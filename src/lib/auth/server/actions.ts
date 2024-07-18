'use server';
import {
    codeSchema,
    emailSchema,
    newPasswordSchema,
    signInSchema,
    signUpSchema,
    twoFactorSetupSchema,
} from '@/lib/auth/validators';
import { db } from '@/server/db';
import { generateId, Scrypt, TimeSpan } from 'lucia';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { validateRequest } from '@/lib/auth/server/validate-request';
import { redirect } from 'next/navigation';
import {
    emailVerificationCodesTable,
    passwordResetTokensTable,
    usersTable,
} from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { createDate } from 'oslo';
import { type z } from 'zod';
import { env } from '@/env';
import { revalidatePath } from 'next/cache';
import { decodeHex, encodeHex } from 'oslo/encoding';
import { createTOTPKeyURI, TOTPController } from 'oslo/otp';
import { EmailTemplate, sendMail } from '@/server/email';

export const signUp = async (obj: z.infer<typeof signUpSchema>) => {
    const parsed = signUpSchema.safeParse(obj);
    if (parsed.error) {
        return { error: parsed.error.errors[0].message };
    }

    const { email, password } = parsed.data;

    // 1. check for existing user
    const existingUser = await db.query.usersTable.findFirst({
        where: (table, { eq }) => eq(table.email, email),
    });
    if (existingUser) {
        return {
            error: 'Cannot create account with that email',
        };
    }

    // 2. create user
    const userId = generateId(21);
    const hashedPassword = await new Scrypt().hash(password);
    await db.insert(usersTable).values({
        id: userId,
        email,
        hashedPassword,
        twoFactorSecret: null,
    });

    // 3. send email verification coder
    const verificationCode = await generateEmailVerificationCode(userId, email);
    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/verify-email?code=${verificationCode}`;
    console.log(verificationLink);
    await sendMail(email, EmailTemplate.EmailVerification, { code: verificationCode });

    // 4. create session and cookie
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return { success: true };
};

export const sendEmailVerification = async () => {
    const { user } = await validateRequest();
    if (!user) {
        return {
            error: 'not authenticated',
        };
    }

    const verificationCode = await generateEmailVerificationCode(user.id, user.email);
    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/verify-email?code=${verificationCode}`;
    console.log(verificationLink);
    await sendMail(user.email, EmailTemplate.EmailVerification, { code: verificationCode });

    return { success: true };
};

export const signIn = async (obj: z.infer<typeof signInSchema>) => {
    const parsed = signInSchema.safeParse(obj);
    if (parsed.error) {
        return { error: parsed.error.errors[0].message };
    }

    const { email, password, code } = parsed.data;

    // 1. check for existing user
    const existingUser = await db.query.usersTable.findFirst({
        where: (table, { eq }) => eq(table.email, email),
    });
    if (!existingUser?.hashedPassword) {
        return {
            error: 'Incorrect email or password',
        };
    }

    // 2. validate password
    const validPassword = await new Scrypt().verify(existingUser.hashedPassword, password);
    if (!validPassword) {
        return {
            error: 'Incorrect email or password',
        };
    }

    // 3. check 2-factor
    if (existingUser.twoFactorSecret) {
        if (code) {
            const validOTP = await new TOTPController().verify(
                code,
                decodeHex(existingUser.twoFactorSecret)
            );
            if (!validOTP) {
                return { error: 'incorrect token' };
            }
        } else {
            return { step: '2fa' };
        }
    }

    // 4. create session & cookie
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return { success: true };
};

export const logOut = async (): Promise<{ error: string } | void> => {
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: 'No session found',
        };
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect('/');
};

export const deleteUser = async () => {
    const { user, session } = await validateRequest();
    if (!user) return { error: 'not authenticated' };

    // 1. check for existing user
    await db.delete(usersTable).where(eq(usersTable.id, user.id)).returning();

    // 2. logout
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return { success: true };
};

export const resetPassword = async (obj: z.infer<typeof emailSchema>) => {
    const parsed = emailSchema.safeParse(obj);
    if (parsed.error) {
        return { error: parsed.error.errors[0].message };
    }
    const { email } = parsed.data;

    const user = await db.query.usersTable.findFirst({
        where: (table, { eq }) => eq(table.email, email),
    });
    if (!user?.hashedPassword) {
        return {
            error: 'Incorrect email',
        };
    }

    const verificationToken = await generatePasswordResetToken(user.id);
    const verificationLink = `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=${verificationToken}`;
    console.log(verificationLink);
    await sendMail(email, EmailTemplate.PasswordReset, { link: verificationLink });

    return { success: true };
};

export const setNewPassword = async (obj: z.infer<typeof newPasswordSchema>) => {
    const parsed = newPasswordSchema.safeParse(obj);
    if (parsed.error) {
        return { error: parsed.error.errors[0].message };
    }
    const { token, password } = parsed.data;

    const resetTokens = await db
        .delete(passwordResetTokensTable)
        .where(eq(passwordResetTokensTable.id, token))
        .returning();

    if (resetTokens.length < 1) {
        return { error: 'Incorrect token' };
    }

    const resetToken = resetTokens[0];
    const hashedPassword = await new Scrypt().hash(password);
    await db.update(usersTable).set({ hashedPassword }).where(eq(usersTable.id, resetToken.userId));
    return { success: true };
};

export const verifyEmail = async (obj: z.infer<typeof codeSchema>) => {
    const parsed = codeSchema.safeParse(obj);
    if (parsed.error) {
        return { error: parsed.error.errors[0].message };
    }

    const { code } = parsed.data;

    const verifyCodes = await db
        .delete(emailVerificationCodesTable)
        .where(eq(emailVerificationCodesTable.code, code))
        .returning();

    if (verifyCodes.length < 1) {
        return { error: 'Incorrect verification code' };
    }

    const users = await db
        .update(usersTable)
        .set({ emailVerified: true })
        .where(eq(usersTable.id, verifyCodes[0].userId))
        .returning();

    if (users.length < 1) {
        return { error: 'Incorrect verification code' };
    }

    revalidatePath('/dashboard');

    return { success: true };
};

export const setupTwoFactor = async (obj: z.infer<typeof twoFactorSetupSchema>) => {
    const { user } = await validateRequest();
    if (!user) return { error: 'not authenticated' };

    const parsed = twoFactorSetupSchema.safeParse(obj);
    if (parsed.error) {
        return { error: parsed.error.errors[0].message };
    }
    const { code, secret } = parsed.data;

    const validOTP = await new TOTPController().verify(code, decodeHex(secret));
    if (!validOTP) {
        return { error: 'incorrect code/secret combination' };
    }

    await db.update(usersTable).set({ twoFactorSecret: secret }).where(eq(usersTable.id, user.id));

    revalidatePath('/dashboard');

    return { success: true };
};

export async function generateTwoFactor(userId: string, email: string) {
    const twoFactorSecret = crypto.getRandomValues(new Uint8Array(20));

    const uri = createTOTPKeyURI(env.APP_TITLE, email, twoFactorSecret);

    return { secret: encodeHex(twoFactorSecret), uri };
}

async function generateEmailVerificationCode(userId: string, email: string) {
    await db
        .delete(emailVerificationCodesTable)
        .where(eq(emailVerificationCodesTable.userId, userId));
    const code: string = generateRandomString(8, alphabet('0-9')); // 8 digit code
    await db.insert(emailVerificationCodesTable).values({
        userId,
        email,
        code,
        expiresAt: createDate(new TimeSpan(10, 'm')), // 10 minutes
    });
    return code;
}

async function generatePasswordResetToken(userId: string): Promise<string> {
    await db.delete(passwordResetTokensTable).where(eq(passwordResetTokensTable.userId, userId));
    const tokenId = generateId(40);
    await db.insert(passwordResetTokensTable).values({
        id: tokenId,
        userId,
        expiresAt: createDate(new TimeSpan(2, 'h')),
    });
    return tokenId;
}

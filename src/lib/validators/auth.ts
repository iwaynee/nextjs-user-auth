import { z } from 'zod';

export const signUpSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const signInSchema = z.object({
    email: z.string().email('Please enter a valid email.'),
    password: z.string().min(8, 'Password is too short. Minimum 8 characters required.').max(255),
    code: z.string().length(6).optional(),
});

export const emailSchema = z.object({
    email: z.string().email('Please enter a valid email.'),
});

export const newPasswordSchema = z.object({
    password: z.string().min(8, 'Password is too short. Minimum 8 characters required.').max(255),
    token: z.string().max(255, 'Token too long'),
});

export const codeSchema = z.object({
    code: z.string(),
});

export const twoFactorSetupSchema = z.object({
    code: z.string(),
    secret: z.string(),
});

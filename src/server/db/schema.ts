import { pgTableCreator, serial, boolean, index, timestamp, varchar } from 'drizzle-orm/pg-core';
import { DATABASE_PREFIX as prefix } from '@/lib/constants';
import { relations } from 'drizzle-orm';

export const pgTable = pgTableCreator((name) => `${prefix}_${name}`);

export const usersTable = pgTable(
    'users',
    {
        id: varchar('id', { length: 21 }).primaryKey(),
        email: varchar('email', { length: 255 }).unique().notNull(),
        emailVerified: boolean('email_verified').default(false).notNull(),
        hashedPassword: varchar('hashed_password', { length: 255 }),
        twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
        avatar: varchar('avatar', { length: 255 }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(() => new Date()),
    },
    (t) => ({
        emailIdx: index('user_email_idx').on(t.email),
    })
);

export type User = typeof usersTable.$inferSelect;

export const sessionsTable = pgTable(
    'sessions',
    {
        id: varchar('id', { length: 255 }).primaryKey(),
        userId: varchar('user_id', { length: 21 })
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    },
    (t) => ({
        userIdx: index('session_user_idx').on(t.userId),
    })
);

export const emailVerificationCodesTable = pgTable(
    'email_verification_codes',
    {
        id: serial('id').primaryKey(),
        userId: varchar('user_id', { length: 21 })
            .unique()
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        email: varchar('email', { length: 255 }).notNull(),
        code: varchar('code', { length: 8 }).notNull(),
        expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    },
    (t) => ({
        userIdx: index('verification_code_user_idx').on(t.userId),
        emailIdx: index('verification_code_email_idx').on(t.email),
    })
);

export const passwordResetTokensTable = pgTable(
    'password_reset_tokens',
    {
        id: varchar('id', { length: 40 }).primaryKey(),
        userId: varchar('user_id', { length: 21 })
            .notNull()
            .references(() => usersTable.id, { onDelete: 'cascade' }),
        expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
    },
    (t) => ({
        userIdx: index('password_token_user_idx').on(t.userId),
    })
);

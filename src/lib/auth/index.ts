import { Lucia, type SessionCookieAttributesOptions, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { env } from '@/env';
import { db } from '@/server/db';
import { sessionsTable, usersTable, type User as DbUser } from '@/server/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
    getSessionAttributes: (/* attributes */) => {
        return {};
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            email: attributes.email,
            emailVerified: attributes.emailVerified,
            avatar: attributes.avatar,
            createdAt: attributes.createdAt,
            updatedAt: attributes.updatedAt,
            setupTwoFactor: attributes.twoFactorSecret !== null,
        };
    },
    sessionExpiresIn: new TimeSpan(30, 'd'),
    sessionCookie: {
        name: 'session',

        expires: false, // session cookies have very long lifespan (2 years)
        attributes: {
            secure: env.NODE_ENV === 'production',
        },
    },
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes extends Omit<DbUser, 'hashedPassword' | 'twoFactorSecret'> {
    twoFactorSecret: string | null;
}

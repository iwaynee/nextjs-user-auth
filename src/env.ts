import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

export const env = createEnv({
    server: {
        DATABASE_URL: z
            .string()
            .url()
            .refine(
                (str) => !str.includes('YOUR_DATABASE_URL_HERE'),
                'You forgot to change the default URL'
            ),
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        SMTP_HOST: z.string().trim().min(1),
        SMTP_PORT: z.number().int().min(1),
        SMTP_USER: z.string().trim().min(1),
        SMTP_PASSWORD: z.string().trim().min(1),
        APP_TITLE: z.string().trim().min(1),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string().url(),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: parseInt(process.env.SMTP_PORT ?? ''),
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        APP_TITLE: process.env.APP_TITLE,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});

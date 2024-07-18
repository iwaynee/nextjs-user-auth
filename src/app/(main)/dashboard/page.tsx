'use server';
import { redirect } from 'next/navigation';
import { env } from '@/env';
import * as React from 'react';
import { validateRequest } from '@/server/auth/validate-request';
import { Dashboard } from '@/app/(main)/dashboard/dashboard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function DashboardPage() {
    const { user } = await validateRequest();
    if (!user) redirect('/authenticate');

    return (
        <div className='mb-6 space-y-4'>
            <h1 className='text-3xl font-bold md:text-4xl'>{env.APP_TITLE}</h1>
            <p>{user.email}</p>

            {!user.emailVerified ? <EmailNotVerified /> : null}
            {!user.setupTwoFactor ? <TwoFactorNotActivated /> : null}

            <Dashboard />
        </div>
    );
}

const EmailNotVerified = () => {
    return (
        <Alert variant={'destructive'}>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Email not verified</AlertTitle>
            <AlertDescription>
                <div className={'flex items-center justify-between'}>
                    <p>Please verify your email</p>
                    <Link href={'/verify-email'}>
                        <Button variant={'outline'} size={'sm'}>
                            Verify Email
                        </Button>
                    </Link>
                </div>
            </AlertDescription>
        </Alert>
    );
};

const TwoFactorNotActivated = () => {
    return (
        <Alert variant={'destructive'}>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>2-Factor not setup</AlertTitle>
            <AlertDescription>
                <div className={'flex items-center justify-between'}>
                    <p>Please setup 2-factor authentification</p>
                    <Link href={'/setup-2f'}>
                        <Button variant={'outline'} size={'sm'}>
                            Setup 2-Factor
                        </Button>
                    </Link>
                </div>
            </AlertDescription>
        </Alert>
    );
};

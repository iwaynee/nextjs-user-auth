import { validateRequest } from '@/server/auth/validate-request';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import * as React from 'react';

export const AuthNotifications = async () => {
    const { user } = await validateRequest();

    return (
        <>
            {!user?.emailVerified ? <EmailNotVerified /> : null}
            {!user?.setupTwoFactor ? <TwoFactorNotActivated /> : null}
        </>
    );
};

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

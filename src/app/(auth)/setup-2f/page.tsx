import { validateRequest } from '@/lib/auth/server/validate-request';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React, { Suspense } from 'react';
import { generateTwoFactor } from '@/lib/auth/server/actions';
import { QrCanvas } from '@/app/(auth)/setup-2f/QrCanvas';
import { TwoFactorForm } from '@/app/(auth)/setup-2f/TwoFactorForm';

export default async function Setup2FPage() {
    const { user } = await validateRequest();
    if (!user) {
        redirect('/authenticate');
    }
    if (user.setupTwoFactor) redirect('/dashboard');

    const { uri, secret } = await generateTwoFactor(user.id, user.email);

    return (
        <Card className='w-full max-w-md'>
            <CardHeader className='space-y-1'>
                <CardTitle>Two Factor</CardTitle>
                <CardDescription>Please setup two factor auth</CardDescription>
            </CardHeader>
            <CardContent className={'flex w-full flex-col items-center'}>
                <Suspense>
                    <QrCanvas uri={uri} />
                    <TwoFactorForm secret={secret} />
                </Suspense>
            </CardContent>
        </Card>
    );
}

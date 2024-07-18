import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/server/validate-request';
import { verifyEmail } from '@/lib/auth/server/actions';
import { Suspense } from 'react';
import { VerifyCode } from '@/app/(auth)/verify-email/VerifyCode';

export const metadata = {
    title: 'Verify Email',
    description: 'Verify Email Page',
};

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: { code: string };
}) {
    const { user } = await validateRequest();

    if (!user) redirect('/authenticate');
    if (user.emailVerified) redirect('/dashboard');

    if (searchParams.code) {
        const res = await verifyEmail({ code: searchParams.code });
        if (res.success) {
            redirect('/dashboard');
        }
    }

    return (
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle>Verify Email</CardTitle>
                <CardDescription>
                    Verification code was sent to <strong>{user.email}</strong>. Check your spam
                    folder if you can't find the email.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense fallback={null}>
                    <VerifyCode />
                </Suspense>
            </CardContent>
        </Card>
    );
}

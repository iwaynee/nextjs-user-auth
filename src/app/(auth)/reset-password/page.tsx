import { redirect } from 'next/navigation';
import { validateRequest } from '@/server/auth/validate-request';
import { ResetPassword } from '@/app/(auth)/reset-password/reset-password';
import { NewPassword } from '@/app/(auth)/reset-password/new-password';

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: { token: string };
}) {
    const { user } = await validateRequest();
    if (user) redirect('/dashboard');

    return searchParams.token ? <NewPassword token={searchParams.token} /> : <ResetPassword />;
}

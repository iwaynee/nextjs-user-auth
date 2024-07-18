import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/server/validate-request';
import { NewPassword } from '@/app/(auth)/reset-password/NewPassword';
import { ResetPassword } from '@/app/(auth)/reset-password/ResetPassword';

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: { token: string };
}) {
    const { user } = await validateRequest();
    if (user) redirect('/dashboard');

    return searchParams.token ? <NewPassword token={searchParams.token} /> : <ResetPassword />;
}

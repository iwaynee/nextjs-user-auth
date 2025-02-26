import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/server/validate-request';
import { Authenticate } from './authenticate';

export default async function LoginPage() {
    const { user } = await validateRequest();

    if (user) redirect('/dashboard');

    return <Authenticate />;
}

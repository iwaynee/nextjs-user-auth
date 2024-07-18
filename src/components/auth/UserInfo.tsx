'use server';

import { validateRequest } from '@/server/auth/validate-request';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const UserInfo = async () => {
    const { user } = await validateRequest();

    return (
        <>
            {user ? (
                <>
                    <p>User is logged in as: {user.email}</p>
                    <div>
                        <Link href={'/dashboard'}>
                            <Button>Dashboard</Button>
                        </Link>
                    </div>
                </>
            ) : (
                <div>
                    <Link href={'/authenticate'}>
                        <Button>Login</Button>
                    </Link>
                </div>
            )}
        </>
    );
};

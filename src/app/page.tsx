'use server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserInfo } from '@/components/auth/UserInfo';
import { env } from '@/env';
import { Suspense } from 'react';

export default async function Home() {
    return (
        <main className='grid min-h-screen place-items-center p-4'>
            <Card>
                <CardHeader>
                    <CardTitle>{env.APP_TITLE}</CardTitle>
                </CardHeader>
                <CardContent className={'space-y-4'}>
                    <p>This is an example app with lucia and drizzle as auth layer</p>
                    <Suspense>
                        <UserInfo />
                    </Suspense>
                </CardContent>
            </Card>
        </main>
    );
}

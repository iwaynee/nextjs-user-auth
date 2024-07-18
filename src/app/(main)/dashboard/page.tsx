'use server';
import { redirect } from 'next/navigation';
import { env } from '@/env';
import * as React from 'react';
import { validateRequest } from '@/server/auth/validate-request';
import { Dashboard } from '@/app/(main)/dashboard/dashboard';
import { AuthNotifications } from '@/components/auth/AuthNotifications';

export default async function DashboardPage() {
    const { user } = await validateRequest();
    if (!user) redirect('/authenticate');

    return (
        <div className='mb-6 space-y-4'>
            <h1 className='text-3xl font-bold md:text-4xl'>{env.APP_TITLE}</h1>
            <p>{user.email}</p>

            <AuthNotifications />

            <Dashboard />
        </div>
    );
}

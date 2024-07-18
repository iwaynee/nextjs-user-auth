'use client';

import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { deleteUser, logOut } from '@/server/actions/auth';
import * as React from 'react';

export const Dashboard = () => {
    const logOutMut = useMutation({
        mutationKey: ['logout'],
        mutationFn: logOut,
    });

    const deleteUserMut = useMutation({
        mutationKey: ['deleteUser'],
        mutationFn: deleteUser,
    });

    return (
        <div className={'space-x-4'}>
            <Button onClick={() => logOutMut.mutate()}>Logout</Button>
            <Button onClick={() => deleteUserMut.mutate()}>Delete user</Button>
        </div>
    );
};

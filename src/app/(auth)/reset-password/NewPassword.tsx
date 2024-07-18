'use client';
import type { z } from 'zod';
import { newPasswordSchema } from '@/lib/auth/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSetNewPasswordMutation } from '@/lib/auth/hooks';

export const NewPassword = ({ token }: { token: string }) => {
    const router = useRouter();
    const setNewPasswordMut = useSetNewPasswordMutation();
    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            token: token,
            password: 'testtest',
        },
    });

    async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
        const res = await setNewPasswordMut.mutateAsync(values);
        if (res.success) {
            toast.success('Email for Password Reset sent!');
            router.push('/authenticate');
        } else {
            toast.error(res.error);
        }
    }

    return (
        <Card className='w-full max-w-md'>
            <CardHeader className='space-y-1'>
                <CardTitle>Reset password</CardTitle>
                <CardDescription>Enter new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                        <input type='hidden' name='token' value={token} />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='enter a new password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type={'submit'} className='w-full'>
                            Reset Password
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema } from '@/lib/auth/validators';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import React from 'react';
import { useResetPasswordMutation } from '@/lib/auth/hooks';

export function ResetPassword() {
    const router = useRouter();
    const resetPasswordMut = useResetPasswordMutation();
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: 'ivan@nosleep-agency.com',
        },
    });

    async function onSubmit(values: z.infer<typeof emailSchema>) {
        const res = await resetPasswordMut.mutateAsync(values);
        if (res.success) {
            toast.success('Email for Password Reset sent!');
            router.push('/authenticate');
        } else {
            toast.error(res.error);
        }
    }

    return (
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle>Forgot password?</CardTitle>
                <CardDescription>Password reset link will be sent to your email.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className={'space-y-4'} onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='Enter your email...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex flex-wrap justify-between'>
                            <Link href={'/authenticate'}>
                                <Button variant={'link'} size={'sm'} className='p-0'>
                                    Not signed up? Sign up now
                                </Button>
                            </Link>
                        </div>

                        <Button
                            disabled={resetPasswordMut.isPending}
                            type={'submit'}
                            className={'w-full'}
                        >
                            Reset Password
                        </Button>
                        <Button variant='outline' className='w-full' asChild>
                            <Link href='/'>Cancel</Link>
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

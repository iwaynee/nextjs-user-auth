'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { type z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { signInSchema } from '@/lib/validators/auth';
import { useSignInMutation } from '@/lib/auth/hooks';

export const SignIn = () => {
    const router = useRouter();
    const loginMut = useSignInMutation();
    const [step, setStep] = useState('credentials');

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: 'ivan@nosleep-agency.com',
            password: 'testtest',
            code: undefined, // <-- important
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signInSchema>) {
        const res = await loginMut.mutateAsync(values);
        if (res.step === '2fa') {
            setStep('2fa');
        } else if (res.success) {
            toast.success('Login successful');
            router.push('/dashboard');
        } else {
            toast.error(res.error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>Sign in to your account to continue.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                <Form {...form}>
                    <form className='flex flex-col gap-2' onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem hidden={step !== 'credentials'}>
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
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem hidden={step !== 'credentials'}>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Enter your password...'
                                            {...field}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.trim();
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {step === 'credentials' && (
                            <>
                                <div className='flex flex-wrap justify-end'>
                                    <Button variant={'link'} size={'sm'} className='p-0' asChild>
                                        <Link href={'/reset-password'}>Forgot password?</Link>
                                    </Button>
                                </div>

                                <Button
                                    disabled={loginMut.isPending}
                                    type={'submit'}
                                    className='self-start'
                                >
                                    Sign In
                                </Button>
                            </>
                        )}

                        {step === '2fa' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name='code'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>2FA Token</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='text'
                                                    placeholder='Enter your 2FA token...'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    disabled={loginMut.isPending}
                                    type='submit'
                                    className='self-start'
                                >
                                    Verify 2FA Token
                                </Button>
                            </>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

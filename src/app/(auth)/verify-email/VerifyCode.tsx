'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { logOut, verifyEmail } from '@/server/actions/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { codeSchema } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useSendEmailVerificationMutation, useVerifyEmailMutation } from '@/lib/auth/hooks';

export const VerifyCode = () => {
    const router = useRouter();
    const verifyEmailMut = useVerifyEmailMutation();
    const sendEmailVerificationMut = useSendEmailVerificationMutation();

    const form = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
        defaultValues: {
            code: '',
        },
    });

    async function onSubmit(values: z.infer<typeof codeSchema>) {
        const res = await verifyEmailMut.mutateAsync(values);
        if (res.error) {
            toast.error(res.error);
        } else if (res.success) {
            toast.success('Email verified successfully');
            router.push('/dashboard');
        }
    }

    return (
        <div className='flex flex-col gap-2'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='code'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification code</FormLabel>
                                <FormControl>
                                    <Input type='code' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className='mt-4 w-full'
                        type={'submit'}
                        disabled={verifyEmailMut.isPending}
                    >
                        Verify
                    </Button>
                </form>
            </Form>
            <form onSubmit={() => sendEmailVerificationMut.mutate()}>
                <Button
                    className='mt-4 w-full'
                    type={'submit'}
                    variant='secondary'
                    disabled={sendEmailVerificationMut.isPending}
                >
                    Resend Verification
                </Button>
            </form>
            <form action={logOut}>
                <Button variant='link' className='p-0 font-normal'>
                    want to use another email? Log out now.
                </Button>
            </form>
        </div>
    );
};

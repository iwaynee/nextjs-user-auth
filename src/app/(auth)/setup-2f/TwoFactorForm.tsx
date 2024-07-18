'use client';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { twoFactorSetupSchema } from '@/lib/auth/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSetupTwoFactorMutation } from '@/lib/auth/hooks';

export const TwoFactorForm = ({ secret }: { secret: string }) => {
    const router = useRouter();
    const confirmTwoFactorMut = useSetupTwoFactorMutation();
    const form = useForm<z.infer<typeof twoFactorSetupSchema>>({
        resolver: zodResolver(twoFactorSetupSchema),
        defaultValues: {
            code: '',
            secret: secret,
        },
    });

    async function onSubmit(values: z.infer<typeof twoFactorSetupSchema>) {
        const res = await confirmTwoFactorMut.mutateAsync(values);
        if (res.success) {
            toast.success('2-Factor Setup Successful');
            router.push('/dashboard');
        } else {
            toast.error(res.error);
        }
    }

    return (
        <Form {...form}>
            <form className={'w-full space-y-4'} onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input type='code' placeholder='enter 2-factor code' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={confirmTwoFactorMut.isPending} className={'w-full self-end'}>
                    Confirm
                </Button>
            </form>
        </Form>
    );
};

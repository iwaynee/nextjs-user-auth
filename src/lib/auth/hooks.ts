'use client';

import { useMutation } from '@tanstack/react-query';
import {
    resetPassword,
    sendEmailVerification,
    setNewPassword,
    setupTwoFactor,
    signIn,
    signUp,
    verifyEmail,
} from '@/lib/auth/server/actions';

export const useSignUpMutation = () => {
    return useMutation({
        mutationKey: ['signUp'],
        mutationFn: signUp,
    });
};

export const useSignInMutation = () => {
    return useMutation({
        mutationKey: ['signIn'],
        mutationFn: signIn,
    });
};

export const useSetNewPasswordMutation = () => {
    return useMutation({
        mutationKey: ['setNewPassword'],
        mutationFn: setNewPassword,
    });
};

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationKey: ['resetPassword'],
        mutationFn: resetPassword,
    });
};

export const useSetupTwoFactorMutation = () => {
    return useMutation({
        mutationKey: ['setupTwoFactor'],
        mutationFn: setupTwoFactor,
    });
};

export const useVerifyEmailMutation = () => {
    return useMutation({
        mutationKey: ['verifyEmail'],
        mutationFn: verifyEmail,
    });
};

export const useSendEmailVerificationMutation = () => {
    return useMutation({
        mutationKey: ['sendEmailVerification'],
        mutationFn: sendEmailVerification,
    });
};

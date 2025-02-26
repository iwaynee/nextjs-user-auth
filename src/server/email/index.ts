import 'server-only';

import { EmailVerificationTemplate } from './templates/email-verification';
import { ResetPasswordTemplate } from './templates/reset-password';
import { env } from '@/env';
import { createTransport, type TransportOptions } from 'nodemailer';
import { type ComponentProps, createElement } from 'react';
import { render } from '@react-email/render';

export enum EmailTemplate {
    EmailVerification = 'EmailVerification',
    PasswordReset = 'PasswordReset',
}

export type PropsMap = {
    [EmailTemplate.EmailVerification]: ComponentProps<typeof EmailVerificationTemplate>;
    [EmailTemplate.PasswordReset]: ComponentProps<typeof ResetPasswordTemplate>;
};

const getEmailTemplate = <T extends EmailTemplate>(template: T, props: PropsMap[NoInfer<T>]) => {
    switch (template) {
        case EmailTemplate.EmailVerification:
            return {
                subject: 'Verify your email address',
                body: render(
                    createElement(
                        EmailVerificationTemplate,
                        props as PropsMap[EmailTemplate.EmailVerification]
                    )
                ),
            };

        case EmailTemplate.PasswordReset:
            return {
                subject: 'Reset your password',
                body: render(
                    createElement(
                        ResetPasswordTemplate,
                        props as PropsMap[EmailTemplate.PasswordReset]
                    )
                ),
            };
        default:
            throw new Error('Invalid email template');
    }
};

const smtpConfig = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
    },
};

const transporter = createTransport(smtpConfig as TransportOptions);

export const sendMail = async <T extends EmailTemplate>(
    to: string,
    template: T,
    props: PropsMap[NoInfer<T>]
) => {
    /*if (env.NODE_ENV !== "production") {
        console.log("📨 Email sent to:", to, "with template:", template, "and props:", props);
        return;
    }*/

    const { subject, body } = getEmailTemplate(template, props);

    return transporter.sendMail({ from: 'ivan.heinzer@hotmail.ch', to, subject, html: body });
};

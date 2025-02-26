import type { Metadata } from 'next';
import '@/styles/globals.css';
import React from 'react';
import Providers from '@/lib/providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { VERCEL_ENV } from '../../constants.mjs';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { fontSans } from '@/lib/fonts';

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.className
                )}
            >
                <Providers>{children}</Providers>
                <Toaster />

                {VERCEL_ENV && (
                    <>
                        <Analytics />
                        <SpeedInsights />
                    </>
                )}
            </body>
        </html>
    );
}

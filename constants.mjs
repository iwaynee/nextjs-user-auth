'use strict';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV || undefined;


export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'https://nodejs.org';



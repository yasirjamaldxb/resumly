import { Checkout } from '@polar-sh/nextjs';

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://resumly.app'}/dashboard?upgraded=true`,
  server: (process.env.POLAR_ENV as 'sandbox' | 'production') || 'sandbox',
});

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { polar } from '@/lib/polar';

// Custom checkout handler — we need this (instead of the drop-in `Checkout()`
// from @polar-sh/nextjs) so we can attach the Supabase user id to the Polar
// customer via `customerExternalId`. Without it, the webhook can't map the
// paid customer back to a row in `profiles` and subscription_tier stays 'free'
// forever.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resumly.app';

const PRODUCT_IDS: Record<string, string | undefined> = {
  starter_monthly: process.env.NEXT_PUBLIC_POLAR_STARTER_MONTHLY || process.env.POLAR_STARTER_MONTHLY,
  starter_yearly: process.env.NEXT_PUBLIC_POLAR_STARTER_YEARLY || process.env.POLAR_STARTER_YEARLY,
  pro_monthly: process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY || process.env.POLAR_PRO_MONTHLY,
  pro_yearly: process.env.NEXT_PUBLIC_POLAR_PRO_YEARLY || process.env.POLAR_PRO_YEARLY,
};

function resolveProductIds(searchParams: URLSearchParams): string[] {
  // Explicit products=... wins (Polar may accept multiple)
  const explicit = searchParams.get('products') || searchParams.get('productId');
  if (explicit) return explicit.split(',').map((s) => s.trim()).filter(Boolean);

  const plan = searchParams.get('plan'); // 'starter' | 'pro'
  const billing = searchParams.get('billing') || 'monthly'; // 'monthly' | 'yearly'
  const key = `${plan}_${billing}`;
  const id = PRODUCT_IDS[key];
  return id ? [id] : [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const products = resolveProductIds(searchParams);

  if (products.length === 0) {
    return NextResponse.json(
      { error: 'no_product', message: 'Missing product id or plan.' },
      { status: 400 },
    );
  }

  // Require login — otherwise we can't link the subscription to a Supabase user.
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    const loginUrl = new URL('/auth/login', SITE_URL);
    loginUrl.searchParams.set(
      'redirectTo',
      `/api/checkout?${searchParams.toString()}`,
    );
    return NextResponse.redirect(loginUrl.toString());
  }

  try {
    const checkout = await polar.checkouts.create({
      products,
      successUrl: `${SITE_URL}/dashboard?upgraded=true&checkout_id={CHECKOUT_ID}`,
      externalCustomerId: user.id,
      customerEmail: user.email || undefined,
      metadata: {
        supabase_user_id: user.id,
        plan: searchParams.get('plan') || '',
        billing: searchParams.get('billing') || '',
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'checkout_create_failed';
    console.error('[checkout] Polar create failed:', msg);
    return NextResponse.json(
      { error: 'checkout_failed', message: msg },
      { status: 500 },
    );
  }
}

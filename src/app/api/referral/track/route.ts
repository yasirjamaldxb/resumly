import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, event } = body;

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json(
        { error: 'Missing referralCode' },
        { status: 400 }
      );
    }

    if (event !== 'click' && event !== 'signup') {
      return NextResponse.json(
        { error: 'Invalid event type. Must be "click" or "signup"' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const eventType = event === 'click' ? 'referral_click' : 'referral_signup';

    const { error } = await supabase.from('analytics_events').insert({
      event_type: eventType,
      metadata: {
        referrer_code: referralCode,
        source: 'referral',
      },
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Referral track insert error:', error);
      return NextResponse.json(
        { error: 'Failed to track referral' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Referral track error:', error);
    return NextResponse.json(
      { error: 'Failed to track referral' },
      { status: 500 }
    );
  }
}

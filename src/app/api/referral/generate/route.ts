import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a short referral code from the user ID (first 8 chars)
    const referralCode = user.id.replace(/-/g, '').slice(0, 8);
    const referralUrl = `https://resumly.app/?ref=${referralCode}`;

    // Fetch referral stats from analytics_events
    const adminSupabase = createAdminClient();

    const [clicksRes, signupsRes] = await Promise.all([
      adminSupabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'referral_click')
        .eq('metadata->>referrer_code', referralCode),
      adminSupabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'referral_signup')
        .eq('metadata->>referrer_code', referralCode),
    ]);

    return NextResponse.json({
      referralUrl,
      referralCode,
      stats: {
        clicks: clicksRes.count || 0,
        signups: signupsRes.count || 0,
        conversions: signupsRes.count || 0,
      },
    });
  } catch (error) {
    console.error('Referral generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral link' },
      { status: 500 }
    );
  }
}

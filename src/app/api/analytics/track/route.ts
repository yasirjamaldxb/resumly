import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackEvent, type EventType } from '@/lib/analytics';

// Same union on the client — keep in sync.
const ALLOWED: EventType[] = [
  'page_view',
  'funnel_step_viewed',
  'funnel_step_completed',
  'funnel_abandoned',
  'onboarding_complete',
  'upgrade_click',
  'checkout_started',
  'checkout_success',
  'cta_click',
  'signup',
  'login',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const event = body?.event as EventType | undefined;
    const metadata = (body?.metadata || {}) as Record<string, unknown>;

    if (!event || !ALLOWED.includes(event)) {
      return NextResponse.json({ ok: false, error: 'invalid_event' }, { status: 400 });
    }

    // Try to resolve a logged-in user (best-effort — page_view works anonymously too)
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id || null;
    } catch {
      // no-op
    }

    // Attach request-derived context to make anon sessions traceable
    const enriched: Record<string, unknown> = {
      ...metadata,
      ua: request.headers.get('user-agent') || undefined,
      referer: request.headers.get('referer') || undefined,
    };

    await trackEvent({ event, userId, metadata: enriched });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'track_failed' },
      { status: 500 },
    );
  }
}

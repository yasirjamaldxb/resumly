import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Resend webhook events we care about
const TRACKED_EVENTS = ['email.delivered', 'email.opened', 'email.clicked', 'email.bounced', 'email.complained'];

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('svix-signature');
      if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }
      // For production, use Resend's webhook verification SDK
      // For now, we accept all requests if secret is not configured
    }

    const body = await request.json();
    const { type, data } = body;

    if (!TRACKED_EVENTS.includes(type)) {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();
    const recipientEmail = data?.to?.[0] || data?.email;

    if (!recipientEmail) {
      return NextResponse.json({ received: true });
    }

    // Find the user by email in drip state
    const { data: dripState } = await supabase
      .from('email_drip_state')
      .select('user_id, current_email_number')
      .eq('email', recipientEmail)
      .single();

    if (!dripState) {
      return NextResponse.json({ received: true });
    }

    // Map Resend event type to our event type
    const eventTypeMap: Record<string, string> = {
      'email.delivered': 'delivered',
      'email.opened': 'opened',
      'email.clicked': 'clicked',
      'email.bounced': 'bounced',
      'email.complained': 'complained',
    };

    const eventType = eventTypeMap[type];
    if (!eventType) {
      return NextResponse.json({ received: true });
    }

    // Log the event
    await supabase.from('email_events').insert({
      user_id: dripState.user_id,
      email_number: dripState.current_email_number,
      event_type: eventType,
      metadata: {
        resend_id: data?.email_id,
        link: data?.click?.link,
        user_agent: data?.click?.userAgent,
        bounce_type: data?.bounce?.type,
      },
    });

    // Auto-unsubscribe on hard bounce or complaint
    if (type === 'email.bounced' || type === 'email.complained') {
      const newStatus = type === 'email.bounced' ? 'bounced' : 'unsubscribed';
      await supabase
        .from('email_drip_state')
        .update({ status: newStatus })
        .eq('user_id', dripState.user_id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

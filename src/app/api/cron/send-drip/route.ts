import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendDripEmail, getNextEmailDueAt } from '@/lib/email/send-drip';
import { DRIP_SEQUENCE } from '@/lib/email/drip-config';

const MAX_EMAILS_PER_RUN = 50; // Rate limit per cron invocation

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Find users who are due for their next email
    const { data: dueUsers, error } = await supabase
      .from('email_drip_state')
      .select('*')
      .eq('status', 'active')
      .lte('next_email_due_at', now)
      .lt('current_email_number', DRIP_SEQUENCE.length)
      .order('next_email_due_at', { ascending: true })
      .limit(MAX_EMAILS_PER_RUN);

    if (error) {
      console.error('Error fetching due users:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!dueUsers || dueUsers.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No emails due' });
    }

    let sent = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of dueUsers) {
      const nextEmailNumber = user.current_email_number + 1;

      const result = await sendDripEmail({
        to: user.email,
        firstName: undefined, // We'll fetch this separately if needed
        emailNumber: nextEmailNumber,
        unsubscribeToken: user.unsubscribe_token,
        hasCompletedResume: user.has_completed_resume,
        hasDownloadedPdf: user.has_downloaded_pdf,
      });

      if (result.skipped) {
        // Skip this email but advance to the next one in the sequence
        const nextDueAt = getNextEmailDueAt(nextEmailNumber, new Date(user.created_at));

        await supabase
          .from('email_drip_state')
          .update({
            current_email_number: nextEmailNumber,
            next_email_due_at: nextDueAt?.toISOString() || null,
            status: nextDueAt ? 'active' : 'completed',
          })
          .eq('id', user.id);

        skipped++;
        continue;
      }

      if (!result.success) {
        console.error(`Failed to send email ${nextEmailNumber} to ${user.email}:`, result.error);
        errors++;
        continue;
      }

      // Log sent event
      await supabase.from('email_events').insert({
        user_id: user.user_id,
        email_number: nextEmailNumber,
        event_type: 'sent',
        metadata: { resend_id: result.messageId },
      });

      // Update drip state
      const nextDueAt = getNextEmailDueAt(nextEmailNumber, new Date(user.created_at));

      await supabase
        .from('email_drip_state')
        .update({
          current_email_number: nextEmailNumber,
          last_email_sent_at: now,
          next_email_due_at: nextDueAt?.toISOString() || null,
          status: nextDueAt ? 'active' : 'completed',
        })
        .eq('id', user.id);

      sent++;
    }

    console.log(`Drip cron: sent=${sent}, skipped=${skipped}, errors=${errors}`);
    return NextResponse.json({ sent, skipped, errors, total: dueUsers.length });
  } catch (err) {
    console.error('Cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

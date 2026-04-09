import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ReEngageEmail from '@/emails/re-engage';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = createAdminClient();
    const now = new Date();

    // 3 days ago
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // 7 days ago (for re-engagement cooldown)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Get users who signed up more than 3 days ago
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at')
      .lt('created_at', threeDaysAgo.toISOString())
      .limit(100);

    if (profilesError || !profiles) {
      console.error('Re-engage: failed to fetch profiles', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    // 2. Get users who were recently re-engaged (within 7 days)
    const { data: recentlyEngaged } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('event_type', 're_engagement_email')
      .gte('created_at', sevenDaysAgo.toISOString());

    const recentlyEngagedUserIds = new Set(
      (recentlyEngaged || []).map((e) => e.metadata?.user_id).filter(Boolean)
    );

    // 3. Get users who have logged in recently (within 3 days) — exclude them
    const { data: recentLogins } = await supabase
      .from('analytics_events')
      .select('user_id')
      .eq('event_type', 'login')
      .gte('created_at', threeDaysAgo.toISOString());

    const recentLoginUserIds = new Set(
      (recentLogins || []).map((e) => e.user_id).filter(Boolean)
    );

    // 4. Get users who have downloaded a PDF (completed) — exclude them
    const { data: completedUsers } = await supabase
      .from('analytics_events')
      .select('user_id')
      .eq('event_type', 'pdf_download');

    const completedUserIds = new Set(
      (completedUsers || []).map((e) => e.user_id).filter(Boolean)
    );

    // Filter eligible users
    const eligibleUsers = profiles.filter(
      (p) =>
        p.email &&
        !recentlyEngagedUserIds.has(p.id) &&
        !recentLoginUserIds.has(p.id) &&
        !completedUserIds.has(p.id)
    );

    // Limit to 25 per run
    const usersToEmail = eligibleUsers.slice(0, 25);

    let sentCount = 0;
    const errors: string[] = [];

    for (const user of usersToEmail) {
      try {
        // Check if user has any resumes to estimate completion
        const { data: resumes } = await supabase
          .from('resumes')
          .select('id, resume_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);

        const resume = resumes?.[0];
        let completionPercent = 20; // Default: just signed up
        let resumeUrl = 'https://resumly.app/dashboard';

        if (resume) {
          // Estimate completion based on filled fields
          const data = resume.resume_data as Record<string, unknown>;
          let filledSections = 0;
          const totalSections = 5; // personal, experience, education, skills, summary

          if (data?.personalInfo && Object.keys(data.personalInfo as object).length > 2) filledSections++;
          if (data?.experience && (data.experience as unknown[]).length > 0) filledSections++;
          if (data?.education && (data.education as unknown[]).length > 0) filledSections++;
          if (data?.skills && (data.skills as unknown[]).length > 0) filledSections++;
          if (data?.summary && (data.summary as string).length > 20) filledSections++;

          completionPercent = Math.max(20, Math.round((filledSections / totalSections) * 100));
          resumeUrl = `https://resumly.app/dashboard`;
        }

        const firstName = user.full_name?.split(' ')[0] || undefined;
        const unsubscribeUrl = `https://resumly.app/unsubscribe?email=${encodeURIComponent(user.email)}`;

        const html = await render(
          ReEngageEmail({
            firstName,
            unsubscribeUrl,
            resumeUrl,
            completionPercent,
          })
        );

        await resend.emails.send({
          from: 'Resumly <hello@resumly.app>',
          to: user.email,
          subject: `Your resume is ${completionPercent}% done — finish in 2 minutes`,
          html,
        });

        // Track the send
        await supabase.from('analytics_events').insert({
          event_type: 're_engagement_email',
          user_id: user.id,
          metadata: {
            user_id: user.id,
            email: user.email,
            completionPercent,
          },
          created_at: new Date().toISOString(),
        });

        sentCount++;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`${user.id}: ${message}`);
        console.error(`Re-engage email failed for ${user.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      eligible: eligibleUsers.length,
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Re-engage cron error:', error);
    return NextResponse.json(
      { error: 'Re-engagement cron failed' },
      { status: 500 }
    );
  }
}

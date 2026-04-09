import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getJobRecommendations } from '@/lib/job-recommendations';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import JobAlertEmail from '@/emails/job-alert';

const MAX_USERS_PER_RUN = 30;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = createAdminClient();
    const now = new Date();
    const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString();

    // Find users with daily alerts enabled on starter or pro tier
    const { data: eligibleUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, subscription_tier')
      .eq('daily_alerts', true)
      .in('subscription_tier', ['starter', 'pro'])
      .limit(MAX_USERS_PER_RUN);

    if (usersError) {
      console.error('Error fetching eligible users:', usersError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!eligibleUsers || eligibleUsers.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No eligible users' });
    }

    // Filter out users who received an alert in the last 23 hours
    const { data: recentAlerts, error: alertsError } = await supabase
      .from('analytics_events')
      .select('user_id')
      .eq('event_type', 'job_alert_sent')
      .gte('created_at', twentyThreeHoursAgo);

    if (alertsError) {
      console.error('Error checking recent alerts:', alertsError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const recentlyAlertedIds = new Set(
      (recentAlerts || []).map((e) => e.user_id),
    );

    const usersToAlert = eligibleUsers.filter(
      (u) => !recentlyAlertedIds.has(u.id),
    );

    if (usersToAlert.length === 0) {
      return NextResponse.json({ sent: 0, message: 'All users already alerted recently' });
    }

    let sent = 0;
    let errors = 0;

    for (const user of usersToAlert) {
      try {
        // Get user's most recent job
        const { data: recentJob } = await supabase
          .from('jobs')
          .select('title, location, skills')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!recentJob || !recentJob.title) {
          continue; // Skip users with no jobs
        }

        const jobTitle = recentJob.title;
        const location = recentJob.location || null;
        const skills: string[] = recentJob.skills || [];

        // Fetch recommendations from Adzuna / RemoteOK
        const recommendations = await getJobRecommendations(
          user.id,
          jobTitle,
          location,
          skills,
        );

        if (recommendations.length === 0) {
          continue; // No recommendations found
        }

        const top5 = recommendations.slice(0, 5);
        const firstName = user.full_name?.split(' ')[0] || undefined;
        const unsubscribeUrl = `https://resumly.app/api/unsubscribe?uid=${user.id}&type=job-alerts`;

        const emailHtml = await render(
          JobAlertEmail({
            firstName,
            unsubscribeUrl,
            basedOn: `${jobTitle}${location ? ` in ${location}` : ''}`,
            jobs: top5.map((j) => ({
              title: j.title,
              company: j.company,
              location: j.location,
              salary: j.salary || undefined,
              url: j.url,
            })),
          }),
        );

        await resend.emails.send({
          from: 'Resumly <alerts@resumly.app>',
          to: user.email,
          subject: `${top5.length} new jobs matching "${jobTitle}"`,
          html: emailHtml,
        });

        // Track in analytics
        await supabase.from('analytics_events').insert({
          user_id: user.id,
          event_type: 'job_alert_sent',
          metadata: {
            job_count: top5.length,
            based_on: jobTitle,
          },
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send job alert to ${user.email}:`, err);
        errors++;
      }
    }

    console.log(`Job alerts cron: sent=${sent}, errors=${errors}, eligible=${usersToAlert.length}`);
    return NextResponse.json({ sent, errors, eligible: usersToAlert.length });
  } catch (err) {
    console.error('Job alerts cron error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAILS = ['yj.digitall@gmail.com'];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check - must be admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const range = request.nextUrl.searchParams.get('range') || '30';
    const days = parseInt(range);
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceISO = since.toISOString();

    // Run all queries in parallel
    const [
      totalUsersRes,
      newUsersRes,
      totalResumesRes,
      recentResumesRes,
      emailLeadsRes,
      recentEmailLeadsRes,
      templateStatsRes,
      eventsRes,
      errorsRes,
      dailyUsersRes,
      dailyResumesRes,
      dailyEventsRes,
      recentErrorsRes,
      resumeCompletionRes,
    ] = await Promise.all([
      // Total users ever
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      // New users in range
      supabase.from('profiles').select('id', { count: 'exact', head: true })
        .gte('created_at', sinceISO),
      // Total resumes ever
      supabase.from('resumes').select('id', { count: 'exact', head: true }),
      // Resumes created in range
      supabase.from('resumes').select('id', { count: 'exact', head: true })
        .gte('created_at', sinceISO),
      // Total email leads
      supabase.from('ats_email_leads').select('email', { count: 'exact', head: true }),
      // Email leads in range
      supabase.from('ats_email_leads').select('email', { count: 'exact', head: true })
        .gte('created_at', sinceISO),
      // Template popularity
      supabase.from('resumes').select('template_id'),
      // Events in range
      supabase.from('analytics_events').select('event_type, created_at, metadata')
        .gte('created_at', sinceISO)
        .order('created_at', { ascending: false }),
      // Error count in range
      supabase.from('error_logs').select('id', { count: 'exact', head: true })
        .gte('created_at', sinceISO),
      // Daily user signups (for chart)
      supabase.from('profiles').select('created_at')
        .gte('created_at', sinceISO)
        .order('created_at', { ascending: true }),
      // Daily resume creation (for chart)
      supabase.from('resumes').select('created_at')
        .gte('created_at', sinceISO)
        .order('created_at', { ascending: true }),
      // Daily events breakdown
      supabase.from('analytics_events').select('event_type, created_at')
        .gte('created_at', sinceISO)
        .order('created_at', { ascending: true }),
      // Recent errors
      supabase.from('error_logs').select('*')
        .order('created_at', { ascending: false })
        .limit(50),
      // Resume completion analysis
      supabase.from('resumes').select('resume_data')
        .gte('created_at', sinceISO),
    ]);

    // Process template stats
    const templateCounts: Record<string, number> = {};
    (templateStatsRes.data || []).forEach((r: { template_id: string }) => {
      templateCounts[r.template_id] = (templateCounts[r.template_id] || 0) + 1;
    });

    // Process events into counts
    const eventCounts: Record<string, number> = {};
    (eventsRes.data || []).forEach((e: { event_type: string }) => {
      eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1;
    });

    // Process daily data for charts
    const dailySignups = groupByDay(dailyUsersRes.data || []);
    const dailyResumes = groupByDay(dailyResumesRes.data || []);

    // Process daily events by type
    const dailyEventsByType: Record<string, Record<string, number>> = {};
    (dailyEventsRes.data || []).forEach((e: { event_type: string; created_at: string }) => {
      const day = e.created_at.split('T')[0];
      if (!dailyEventsByType[e.event_type]) dailyEventsByType[e.event_type] = {};
      dailyEventsByType[e.event_type][day] = (dailyEventsByType[e.event_type][day] || 0) + 1;
    });

    // Resume completion analysis
    const completionStats = analyzeResumeCompletion(resumeCompletionRes.data || []);

    // ATS score distribution from events
    const atsScores: number[] = [];
    (eventsRes.data || []).forEach((e: { event_type: string; metadata: Record<string, unknown> }) => {
      if (e.event_type === 'ats_check' && e.metadata?.score) {
        atsScores.push(e.metadata.score as number);
      }
    });

    // Funnel data
    const funnel = {
      signups: newUsersRes.count || 0,
      resumesCreated: eventCounts['resume_create'] || 0,
      resumesSaved: eventCounts['resume_save'] || 0,
      pdfDownloads: eventCounts['pdf_download'] || 0,
      atsChecks: eventCounts['ats_check'] || 0,
      emailCaptures: recentEmailLeadsRes.count || 0,
    };

    return NextResponse.json({
      overview: {
        totalUsers: totalUsersRes.count || 0,
        newUsers: newUsersRes.count || 0,
        totalResumes: totalResumesRes.count || 0,
        recentResumes: recentResumesRes.count || 0,
        totalEmailLeads: emailLeadsRes.count || 0,
        recentEmailLeads: recentEmailLeadsRes.count || 0,
        totalErrors: errorsRes.count || 0,
        pdfDownloads: eventCounts['pdf_download'] || 0,
        pdfErrors: eventCounts['pdf_download_error'] || 0,
        atsChecks: eventCounts['ats_check'] || 0,
        aiSuggestions: eventCounts['ai_suggest'] || 0,
      },
      funnel,
      templatePopularity: templateCounts,
      eventCounts,
      dailySignups,
      dailyResumes,
      dailyEventsByType,
      atsScores: {
        average: atsScores.length ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length) : 0,
        distribution: {
          excellent: atsScores.filter(s => s >= 90).length,
          good: atsScores.filter(s => s >= 75 && s < 90).length,
          needsWork: atsScores.filter(s => s >= 50 && s < 75).length,
          poor: atsScores.filter(s => s < 50).length,
        },
        total: atsScores.length,
      },
      completionStats,
      recentErrors: (recentErrorsRes.data || []).slice(0, 50),
      range: days,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}

function groupByDay(items: { created_at: string }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach(item => {
    const day = item.created_at.split('T')[0];
    counts[day] = (counts[day] || 0) + 1;
  });
  return counts;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function analyzeResumeCompletion(resumes: { resume_data: any }[]) {
  const fields = {
    hasName: 0,
    hasEmail: 0,
    hasPhone: 0,
    hasSummary: 0,
    hasExperience: 0,
    hasEducation: 0,
    hasSkills: 0,
    hasPhoto: 0,
    hasLinkedIn: 0,
    hasProjects: 0,
    hasCertifications: 0,
    hasLanguages: 0,
  };
  const total = resumes.length || 1;

  resumes.forEach(r => {
    const d = r.resume_data;
    if (!d) return;
    const p = d.personalDetails || {};
    if (p.firstName || p.lastName) fields.hasName++;
    if (p.email) fields.hasEmail++;
    if (p.phone) fields.hasPhone++;
    if (p.summary && p.summary.length > 20) fields.hasSummary++;
    if (p.linkedIn) fields.hasLinkedIn++;
    if (p.photo) fields.hasPhoto++;
    if (d.workExperience?.length > 0) fields.hasExperience++;
    if (d.education?.length > 0) fields.hasEducation++;
    if (d.skills?.length > 0) fields.hasSkills++;
    if (d.projects?.length > 0) fields.hasProjects++;
    if (d.certifications?.length > 0) fields.hasCertifications++;
    if (d.languages?.length > 0) fields.hasLanguages++;
  });

  return Object.fromEntries(
    Object.entries(fields).map(([key, count]) => [key, Math.round((count / total) * 100)])
  );
}

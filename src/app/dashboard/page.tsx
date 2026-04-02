import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Dashboard – Resumly',
  robots: 'noindex',
};

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  draft: { label: 'Draft', dot: 'bg-neutral-40', bg: 'bg-neutral-10', text: 'text-neutral-60' },
  ready: { label: 'Ready', dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  applied: { label: 'Applied', dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  interviewing: { label: 'Interviewing', dot: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
  offered: { label: 'Offered', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  rejected: { label: 'Rejected', dot: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-600' },
  withdrawn: { label: 'Withdrawn', dot: 'bg-neutral-30', bg: 'bg-neutral-10', text: 'text-neutral-50' },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const [{ data: resumes }, { data: applications }, { count: downloadCount }] = await Promise.all([
    supabase
      .from('resumes')
      .select('id, title, template_id, updated_at, resume_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(6),
    supabase
      .from('applications')
      .select(`
        id, status, applied_at, created_at,
        job:jobs(id, title, company, location, url),
        resume:resumes(id, title),
        cover_letter:cover_letters(id)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'pdf_download')
      .eq('user_id', user.id),
  ]);

  const calcAtsScore = (rd: Record<string, unknown>): number => {
    const p = rd?.personalDetails as Record<string, string> | undefined;
    const we = rd?.workExperience as unknown[] | undefined;
    const edu = rd?.education as unknown[] | undefined;
    const skills = rd?.skills as unknown[] | undefined;
    let score = 0;
    if (p?.firstName && p?.lastName) score += 10;
    if (p?.email) score += 10;
    if (p?.phone) score += 5;
    if (p?.jobTitle) score += 10;
    if (p?.location) score += 5;
    if (p?.summary && p.summary.length > 50) score += 15;
    if (we && we.length > 0) score += 20;
    if (edu && edu.length > 0) score += 10;
    if (skills && skills.length >= 5) score += 15;
    return Math.min(score, 100);
  };

  const atsReadyCount = (resumes || []).filter((r) => calcAtsScore(r.resume_data as Record<string, unknown>) >= 80).length;
  const interviewCount = (applications || []).filter(a => a.status === 'interviewing' || a.status === 'offered').length;
  const { count: totalApps } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

  const metaName = user.user_metadata?.name?.trim();
  const firstName = metaName ? metaName.split(' ')[0] : null;
  const hasApplications = applications && applications.length > 0;
  const isEmpty = !hasApplications && (!resumes || resumes.length === 0);

  return (
    <>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-[18px] sm:text-[20px] font-semibold text-neutral-90 tracking-tight leading-tight">
          {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
        </h1>
        <p className="text-neutral-50 mt-0.5 text-[13px]">Here&apos;s an overview of your job search progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {[
          {
            label: 'Applications', value: totalApps || 0,
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
            accent: 'text-primary bg-primary/8',
          },
          {
            label: 'Interviews', value: interviewCount,
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
            accent: 'text-purple-600 bg-purple-50',
          },
          {
            label: 'ATS Ready', value: atsReadyCount,
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            accent: 'text-green-600 bg-green-50',
          },
          {
            label: 'Downloads', value: downloadCount || 0,
            icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
            accent: 'text-orange-600 bg-orange-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-neutral-20 shadow-sm px-4 py-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <div className={`w-8 h-8 rounded-lg ${stat.accent} flex items-center justify-center`}>{stat.icon}</div>
              <span className="text-[22px] sm:text-[24px] font-bold text-neutral-90 tracking-tight">{stat.value}</span>
            </div>
            <div className="text-[12px] text-neutral-50 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="text-center py-14 sm:py-16 bg-white rounded-xl border border-neutral-20 shadow-sm">
          <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-semibold text-neutral-90 mb-1.5">Start your first application</h3>
          <p className="text-neutral-50 text-[13px] mb-6 max-w-md mx-auto leading-relaxed">
            Paste a job link and we&apos;ll create an ATS-optimized resume tailored to the role.
          </p>
          <div className="flex gap-2.5 justify-center">
            <Button asChild size="sm" className="gap-2">
              <Link href="/">Paste a Job Link</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/builder/new">Create Resume</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Recent applications */}
      {hasApplications && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-neutral-90">Recent Applications</h2>
            <Link href="/dashboard/applications" className="text-[12px] text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-[1fr_120px_120px_90px] gap-4 px-4 py-2 border-b border-neutral-20">
              <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Position</span>
              <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Documents</span>
              <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Status</span>
              <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Date</span>
            </div>
            {applications.map((app) => {
              const jobArr = app.job as unknown as { id: string; title: string; company: string; location: string; url: string }[] | null;
              const job = Array.isArray(jobArr) ? jobArr[0] : jobArr;
              const resumeArr = app.resume as unknown as { id: string; title: string }[] | null;
              const resume = Array.isArray(resumeArr) ? resumeArr[0] : resumeArr;
              const clArr = app.cover_letter as unknown as { id: string }[] | null;
              const coverLetter = Array.isArray(clArr) ? clArr[0] : clArr;
              const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;

              return (
                <div key={app.id} className="grid sm:grid-cols-[1fr_120px_120px_90px] gap-1.5 sm:gap-4 px-4 py-3 border-b border-neutral-20/60 last:border-0 hover:bg-neutral-10/50 transition-colors items-center">
                  <div className="min-w-0">
                    <p className="font-medium text-[13px] text-neutral-90 truncate">{job?.title || 'Untitled'}</p>
                    <p className="text-[11px] text-neutral-50 truncate">{job?.company}{job?.location ? ` \u00b7 ${job.location}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {resume && (
                      <Link href={`/dashboard/resume/${resume.id}`} className="text-[12px] text-primary hover:underline font-medium">Resume</Link>
                    )}
                    {resume && coverLetter && <span className="text-neutral-20">\u00b7</span>}
                    {coverLetter && (
                      <Link href={`/dashboard/cover-letter/${coverLetter.id}`} className="text-[12px] text-green-600 hover:underline font-medium">Letter</Link>
                    )}
                    {!resume && !coverLetter && <span className="text-[12px] text-neutral-30">&mdash;</span>}
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>
                  <div className="text-[12px] text-neutral-40">
                    {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick actions */}
      {!isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Link
            href="/"
            className="group bg-white rounded-xl border border-neutral-20 shadow-sm px-5 py-4 hover:shadow-md hover:border-neutral-30 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center mb-2.5 group-hover:bg-primary/15 transition-colors">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.9-3.038a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757" /></svg>
            </div>
            <p className="font-semibold text-[13px] text-neutral-80 mb-0.5">New Application</p>
            <p className="text-[12px] text-neutral-50">Paste a job link to get started</p>
          </Link>
          <Link
            href="/builder/new"
            className="group bg-white rounded-xl border border-neutral-20 shadow-sm px-5 py-4 hover:shadow-md hover:border-neutral-30 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-2.5 group-hover:bg-green-100 transition-colors">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            <p className="font-semibold text-[13px] text-neutral-80 mb-0.5">Create Resume</p>
            <p className="text-[12px] text-neutral-50">Build from scratch or upload</p>
          </Link>
          <Link
            href="/dashboard/resumes"
            className="group bg-white rounded-xl border border-neutral-20 shadow-sm px-5 py-4 hover:shadow-md hover:border-neutral-30 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-2.5 group-hover:bg-purple-100 transition-colors">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
            </div>
            <p className="font-semibold text-[13px] text-neutral-80 mb-0.5">My Resumes</p>
            <p className="text-[12px] text-neutral-50">View and manage all resumes</p>
          </Link>
        </div>
      )}
    </>
  );
}

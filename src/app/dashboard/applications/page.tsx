import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Applications – Resumly',
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

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at, created_at, notes,
      job:jobs(id, title, company, location, salary, url),
      resume:resumes(id, title, ats_score),
      cover_letter:cover_letters(id, content, tone)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const hasApps = applications && applications.length > 0;

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] sm:text-[20px] font-semibold text-neutral-90 tracking-tight">Applications</h1>
          <p className="text-neutral-50 text-[13px] mt-0.5">{hasApps ? `${applications.length} total` : 'No applications yet'}</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New
          </Link>
        </Button>
      </div>

      {!hasApps && (
        <div className="text-center py-14 bg-white rounded-xl border border-neutral-20 shadow-sm">
          <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </div>
          <h3 className="text-[14px] font-semibold text-neutral-90 mb-1">No applications yet</h3>
          <p className="text-neutral-50 text-[13px] mb-5 max-w-sm mx-auto">Paste a job link on the homepage to create your first application.</p>
          <Button asChild size="sm"><Link href="/">Get Started</Link></Button>
        </div>
      )}

      {hasApps && (
        <div className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-[1fr_140px_140px_120px_90px] gap-4 px-4 py-2 border-b border-neutral-20">
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Position</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Resume</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Cover Letter</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Status</span>
            <span className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Date</span>
          </div>
          {applications.map((app) => {
            const jobArr = app.job as unknown as { id: string; title: string; company: string; location: string; salary: string; url: string }[] | null;
            const job = Array.isArray(jobArr) ? jobArr[0] : jobArr;
            const resumeArr = app.resume as unknown as { id: string; title: string; ats_score: number }[] | null;
            const resume = Array.isArray(resumeArr) ? resumeArr[0] : resumeArr;
            const clArr = app.cover_letter as unknown as { id: string; content: string; tone: string }[] | null;
            const coverLetter = Array.isArray(clArr) ? clArr[0] : clArr;
            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;

            return (
              <div key={app.id} className="grid sm:grid-cols-[1fr_140px_140px_120px_90px] gap-1.5 sm:gap-4 px-4 py-3 border-b border-neutral-20/60 last:border-0 hover:bg-primary/[0.02] transition-colors items-center">
                <div className="min-w-0">
                  <p className="font-medium text-[13px] text-neutral-90 truncate">{job?.title || 'Untitled'}</p>
                  <p className="text-[11px] text-neutral-50 truncate">{job?.company}{job?.location ? ` \u00b7 ${job.location}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  {resume ? (
                    <>
                      <Link href={`/dashboard/resume/${resume.id}`} className="text-[12px] text-primary hover:underline font-medium">View</Link>
                      <span className="text-neutral-20">\u00b7</span>
                      <Link href={`/dashboard/resume/${resume.id}?download=true`} className="text-[12px] text-neutral-50 hover:text-primary font-medium">PDF</Link>
                    </>
                  ) : (
                    <span className="text-[12px] text-neutral-30">&mdash;</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {coverLetter ? (
                    <>
                      <Link href={`/dashboard/cover-letter/${coverLetter.id}`} className="text-[12px] text-green-600 hover:underline font-medium">View</Link>
                      <span className="text-neutral-20">\u00b7</span>
                      <Link href={`/dashboard/cover-letter/${coverLetter.id}?download=true`} className="text-[12px] text-neutral-50 hover:text-green-600 font-medium">PDF</Link>
                    </>
                  ) : job ? (
                    <Link href={`/funnel/${job.id}/cover-letter${resume ? `?resumeId=${resume.id}` : ''}`} className="text-[12px] text-primary hover:underline font-medium">Generate</Link>
                  ) : (
                    <span className="text-[12px] text-neutral-30">&mdash;</span>
                  )}
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
      )}
    </>
  );
}

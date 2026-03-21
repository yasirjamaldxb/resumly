import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ResumeCard } from '@/components/dashboard/resume-card';

export const metadata: Metadata = {
  title: 'Dashboard – Resumly',
  robots: 'noindex',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const [{ data: resumes }, { count: downloadCount }] = await Promise.all([
    supabase
      .from('resumes')
      .select('id, title, template_id, color_scheme, updated_at, resume_data, is_public')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false }),
    supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'pdf_download')
      .eq('user_id', user.id),
  ]);

  // Calculate ATS score for each resume (mirrors builder logic)
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

  const firstName = user.user_metadata?.name?.split(' ')[0] || user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-neutral-90 tracking-tight text-[17px]">resumly<span className="text-primary">.app</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-neutral-50 hidden sm:block">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-[14px] text-neutral-50 hover:text-neutral-90 transition-colors font-medium">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-[28px] sm:text-[32px] font-medium text-neutral-90 tracking-tight">Welcome, {firstName}</h1>
          <p className="text-neutral-50 mt-1 text-[15px]">Create, manage, and download your ATS-optimized resumes.</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: 'Resumes', value: String(resumes?.length || 0), color: 'bg-primary/10 text-primary' },
            { label: 'ATS Ready', value: String(atsReadyCount), color: 'bg-green-50 text-green-600' },
            { label: 'Templates', value: '10', color: 'bg-purple-50 text-purple-600' },
            { label: 'Downloads', value: String(downloadCount || 0), color: 'bg-orange-50 text-orange-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-neutral-20/80 p-4 hover:shadow-sm transition-shadow">
              <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3 text-[15px] font-bold`}>
                {stat.value}
              </div>
              <div className="text-[13px] text-neutral-50 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Resumes section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-semibold text-neutral-90 tracking-tight">My Resumes</h2>
            <Button asChild size="sm">
              <Link href="/builder/new" className="gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                New Resume
              </Link>
            </Button>
          </div>

          {!resumes || resumes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-20">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-neutral-90 mb-1.5">No resumes yet</h3>
              <p className="text-neutral-50 text-[14px] mb-6 max-w-xs mx-auto">Create your first ATS-friendly resume in under 10 minutes</p>
              <Button asChild>
                <Link href="/builder/new">Create My Resume</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* New resume card */}
              <Link
                href="/builder/new"
                className="group border-2 border-dashed border-neutral-20 rounded-xl flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/[0.02] transition-all min-h-[240px]"
              >
                <div className="w-12 h-12 bg-neutral-10 group-hover:bg-primary/10 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <svg className="w-6 h-6 text-neutral-40 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-semibold text-[15px] text-neutral-60 group-hover:text-primary transition-colors">New Resume</p>
              </Link>

              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={{
                    id: resume.id,
                    title: resume.title,
                    template_id: resume.template_id,
                    color_scheme: resume.color_scheme,
                    updated_at: resume.updated_at,
                    is_public: resume.is_public ?? false,
                    resume_data: resume.resume_data as { personalDetails?: { firstName?: string; lastName?: string; jobTitle?: string; photo?: string }; colorScheme?: string } | null,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

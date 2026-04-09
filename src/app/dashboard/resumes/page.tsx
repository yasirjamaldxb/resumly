import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ResumeCard } from '@/components/dashboard/resume-card';

export const metadata: Metadata = {
  title: 'My Resumes – Resumly',
  robots: 'noindex',
};

export default async function ResumesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, title, template_id, color_scheme, updated_at, resume_data, is_public')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const hasResumes = resumes && resumes.length > 0;

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] sm:text-[20px] font-semibold text-neutral-90 tracking-tight">My Resumes</h1>
          <p className="text-neutral-50 text-[13px] mt-0.5">{hasResumes ? `${resumes.length} resume${resumes.length !== 1 ? 's' : ''}` : 'No resumes yet'}</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/builder">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            New Resume
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* New resume card */}
        <Link
          href="/builder"
          className="group border-2 border-dashed border-neutral-20 rounded-xl flex flex-col items-center justify-center text-center hover:border-primary/30 hover:bg-primary/[0.02] transition-all min-h-[220px]"
        >
          <div className="w-10 h-10 bg-neutral-10 group-hover:bg-primary/8 rounded-lg flex items-center justify-center mb-2.5 transition-colors">
            <svg className="w-5 h-5 text-neutral-40 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="font-semibold text-[13px] text-neutral-60 group-hover:text-primary transition-colors">New Resume</p>
        </Link>

        {(resumes || []).map((resume) => (
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
    </>
  );
}

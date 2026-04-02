import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResumeTemplate } from '@/components/resume/templates';
import { ResumeData } from '@/types/resume';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('resumes')
    .select('resume_data, is_public')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (!data) return { title: 'Resume – Resumly' };

  const rd = data.resume_data as ResumeData;
  const name = `${rd?.personalDetails?.firstName || ''} ${rd?.personalDetails?.lastName || ''}`.trim();
  const jobTitle = rd?.personalDetails?.jobTitle || '';

  return {
    title: `${name}${jobTitle ? ` – ${jobTitle}` : ''} | Resume`,
    description: `View ${name}'s professional resume built with Resumly.`,
    robots: 'noindex',
  };
}

export default async function PublicResumePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: resume } = await supabase
    .from('resumes')
    .select('resume_data, is_public')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (!resume) notFound();

  const resumeData = resume.resume_data as ResumeData;
  const name = `${resumeData?.personalDetails?.firstName || ''} ${resumeData?.personalDetails?.lastName || ''}`.trim();

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header bar */}
      <div className="bg-white border-b border-neutral-20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-[52px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-neutral-90 text-[15px] tracking-tight">resumly<span className="text-primary">.app</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-50 hidden sm:block">{name}&apos;s Resume</span>
            <Link
              href="/builder/new"
              className="bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Build My Resume
            </Link>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="py-8 px-4">
        <div
          className="bg-white shadow-lg mx-auto rounded-sm"
          style={{ width: '794px', maxWidth: '100%' }}
        >
          <ResumeTemplate data={resumeData} />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-[794px] mx-auto px-4 pb-10 text-center">
        <p className="text-sm text-neutral-50 mb-3">
          Built with <Link href="/" className="text-primary font-medium hover:underline">Resumly</Link>. Create your ATS-optimized resume for free
        </p>
        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          Create My Resume, Free
        </Link>
      </div>
    </div>
  );
}

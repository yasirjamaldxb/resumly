import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CoverLetterClient } from './cover-letter-client';

export const metadata: Metadata = {
  title: 'Free AI Cover Letter Builder – Write in Minutes (2026)',
  description:
    'Create a professional cover letter in minutes with AI assistance. Paste the job description to generate a targeted, ATS-friendly cover letter. Free, no sign-up required.',
  alternates: { canonical: 'https://resumly.app/cover-letter-builder' },
  openGraph: {
    title: 'Free AI Cover Letter Builder · Resumly',
    description: 'Generate a professional, ATS-friendly cover letter in seconds with AI. Free and no sign-up required.',
  },
};

export default function CoverLetterBuilderPage() {
  return (
    <>
      <Header />
      <main>
        <CoverLetterClient />
      </main>
      <Footer />
    </>
  );
}

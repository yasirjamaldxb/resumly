import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Free Resume Builder – Build Your Resume Online in Minutes',
  description:
    'Use our free online resume builder to create a professional, ATS-friendly resume in under 10 minutes. AI writing assistance, 6+ templates, instant PDF download.',
  alternates: { canonical: 'https://resumly.app/resume-builder' },
  openGraph: {
    title: 'Free Resume Builder | Resumly',
    description: 'Build your professional resume in minutes with AI assistance. Free, ATS-optimized, instant PDF.',
  },
};

const benefits = [
  { icon: '🤖', text: 'AI writes your bullets & summary' },
  { icon: '✅', text: '99% ATS pass rate guaranteed' },
  { icon: '⚡', text: 'Build in under 10 minutes' },
  { icon: '📄', text: 'Download PDF free, no watermarks' },
  { icon: '🎨', text: '6 professional templates' },
  { icon: '📊', text: 'Real-time ATS score checker' },
];

export default function ResumeBuilderPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              Free Resume Builder — Build Your Resume Online
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create a professional, ATS-friendly resume in minutes. Our AI-powered builder guides you through every step — no design skills needed.
            </p>
            <Button size="xl" asChild>
              <Link href="/builder/new">Start Building for Free →</Link>
            </Button>
            <p className="text-sm text-gray-500 mt-3">No sign-up required. Free forever.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12 text-left">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3">
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to use section - SEO content */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to use the free resume builder</h2>

            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p>
                Building a professional resume has never been easier. Our free online resume builder walks you through each section, offers AI-powered writing suggestions, and ensures your resume passes ATS (Applicant Tracking System) filters used by 99% of Fortune 500 companies.
              </p>

              <h3 className="text-xl font-bold text-gray-900">Step 1: Choose a template</h3>
              <p>
                Select from 6 professionally designed resume templates. All templates are ATS-optimized and tested with major ATS systems including Workday, Greenhouse, and Lever. The <strong>ATS Pro template</strong> achieves a 99% ATS pass rate and is ideal for most job seekers.
              </p>

              <h3 className="text-xl font-bold text-gray-900">Step 2: Add your personal details</h3>
              <p>
                Enter your name, contact information, and professional summary. Not sure what to write? Click &quot;AI Write&quot; and our AI will generate a compelling professional summary based on your job title and experience.
              </p>

              <h3 className="text-xl font-bold text-gray-900">Step 3: Add work experience</h3>
              <p>
                List your work history starting with your most recent position. For each role, add 3-5 bullet points describing your key achievements. Use our AI bullet generator to create powerful, results-oriented bullet points that start with action verbs.
              </p>

              <h3 className="text-xl font-bold text-gray-900">Step 4: Education and skills</h3>
              <p>
                Add your educational background and relevant skills. Our AI will suggest skills based on your target job title that recruiters and ATS systems are specifically looking for.
              </p>

              <h3 className="text-xl font-bold text-gray-900">Step 5: Download your resume</h3>
              <p>
                Once your ATS score hits 80%+, download your resume as a perfectly formatted PDF. No watermarks, no fees — just a professional resume ready to send.
              </p>
            </div>

            <div className="mt-10 text-center">
              <Button size="xl" asChild>
                <Link href="/builder/new">Build My Resume Now →</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

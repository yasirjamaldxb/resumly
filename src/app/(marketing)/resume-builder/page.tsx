import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Resume Builder: Make & Download Your Resume Easily (2026)',
  description:
    'Create a professional resume in under 10 minutes. AI writes your bullet points, 10 ATS-optimized templates, instant text-based PDF download. No watermarks.',
  alternates: { canonical: 'https://resumly.app/resume-builder' },
  openGraph: {
    title: 'AI Resume Builder: Make & Download Your Resume Easily · Resumly',
    description: 'Create a professional resume in under 10 minutes. AI writes your bullet points, 10 ATS-optimized templates, instant PDF.',
  },
};

const benefits = [
  { icon: '🤖', text: 'AI writes your bullets & summary' },
  { icon: '✅', text: 'ATS-optimized templates that pass screening' },
  { icon: '⚡', text: 'Build in under 10 minutes' },
  { icon: '📄', text: 'Text-based PDF, no watermarks, no images' },
  { icon: '🎨', text: '10 professional templates' },
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
              AI Resume Builder: Build Your Resume Online
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create a professional, ATS-friendly resume in minutes. Our AI-powered builder guides you through every step. No design skills needed.
            </p>
            <Button size="xl" asChild>
              <Link href="/#hero-input">Start Building Now →</Link>
            </Button>
            <p className="text-sm text-gray-500 mt-3">No sign-up required. No credit card needed.</p>

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
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to use the resume builder</h2>

            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p>
                Building a professional resume has never been easier. Our online resume builder walks you through each section, offers AI-powered writing suggestions, and ensures your resume passes ATS (Applicant Tracking System) filters used by 99% of Fortune 500 companies.
              </p>

              <h3 className="text-xl font-bold text-gray-900">Step 1: Choose a template</h3>
              <p>
                Select from 10 professionally designed resume templates. All templates are ATS-optimized with clean formatting that works with major ATS systems including Workday, Greenhouse, and Lever. The <strong>ATS Pro template</strong> is our most popular choice and is ideal for most job seekers.
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
                Once your ATS score hits 80%+, download your resume as a perfectly formatted PDF. No watermarks, no fees. Just a professional resume ready to send.
              </p>
            </div>

            <div className="mt-10 text-center">
              <Button size="xl" asChild>
                <Link href="/#hero-input">Build My Resume Now →</Link>
              </Button>
            </div>
          </div>
        </section>
        {/* FAQ structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Do I need to create an account to use the resume builder?',
                  acceptedAnswer: { '@type': 'Answer', text: 'No sign-up is required to start building your resume. You can create and download a resume right away. Creating an account lets you save your resumes and access them later.' },
                },
                {
                  '@type': 'Question',
                  name: 'How long does it take to build a resume?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Most users complete their resume in under 10 minutes using our step-by-step builder. The AI writing feature speeds things up by generating professional summaries and bullet points for you.' },
                },
                {
                  '@type': 'Question',
                  name: 'Are the resume templates ATS-friendly?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, all 10 templates are designed to pass Applicant Tracking Systems. They use clean formatting, standard fonts, and proper section headings. Our PDFs are text-based (not images), so ATS systems can read every word.' },
                },
                {
                  '@type': 'Question',
                  name: 'What format can I download my resume in?',
                  acceptedAnswer: { '@type': 'Answer', text: 'You can download your resume as a text-based PDF. Unlike some builders that create image-based PDFs, ours contain real selectable text that ATS systems and recruiters can read perfectly.' },
                },
                {
                  '@type': 'Question',
                  name: 'Can I create multiple resumes?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can create and save unlimited resumes. We recommend creating a tailored resume for each job application to maximize your chances of getting an interview.' },
                },
                {
                  '@type': 'Question',
                  name: 'How is Resumly different from other resume builders?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Resumly generates real text-based PDFs instead of image screenshots, which means your resume is fully readable by ATS systems. It also includes AI writing assistance, no watermarks, and a real-time ATS score checker.' },
                },
              ],
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}

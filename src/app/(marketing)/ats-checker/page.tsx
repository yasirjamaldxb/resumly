import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker – Test Your Resume Score | Resumly',
  description:
    'Check if your resume will pass ATS filters. Our free ATS checker scores your resume and gives specific tips to improve it. Used by 50,000+ job seekers.',
  alternates: { canonical: 'https://resumly.app/ats-checker' },
};

export default function ATSCheckerPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-green-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Free ATS Scanner
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              Free ATS Resume Checker
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              75% of resumes are rejected by ATS before a human ever reads them.
              Build your resume with Resumly and get a real-time ATS score as you type.
            </p>
            <Button size="xl" asChild>
              <Link href="/builder/new">Check My Resume Score →</Link>
            </Button>
          </div>
        </section>

        {/* What is ATS */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What is an ATS and why does it matter?</h2>
            <div className="text-gray-600 space-y-6 text-lg leading-relaxed">
              <p>
                An <strong>Applicant Tracking System (ATS)</strong> is software used by 99% of Fortune 500 companies to automatically screen resumes before a human recruiter sees them.
                If your resume doesn&apos;t pass the ATS filter, it gets automatically rejected — no matter how qualified you are.
              </p>
              <p>
                ATS systems scan for specific keywords, proper formatting, and structured sections. A resume that looks beautiful to humans might be completely unreadable to an ATS if it uses tables, columns, graphics, or unusual fonts.
              </p>
              <h3 className="text-xl font-bold text-gray-900">Our real-time ATS score checks:</h3>
              <ul className="space-y-3">
                {[
                  'Contact information completeness',
                  'Professional summary presence and length',
                  'Work experience formatting and keyword density',
                  'Skills section with relevant keywords',
                  'Education section formatting',
                  'File format compatibility (PDF with text layer)',
                  'Font and formatting parsability',
                  'Keyword match with job descriptions',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 bg-blue-50 rounded-2xl p-6 text-center">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                The best way to ensure ATS compatibility is to build your resume with Resumly
              </p>
              <Button asChild size="lg">
                <Link href="/builder/new">Build ATS-Ready Resume →</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

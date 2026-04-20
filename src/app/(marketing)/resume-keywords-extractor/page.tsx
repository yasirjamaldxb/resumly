import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { FAQPageSchema, BreadcrumbListSchema, ArticleSchema } from '@/components/seo/schema';
import KeywordExtractor from './extractor';

export const metadata: Metadata = {
  title: 'Free Resume Keyword Extractor — Find ATS Keywords From Any Job Posting',
  description:
    'Paste any job description and instantly extract the top ATS keywords, hard skills, and soft skills to include in your resume. Free, no signup required.',
  alternates: { canonical: 'https://resumly.app/resume-keywords-extractor' },
  openGraph: {
    title: 'Free Resume Keyword Extractor · Resumly',
    description:
      'Paste any job description, get the top ATS keywords to include on your resume. Free, no signup.',
  },
};

const FAQ = [
  {
    question: 'What is a resume keyword extractor?',
    answer:
      'A resume keyword extractor analyzes a job description and pulls out the specific terms, skills, tools, and certifications that Applicant Tracking Systems (ATS) look for. Using these exact keywords on your resume increases your chances of passing ATS screening.',
  },
  {
    question: 'Why do keywords matter for ATS?',
    answer:
      'Over 99% of Fortune 500 companies use ATS to filter resumes before a human ever sees them. ATS systems rank resumes by how closely they match the job description keywords. Missing key terms is the #1 reason qualified candidates get rejected.',
  },
  {
    question: 'How many keywords should I include in my resume?',
    answer:
      'Aim to include the top 10-15 most important keywords from the job description. Focus on hard skills, tools, certifications, and specific technologies. Integrate them naturally into your summary, experience bullets, and skills section — never stuff them.',
  },
  {
    question: 'Is the keyword extractor really free?',
    answer:
      'Yes. The Resumly keyword extractor is 100% free with no signup, no email required, and no limit on the number of job descriptions you can analyze. We also offer a free AI resume builder and ATS checker.',
  },
  {
    question: 'Does this work for any industry?',
    answer:
      'Yes. The extractor works for any job in any industry — tech, healthcare, finance, marketing, trades, retail, education, and more. Paste any job description and get the keywords that matter for that specific role.',
  },
];

export default function ResumeKeywordsExtractorPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-blue-50 to-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-4">
              FREE · NO SIGNUP
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Resume Keyword Extractor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Paste any job description and instantly get the top ATS keywords to include on
              your resume. Pass the bots, get more interviews.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <KeywordExtractor />
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How the keyword extractor works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { n: 1, t: 'Paste the job description', d: 'Copy any job posting from LinkedIn, Indeed, or a company career page and paste it into the box.' },
                { n: 2, t: 'Get your keywords', d: 'We identify the top hard skills, soft skills, tools, and certifications the ATS is looking for.' },
                { n: 3, t: 'Add them to your resume', d: 'Naturally integrate the top 10-15 keywords into your summary, bullets, and skills section.' },
              ].map((s) => (
                <div key={s.n} className="bg-white rounded-xl p-5 border border-gray-200">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">{s.n}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.t}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <details key={item.question} className="bg-white border border-gray-200 rounded-xl p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {item.question}
                    <span className="text-blue-600 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold mb-3">Build your ATS-optimized resume next</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Use your extracted keywords to build a free, ATS-friendly resume in under 60 seconds.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold" asChild>
              <Link href="/#hero-input">Build My Resume Free →</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />

      <ArticleSchema
        headline="Free Resume Keyword Extractor"
        description="Paste any job description and instantly extract the top ATS keywords for your resume."
        url="https://resumly.app/resume-keywords-extractor"
        datePublished="2026-04-20"
        dateModified="2026-04-20"
        type="Article"
      />
      <BreadcrumbListSchema
        items={[
          { name: 'Home', url: 'https://resumly.app' },
          { name: 'Resume Keyword Extractor', url: 'https://resumly.app/resume-keywords-extractor' },
        ]}
      />
      <FAQPageSchema items={FAQ} />
    </>
  );
}

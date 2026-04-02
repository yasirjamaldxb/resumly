import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ATSCheckerClient } from './ats-checker-client';

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker: Score Your Resume Instantly (2026)',
  description:
    'Upload your resume and get an instant ATS compatibility score. Our free checker analyzes formatting, keywords, sections, and content quality, with actionable fix suggestions.',
  keywords: [
    'ATS resume checker', 'ATS score', 'resume scanner', 'applicant tracking system',
    'ATS friendly resume', 'resume checker free', 'ATS compatibility', 'resume score',
    'ATS resume test', 'resume analyzer', 'free ATS check',
  ].join(', '),
  alternates: { canonical: 'https://resumly.app/ats-checker' },
  openGraph: {
    title: 'Free ATS Resume Checker · Resumly',
    description: 'Upload your resume and get an instant ATS compatibility score with actionable fix suggestions.',
    url: 'https://resumly.app/ats-checker',
    siteName: 'Resumly',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Checker · Resumly',
    description: 'Upload your resume and get an instant ATS compatibility score with actionable fix suggestions.',
  },
};

export default function ATSCheckerPage() {
  return (
    <>
      <Header />
      <main>
        <ATSCheckerClient />

        {/* Educational content below the checker */}
        <section className="py-16 bg-white">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="text-[24px] font-medium text-neutral-90 mb-5 tracking-tight">
              What is an ATS?
            </h2>
            <p className="text-[14px] text-neutral-60 leading-relaxed mb-4">
              An Applicant Tracking System (ATS) is software that companies use to manage job applications. Over 97% of Fortune 500 companies and 75% of all employers use ATS software to screen resumes before a human ever sees them.
            </p>
            <p className="text-[14px] text-neutral-60 leading-relaxed mb-10">
              The ATS scans your resume for keywords, proper formatting, standard section headings, and structured content. If your resume doesn&apos;t pass the ATS, it gets rejected automatically, even if you&apos;re perfectly qualified for the job.
            </p>

            <h2 className="text-[24px] font-medium text-neutral-90 mb-5 tracking-tight">
              What our ATS checker analyzes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                { title: 'Contact Information', desc: 'Email, phone, LinkedIn, and location, all required by ATS.' },
                { title: 'Resume Sections', desc: 'Standard section headings like Experience, Education, Skills.' },
                { title: 'Content Quality', desc: 'Action verbs, measurable achievements, bullet points, dates.' },
                { title: 'Formatting', desc: 'Clean text encoding, no problematic headers/footers, text-based PDF.' },
                { title: 'Keywords', desc: 'Industry-specific terms and skills that ATS systems look for.' },
                { title: 'Professional Tone', desc: 'Proper resume conventions like avoiding first-person pronouns.' },
              ].map(item => (
                <div key={item.title} className="border border-neutral-20 rounded-xl p-4">
                  <h3 className="text-[14px] font-semibold text-neutral-90 mb-1">{item.title}</h3>
                  <p className="text-[13px] text-neutral-50">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-[24px] font-medium text-neutral-90 mb-5 tracking-tight">
              Common ATS mistakes that get resumes rejected
            </h2>
            <div className="space-y-4 mb-10">
              {[
                { mistake: 'Using image-based PDFs', fix: 'ATS cannot read images. Always use text-based PDFs where text is selectable. Resumly generates real text-based PDFs automatically.' },
                { mistake: 'Fancy formatting and graphics', fix: 'Tables, text boxes, columns, and graphics confuse ATS parsers. Stick to clean, single-column layouts.' },
                { mistake: 'Non-standard section headings', fix: 'Use standard headings: "Work Experience" not "Where I\'ve Been". ATS looks for specific keywords.' },
                { mistake: 'Missing keywords', fix: 'Mirror the exact terms from the job description. If they say "project management", don\'t just write "PM".' },
                { mistake: 'No measurable achievements', fix: 'Replace vague descriptions with specific numbers: "Increased revenue by 25%" beats "Helped grow revenue".' },
                { mistake: 'Missing dates', fix: 'Every position needs start/end dates. Gaps are okay, but missing dates entirely is a red flag.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-[13px] font-bold mt-0.5">{i + 1}</div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-neutral-90 mb-0.5">{item.mistake}</h3>
                    <p className="text-[13px] text-neutral-50 leading-relaxed">{item.fix}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-[15px] font-semibold text-green-800 mb-2">Why text-based PDFs matter</h3>
              <p className="text-[13px] text-green-700 leading-relaxed">
                Many resume builders generate image-based PDFs. They look fine to humans but ATS systems see a blank page. Resumly generates real text-based PDFs where every word is selectable and machine-readable. This is the single biggest factor in whether your resume passes ATS screening.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-neutral-10">
          <div className="max-w-[680px] mx-auto px-6">
            <h2 className="text-[24px] font-medium text-neutral-90 text-center mb-8 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Is the ATS checker free?', a: 'Yes, completely free. Upload as many resumes as you want, no sign-up required, no limits.' },
                { q: 'Is my resume data safe?', a: 'Your resume is processed in memory and never stored on our servers. It is deleted immediately after analysis.' },
                { q: 'What score should I aim for?', a: 'Aim for 80% or higher. Resumes scoring 90%+ have the best chance of passing ATS screening. Focus on fixing the suggestions our checker provides.' },
                { q: 'Does this replace a human review?', a: 'No. Our ATS checker identifies formatting and structural issues that cause ATS rejection. You should still have your resume reviewed by a professional or mentor for content quality.' },
                { q: 'What file formats are supported?', a: 'Currently we support PDF files only. PDF is the recommended format for resume submissions as it preserves formatting.' },
                { q: 'How accurate is the ATS score?', a: 'Our checker tests against the same criteria used by major ATS systems like Workday, Taleo, Greenhouse, and iCIMS. While every ATS is slightly different, our checks cover the universal requirements.' },
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-neutral-20 p-5">
                  <h3 className="text-[14px] font-semibold text-neutral-90 mb-1.5">{faq.q}</h3>
                  <p className="text-[13px] text-neutral-50 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { q: 'Is the ATS checker free?', a: 'Yes, completely free. Upload as many resumes as you want, no sign-up required, no limits.' },
              { q: 'Is my resume data safe?', a: 'Your resume is processed in memory and never stored on our servers.' },
              { q: 'What score should I aim for?', a: 'Aim for 80% or higher. Resumes scoring 90%+ have the best chance of passing ATS screening.' },
              { q: 'What file formats are supported?', a: 'Currently we support PDF files only.' },
            ].map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Resumly ATS Resume Checker',
            url: 'https://resumly.app/ats-checker',
            description: 'Free ATS resume compatibility checker with instant scoring and fix suggestions.',
            applicationCategory: 'BusinessApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </>
  );
}

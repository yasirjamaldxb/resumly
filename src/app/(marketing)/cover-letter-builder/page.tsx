import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CoverLetterClient } from './cover-letter-client';

export const metadata: Metadata = {
  title: 'AI Cover Letter Builder – Write in Minutes (2026)',
  description:
    'Create a professional cover letter in minutes with AI assistance. Paste the job description to generate a targeted, ATS-friendly cover letter. No sign-up required.',
  keywords: ['cover letter builder', 'AI cover letter', 'cover letter generator', 'cover letter template', 'ATS cover letter', 'job application letter'],
  alternates: { canonical: 'https://resumly.app/cover-letter-builder' },
  openGraph: {
    title: 'AI Cover Letter Builder · Resumly',
    description: 'Generate a professional, ATS-friendly cover letter in seconds with AI. No sign-up required.',
    url: 'https://resumly.app/cover-letter-builder',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I write a cover letter with AI?', acceptedAnswer: { '@type': 'Answer', text: 'Enter your name, the job title, and company name. Optionally paste the job description and your background. Click Generate and our AI writes a tailored, ATS-friendly cover letter in seconds. You can edit the result before copying or downloading.' } },
        { '@type': 'Question', name: 'Do I need an account to use the cover letter builder?', acceptedAnswer: { '@type': 'Answer', text: 'No account or credit card required. Generate as many cover letters as you need with no watermarks.' } },
        { '@type': 'Question', name: 'Should I include a cover letter with my resume?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Studies show that 83% of hiring managers say cover letters are important in hiring decisions. A targeted cover letter can set you apart from candidates who only submit a resume, especially when it addresses the specific job requirements.' } },
        { '@type': 'Question', name: 'How long should a cover letter be?', acceptedAnswer: { '@type': 'Answer', text: 'A cover letter should be 200 to 400 words, or about three paragraphs. Hiring managers spend an average of 30 seconds reading a cover letter, so keep it concise and focused on your strongest qualifications for the role.' } },
        { '@type': 'Question', name: 'What makes a good cover letter?', acceptedAnswer: { '@type': 'Answer', text: 'A good cover letter opens with a compelling hook, proves your fit with 2-3 specific achievements that match the job requirements, and closes with a confident call to action. It should reference the company by name and use keywords from the job posting naturally.' } },
      ],
    }),
  },
};

export default function CoverLetterBuilderPage() {
  return (
    <>
      <Header />
      <main>
        <CoverLetterClient />

        {/* Server-rendered SEO content — crawlable by Google */}
        <section className="py-16 bg-white border-t border-neutral-100">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="text-[28px] font-bold text-neutral-800 tracking-tight mb-6">How to Write a Cover Letter That Gets Interviews</h2>
            <div className="prose prose-neutral max-w-none text-[15px] leading-relaxed text-neutral-600">
              <p>
                A cover letter is your chance to make a first impression beyond what your resume shows. While a resume lists your qualifications, a cover letter tells the story of why you are the right person for this specific role at this specific company. Hiring managers use cover letters to gauge your communication skills, enthusiasm, and cultural fit, qualities that are hard to capture in bullet points.
              </p>

              <h3 className="text-[20px] font-semibold text-neutral-800 mt-8 mb-3">The 3-Paragraph Formula</h3>
              <p>
                The most effective cover letters follow a simple structure that hiring managers can scan in under 30 seconds:
              </p>
              <p>
                <strong>Paragraph 1: The Hook.</strong> Open with something specific about the company or role that connects to your experience. Avoid generic openings like &quot;I am writing to apply for...&quot; Instead, lead with a concrete insight: what you built, what you learned, or why this company&apos;s mission resonates with your career trajectory.
              </p>
              <p>
                <strong>Paragraph 2: The Proof.</strong> This is the core of your letter. Pick 2-3 specific achievements from your experience that directly address the job&apos;s top requirements. Use numbers, project names, and outcomes. Every sentence should make the reader think &quot;this person has already done what we need.&quot;
              </p>
              <p>
                <strong>Paragraph 3: The Close.</strong> End with confidence. Reference something specific about the team, product, or company direction, and state clearly what you want to happen next. A strong close is forward-looking, not apologetic.
              </p>

              <h3 className="text-[20px] font-semibold text-neutral-800 mt-8 mb-3">Cover Letter Mistakes That Cost You Interviews</h3>
              <p>
                <strong>Being generic.</strong> A cover letter that could be sent to any company is effectively invisible. Mention the company by name at least twice and reference specific details from the job posting. Recruiters can spot a mass-mailed letter instantly.
              </p>
              <p>
                <strong>Repeating your resume.</strong> Your cover letter should complement your resume, not duplicate it. Use the cover letter to provide context, explain career transitions, or highlight the story behind your achievements.
              </p>
              <p>
                <strong>Writing too much.</strong> Keep your cover letter between 200 and 300 words. Hiring managers spend an average of 30 seconds on a cover letter, so make every word count. If you can say it in one sentence, do not use three.
              </p>
              <p>
                <strong>Forgetting ATS keywords.</strong> Many companies use Applicant Tracking Systems that scan cover letters for relevant keywords. Mirror the exact language from the job posting. If they say &quot;project management,&quot; use that phrase, not &quot;managing projects.&quot;
              </p>

              <h3 className="text-[20px] font-semibold text-neutral-800 mt-8 mb-3">Why Use an AI Cover Letter Builder?</h3>
              <p>
                Writing a personalized cover letter for every application is time-consuming. Job seekers applying to 10-20 positions per week often default to generic templates, which hurts their chances. An AI cover letter builder solves this by analyzing the job description and your background to generate a unique, targeted letter in seconds.
              </p>
              <p>
                Resumly&apos;s AI cover letter builder uses your actual experience and the specific job requirements to write a letter that sounds human, not templated. It automatically weaves in relevant keywords for ATS compatibility while maintaining a natural, professional tone. You can edit the result, adjust the tone, and regenerate as many times as you need.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-neutral-50">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="text-[24px] font-bold text-neutral-800 tracking-tight mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'How do I write a cover letter with AI?', a: 'Enter your name, the job title, and company name. Optionally paste the job description and your background for better results. Click Generate and our AI writes a tailored, ATS-friendly cover letter in seconds. You can edit the result before copying or downloading.' },
                { q: 'Do I need an account to use the cover letter builder?', a: 'No account or credit card required. Generate as many cover letters as you need for different job applications, with no watermarks.' },
                { q: 'Should I include a cover letter with my resume?', a: 'Yes. Studies show that 83% of hiring managers say cover letters are important in hiring decisions. A targeted cover letter sets you apart from candidates who only submit a resume, especially when it addresses specific job requirements.' },
                { q: 'How long should a cover letter be?', a: 'A cover letter should be 200 to 400 words, or about three paragraphs. Hiring managers spend an average of 30 seconds reading a cover letter, so keep it concise and focused on your strongest qualifications.' },
                { q: 'What makes a good cover letter?', a: 'A good cover letter opens with a compelling hook, proves your fit with 2-3 specific achievements that match the job requirements, and closes with a confident call to action. It should reference the company by name and use keywords from the job posting naturally.' },
              ].map((faq, i) => (
                <details key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden group">
                  <summary className="px-6 py-4 text-[15px] font-semibold text-neutral-800 cursor-pointer hover:bg-neutral-50 transition-colors list-none flex items-center justify-between">
                    {faq.q}
                    <svg className="w-4 h-4 text-neutral-400 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="px-6 pb-4 text-[14px] text-neutral-600 leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

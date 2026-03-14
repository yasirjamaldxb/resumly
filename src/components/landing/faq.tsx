'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Is Resumly really free?',
    a: 'Yes! Creating and downloading your resume as PDF is completely free. We offer optional premium features like multiple resume storage and advanced AI assistance for those who want more.',
  },
  {
    q: 'What makes a resume ATS-friendly?',
    a: 'ATS (Applicant Tracking Systems) scan resumes for keywords, proper formatting, and structured data before they reach humans. Our templates use standard fonts, proper headings, and clean layouts that ATS systems can parse perfectly. We also help you match keywords from job descriptions.',
  },
  {
    q: 'Will my resume pass through Workday, Greenhouse, and other ATS?',
    a: 'Our ATS Pro template has a 99% pass rate across all major ATS platforms including Workday, Greenhouse, Lever, iCIMS, and Taleo. We regularly test and update our templates to ensure compatibility.',
  },
  {
    q: 'How does the AI resume writing work?',
    a: 'Enter your job title and basic experience, then click "AI Write" to generate professional summaries, bullet points, and skill suggestions. Our AI is trained on thousands of successful resumes and knows what recruiters want to see for specific roles.',
  },
  {
    q: 'Can I create multiple resumes?',
    a: 'Yes! We recommend creating tailored resumes for different job types. Research shows that tailored resumes get 40% more callbacks than generic ones.',
  },
  {
    q: "What's the difference between a resume and a CV?",
    a: 'A resume is typically 1-2 pages and focuses on relevant work experience for a specific job. A CV (curriculum vitae) is more comprehensive, often used in academic and international contexts. For most job applications in the US, Canada, and UK, you want a resume.',
  },
  {
    q: 'How long should my resume be?',
    a: 'For most professionals: 1 page if under 10 years of experience, 2 pages if 10+ years. Our templates are optimized for these lengths. The AI will alert you if your content is getting too long.',
  },
  {
    q: 'Can I download my resume as PDF?',
    a: 'Yes! You can download a perfectly formatted PDF resume instantly for free. The PDF will be clean, professional, and ready to submit to any job application.',
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about building a great resume.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
    </section>
  );
}

'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'What is the definition of a resume?',
    a: 'A resume is a formal document that provides an overview of your professional qualifications, including your relevant work experience, skills, education, and notable accomplishments. It is typically used when applying for jobs to demonstrate to employers why you are a strong candidate.',
  },
  {
    q: 'What is the difference between a CV and a resume?',
    a: 'A resume is typically 1-2 pages and focuses on relevant work experience for a specific job. A CV (curriculum vitae) is more comprehensive, often used in academic and international contexts. For most job applications in the US, Canada, and UK, you want a resume.',
  },
  {
    q: 'How do I choose the right resume template?',
    a: 'Choose a template based on your industry and experience level. Use ATS-friendly templates for corporate jobs, creative templates for design roles, and professional templates for executive positions. All our templates are tested against major ATS systems.',
  },
  {
    q: 'How far back should a resume go?',
    a: 'Generally, your resume should cover the last 10-15 years of work experience. For recent graduates, include relevant internships, projects, and education. Focus on positions most relevant to the job you are applying for.',
  },
  {
    q: 'What does an ATS friendly resume mean?',
    a: 'ATS (Applicant Tracking Systems) scan resumes for keywords, proper formatting, and structured data before they reach humans. An ATS-friendly resume uses standard fonts, clear headings, and clean layouts that these systems can parse perfectly.',
  },
  {
    q: 'What resume file format can I download it?',
    a: 'You can download your resume as a perfectly formatted PDF. PDF is the gold standard for resume submissions as it preserves your formatting across all devices and systems.',
  },
  {
    q: 'Is it worth paying for a resume builder?',
    a: 'Resumly offers a powerful free tier that lets you create and download professional resumes. Our premium features like AI writing assistance and multiple resume storage provide additional value for serious job seekers.',
  },
  {
    q: 'Should I make a different resume for every job application?',
    a: 'Yes! Tailored resumes get 40% more callbacks than generic ones. Customize your resume for each application by matching keywords from the job description and highlighting the most relevant experience.',
  },
  {
    q: 'What makes Resumly the best resume builder?',
    a: 'Resumly combines AI-powered writing, ATS-tested templates, real-time scoring, and an intuitive builder into one free platform. Our templates are designed by recruiters and tested against all major ATS systems.',
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between py-5 text-left hover:text-blue-600 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="pb-5 pr-12">
                  <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
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

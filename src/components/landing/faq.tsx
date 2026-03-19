'use client';

import { useState } from 'react';

const faqs = [
  { q: 'What is the definition of a resume?', a: 'A resume is a formal document that provides an overview of your professional qualifications, including your relevant work experience, skills, education, and notable accomplishments. It is typically used when applying for jobs to demonstrate to employers why you are a strong candidate.' },
  { q: 'What is the difference between a CV and a resume?', a: 'A resume is typically 1-2 pages and focuses on relevant work experience for a specific job. A CV (curriculum vitae) is more comprehensive, often used in academic and international contexts. For most job applications in the US, Canada, and UK, you want a resume.' },
  { q: 'How do I choose the right resume template?', a: 'Choose a template based on your industry and experience level. Use ATS-friendly templates like our ATS Pro for corporate jobs, creative templates for design roles, and professional templates for executive positions. All 10 of our templates are tested against major ATS systems.' },
  { q: 'How far back should a resume go?', a: 'Generally, your resume should cover the last 10-15 years of work experience. For recent graduates, include relevant internships, projects, and education. Focus on positions most relevant to the job you are applying for.' },
  { q: 'What does an ATS-friendly resume mean?', a: 'ATS (Applicant Tracking Systems) scan resumes for keywords, proper formatting, and structured data before they reach human recruiters. An ATS-friendly resume uses standard fonts, clear section headings, and clean layouts that these systems can parse correctly. Resumly generates text-based PDFs — not images — so your content is fully readable by any ATS.' },
  { q: 'What resume file format should I use?', a: 'PDF is the gold standard for resume submissions. Unlike Word documents, PDFs preserve your formatting across all devices and systems. Resumly generates text-based PDFs with real selectable text, ensuring both ATS systems and humans can read your content perfectly.' },
  { q: 'Is Resumly really free?', a: 'Yes, Resumly is 100% free. There are no hidden fees, no premium paywalls, and no credit card required. You get full access to all 10 templates, AI writing suggestions, ATS scoring, and unlimited PDF downloads at no cost.' },
  { q: 'Should I make a different resume for every job application?', a: 'Yes! Tailoring your resume to each job description is one of the most effective ways to get more callbacks. Customize your summary, reorder your skills, and match keywords from the job posting. Our AI suggestions help you do this quickly.' },
  { q: 'What makes Resumly different from other resume builders?', a: 'Resumly generates real text-based PDFs, not images. Many builders use screenshot-to-PDF conversion which creates image files that ATS systems cannot read. Our PDFs contain actual selectable text, giving you maximum compatibility with every applicant tracking system. Plus, it is completely free with no watermarks.' },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-[720px] mx-auto px-6">
        <h2 className="text-[40px] sm:text-[48px] font-medium text-neutral-90 text-center mb-14 tracking-tight leading-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-neutral-20">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={`text-[16px] font-medium pr-6 transition-colors ${open === i ? 'text-primary' : 'text-neutral-80 group-hover:text-neutral-90'}`}>
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-neutral-40 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${open === i ? 'max-h-[500px] pb-5' : 'max-h-0'}`}>
                <p className="text-[15px] text-neutral-50 leading-relaxed pr-10">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

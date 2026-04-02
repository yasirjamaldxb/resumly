'use client';

import { useState } from 'react';

const faqs = [
  { q: 'How does Resumly work?', a: 'Paste any job link from LinkedIn, Indeed, or any job board. Resumly extracts the job title, company, requirements, and keywords. Then our AI creates a tailored resume that matches the role.optimized for ATS systems so your application actually gets seen by recruiters.' },
  { q: 'What makes Resumly different from other resume builders?', a: 'Most resume builders give you a blank template and leave you to figure it out. Resumly starts with the job you want and works backwards.AI rewrites your experience to match the job description, generates a cover letter, and tracks your application. It\'s a job search companion, not just a resume tool.' },
  { q: 'What does ATS-friendly mean and why does it matter?', a: 'ATS (Applicant Tracking Systems) are software that employers use to filter resumes before a human ever sees them. Over 75% of resumes are rejected by ATS. Resumly generates text-based PDFs with proper formatting, section headings, and keywords that these systems can parse correctly.so your resume gets through to actual recruiters.' },
  { q: 'Can I use Resumly for free?', a: 'Yes! Your first complete application.resume, AI optimization, and cover letter.is completely free so you can experience the quality. After that, upgrade to Starter ($4.99/mo) for 10 applications or Pro ($9.99/mo) for unlimited applications, cover letters, and interview prep.' },
  { q: 'Do I need to write my resume from scratch?', a: 'No. You can upload an existing CV (PDF or DOCX) and Resumly will extract all your information. Then when you paste a job link, AI re-optimizes your existing experience to match the new role. You can also start fresh and let AI generate content based on your profile and the job description.' },
  { q: 'Does Resumly generate cover letters too?', a: 'Yes. After your resume is created, Resumly auto-generates a matching cover letter using your resume data and the job description. It\'s personalized to the company and role.not a generic template. You can edit it or download it as-is.' },
  { q: 'Can I apply to multiple jobs?', a: 'Absolutely. That\'s the whole point. Your profile is saved, so applying to a second job takes seconds.paste the new job link, AI re-optimizes your resume, generates a new cover letter, and tracks everything on your dashboard. No re-entering information.' },
  { q: 'What file format will my resume be in?', a: 'Resumly generates text-based PDFs.not images or screenshots. This is critical because ATS systems need to read the actual text in your file. Our PDFs contain real, selectable, searchable text that both software and humans can read perfectly.' },
  { q: 'How is my data used?', a: 'Your data is only used to create and optimize your resumes. We don\'t sell your information to recruiters, job boards, or third parties. Your resumes and profile data are stored securely and you can delete your account at any time.' },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-[680px] mx-auto px-6">
        <h2 className="text-[28px] sm:text-[34px] font-medium text-neutral-90 text-center mb-10 tracking-tight leading-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-neutral-20">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between py-4 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={`text-[14px] font-medium pr-6 transition-colors ${open === i ? 'text-primary' : 'text-neutral-80 group-hover:text-neutral-90'}`}>
                  {faq.q}
                </span>
                <svg
                  className={`w-4 h-4 text-neutral-40 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${open === i ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
                <p className="text-[13px] text-neutral-50 leading-relaxed pr-10">{faq.a}</p>
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

import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbListSchema, FAQPageSchema } from '@/components/seo/schema';

export const metadata: Metadata = {
  title: 'Resumly Chrome Extension — One-Click Resume Tailoring',
  description:
    'Import any job posting from LinkedIn, Indeed, Glassdoor, or any careers page into Resumly in one click. Get a tailored, ATS-ready resume in 60 seconds.',
  alternates: { canonical: 'https://resumly.app/chrome-extension' },
  openGraph: {
    title: 'Resumly Chrome Extension — Tailor Your Resume to Any Job',
    description:
      'Click once. Resumly reads the job, rewrites your resume, drafts a matching cover letter. Works on every job board and careers page.',
    url: 'https://resumly.app/chrome-extension',
    type: 'website',
  },
};

// TODO: Replace with the real Chrome Web Store URL once the listing is approved.
const WEB_STORE_URL = 'https://chrome.google.com/webstore/detail/resumly';

const STEPS = [
  {
    n: '1',
    title: 'Find a job',
    body: 'Open any job posting on LinkedIn, Indeed, Glassdoor, Wellfound, Lever, Greenhouse, Workday, or any company careers page.',
  },
  {
    n: '2',
    title: 'Click the icon',
    body: 'The extension reads the job\u2019s JSON-LD structured data, meta tags, and visible page text. A preview card shows the parsed title, company, and location.',
  },
  {
    n: '3',
    title: 'Import to Resumly',
    body: 'One click sends the job to Resumly. Our AI tailors your resume to the requirements and drafts a matching cover letter in under 60 seconds.',
  },
];

const SITES = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'Wellfound',
  'Lever',
  'Greenhouse',
  'Workday',
  'Apple Careers',
  'Google Careers',
  'Stripe',
  'Notion',
  'Any careers page',
];

const FAQ = [
  {
    q: 'Is the extension free?',
    a: 'Yes, the extension itself is completely free. You\u2019ll need a free Resumly account to finish the import — the free plan includes 3 tailored resumes and 3 cover letters.',
  },
  {
    q: 'What data does the extension collect?',
    a: 'Nothing, until you click the icon. At that point it reads the active tab\u2019s URL, structured data, meta tags, and visible text in order to extract the job posting. It has no background pages, no host permissions, no cookies, and no analytics.',
  },
  {
    q: 'Does it work on job boards outside the US?',
    a: 'Yes. The extension reads the page directly, so it works on every job board and careers page regardless of country — LinkedIn.co.uk, Naukri, Seek, and company sites worldwide.',
  },
  {
    q: 'What if the page has no structured data?',
    a: 'The extension falls back to OpenGraph meta tags, then to the page\u2019s visible text (with nav, footer, and sidebars stripped). It sends up to 15 KB of cleaned text to Resumly\u2019s AI parser.',
  },
  {
    q: 'Which permissions does the extension request?',
    a: 'Only two: activeTab (read the current tab when you click the icon) and scripting (inject the extraction script at click time). No host permissions. No persistent background workers.',
  },
  {
    q: 'Can I use Resumly without the extension?',
    a: 'Of course. Paste any job URL into resumly.app and we\u2019ll fetch it server-side. The extension just makes it one click instead of copy-paste-paste.',
  },
];

export default function ChromeExtensionPage() {
  return (
    <>
      <BreadcrumbListSchema
        items={[
          { name: 'Home', url: 'https://resumly.app' },
          { name: 'Chrome Extension', url: 'https://resumly.app/chrome-extension' },
        ]}
      />
      <FAQPageSchema items={FAQ.map((f) => ({ question: f.q, answer: f.a }))} />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-16 pb-12 px-6 bg-gradient-to-b from-orange-50/40 to-white">
          <div className="max-w-[1120px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-20 rounded-full text-[12px] font-medium text-neutral-70 mb-5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              New \u00b7 works on every job board
            </div>
            <h1 className="text-[36px] sm:text-[48px] font-semibold text-neutral-90 tracking-tight leading-[1.1] mb-4 max-w-[720px] mx-auto">
              One click. <span className="text-primary">Tailored resume.</span>
            </h1>
            <p className="text-[16px] sm:text-[18px] text-neutral-50 max-w-[560px] mx-auto mb-8">
              Import any job posting from LinkedIn, Indeed, Glassdoor, or any careers page into Resumly.
              Get a customised resume and matching cover letter in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={WEB_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-primary text-white rounded-xl text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M21.17 8H12M3.95 6.06L8.54 14M10.88 21.94L15.46 14" />
                </svg>
                Add to Chrome \u2014 it\u2019s free
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-6 py-3.5 bg-white text-neutral-70 border border-neutral-20 rounded-xl text-[15px] font-medium hover:bg-neutral-5 transition-colors"
              >
                Try Resumly on the web first
              </Link>
            </div>
            <p className="text-[12px] text-neutral-40 mt-4">
              Free forever \u00b7 No credit card \u00b7 2\u2009MB download
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-6">
          <div className="max-w-[1120px] mx-auto">
            <h2 className="text-[28px] sm:text-[34px] font-semibold text-neutral-90 text-center tracking-tight mb-3">
              Three clicks from job posting to interview-ready resume
            </h2>
            <p className="text-[15px] text-neutral-50 text-center mb-12 max-w-[520px] mx-auto">
              The extension does the boring part \u2014 reading the job description and wiring it to your Resumly account.
            </p>

            <div className="grid sm:grid-cols-3 gap-5">
              {STEPS.map((s) => (
                <div key={s.n} className="bg-white border border-neutral-15 rounded-2xl p-6">
                  <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-[15px] font-bold mb-4">
                    {s.n}
                  </div>
                  <h3 className="text-[17px] font-semibold text-neutral-90 mb-2 tracking-tight">{s.title}</h3>
                  <p className="text-[13px] text-neutral-50 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where it works */}
        <section className="py-12 px-6 bg-neutral-5/50">
          <div className="max-w-[1120px] mx-auto text-center">
            <h2 className="text-[22px] font-semibold text-neutral-90 tracking-tight mb-6">
              Works on every job board and careers page
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {SITES.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-neutral-15 rounded-full text-[13px] font-medium text-neutral-70"
                >
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="py-16 px-6">
          <div className="max-w-[720px] mx-auto bg-white border border-neutral-15 rounded-2xl p-8">
            <h2 className="text-[22px] font-semibold text-neutral-90 tracking-tight mb-4">
              Privacy-first, by design
            </h2>
            <ul className="space-y-3">
              {[
                'The extension only reads a page when you click the icon — no background scraping, no persistent workers.',
                'Permissions are scoped to activeTab + scripting. No host permissions, no cookies, no history access.',
                'Your job data is sent to Resumly via a URL fragment (#data=\u2026), which is never transmitted to any server.',
                'No tracking, no analytics, no third-party scripts inside the extension.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[14px] text-neutral-70">
                  <svg className="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/chrome-extension/privacy"
              className="inline-flex items-center gap-1 mt-5 text-[13px] font-semibold text-primary hover:text-primary-dark"
            >
              Read the full extension privacy policy
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-6">
          <div className="max-w-[720px] mx-auto">
            <h2 className="text-[24px] font-semibold text-neutral-90 tracking-tight mb-6 text-center">
              Frequently asked
            </h2>
            <div className="divide-y divide-neutral-15 border border-neutral-15 rounded-2xl overflow-hidden bg-white">
              {FAQ.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-[15px] font-medium text-neutral-90">{f.q}</span>
                    <svg className="w-4 h-4 text-neutral-40 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[14px] text-neutral-60 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-6 bg-neutral-90 text-white">
          <div className="max-w-[720px] mx-auto text-center">
            <h2 className="text-[28px] font-semibold tracking-tight mb-3">Add Resumly to Chrome</h2>
            <p className="text-[15px] text-neutral-30 mb-6">
              Stop rewriting your resume for every job. Start landing interviews.
            </p>
            <a
              href={WEB_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-white rounded-xl text-[15px] font-semibold hover:bg-primary-dark transition-colors"
            >
              Add to Chrome
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

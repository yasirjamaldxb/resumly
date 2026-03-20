import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker: Score Your Resume Instantly (2026)',
  description:
    'Check if your resume will pass ATS filters. Our free ATS checker scores your resume in real-time and gives specific, actionable tips to improve it. Built into the resume builder — no upload needed.',
  keywords: ['ATS resume checker', 'ATS score checker', 'resume ATS check', 'ATS friendly resume checker', 'applicant tracking system checker', 'free ATS scanner'],
  alternates: { canonical: 'https://resumly.app/ats-checker' },
  openGraph: {
    title: 'Free ATS Resume Checker: Score Your Resume Instantly · Resumly',
    description: 'Check if your resume will pass ATS filters. Real-time scoring with actionable tips. Free.',
    url: 'https://resumly.app/ats-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Checker · Resumly',
    description: 'Check if your resume passes ATS filters. Real-time score with actionable tips.',
  },
};

const atsChecks = [
  { label: 'Contact information', desc: 'Name, email, phone, and location are present and properly formatted', icon: '📋' },
  { label: 'Professional summary', desc: 'A compelling summary with relevant keywords for your target role', icon: '✍️' },
  { label: 'Work experience', desc: 'Properly structured entries with job titles, companies, dates, and achievement-driven bullets', icon: '💼' },
  { label: 'Skills section', desc: 'Relevant hard and soft skills that match common job description keywords', icon: '⚡' },
  { label: 'Education', desc: 'Degrees, institutions, and graduation dates in standard format', icon: '🎓' },
  { label: 'File format', desc: 'Text-based PDF with real selectable text — not images that ATS cannot read', icon: '📄' },
  { label: 'Section headings', desc: 'Standard headings (Work Experience, Education, Skills) that ATS systems expect', icon: '📑' },
  { label: 'Overall completeness', desc: 'All essential resume sections are filled with sufficient detail', icon: '✅' },
];

const scoreRanges = [
  { range: '90-100%', color: 'bg-green-500', label: 'Excellent', desc: 'Your resume is fully optimized for ATS. You are ready to apply with confidence.' },
  { range: '70-89%', color: 'bg-yellow-500', label: 'Good', desc: 'Your resume will likely pass most ATS filters. A few improvements could maximize your chances.' },
  { range: '50-69%', color: 'bg-orange-500', label: 'Needs Work', desc: 'Your resume may be filtered out by some ATS systems. Follow the suggestions to improve.' },
  { range: 'Below 50%', color: 'bg-red-500', label: 'At Risk', desc: 'Your resume is likely to be rejected by ATS. Significant changes are needed before applying.' },
];

const commonMistakes = [
  { mistake: 'Using tables, columns, or text boxes', fix: 'Use a single-column layout with clear section breaks. ATS parsers struggle with multi-column layouts and may scramble your content.' },
  { mistake: 'Saving as image-based PDF', fix: 'Use a builder like Resumly that generates text-based PDFs. If ATS cannot select/copy text from your PDF, it cannot read your resume.' },
  { mistake: 'Fancy section headings', fix: 'Use standard headings: "Work Experience" (not "Where I\'ve Been"), "Education" (not "Academic Journey"), "Skills" (not "What I Bring").' },
  { mistake: 'Missing keywords from the job description', fix: 'Read the job posting carefully. Mirror the exact terms they use — if they say "project management," use that phrase, not "managing projects."' },
  { mistake: 'Headers and footers for contact info', fix: 'Many ATS systems cannot read content in headers/footers. Place your contact information in the main body of the resume.' },
  { mistake: 'Using abbreviations without spelling them out', fix: 'Write "Search Engine Optimization (SEO)" first, then use "SEO" after. ATS may search for either form.' },
];

export default function ATSCheckerPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 via-green-50/50 to-white py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Real-Time ATS Scoring
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                  Is your resume
                  <br />
                  <span className="text-green-600">ATS-ready?</span>
                </h1>
                <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                  75% of resumes are rejected by Applicant Tracking Systems before a human ever reads them.
                </p>
                <p className="text-lg text-gray-500 mb-8">
                  Our ATS checker scores your resume in real-time as you build it — no uploading, no waiting. See exactly what to fix and watch your score climb.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="xl" asChild>
                    <Link href="/builder/new">Check My Resume Score →</Link>
                  </Button>
                  <Button size="xl" variant="outline" asChild>
                    <Link href="#how-it-works">How It Works</Link>
                  </Button>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap gap-6 mt-8">
                  {[
                    { label: '100% Free', sub: 'No credit card' },
                    { label: 'Real-Time', sub: 'Instant scoring' },
                    { label: 'Text-Based PDF', sub: 'ATS can read it' },
                  ].map((signal) => (
                    <div key={signal.label} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">{signal.label}</span>
                        <span className="text-xs text-gray-400 ml-1">· {signal.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score visualization mockup */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative">
                  <div className="text-center mb-6">
                    <div className="text-sm font-medium text-gray-400 mb-3">Your ATS Score</div>
                    <div className="relative w-40 h-40 mx-auto">
                      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                        <circle cx="80" cy="80" r="70" fill="none" stroke="#22c55e" strokeWidth="12" strokeDasharray="440" strokeDashoffset="66" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold text-gray-900">85<span className="text-2xl text-gray-400">%</span></span>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Good — Ready to apply
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Contact Info', score: 100, color: 'bg-green-500' },
                      { label: 'Summary', score: 90, color: 'bg-green-500' },
                      { label: 'Experience', score: 85, color: 'bg-green-500' },
                      { label: 'Skills', score: 75, color: 'bg-yellow-500' },
                      { label: 'Education', score: 80, color: 'bg-green-500' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-24 text-right">{item.label}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                          <div className={`${item.color} h-2.5 rounded-full transition-all`} style={{ width: `${item.score}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-8">{item.score}%</span>
                      </div>
                    ))}
                  </div>
                  {/* Floating suggestion */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 max-w-[220px]">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500 text-lg flex-shrink-0">💡</span>
                      <p className="text-xs text-gray-600 leading-relaxed">Add 2-3 more skills matching the job description to boost your score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is ATS */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">What is an ATS and why should you care?</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Understanding how Applicant Tracking Systems work is the first step to getting past them.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                <div className="text-3xl mb-4">🚫</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Without ATS optimization</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Resume gets auto-rejected before any human sees it
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Image-based PDFs are completely unreadable by ATS
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Missing keywords mean low ranking even if qualified
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Fancy formatting gets scrambled into gibberish
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">With Resumly ATS checker</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time score updates as you type each section
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Text-based PDF output that every ATS can parse
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Specific suggestions for what to add or change
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Clean, standard formatting ATS systems expect
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>An Applicant Tracking System (ATS)</strong> is software used by virtually all mid-to-large companies to filter resumes before a recruiter reviews them.
                It scans for specific keywords, checks formatting compatibility, and ranks candidates.
                If your resume does not pass the ATS filter, no human will ever see it — regardless of your qualifications.
                Our built-in ATS checker analyzes your resume against the same criteria these systems use, so you know you are ready before you hit &quot;Apply.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* What We Check */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">What our ATS checker analyzes</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Every section of your resume is scored against the criteria that real ATS systems use.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {atsChecks.map((check) => (
                <div key={check.label} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md hover:border-green-200 transition-all">
                  <span className="text-2xl mb-3 block">{check.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-1.5">{check.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{check.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How the ATS checker works</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                No uploading. No waiting. Your ATS score updates in real-time as you build your resume.
              </p>
            </div>

            <div className="space-y-0">
              {[
                {
                  step: '1',
                  title: 'Start building your resume',
                  desc: 'Open the resume builder and begin filling in your details. Choose any of our 10 ATS-friendly templates — they are all designed to pass ATS screening.',
                },
                {
                  step: '2',
                  title: 'Watch your ATS score update live',
                  desc: 'As you add your summary, work experience, skills, and education, the ATS score in the top corner updates instantly. It checks completeness, keyword density, and formatting.',
                },
                {
                  step: '3',
                  title: 'Follow the improvement suggestions',
                  desc: 'The checker tells you exactly what is missing or could be improved. Add a professional summary, include more relevant skills, or complete a section to see your score rise.',
                },
                {
                  step: '4',
                  title: 'Hit 80%+ and download with confidence',
                  desc: 'Once your score is 80% or higher, download your resume as a text-based PDF. Your content is real, selectable text — guaranteed readable by any ATS system.',
                },
              ].map((item, i) => (
                <div key={item.step} className="flex gap-6 py-8 border-b border-gray-100 last:border-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {item.step}
                    </div>
                    {i < 3 && <div className="w-px h-full bg-green-200 mt-2" />}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button size="xl" asChild>
                <Link href="/builder/new">Start Building & Check Score →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Score ranges */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Understanding your ATS score</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Here is what each score range means and what to do about it.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {scoreRanges.map((range) => (
                <div key={range.range} className="bg-white rounded-xl p-6 border border-gray-200 flex gap-4">
                  <div className={`w-3 h-full ${range.color} rounded-full flex-shrink-0`} />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">{range.range}</span>
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{range.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{range.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">6 ATS mistakes that get resumes rejected</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Avoid these common formatting and content errors that cause ATS systems to reject otherwise strong resumes.
              </p>
            </div>

            <div className="space-y-5">
              {commonMistakes.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 font-bold text-sm flex-shrink-0">{i + 1}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.mistake}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed"><strong className="text-green-600">Fix:</strong> {item.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why text-based PDF matters */}
        <section className="py-20 bg-green-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
              Why text-based PDFs are critical for ATS
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Many resume builders use screenshot-to-PDF conversion, creating image files that look great but are completely unreadable by ATS. The text in your resume is literally a picture — no machine can extract words from it.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-left">
                <div className="text-red-300 font-bold text-sm mb-3">❌ IMAGE-BASED PDF</div>
                <ul className="text-green-100 text-sm space-y-2">
                  <li>• ATS sees a blank page</li>
                  <li>• Cannot extract any text</li>
                  <li>• Cannot match keywords</li>
                  <li>• Auto-rejected every time</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-left">
                <div className="text-green-300 font-bold text-sm mb-3">✅ TEXT-BASED PDF (RESUMLY)</div>
                <ul className="text-green-100 text-sm space-y-2">
                  <li>• ATS reads every word</li>
                  <li>• Full text extraction</li>
                  <li>• Keywords matched accurately</li>
                  <li>• Properly ranked and scored</li>
                </ul>
              </div>
            </div>
            <Button size="xl" className="bg-white text-green-600 hover:bg-green-50 font-semibold" asChild>
              <Link href="/builder/new">Build ATS-Ready Resume Free →</Link>
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqData.map((faq) => (
                <div key={faq.q} className="border-b border-gray-100 pb-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stop guessing. Start scoring.
            </h2>
            <p className="text-gray-600 mb-6">
              Build your resume with Resumly and see your ATS score update in real-time. Free forever — no credit card required.
            </p>
            <Button size="xl" asChild>
              <Link href="/builder/new">Create My Resume & Check Score →</Link>
            </Button>
          </div>
        </section>

        {/* FAQ structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqData.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />

        {/* WebApplication structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Resumly ATS Resume Checker',
              url: 'https://resumly.app/ats-checker',
              description: 'Free real-time ATS resume checker that scores your resume and gives actionable improvement tips.',
              applicationCategory: 'BusinessApplication',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              operatingSystem: 'All',
              browserRequirements: 'Requires a modern web browser',
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}

const faqData = [
  {
    q: 'What is an ATS resume checker?',
    a: 'An ATS resume checker analyzes your resume against the same criteria that Applicant Tracking Systems use to filter candidates. It checks formatting, keywords, section structure, and completeness to predict whether your resume will pass automated screening.',
  },
  {
    q: 'Is the Resumly ATS checker free?',
    a: 'Yes, completely free. The ATS score is built into our resume builder and updates in real-time as you create your resume. There are no hidden fees, no premium tier required, and no upload limits.',
  },
  {
    q: 'How does the real-time ATS scoring work?',
    a: 'As you fill in each section of your resume (contact info, summary, experience, skills, education), our checker evaluates completeness, keyword density, formatting compliance, and overall structure. Your score updates instantly with each change.',
  },
  {
    q: 'What ATS score should I aim for?',
    a: 'We recommend aiming for 80% or higher before submitting your resume. A score of 90%+ means your resume is fully optimized. Scores below 70% indicate significant issues that could cause your resume to be filtered out.',
  },
  {
    q: 'Why do text-based PDFs matter for ATS?',
    a: 'ATS systems need to extract text from your resume file to analyze it. Image-based PDFs (created by screenshot-to-PDF tools) contain no extractable text — the ATS sees a blank page. Resumly generates text-based PDFs where every word is real, selectable text that ATS systems can read.',
  },
  {
    q: 'Can I check an existing resume I already have?',
    a: 'Our ATS checker is integrated into the resume builder rather than being a file upload tool. This means you get real-time feedback as you build, which is more actionable than a one-time scan. Simply start a new resume in our builder and enter your existing content to see your score.',
  },
  {
    q: 'Which ATS systems does this work with?',
    a: 'Our checker evaluates your resume against general ATS parsing standards used by all major systems including Workday, Greenhouse, Lever, iCIMS, Taleo, and BambooHR. The formatting and structure checks are universal across all ATS platforms.',
  },
  {
    q: 'Do I need to optimize my resume for every job application?',
    a: 'Yes, tailoring your resume for each job description significantly improves your ATS score and callback rate. Focus on matching the specific keywords and skills mentioned in the job posting. Our AI suggestions can help you identify the right keywords quickly.',
  },
];

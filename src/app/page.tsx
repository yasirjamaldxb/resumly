import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/landing/hero';
import { StatsBar } from '@/components/landing/stats-bar';
import { FeaturesSection } from '@/components/landing/features';
import { TemplatesShowcase } from '@/components/landing/templates-showcase';
import { HowItWorks } from '@/components/landing/how-it-works';
import { TestimonialsSection } from '@/components/landing/testimonials';
import { FAQSection } from '@/components/landing/faq';
import { CTASection } from '@/components/landing/cta';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Resumly, Your AI Job Search Companion | Tailored Resumes That Get Interviews',
  description:
    'Paste any job link and get a tailored, ATS-optimized resume in minutes. AI matches your experience to the job description so your application gets seen by recruiters. Resume + cover letter + tracking, all in one platform.',
  keywords: [
    'AI resume builder', 'job search tool', 'ATS resume', 'resume tailored to job',
    'CV builder', 'resume maker', 'ATS friendly resume', 'job application tracker',
    'AI cover letter', 'resume for job description', 'applicant tracking system',
    'resume optimization', 'job search companion', 'tailored resume builder',
  ].join(', '),
  alternates: { canonical: 'https://resumly.app' },
  openGraph: {
    title: 'Resumly, Your AI Job Search Companion',
    description: 'Paste any job link. Get a tailored, ATS-optimized resume that gets you interviews. Resume + cover letter + tracking in one platform.',
    url: 'https://resumly.app',
    siteName: 'Resumly',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resumly | AI Job Search Companion',
    description: 'Paste any job link. Get a tailored resume that gets you interviews. AI-powered, ATS-optimized.',
  },
};

const exampleCategories = [
  { title: 'Software Engineer', slug: 'software-engineer' },
  { title: 'Product Manager', slug: 'product-manager' },
  { title: 'Marketing', slug: 'marketing-manager' },
  { title: 'Data Analyst', slug: 'data-analyst' },
  { title: 'Designer', slug: 'graphic-designer' },
  { title: 'Finance', slug: 'accountant' },
  { title: 'Healthcare', slug: 'doctor' },
  { title: 'Teacher', slug: 'teacher' },
  { title: 'Sales', slug: 'retail' },
  { title: 'HR', slug: 'human-resources' },
];

const blogPosts = [
  { title: 'How to tailor your resume for every job application (2026)', slug: 'how-to-write-a-resume', tag: 'JOB SEARCH', tagColor: 'bg-orange-100 text-orange-700', cardBg: 'bg-orange-50' },
  { title: 'Why 75% of resumes never reach a human, and how to fix yours', slug: 'how-to-write-a-cover-letter', tag: 'ATS GUIDE', tagColor: 'bg-pink-100 text-pink-700', cardBg: 'bg-pink-50' },
];

function ResumeExamplesPreview() {
  return (
    <section className="bg-[#1a1c6a] py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Category pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <span className="px-3 py-1 bg-primary rounded-full text-white text-[12px] font-semibold whitespace-nowrap">All</span>
          {exampleCategories.map(cat => (
            <Link
              key={cat.slug}
              href={`/resume-examples/${cat.slug}`}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/80 text-[12px] font-medium whitespace-nowrap transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-medium text-white leading-tight tracking-tight mb-3">
              See real resumes
              <br />
              that landed
              <br />
              interviews
            </h2>
            <p className="text-[14px] text-white/60 mb-6 max-w-[380px]">
              Browse profession-specific examples. See what hiring managers actually want to read, and use them as a starting point for your own.
            </p>
            <Link href="/resume-examples" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded font-semibold text-[13px] transition-colors">
              Browse resume examples
            </Link>
          </div>

          {/* Resume thumbnails */}
          <div className="flex gap-4 justify-center">
            {[
              { id: 'professional', name: 'Professional', role: 'Product Manager' },
              { id: 'modern', name: 'Modern', role: 'Software Engineer' },
              { id: 'ats-pro', name: 'ATS Pro', role: 'Data Analyst' },
            ].map((example, i) => (
              <Link key={example.id} href={`/resume-examples`} className={`group block ${i === 2 ? 'hidden sm:block' : ''}`}>
                <div className="w-[160px] aspect-[1/1.414] bg-white rounded-lg shadow-xl overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-2xl">
                  <Image
                    src={`/templates/${example.id}.png`}
                    alt={`${example.name} resume example`}
                    width={794}
                    height={1123}
                    className="w-full h-full object-cover object-top"
                    quality={80}
                  />
                </div>
                <div className="mt-2.5 text-center">
                  <p className="text-[12px] font-semibold text-white">{example.role}</p>
                  <p className="text-[11px] text-white/50">{example.name} template</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertAdvice() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] sm:text-[34px] font-medium text-neutral-90 tracking-tight leading-tight">
            Job search tips from experts
          </h2>
          <Link href="/blog" className="text-primary hover:text-primary-dark text-[13px] font-semibold inline-flex items-center gap-1 transition-colors">
            Read the blog
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={`group ${post.cardBg} rounded-2xl p-6 hover:shadow-lg transition-all min-h-[160px] flex flex-col justify-end`}>
              <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded ${post.tagColor} mb-2 w-fit`}>{post.tag}</span>
              <h3 className="text-[18px] font-semibold text-neutral-90 leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <TemplatesShowcase />
        <HowItWorks />
        <ResumeExamplesPreview />
        <TestimonialsSection />
        <ExpertAdvice />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Resumly | AI Job Search Companion',
            url: 'https://resumly.app',
            description: 'AI-powered job search companion that creates tailored, ATS-optimized resumes from any job link.',
            applicationCategory: 'BusinessApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'First application free' },
          }),
        }}
      />
    </>
  );
}

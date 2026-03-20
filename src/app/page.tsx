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
  title: 'Free Resume Builder: Create Your Resume Online in Minutes · Resumly',
  description:
    'Build a professional resume that gets interviews. 10 ATS-friendly templates, AI writing help, and instant text-based PDF download. 100% free — no credit card, no watermarks. Start building now.',
  keywords: [
    'free resume builder', 'resume builder', 'ATS resume', 'resume templates',
    'CV builder', 'resume maker', 'professional resume', 'ATS friendly resume',
    'online resume builder', 'resume builder free', 'best resume builder 2026',
    'resume builder no sign up', 'ATS optimized resume', 'text based resume PDF',
  ].join(', '),
  alternates: { canonical: 'https://resumly.app' },
  openGraph: {
    title: 'Free Resume Builder: Create Your Resume Online in Minutes · Resumly',
    description: 'Build a professional resume that gets interviews. 10 ATS-friendly templates, AI writing help, instant PDF. 100% free.',
    url: 'https://resumly.app',
    siteName: 'Resumly',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder · Resumly',
    description: 'Build a professional resume that gets interviews. 10 ATS-friendly templates, AI writing help, instant PDF. 100% free.',
  },
};

const exampleCategories = [
  { title: 'Doctor', slug: 'doctor' },
  { title: 'Architect', slug: 'architect' },
  { title: 'Civil Engineer', slug: 'civil-engineer' },
  { title: 'Driver', slug: 'driver' },
  { title: 'Teacher', slug: 'teacher' },
  { title: 'Accountant', slug: 'accountant' },
  { title: 'Retail', slug: 'retail' },
  { title: 'Human Resources', slug: 'human-resources' },
  { title: 'Administrative', slug: 'administrative-assistant' },
  { title: 'Student', slug: 'student' },
];

const blogPosts = [
  { title: 'How to write a resume: Expert guide & examples (2026)', slug: 'how-to-write-a-resume', tag: 'FIELD TESTED', tagColor: 'bg-orange-100 text-orange-700', cardBg: 'bg-orange-50' },
  { title: 'How to Write a Cover Letter in 2026', slug: 'how-to-write-a-cover-letter', tag: 'HR APPROVED', tagColor: 'bg-pink-100 text-pink-700', cardBg: 'bg-pink-50' },
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
              Get the interview
              <br />
              with professional
              <br />
              resume examples
            </h2>
            <p className="text-[14px] text-white/60 mb-6 max-w-[380px]">
              Explore our library of profession-specific examples. Find inspiration and see what works for your field.
            </p>
            <Link href="/resume-examples" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded font-semibold text-[13px] transition-colors">
              See all resume examples
            </Link>
          </div>

          {/* Resume thumbnails - like resume.io */}
          <div className="flex gap-4 justify-center">
            {[
              { id: 'professional', name: 'Professional', role: 'Marketing Manager' },
              { id: 'modern', name: 'Modern', role: 'Software Engineer' },
              { id: 'ats-pro', name: 'ATS Pro', role: 'Project Manager' },
            ].map((example, i) => (
              <Link key={example.id} href={`/resume-examples`} className={`group block ${i === 2 ? 'hidden sm:block' : ''}`}>
                <div className="w-[160px] bg-white rounded-lg shadow-xl overflow-hidden transition-transform group-hover:scale-105 group-hover:shadow-2xl">
                  <Image
                    src={`/templates/${example.id}.png`}
                    alt={`${example.name} resume example`}
                    width={794}
                    height={1123}
                    className="w-full h-auto"
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
            Need some expert advice?
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
            name: 'Resumly – Free Resume Builder',
            url: 'https://resumly.app',
            description: 'Free ATS-friendly resume builder with AI assistance and professional templates.',
            applicationCategory: 'BusinessApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </>
  );
}

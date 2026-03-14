import { Metadata } from 'next';
import Link from 'next/link';
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
  title: 'Free Resume Builder – Create ATS-Friendly Resumes | Resumly',
  description:
    'Build a professional, ATS-friendly resume in minutes with Resumly. Choose from 6+ expert-designed templates, get AI writing assistance, and download as PDF. Free resume builder trusted by 100,000+ job seekers.',
  keywords: [
    'free resume builder', 'resume builder', 'ATS resume', 'resume templates',
    'CV builder', 'resume maker', 'professional resume', 'ATS friendly resume',
    'online resume builder', 'resume builder free',
  ].join(', '),
  alternates: { canonical: 'https://resumly.app' },
  openGraph: {
    title: 'Free Resume Builder – Create ATS-Friendly Resumes | Resumly',
    description: 'Build a professional ATS-friendly resume in minutes. AI-powered, free, and trusted by 100,000+ job seekers.',
    url: 'https://resumly.app',
    siteName: 'Resumly',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder | Resumly',
    description: 'Build ATS-friendly resumes in minutes with AI assistance.',
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
  { title: 'How to write a resume: Expert guide & examples (2025)', slug: 'how-to-write-a-resume', tag: 'FIELD TESTED', tagColor: 'bg-orange-100 text-orange-700', cardBg: 'bg-orange-50' },
  { title: 'How to write a cover letter: expert guide & examples (2025)', slug: 'cover-letter-guide', tag: 'HR APPROVED', tagColor: 'bg-pink-100 text-pink-700', cardBg: 'bg-pink-50' },
];

function ResumeExamplesPreview() {
  return (
    <section className="bg-[#1a1c6a] py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Category pills */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          <span className="px-4 py-1.5 bg-primary rounded-full text-white text-[13px] font-semibold whitespace-nowrap">All</span>
          {exampleCategories.map(cat => (
            <Link
              key={cat.slug}
              href={`/resume-examples/${cat.slug}`}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/80 text-[13px] font-medium whitespace-nowrap transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[36px] sm:text-[44px] font-medium text-white leading-tight tracking-tight mb-4">
              Get the interview
              <br />
              with professional
              <br />
              resume examples
            </h2>
            <p className="text-[16px] text-white/60 mb-8 max-w-[400px]">
              Explore our library of profession-specific examples. Find inspiration and see what works for your field.
            </p>
            <Link href="/resume-examples" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold text-[15px] transition-colors">
              See all resume examples
            </Link>
          </div>

          {/* Example cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Marion Diaz', role: 'Legal Administrative Assistant' },
              { name: 'Dr. Emmit Jackson', role: 'Family Medicine Physician' },
            ].map(person => (
              <div key={person.name} className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-20 to-neutral-30 flex items-center justify-center">
                    <span className="text-neutral-60 text-[12px] font-bold">{person.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-neutral-90">{person.name}</div>
                    <div className="text-[11px] text-neutral-40">{person.role}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-neutral-10 rounded w-full" />
                  <div className="h-2 bg-neutral-10 rounded w-5/6" />
                  <div className="h-2 bg-neutral-10 rounded w-4/5" />
                  <div className="h-2 bg-neutral-10 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpertAdvice() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[36px] sm:text-[44px] font-medium text-neutral-90 tracking-tight leading-tight">
            Need some expert advice?
          </h2>
          <Link href="/blog" className="text-primary hover:text-primary-dark text-[15px] font-semibold inline-flex items-center gap-1 transition-colors">
            Read the blog
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={`group ${post.cardBg} rounded-2xl p-8 hover:shadow-lg transition-all min-h-[200px] flex flex-col justify-end`}>
              <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded ${post.tagColor} mb-3 w-fit`}>{post.tag}</span>
              <h3 className="text-[22px] font-semibold text-neutral-90 leading-tight group-hover:text-primary transition-colors">
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
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '12400' },
          }),
        }}
      />
    </>
  );
}

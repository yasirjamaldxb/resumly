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
    'free resume builder',
    'resume builder',
    'ATS resume',
    'resume templates',
    'CV builder',
    'resume maker',
    'professional resume',
    'ATS friendly resume',
    'online resume builder',
    'resume builder free',
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
  { title: 'Software Engineer', slug: 'software-engineer', icon: '💻' },
  { title: 'Nurse', slug: 'nurse', icon: '🏥' },
  { title: 'Data Scientist', slug: 'data-scientist', icon: '📊' },
  { title: 'Marketing Manager', slug: 'marketing-manager', icon: '📈' },
  { title: 'Teacher', slug: 'teacher', icon: '📚' },
  { title: 'Graphic Designer', slug: 'graphic-designer', icon: '🎨' },
];

const blogPosts = [
  {
    title: 'How to write a resume: Expert guide & examples (2025)',
    slug: 'how-to-write-a-resume',
    category: 'Guide',
  },
  {
    title: 'How to write a cover letter: expert guide & examples (2025)',
    slug: 'cover-letter-guide',
    category: 'Guide',
  },
];

function ResumeExamplesPreview() {
  return (
    <section className="py-20 bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Get the interview with professional
            <br />
            resume examples
          </h2>
          <Link href="/resume-examples" className="text-blue-200 hover:text-white text-sm font-medium whitespace-nowrap">
            See all examples →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {exampleCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/resume-examples/${cat.slug}`}
              className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-center transition-colors group"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-white text-sm font-medium">{cat.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertAdvice() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Need some expert advice?
          </h2>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap">
            Read the blog →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
            >
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{post.category}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-2 bg-gray-200 rounded w-20" />
                  <div className="h-2 bg-gray-100 rounded w-14 mt-1" />
                </div>
              </div>
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

import { Metadata } from 'next';
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
        <TestimonialsSection />
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

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS } from '../page';

const BLOG_CONTENT: Record<string, { intro: string; sections: { heading: string; content: string }[] }> = {
  'how-to-write-a-resume': {
    intro: 'Writing a resume in 2025 is both art and science. Hiring managers spend just 6-7 seconds on an initial scan, while ATS systems reject 75% of resumes before human eyes ever see them. This guide covers everything you need to create a resume that passes both tests.',
    sections: [
      {
        heading: 'Choose the right resume format',
        content: 'The three main resume formats are chronological (most common — lists work history newest to oldest), functional (skills-based, better for career changers), and combination (hybrid of both). For most people, the chronological or combination format works best. Hiring managers and ATS systems are most familiar with chronological resumes.',
      },
      {
        heading: 'Essential resume sections',
        content: 'Every resume needs these core sections: Contact Information (name, phone, email, LinkedIn, location), Professional Summary (3-5 sentences), Work Experience (most recent first), Education, and Skills. Optional sections include Certifications, Projects, Publications, and Languages.',
      },
      {
        heading: 'How to write your professional summary',
        content: 'Your professional summary is prime real estate — the first thing recruiters read. It should be 3-5 sentences that: state your job title and years of experience, highlight your top 2-3 relevant skills or achievements, and include keywords from your target job description. Avoid phrases like "hard-working" or "team player" — these are meaningless without evidence.',
      },
      {
        heading: 'Writing effective work experience bullet points',
        content: 'Each bullet point should follow the formula: Action Verb + Task + Quantified Result. For example: "Increased website conversion rate by 23% through A/B testing of landing pages." Start every bullet with a strong action verb: Led, Built, Designed, Achieved, Generated, Reduced, Improved. Always quantify results with numbers, percentages, or dollar amounts.',
      },
      {
        heading: 'Optimizing for ATS (Applicant Tracking Systems)',
        content: 'Over 99% of Fortune 500 companies use ATS to filter resumes. To pass ATS screening: use standard section headings, avoid tables and graphics, use the exact keywords from the job description, submit as a text-based PDF, and use standard fonts like Arial, Calibri, or Times New Roman at 10-12pt.',
      },
      {
        heading: 'How long should your resume be?',
        content: 'The right resume length depends on your experience: 0-10 years: 1 page maximum. 10+ years: 2 pages maximum. Academic/research roles: CV format, no page limit. Focus on relevance — cut anything older than 15 years or unrelated to your target role.',
      },
    ],
  },
  'ats-resume-guide': {
    intro: 'Applicant Tracking Systems (ATS) are used by 99% of Fortune 500 companies to automatically filter resumes. If your resume isn\'t formatted correctly, it will be rejected before a human ever reads it — no matter how qualified you are.',
    sections: [
      {
        heading: 'What is an ATS and how does it work?',
        content: 'An ATS scans your resume for specific keywords, education requirements, years of experience, and formatting. It parses your resume into a structured database, then ranks candidates based on how well their resumes match the job description. Low-ranking resumes never reach human reviewers.',
      },
      {
        heading: 'ATS formatting rules',
        content: 'To ensure ATS can parse your resume: use standard fonts (Arial, Calibri, Times New Roman), avoid tables, text boxes, columns, headers/footers, and graphics, use standard section headings ("Work Experience" not "Where I\'ve Been"), submit as PDF with embedded text (never a scanned image), and keep file size under 2MB.',
      },
      {
        heading: 'ATS keywords — the most important factor',
        content: 'The #1 way to pass ATS is keyword matching. Read the job description carefully and use the exact same terms they use. If they say "project management" use that phrase, not "managing projects." If they list "Salesforce" as a requirement, make sure that exact word appears in your skills section.',
      },
      {
        heading: 'Common ATS mistakes to avoid',
        content: 'Top ATS-killing mistakes: using a non-standard file format (Word doc is safer than you think, but only with simple formatting), using headers/footers for contact info (ATS often can\'t read them), using abbreviations without spelling them out first (write "Search Engine Optimization (SEO)"), and submitting a designed/graphic resume without also providing a plain-text version.',
      },
      {
        heading: 'How to check your ATS score',
        content: 'Resumly provides a real-time ATS score as you build your resume. Our score checks contact information completeness, keyword density, section structure, formatting compatibility, and skills match. Aim for 85%+ before downloading and submitting your resume.',
      },
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://resumly.app/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = BLOG_CONTENT[slug];

  return (
    <>
      <Header />
      <main>
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{post.category}</span>
          </nav>

          <header className="mb-10">
            <span className="inline-block text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime}</span>
              <span>·</span>
              <span>By Resumly Careers Team</span>
            </div>
          </header>

          {/* CTA box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Ready to put this into practice?</p>
              <p className="text-sm text-gray-600 mt-1">Build your ATS-optimized resume in minutes with Resumly — free.</p>
            </div>
            <Button asChild className="flex-shrink-0">
              <Link href="/builder/new">Build My Resume →</Link>
            </Button>
          </div>

          {/* Article content */}
          {content ? (
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">{content.intro}</p>
              {content.sections.map((section, i) => (
                <div key={i} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed space-y-6">
              <p className="text-xl font-medium">This comprehensive guide covers everything you need to know about {post.title.toLowerCase()}.</p>
              <p>Our team of career experts and former recruiters has put together this guide to help you navigate your job search with confidence. Check back soon for the full article.</p>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 bg-blue-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Apply what you learned</h2>
            <p className="text-blue-100 mb-6">Build an ATS-optimized resume using our free builder — everything from this guide is built right in.</p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold" size="lg" asChild>
              <Link href="/builder/new">Build My Resume Free →</Link>
            </Button>
          </div>

          {/* Related posts */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6">More Resume Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 4).map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors"
                >
                  <p className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors">{related.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{related.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Article structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.date,
              author: { '@type': 'Organization', name: 'Resumly Careers Team', url: 'https://resumly.app' },
              publisher: { '@type': 'Organization', name: 'Resumly', url: 'https://resumly.app' },
              mainEntityOfPage: { '@type': 'WebPage', '@id': `https://resumly.app/blog/${slug}` },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}

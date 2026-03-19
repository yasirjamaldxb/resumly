import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Resume & Career Blog: Expert Tips, Examples & Guides (2026)',
  description:
    'Expert resume writing tips, ATS optimization guides, and career advice from hiring professionals. Learn how to write a resume that gets interviews in 2026.',
  alternates: { canonical: 'https://resumly.app/blog' },
  openGraph: {
    title: 'Resume & Career Blog: Expert Tips & Guides · Resumly',
    description: 'Expert resume writing tips, ATS optimization guides, and career advice from hiring professionals.',
  },
};

export const BLOG_POSTS = [
  {
    slug: 'how-to-write-a-resume',
    title: 'How to Write a Resume in 2026: The Complete Guide',
    description: 'A step-by-step guide to writing a resume that gets interviews. Covers format, sections, keywords, and ATS optimization.',
    category: 'Resume Writing',
    readTime: '12 min read',
    date: '2025-01-15',
    popular: true,
  },
  {
    slug: 'ats-resume-guide',
    title: 'ATS Resume Guide: How to Beat Applicant Tracking Systems',
    description: 'Everything you need to know about ATS systems and how to format your resume to pass automated screening every time.',
    category: 'ATS',
    readTime: '10 min read',
    date: '2025-01-10',
    popular: true,
  },
  {
    slug: 'resume-summary-examples',
    title: '50 Resume Summary Examples That Get Interviews (2026)',
    description: 'Real, copy-ready professional summary examples for every industry and career level. Plus the formula to write your own.',
    category: 'Resume Writing',
    readTime: '8 min read',
    date: '2025-01-08',
  },
  {
    slug: 'resume-skills',
    title: 'Best Skills to Put on a Resume in 2026 (With Examples)',
    description: 'The top hard and soft skills employers are looking for in 2026, organized by industry and role.',
    category: 'Resume Writing',
    readTime: '7 min read',
    date: '2025-01-05',
  },
  {
    slug: 'how-to-write-a-cover-letter',
    title: 'How to Write a Cover Letter in 2026 (With Examples)',
    description: 'A complete guide to writing a compelling cover letter that gets read. Includes templates and real examples.',
    category: 'Cover Letter',
    readTime: '9 min read',
    date: '2025-01-03',
  },
  {
    slug: 'resume-action-words',
    title: '200+ Resume Action Words and Power Verbs for 2026',
    description: 'The ultimate list of strong action verbs to make your resume bullet points more impactful and ATS-friendly.',
    category: 'Resume Writing',
    readTime: '5 min read',
    date: '2024-12-28',
  },
  {
    slug: 'cv-vs-resume',
    title: 'CV vs Resume: What\'s the Difference? (And Which Do You Need?)',
    description: 'Understand when to use a CV vs resume, the key differences between them, and which one to submit for each type of job.',
    category: 'Career Advice',
    readTime: '6 min read',
    date: '2024-12-20',
  },
  {
    slug: 'resume-with-no-experience',
    title: 'How to Write a Resume With No Experience (2026 Guide)',
    description: 'A practical guide to building a strong resume when you have little or no work experience. For students and career changers.',
    category: 'Entry Level',
    readTime: '8 min read',
    date: '2024-12-15',
  },
  {
    slug: 'resume-tips',
    title: 'Top 25 Resume Tips for 2026 from HR Professionals',
    description: 'Actionable resume tips from real hiring managers and HR professionals to help you get more callbacks.',
    category: 'Resume Writing',
    readTime: '10 min read',
    date: '2024-12-10',
  },
];

const categories = [...new Set(BLOG_POSTS.map((p) => p.category))];

export default function BlogPage() {
  const featuredPosts = BLOG_POSTS.filter((p) => p.popular);
  const regularPosts = BLOG_POSTS.filter((p) => !p.popular);

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Resume Tips & Career Advice</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert guides on resume writing, cover letters, ATS optimization, and landing your next job.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Featured posts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Popular Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <span className="inline-block text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{post.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* All posts */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">{post.description}</p>
                    <p className="text-xs text-gray-400">{post.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { TEMPLATE_LIST } from '@/types/resume';
import { TemplatePreview } from '@/components/resume/template-preview';

export const metadata: Metadata = {
  title: 'Free Resume Templates 2026 [Download & Edit Instantly]',
  description:
    'Download free, ATS-friendly resume templates for 2026. 10 professionally designed templates — modern, classic, minimal, creative. Edit online and download as text-based PDF.',
  alternates: { canonical: 'https://resumly.app/resume-templates' },
  openGraph: {
    title: 'Free Resume Templates 2026 [Download & Edit] · Resumly',
    description: '10 free, ATS-optimized resume templates. Edit online, download as text-based PDF instantly.',
  },
};

const categoryDescriptions: Record<string, string> = {
  ats: 'Maximum ATS compatibility. These templates use clean, parsable formatting to ensure your resume reaches human eyes.',
  modern: 'Contemporary designs that balance visual appeal with ATS compatibility. Great for tech and creative professional roles.',
  classic: 'Traditional layouts trusted by Fortune 500 recruiters. Safe choice for conservative industries like finance and law.',
  minimal: 'Clean, whitespace-rich designs that let your achievements speak. Popular with senior professionals.',
  creative: 'Stand-out designs for creative industries like design, marketing, and advertising.',
};

export default function ResumeTemplatesPage() {
  const categories = ['ats', 'modern', 'classic', 'minimal', 'creative'] as const;

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Free Resume Templates for 2026
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {TEMPLATE_LIST.length} professionally designed templates. All ATS-tested. All free.
              Choose the one that fits your industry and style.
            </p>
            <Button size="lg" asChild>
              <Link href="/builder/new">Use a Template →</Link>
            </Button>
          </div>
        </section>

        {/* Templates by category */}
        {categories.map((category) => {
          const templates = TEMPLATE_LIST.filter((t) => t.category === category);
          if (templates.length === 0) return null;

          return (
            <section key={category} id={category} className="py-16 border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize mb-2">
                    {category === 'ats' ? 'ATS-Optimized' : category} Resume Templates
                  </h2>
                  <p className="text-gray-600 max-w-2xl">{categoryDescriptions[category]}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {templates.map((template) => (
                    <div key={template.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                      {/* Template preview */}
                      <div className="h-72 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                        <div className="w-44 h-60 bg-white shadow-lg rounded border border-gray-200 overflow-hidden">
                          <TemplatePreview
                            templateId={template.id}
                            color={template.id === 'ats-pro' ? '#1a91f0' : template.id === 'modern' ? '#7c3aed' : template.id === 'professional' ? '#1e3a5f' : template.id === 'minimal' ? '#0d9488' : template.id === 'executive' ? '#16a34a' : template.id === 'creative' ? '#ea580c' : template.id === 'compact' ? '#2563eb' : template.id === 'elegant' ? '#8b5cf6' : template.id === 'technical' ? '#2d3748' : '#374151'}
                            className="w-full h-full"
                          />
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                          </div>
                          {template.popular && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                              Popular
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm text-gray-600 font-medium">ATS Score: {template.atsScore}%</span>
                        </div>

                        <Button className="w-full" asChild>
                          <Link href={`/builder/new?template=${template.id}`}>
                            Use This Template
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* SEO content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to choose the right resume template</h2>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>
                Choosing the right resume template is one of the most important decisions in your job search.
                The wrong template could mean your resume gets rejected by an ATS before a human ever reads it.
              </p>
              <h3 className="text-lg font-bold text-gray-900">For most job seekers: ATS Pro or Professional</h3>
              <p>
                If you&apos;re applying to corporate roles, tech companies, healthcare, or finance, our ATS Pro and Professional templates are your safest bet. They use clean formatting, standard fonts, and proper section headings designed to pass ATS screening.
              </p>
              <h3 className="text-lg font-bold text-gray-900">For creative roles: Modern or Creative</h3>
              <p>
                Designers, marketers, and creative professionals can benefit from our Modern template, which adds visual appeal while maintaining ATS compatibility. The Creative template is best reserved for portfolio submissions where design matters most.
              </p>
            </div>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Are these resume templates free to download?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, all 10 resume templates are completely free to use. You can edit them online and download as a text-based PDF with no watermarks, no fees, and no credit card required.' },
                },
                {
                  '@type': 'Question',
                  name: 'Which resume template should I use?',
                  acceptedAnswer: { '@type': 'Answer', text: 'For most job seekers, the ATS Pro or Professional templates are the safest choice. They use clean formatting that works with all major Applicant Tracking Systems. For creative roles, try the Modern or Creative templates. The Minimal template works well for tech and startup jobs.' },
                },
                {
                  '@type': 'Question',
                  name: 'Will these templates pass ATS screening?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, all templates are designed with ATS compatibility in mind. They use standard section headings, clean fonts, and proper formatting. Our PDFs contain real text (not images), so ATS systems can parse every word of your resume.' },
                },
                {
                  '@type': 'Question',
                  name: 'Can I customize the colors and fonts?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can customize the color scheme of any template using our 8 preset colors or a custom color picker. The fonts are optimized for readability and ATS compatibility.' },
                },
                {
                  '@type': 'Question',
                  name: 'What file format do the templates download in?',
                  acceptedAnswer: { '@type': 'Answer', text: 'All templates download as text-based PDF files. This means the text in your resume is real and selectable, not an image screenshot. This is critical for ATS compatibility and is the format preferred by most employers.' },
                },
              ],
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}

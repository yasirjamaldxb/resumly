import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Free Resume Examples by Industry & Job Title (2026)',
  description:
    'Browse free resume examples with writing guides for every industry. See real samples, learn what works, and build your own ATS-friendly resume in minutes.',
  alternates: { canonical: 'https://resumly.app/resume-examples' },
  openGraph: {
    title: 'Free Resume Examples by Industry & Job Title (2026) · Resumly',
    description: 'Browse resume examples with writing guides. See what works for your field and build yours free.',
  },
};

const EXAMPLES = [
  // Tech
  { slug: 'software-engineer', title: 'Software Engineer', icon: '💻', category: 'Technology', searches: '145k/mo' },
  { slug: 'data-scientist', title: 'Data Scientist', icon: '📊', category: 'Technology', searches: '45k/mo' },
  { slug: 'product-manager', title: 'Product Manager', icon: '🗂️', category: 'Technology', searches: '55k/mo' },
  { slug: 'web-developer', title: 'Web Developer', icon: '🌐', category: 'Technology', searches: '75k/mo' },
  { slug: 'ux-designer', title: 'UX Designer', icon: '🎨', category: 'Technology', searches: '35k/mo' },
  // Healthcare
  { slug: 'nurse', title: 'Nurse', icon: '🏥', category: 'Healthcare', searches: '95k/mo' },
  { slug: 'medical-assistant', title: 'Medical Assistant', icon: '💊', category: 'Healthcare', searches: '42k/mo' },
  { slug: 'pharmacist', title: 'Pharmacist', icon: '🔬', category: 'Healthcare', searches: '28k/mo' },
  // Business
  { slug: 'marketing-manager', title: 'Marketing Manager', icon: '📈', category: 'Business', searches: '65k/mo' },
  { slug: 'accountant', title: 'Accountant', icon: '💰', category: 'Business', searches: '78k/mo' },
  { slug: 'project-manager', title: 'Project Manager', icon: '📋', category: 'Business', searches: '88k/mo' },
  { slug: 'sales-manager', title: 'Sales Manager', icon: '🤝', category: 'Business', searches: '52k/mo' },
  // Education
  { slug: 'teacher', title: 'Teacher', icon: '📚', category: 'Education', searches: '60k/mo' },
  { slug: 'student', title: 'Student / Entry Level', icon: '🎓', category: 'Education', searches: '115k/mo' },
  // Other
  { slug: 'customer-service', title: 'Customer Service', icon: '💬', category: 'Service', searches: '72k/mo' },
  { slug: 'warehouse-worker', title: 'Warehouse Worker', icon: '📦', category: 'Logistics', searches: '48k/mo' },
  { slug: 'high-school-student', title: 'High School Student', icon: '🏫', category: 'Education', searches: '85k/mo' },
  { slug: 'internship', title: 'Internship', icon: '🌱', category: 'Education', searches: '68k/mo' },
];

const categories = [...new Set(EXAMPLES.map((e) => e.category))];

export default function ResumeExamplesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Resume Examples for Every Job Title (2026)
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect resume example for your job title and industry.
              Written by career experts, optimized for ATS.
            </p>
          </div>
        </section>

        {categories.map((category) => (
          <section key={category} className="py-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {EXAMPLES.filter((e) => e.category === category).map((example) => (
                  <Link
                    key={example.slug}
                    href={`/resume-examples/${example.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="text-3xl mb-2">{example.icon}</div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                      {example.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Resume Example</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* SEO text */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to use resume examples</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Resume examples show you what works for specific job titles and industries.
                Browse examples to understand the right format, keywords, and achievements to include for your target role.
              </p>
              <p>
                Never copy a resume example word-for-word — instead, use them as inspiration and customize with your own experience and achievements.
                Our free resume builder makes it easy to adapt any example to your specific background.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

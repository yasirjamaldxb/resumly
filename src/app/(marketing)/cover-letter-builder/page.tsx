import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Free Cover Letter Builder – Write a Cover Letter in Minutes | Resumly',
  description:
    'Create a professional cover letter in minutes with AI assistance. Free cover letter builder with customizable templates. Pair with your Resumly resume.',
  alternates: { canonical: 'https://resumly.app/cover-letter-builder' },
};

export default function CoverLetterBuilderPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-purple-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              Free Cover Letter Builder
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Write a compelling cover letter in minutes with AI assistance.
              Pair it with your Resumly resume for a complete job application.
            </p>
            <Button size="xl" asChild>
              <Link href="/builder/new">Start Building →</Link>
            </Button>
            <p className="text-sm text-gray-500 mt-3">Coming soon — join the waitlist</p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to write a great cover letter</h2>
            <div className="text-gray-600 space-y-5 text-lg leading-relaxed">
              <p>
                A strong cover letter does three things: shows why you want this specific job, proves you understand the company&apos;s needs, and demonstrates how your experience addresses those needs.
              </p>
              <h3 className="text-xl font-bold text-gray-900">Cover letter structure</h3>
              <div className="space-y-4">
                {[
                  { num: '01', title: 'Opening hook', desc: 'Grab attention immediately. Mention a specific achievement or connection to the company.' },
                  { num: '02', title: 'Why this company', desc: 'Show you&apos;ve done your research. Reference something specific about their mission or recent news.' },
                  { num: '03', title: 'Why you&apos;re the right fit', desc: 'Connect your top 2-3 achievements directly to the job requirements.' },
                  { num: '04', title: 'Call to action', desc: 'Confidently ask for the interview. Express enthusiasm and next steps.' },
                ].map((item) => (
                  <div key={item.num} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                    <span className="text-blue-600 font-bold text-lg flex-shrink-0">{item.num}</span>
                    <div>
                      <p className="font-bold text-gray-900">{item.title}</p>
                      <p className="text-gray-600 text-base mt-1">{item.desc}</p>
                    </div>
                  </div>
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

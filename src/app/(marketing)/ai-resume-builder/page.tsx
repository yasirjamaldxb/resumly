import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Resume Builder – Generate Your Resume with AI in Minutes | Resumly',
  description:
    'Build a professional resume using AI. Our AI resume builder generates summaries, bullet points, and suggests skills tailored to your target job. Free to use.',
  keywords: ['AI resume builder', 'AI resume writer', 'resume builder AI', 'ChatGPT resume', 'AI CV builder'],
  alternates: { canonical: 'https://resumly.app/ai-resume-builder' },
  openGraph: {
    title: 'AI Resume Builder | Resumly',
    description: 'Let AI write your resume for you. Generate tailored summaries, bullet points, and skills in seconds.',
  },
};

const aiFeatures = [
  {
    icon: '✍️',
    title: 'AI Professional Summary',
    description: 'Enter your job title and let AI write a compelling 3-5 sentence professional summary that highlights your value proposition.',
  },
  {
    icon: '📌',
    title: 'AI Bullet Points',
    description: 'Enter your role and company. Our AI generates 4+ strong, results-oriented bullet points starting with action verbs.',
  },
  {
    icon: '⚡',
    title: 'AI Skill Suggestions',
    description: 'Tell us your target role. We instantly suggest the most in-demand skills that recruiters search for.',
  },
  {
    icon: '🎯',
    title: 'Job-Tailored Content',
    description: 'Paste a job description and our AI rewrites your resume to maximize keyword match for that specific role.',
  },
];

export default function AIResumeBuilderPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-purple-50 via-blue-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI-Powered
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              AI Resume Builder — Write Your Resume with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Don&apos;t know what to write? Let AI do the heavy lifting.
              Our AI generates tailored resume content in seconds — summaries, bullet points, skills — all optimized for ATS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild>
                <Link href="/builder/new">Try AI Resume Builder Free →</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">No sign-up required. No credit card. Free forever.</p>
          </div>
        </section>

        {/* AI Features */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                How AI builds your resume for you
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI is trained on thousands of successful resumes and knows exactly what hiring managers and ATS systems want to see.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              How our AI resume builder works
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Enter your job title',
                  desc: 'Tell us the role you want. Our AI immediately knows which keywords, skills, and achievements are most valuable for that position based on thousands of job postings.',
                },
                {
                  step: '2',
                  title: 'Click AI Write on any section',
                  desc: 'See the AI Write button next to every text field. Click it for your summary, or AI Suggest for bullet points and skills. The AI generates content instantly — you can edit it or regenerate.',
                },
                {
                  step: '3',
                  title: 'Review, edit, and refine',
                  desc: 'AI gives you a strong starting point. Review the suggestions, add your specific numbers and achievements, and make it uniquely yours. The more details you add, the better.',
                },
                {
                  step: '4',
                  title: 'Check your ATS score and download',
                  desc: 'Watch your ATS score update in real time. Once you hit 80%+, download your perfectly formatted PDF — ready to send.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="xl" asChild>
                <Link href="/builder/new">Start with AI Resume Builder →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">AI Resume Builder FAQ</h2>
            <div className="space-y-6 text-gray-700">
              {[
                {
                  q: 'Is the AI resume builder free?',
                  a: 'Yes, our AI resume builder is completely free to use. AI suggestions for summaries, bullet points, and skills are all included at no cost.',
                },
                {
                  q: 'Will AI-generated resumes pass ATS?',
                  a: 'Yes. Our AI is specifically trained to generate ATS-optimized content. It uses the right keywords, action verbs, and formatting that ATS systems are designed to parse. We also include a real-time ATS score so you can verify before downloading.',
                },
                {
                  q: 'Is this better than using ChatGPT for my resume?',
                  a: 'Our AI is purpose-built for resumes — it understands job titles, industries, and recruiter expectations. It integrates directly into our builder so your content flows into a beautifully formatted, ATS-ready template automatically.',
                },
                {
                  q: 'Can I edit the AI-generated content?',
                  a: 'Absolutely — and you should! AI gives you a strong starting point. Always review the suggestions and personalize them with your specific achievements, numbers, and unique experiences.',
                },
              ].map((faq) => (
                <div key={faq.q} className="border-b border-gray-100 pb-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

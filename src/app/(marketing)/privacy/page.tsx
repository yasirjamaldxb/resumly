import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Resumly collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://resumly.app/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="max-w-[760px] mx-auto px-6 py-16">
          <h1 className="text-[36px] font-medium text-neutral-90 tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-neutral-50 text-[15px] mb-10">Last updated: March 20, 2026</p>

          <div className="prose prose-neutral max-w-none [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:text-neutral-90 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-[15px] [&_p]:text-neutral-60 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-[15px] [&_ul]:text-neutral-60 [&_ul]:leading-relaxed [&_li]:mb-2">
            <p>
              Resumly (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website resumly.app. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our resume builder service.
            </p>

            <h2>Information We Collect</h2>
            <p><strong>Account Information:</strong> When you create an account, we collect your email address and password (stored securely via Supabase authentication). If you sign in with Google, we receive your name and email from Google.</p>
            <p><strong>Resume Data:</strong> The personal and professional information you enter into the resume builder (name, contact details, work history, education, skills) is stored in our database to enable saving and editing your resumes.</p>
            <p><strong>Usage Data:</strong> We may collect anonymous usage analytics such as pages visited, features used, and session duration to improve our service.</p>

            <h2>How We Use Your Information</h2>
            <ul>
              <li>To provide, maintain, and improve the resume builder service</li>
              <li>To save and retrieve your resume data across sessions</li>
              <li>To authenticate your identity and secure your account</li>
              <li>To generate PDF downloads of your resumes</li>
              <li>To send service-related communications (password resets, account notifications)</li>
              <li>To analyze usage patterns and improve user experience</li>
            </ul>

            <h2>Data Storage & Security</h2>
            <p>Your data is stored securely on Supabase (powered by PostgreSQL) with Row Level Security (RLS) enabled, meaning users can only access their own data. All data transmission is encrypted via HTTPS/TLS.</p>
            <p>Resume PDFs are generated client-side in your browser and are not stored on our servers. When you download a PDF, it is created locally and downloaded directly to your device.</p>

            <h2>Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share data only in the following circumstances:</p>
            <ul>
              <li><strong>Service providers:</strong> We use Supabase for authentication and data storage, and Vercel for hosting. These providers process data on our behalf under strict data protection agreements.</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect our rights, safety, or property.</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access</strong> your personal data stored in your account</li>
              <li><strong>Edit or update</strong> your information at any time through the resume builder</li>
              <li><strong>Delete</strong> your resumes from the dashboard</li>
              <li><strong>Delete your account</strong> by contacting us at privacy@resumly.app</li>
              <li><strong>Export</strong> your data by downloading your resume as PDF</li>
            </ul>

            <h2>Cookies</h2>
            <p>We use essential cookies for authentication (keeping you logged in). We do not use advertising or tracking cookies. If we implement analytics, we use privacy-friendly, cookie-less analytics tools.</p>

            <h2>Children&apos;s Privacy</h2>
            <p>Our service is not directed to individuals under 16. We do not knowingly collect personal information from children. If you are a parent and believe your child has provided us with personal information, please contact us.</p>

            <h2>Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice on our website. Your continued use of the service after changes constitutes acceptance of the updated policy.</p>

            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy or your data, contact us at:</p>
            <p><strong>Email:</strong> privacy@resumly.app</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

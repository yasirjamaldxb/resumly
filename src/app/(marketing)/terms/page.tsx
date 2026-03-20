import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for using Resumly resume builder.',
  alternates: { canonical: 'https://resumly.app/terms' },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="max-w-[760px] mx-auto px-6 py-16">
          <h1 className="text-[36px] font-medium text-neutral-90 tracking-tight mb-2">Terms of Service</h1>
          <p className="text-neutral-50 text-[15px] mb-10">Last updated: March 20, 2026</p>

          <div className="prose prose-neutral max-w-none [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:text-neutral-90 [&_h2]:mt-10 [&_h2]:mb-4 [&_p]:text-[15px] [&_p]:text-neutral-60 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-[15px] [&_ul]:text-neutral-60 [&_ul]:leading-relaxed [&_li]:mb-2">
            <p>
              Welcome to Resumly. By accessing or using our website at resumly.app, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
            </p>

            <h2>1. Description of Service</h2>
            <p>Resumly provides a free online resume builder that allows users to create, edit, save, and download professional resumes in PDF format. The service includes resume templates, AI-powered content suggestions, and ATS score checking.</p>

            <h2>2. Account Registration</h2>
            <p>To save your resumes, you must create an account using a valid email address or sign in through Google OAuth. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <p>You agree to provide accurate information and to update it as necessary. We reserve the right to suspend or terminate accounts that violate these terms.</p>

            <h2>3. User Content</h2>
            <p>You retain full ownership of the content you create using Resumly, including your resume data, personal information, and generated PDFs. By using the service, you grant us a limited license to store and process your content solely for the purpose of providing the service to you.</p>
            <p>You are responsible for ensuring that the information you include in your resume is accurate and does not violate any third-party rights.</p>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to other users&apos; accounts or data</li>
              <li>Interfere with or disrupt the service or its infrastructure</li>
              <li>Use automated tools to scrape, crawl, or harvest data from the service</li>
              <li>Upload malicious content, viruses, or harmful code</li>
              <li>Impersonate another person or entity</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>The Resumly service, including its design, templates, code, and branding, is owned by Resumly and protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the service.</p>
            <p>Resume templates are provided for personal use in creating your resumes. You may not redistribute, sell, or sublicense the templates themselves.</p>

            <h2>6. Service Availability</h2>
            <p>We strive to maintain high availability but do not guarantee uninterrupted access to the service. We may modify, suspend, or discontinue features at any time without prior notice. We are not liable for any loss of data or interruption of service.</p>

            <h2>7. Free Service</h2>
            <p>Resumly is currently offered as a free service. We reserve the right to introduce paid features or subscription plans in the future. Any changes to pricing will be communicated in advance, and existing free features will remain accessible.</p>

            <h2>8. Limitation of Liability</h2>
            <p>Resumly is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not guarantee that using our service will result in job interviews or employment.</p>
            <p>To the maximum extent permitted by law, Resumly shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>

            <h2>9. Privacy</h2>
            <p>Your use of the service is also governed by our <a href="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</a>, which describes how we collect, use, and protect your personal information.</p>

            <h2>10. Termination</h2>
            <p>You may stop using the service at any time. You may delete your resumes from the dashboard. To delete your account entirely, contact us at support@resumly.app.</p>
            <p>We reserve the right to terminate or suspend your account if you violate these Terms of Service.</p>

            <h2>11. Changes to Terms</h2>
            <p>We may update these Terms of Service from time to time. Material changes will be communicated via the website. Continued use of the service after changes constitutes acceptance of the new terms.</p>

            <h2>12. Contact</h2>
            <p>For questions about these Terms of Service, contact us at:</p>
            <p><strong>Email:</strong> support@resumly.app</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

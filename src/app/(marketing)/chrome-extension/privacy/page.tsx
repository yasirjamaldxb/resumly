import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chrome Extension Privacy Policy \u00b7 Resumly',
  description:
    'How the Resumly Chrome Extension handles your data. Nothing leaves your browser unless you click Import to Resumly.',
  alternates: { canonical: 'https://resumly.app/chrome-extension/privacy' },
};

export default function ExtensionPrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[720px] mx-auto px-6 py-16">
        <Link href="/chrome-extension" className="text-[13px] text-primary hover:underline">&larr; Back to extension</Link>

        <h1 className="text-[32px] font-semibold text-neutral-90 tracking-tight mt-4 mb-2">
          Chrome Extension Privacy Policy
        </h1>
        <p className="text-[13px] text-neutral-40 mb-8">Last updated: April 21, 2026</p>

        <div className="prose prose-neutral max-w-none text-[15px] leading-relaxed text-neutral-70">
          <p className="font-medium text-neutral-90">
            The Resumly Chrome Extension is designed with one rule: nothing leaves your browser unless you click &ldquo;Import to Resumly&rdquo;.
          </p>

          <h2 className="text-[20px] font-semibold text-neutral-90 mt-8 mb-3">What the extension reads</h2>
          <p>
            When \u2014 and only when \u2014 you click the Resumly icon in the Chrome toolbar, the extension runs a one-time script in the active tab that reads:
          </p>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li>The page URL and title</li>
            <li>Any <code>application/ld+json</code> structured data on the page (e.g. <code>JobPosting</code> schemas)</li>
            <li>A small set of OpenGraph / Twitter meta tags (title, description, site name)</li>
            <li>The visible text content of the page, with nav/footer/sidebars removed, truncated to ~15 KB</li>
          </ul>
          <p>This happens locally in your browser. Nothing is sent to any server at this stage.</p>

          <h2 className="text-[20px] font-semibold text-neutral-90 mt-8 mb-3">What the extension does with that data</h2>
          <p>
            The popup shows you a preview card with the extracted title, company, and location. The full payload is held in memory in the popup process only.
          </p>
          <p>When you click <strong>Import to Resumly</strong>, the extension:</p>
          <ol className="list-decimal pl-6 space-y-1 my-3">
            <li>Base64-encodes the payload into a URL fragment</li>
            <li>Opens a new tab at <code>https://resumly.app/import#data=\u2026</code></li>
          </ol>
          <p>
            The payload is placed in the URL hash, which by design is <strong>never transmitted to any server</strong> \u2014 not even resumly.app&rsquo;s. The hash is readable only by the JavaScript running on the <code>/import</code> page in your browser. That script decodes it, sends it to Resumly&rsquo;s job parser API under your session, saves the parsed job to your account, and redirects you to the funnel.
          </p>

          <h2 className="text-[20px] font-semibold text-neutral-90 mt-8 mb-3">What the extension does NOT do</h2>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li>No background pages, no service workers that run when the popup is closed</li>
            <li>No automatic page scraping \u2014 the extension never reads a page without you clicking the icon</li>
            <li>No analytics, no telemetry, no error tracking inside the extension</li>
            <li>No third-party scripts, trackers, or advertising SDKs</li>
            <li>No host permissions \u2014 only <code>activeTab</code> and <code>scripting</code>, both scoped to the tab you&rsquo;re on when you click the icon</li>
            <li>No cookies, no passwords, no form data, no browsing history</li>
            <li>No persistent storage \u2014 the extension does not use <code>chrome.storage</code></li>
          </ul>

          <h2 className="text-[20px] font-semibold text-neutral-90 mt-8 mb-3">Permissions used</h2>
          <ul className="list-disc pl-6 space-y-1 my-3">
            <li><strong>activeTab</strong>: Read the URL and content of the tab you&rsquo;re on, for the duration of a click. Revokes automatically when you switch tabs.</li>
            <li><strong>scripting</strong>: Inject the content script into the active tab to extract the job data.</li>
          </ul>

          <h2 className="text-[20px] font-semibold text-neutral-90 mt-8 mb-3">Data handled by resumly.app</h2>
          <p>
            Once the data reaches resumly.app, it is subject to the main{' '}
            <Link href="/privacy" className="text-primary hover:underline">Resumly Privacy Policy</Link>.
            The imported job becomes a row in your account&rsquo;s jobs table, linked to the resume and application you create from it.
          </p>

          <h2 className="text-[20px] font-semibold text-neutral-90 mt-8 mb-3">Contact</h2>
          <p>
            Questions? Email <a href="mailto:yj.digitall@gmail.com" className="text-primary hover:underline">yj.digitall@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

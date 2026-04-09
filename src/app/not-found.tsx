import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-90 mb-2">Page not found</h1>
        <p className="text-neutral-60 mb-6">
          We couldn&apos;t find the page you were looking for. It may have moved or never existed.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-lg border border-neutral-20 text-neutral-90 font-medium hover:bg-neutral-05 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

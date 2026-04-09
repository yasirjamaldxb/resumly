'use client';

// global-error.tsx catches crashes in the root layout itself.
// It must render its own <html> and <body>.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#ffffff',
          }}
        >
          <div style={{ maxWidth: '448px', width: '100%', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 24px',
                borderRadius: '16px',
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}
            >
              ⚠️
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', margin: '0 0 8px' }}>
              Something went very wrong
            </h1>
            <p style={{ color: '#666', margin: '0 0 24px', lineHeight: 1.5 }}>
              We hit an unexpected error loading the app. Please refresh the page. If the problem persists, email support@resumly.app.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                fontWeight: 500,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            {error.digest && (
              <p style={{ marginTop: '24px', fontSize: '12px', color: '#999' }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Resumly — Free AI Resume Builder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #1a91f0 0%, #0b5ed7 100%)',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            opacity: 0.9,
            marginBottom: 24,
            letterSpacing: -0.5,
          }}
        >
          resumly.app
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 24,
            maxWidth: 1000,
          }}
        >
          Free AI Resume Builder
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            opacity: 0.95,
            lineHeight: 1.3,
            maxWidth: 900,
          }}
        >
          10 ATS-friendly templates · Job-targeted optimization · PDF in 60 seconds
        </div>
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            gap: 16,
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          <span style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: 100 }}>
            No credit card
          </span>
          <span style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: 100 }}>
            ATS-optimized
          </span>
          <span style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: 100 }}>
            AI-powered
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

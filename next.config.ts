import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // CRITICAL: Keep @sparticuz/chromium as an external package so its binary
  // files (chromium.br, fonts.tar.br etc.) are included in the Lambda bundle
  // instead of being tree-shaken by the bundler.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],

  // Explicitly include @sparticuz/chromium binary files in the PDF generation
  // serverless function. Without this, Next.js output file tracing misses
  // the .br (brotli) files needed to bootstrap Chromium on Lambda.
  outputFileTracingIncludes: {
    '/api/resume/generate-pdf': [
      './node_modules/@sparticuz/chromium/**/*',
      './node_modules/@sparticuz/chromium/bin/**',
    ],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  // SEO headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // www → non-www canonical redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.resumly.app' }],
        destination: 'https://resumly.app/:path*',
        permanent: true,
      },
      { source: '/cv-builder', destination: '/resume-builder', permanent: true },
      { source: '/cv-templates', destination: '/resume-templates', permanent: true },
      { source: '/builder', destination: '/#hero-input', permanent: false },
    ];
  },

  // Performance
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

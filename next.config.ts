import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
      { source: '/cv-builder', destination: '/resume-builder', permanent: true },
      { source: '/cv-templates', destination: '/resume-templates', permanent: true },
      { source: '/builder', destination: '/builder/new', permanent: false },
    ];
  },

  // Performance
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

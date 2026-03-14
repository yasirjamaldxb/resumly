import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/builder/', '/auth/', '/api/'],
      },
    ],
    sitemap: 'https://resumly.app/sitemap.xml',
  };
}

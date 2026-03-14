import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://resumly.app'),
  title: {
    default: 'Free Resume Builder – Create ATS-Friendly Resumes | Resumly',
    template: '%s | Resumly',
  },
  description:
    'Build a professional, ATS-friendly resume in minutes. AI-powered resume builder with 6+ templates. Free to use, instant PDF download.',
  keywords: ['resume builder', 'free resume builder', 'ATS resume', 'CV builder', 'resume templates', 'resume maker'],
  authors: [{ name: 'Resumly' }],
  creator: 'Resumly',
  publisher: 'Resumly',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resumly.app',
    siteName: 'Resumly',
    title: 'Free Resume Builder – Create ATS-Friendly Resumes | Resumly',
    description: 'Build a professional ATS-friendly resume in minutes. Free AI-powered resume builder.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@resumlyapp',
    creator: '@resumlyapp',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1a91f0" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

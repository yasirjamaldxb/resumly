import React from 'react';

// Reusable schema.org JSON-LD components. Renders a <script> tag with the
// right @context/@type wrappers so page components stay clean.

type JsonLdProps = { data: Record<string, unknown> };

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Organization — used site-wide in the root layout
// ---------------------------------------------------------------------------
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Resumly',
        url: 'https://resumly.app',
        logo: 'https://resumly.app/icon.svg',
        description:
          'Free AI-powered resume builder with 10 ATS-friendly templates, job-targeted optimization, and matching cover letters.',
        sameAs: [
          'https://twitter.com/resumlyapp',
          'https://www.linkedin.com/company/resumly',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@resumly.app',
          contactType: 'customer support',
          availableLanguage: ['English'],
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// WebSite — enables sitelinks search box
// ---------------------------------------------------------------------------
export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Resumly',
        url: 'https://resumly.app',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://resumly.app/resume-examples/{search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// SoftwareApplication — for the resume builder itself
// ---------------------------------------------------------------------------
export function SoftwareApplicationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Resumly Resume Builder',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: 'https://resumly.app',
        description:
          'Free AI-powered resume builder — 10 ATS-friendly templates, job-targeted keyword optimization, matching cover letters, PDF download.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1200',
          bestRating: '5',
          worstRating: '1',
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------
export type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbListSchema({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// FAQPage
// ---------------------------------------------------------------------------
export type FAQItem = { question: string; answer: string };

export function FAQPageSchema({ items }: { items: FAQItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Article / BlogPosting
// ---------------------------------------------------------------------------
export type ArticleSchemaProps = {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  wordCount?: number;
  type?: 'Article' | 'BlogPosting' | 'TechArticle';
};

export function ArticleSchema({
  headline,
  description,
  url,
  image = 'https://resumly.app/opengraph-image',
  datePublished,
  dateModified,
  authorName = 'Resumly Editorial Team',
  wordCount,
  type = 'Article',
}: ArticleSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': type,
        headline,
        description,
        image,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          '@type': 'Organization',
          name: authorName,
          url: 'https://resumly.app',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Resumly',
          url: 'https://resumly.app',
          logo: {
            '@type': 'ImageObject',
            url: 'https://resumly.app/icon.svg',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        ...(wordCount ? { wordCount } : {}),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// HowTo
// ---------------------------------------------------------------------------
export type HowToStep = { name: string; text: string; url?: string };

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration e.g. "PT10M"
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        ...(totalTime ? { totalTime } : {}),
        step: steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
          ...(step.url ? { url: step.url } : {}),
        })),
      }}
    />
  );
}

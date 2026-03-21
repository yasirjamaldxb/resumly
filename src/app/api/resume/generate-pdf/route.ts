import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, logError } from '@/lib/analytics';
import { createElement } from 'react';

export const maxDuration = 60;

// Font map — must match the one in templates/index.tsx
const FONT_CSS_MAP: Record<string, string> = {
  inter: 'Inter, sans-serif',
  georgia: 'Georgia, serif',
  times: '"Times New Roman", serif',
  arial: 'Arial, Helvetica, sans-serif',
  garamond: 'Garamond, Georgia, serif',
  calibri: 'Calibri, Candara, sans-serif',
};

// Google Fonts URL for all supported font families
const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@400;700&display=swap';

export async function POST(req: NextRequest) {
  let browser: any = null;

  try {
    const body = await req.json();
    const { resumeData } = body;

    if (!resumeData) {
      return NextResponse.json({ error: 'resumeData is required' }, { status: 400 });
    }

    // Dynamic import of react-dom/server (Turbopack blocks static import in routes)
    const { renderToStaticMarkup } = await import('react-dom/server');

    // Dynamically import the template components (they use 'use client' but
    // renderToStaticMarkup works with any React component — no hooks, no browser APIs)
    const { ATSProTemplate } = await import('@/components/resume/templates/ats-pro');
    const { ModernTemplate } = await import('@/components/resume/templates/modern');
    const { ProfessionalTemplate } = await import('@/components/resume/templates/professional');
    const { MinimalTemplate } = await import('@/components/resume/templates/minimal');
    const { ExecutiveTemplate } = await import('@/components/resume/templates/executive');
    const { CreativeTemplate } = await import('@/components/resume/templates/creative');
    const { CompactTemplate } = await import('@/components/resume/templates/compact');
    const { ElegantTemplate } = await import('@/components/resume/templates/elegant');
    const { TechnicalTemplate } = await import('@/components/resume/templates/technical');
    const { ClassicTemplate } = await import('@/components/resume/templates/classic');

    // Pick the right template component based on templateId
    const templateMap: Record<string, any> = {
      'ats-pro': ATSProTemplate,
      'modern': ModernTemplate,
      'professional': ProfessionalTemplate,
      'minimal': MinimalTemplate,
      'executive': ExecutiveTemplate,
      'creative': CreativeTemplate,
      'compact': CompactTemplate,
      'elegant': ElegantTemplate,
      'technical': TechnicalTemplate,
      'classic': ClassicTemplate,
    };

    const TemplateComponent = templateMap[resumeData.templateId] || ATSProTemplate;
    const fontCss = FONT_CSS_MAP[resumeData.fontFamily] || FONT_CSS_MAP['inter'];

    // Server-render the SAME React template component that the preview uses
    // scale=1 for full A4 size (794px width)
    const templateElement = createElement(TemplateComponent, { data: resumeData, scale: 1 });
    const wrapperElement = createElement('div', { style: { fontFamily: fontCss } }, templateElement);
    const templateHtml = renderToStaticMarkup(wrapperElement);

    // Build a complete HTML document matching the preview context
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    html, body {
      width: 794px;
      min-height: 1123px;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    body {
      font-family: ${fontCss};
    }
    ul { list-style-position: outside; }
  </style>
</head>
<body>${templateHtml}</body>
</html>`;

    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;

    if (isProd) {
      const chromium = (await import('@sparticuz/chromium')).default;
      const puppeteer = (await import('puppeteer-core')).default;

      browser = await puppeteer.launch({
        args: [...chromium.args, '--disable-gpu', '--single-process'],
        defaultViewport: { width: 794, height: 1123 },
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // Dev mode: find local Chrome
      const puppeteer = (await import('puppeteer-core')).default;
      const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
      ];

      let executablePath: string | undefined;
      const fs = await import('fs');
      for (const p of chromePaths) {
        if (fs.existsSync(p)) { executablePath = p; break; }
      }

      if (!executablePath) {
        return NextResponse.json({ error: 'Chrome not found locally.' }, { status: 503 });
      }

      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 794, height: 1123 },
      });
    }

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();
    browser = null;

    trackEvent({ event: 'pdf_download', metadata: { method: 'server-ssr-puppeteer', template: resumeData.templateId } });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    console.error('PDF generation error:', error);
    logError({ endpoint: '/api/resume/generate-pdf', errorMessage: error instanceof Error ? error.message : 'PDF generation failed' });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

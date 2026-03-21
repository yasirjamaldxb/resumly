import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, logError } from '@/lib/analytics';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let browser: any = null;

  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // Wrap resume HTML in a proper page with A4 sizing and web fonts
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: A4; margin: 0; }
            body {
              width: 794px;
              min-height: 1123px;
              margin: 0 auto;
              font-family: Arial, Helvetica, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            ul { margin: 0; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;

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

      trackEvent({ event: 'pdf_download', metadata: { method: 'server-puppeteer' } });

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="resume.pdf"',
          'Cache-Control': 'no-store',
        },
      });
    } else {
      // Dev mode: try to find local Chrome
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
        if (fs.existsSync(p)) {
          executablePath = p;
          break;
        }
      }

      if (!executablePath) {
        return NextResponse.json(
          { error: 'Chrome not found. Install Chrome or use production deployment.' },
          { status: 503 }
        );
      }

      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      await browser.close();
      browser = null;

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="resume.pdf"',
        },
      });
    }
  } catch (error) {
    // Always close browser on error
    if (browser) {
      try { await browser.close(); } catch {}
    }

    console.error('PDF generation error:', error);
    logError({ endpoint: '/api/resume/generate-pdf', errorMessage: error instanceof Error ? error.message : 'PDF generation failed' });
    trackEvent({ event: 'pdf_download_error', metadata: { error: error instanceof Error ? error.message : 'unknown' } });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

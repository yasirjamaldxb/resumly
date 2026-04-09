import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, logError } from '@/lib/analytics';
import { createElement } from 'react';
import { getTemplateStyles } from '@/lib/template-utils';
import { createClient } from '@/lib/supabase/server';
import type { ResumeData } from '@/types/resume';

export const maxDuration = 60;

// PDF-specific font map — prepends metric-compatible Google web fonts
// Lambda Chromium lacks system fonts (Arial, Helvetica, Times, Georgia, etc.)
// These web fonts are metrically equivalent so layout stays identical
const PDF_FONT_CSS_MAP: Record<string, string> = {
  inter: 'Inter, sans-serif',
  georgia: 'Tinos, Georgia, serif',
  times: 'Tinos, "Times New Roman", serif',
  arial: 'Arimo, Arial, Helvetica, sans-serif',
  garamond: '"EB Garamond", Garamond, Georgia, serif',
  calibri: 'Carlito, Calibri, Candara, sans-serif',
};

export async function POST(req: NextRequest) {
  let browser: any = null;

  try {
    // Auth guard — Puppeteer/Chromium is expensive, never serve anonymous
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Accept both JSON (fetch) and form-urlencoded (hidden form POST) so the
    // browser can be trusted to stream the response straight to the user's
    // Downloads folder via Content-Disposition, skipping the JS blob path that
    // triggers Chrome's "Save As" dialog.
    const contentType = req.headers.get('content-type') || '';
    let resumeData: ResumeData | null = null;
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const raw = form.get('resumeData');
      try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : null;
        resumeData = parsed && typeof parsed === 'object' ? parsed as ResumeData : null;
      } catch {
        resumeData = null;
      }
    } else {
      const body = await req.json();
      const rd = body?.resumeData;
      resumeData = rd && typeof rd === 'object' ? rd as ResumeData : null;
    }

    if (!resumeData) {
      return NextResponse.json({ error: 'resumeData is required' }, { status: 400 });
    }

    console.log('[PDF] Starting generation for template:', resumeData.templateId, 'font:', resumeData.fontFamily);

    // Dynamic import of react-dom/server (Turbopack blocks static import in routes)
    const { renderToStaticMarkup } = await import('react-dom/server');

    // Dynamically import template components
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
    const styles = getTemplateStyles(resumeData, 1);
    const pdfFontCss = PDF_FONT_CSS_MAP[resumeData.fontFamily] || PDF_FONT_CSS_MAP['inter'];

    console.log('[PDF] Using template component for:', resumeData.templateId, '| pdfFont:', pdfFontCss);

    // Server-render the SAME React template the browser preview uses (scale=1 for A4)
    const templateElement = createElement(TemplateComponent, { data: resumeData, styles });
    const wrapperElement = createElement('div', { style: { fontFamily: styles.fontFamily } }, templateElement);
    const templateHtml = renderToStaticMarkup(wrapperElement);

    console.log('[PDF] HTML rendered, length:', templateHtml.length);

    // Build HTML document that matches the browser preview context exactly
    // Load metric-compatible Google Fonts that match system fonts:
    // Arimo ≡ Arial/Helvetica, Tinos ≡ Times New Roman/Georgia, Carlito ≡ Calibri
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=${styles.pageWidth}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Carlito:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${styles.pageWidth}px;
      margin: 0;
      padding: 0;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    body {
      font-family: ${pdfFontCss};
    }

    /* ── Page-break rules for clean multi-page PDFs ── */
    /* Prevent page breaks inside job entries, education items, etc. */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      break-after: avoid;
    }
    /* Keep bullet lists together with their heading */
    ul, ol {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    /* Prevent orphan headings at bottom of page */
    p {
      orphans: 3;
      widows: 3;
    }
  </style>
</head>
<body>${templateHtml}</body>
</html>`;

    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;

    if (isProd) {
      const chromium = (await import('@sparticuz/chromium')).default;
      const puppeteer = (await import('puppeteer-core')).default;

      console.log('[PDF] Launching Chromium on Lambda...');
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--font-render-hinting=none',
          '--disable-font-subpixel-positioning',
        ],
        defaultViewport: { width: styles.pageWidth, height: styles.pageHeight },
        executablePath: await chromium.executablePath(),
        headless: true,
      });
      console.log('[PDF] Chromium launched successfully');
    } else {
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
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        defaultViewport: { width: styles.pageWidth, height: styles.pageHeight },
      });
    }

    const page = await browser.newPage();

    // CRITICAL: Emulate screen media BEFORE setting content
    await page.emulateMediaType('screen');

    // Set content — use networkidle2 (allows 2 pending connections) instead of
    // networkidle0 which can hang if Google Fonts CDN is slow from Lambda
    await page.setContent(fullHtml, { waitUntil: 'networkidle2', timeout: 25000 });

    console.log('[PDF] Content loaded');

    // Wait for fonts to load with a timeout — don't hang if fonts fail
    try {
      await page.waitForFunction(
        () => (document as any).fonts.ready.then(() => true),
        { timeout: 8000 }
      );
      console.log('[PDF] Fonts loaded');
    } catch {
      console.warn('[PDF] Font loading timed out — proceeding with available fonts');
    }

    // Walk DOM and prepend metric-compatible web fonts to inline font-family.
    // Wrapped in try/catch so font replacement failure doesn't crash PDF generation.
    try {
      await page.evaluate(() => {
        const replacements = [
          ['Arial', 'Arimo'],
          ['Helvetica', 'Arimo'],
          ['Times New Roman', 'Tinos'],
          ['Georgia', 'Tinos'],
          ['Garamond', '"EB Garamond"'],
          ['Calibri', 'Carlito'],
          ['Candara', 'Carlito'],
        ];

        document.querySelectorAll('*').forEach((el) => {
          const htmlEl = el as HTMLElement;
          const ff = htmlEl.style.fontFamily;
          if (!ff) return;

          let newFf = ff;
          for (const [systemFont, webFont] of replacements) {
            const cleanWebFont = webFont.replace(/"/g, '');
            if (newFf.includes(systemFont) && !newFf.includes(cleanWebFont)) {
              newFf = newFf.replace(systemFont, `${webFont}, ${systemFont}`);
            }
          }
          if (newFf !== ff) {
            htmlEl.style.fontFamily = newFf;
          }
        });

        // Ensure body styling
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.background = '#ffffff';
      });
      console.log('[PDF] Font replacement done');
    } catch (evalErr) {
      console.warn('[PDF] Font replacement evaluate failed:', evalErr);
      // Still continue — PDF will generate with default fonts
    }

    // Fix multi-page layout: remove minHeight so content flows naturally,
    // and add page-break-inside:avoid to content blocks so sections don't
    // get split awkwardly across pages.
    try {
      await page.evaluate(() => {
        // 1. Remove minHeight from all elements — it forces a single-page
        //    container which causes blank space at the bottom and awkward
        //    overflow to the next page.
        document.querySelectorAll('*').forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style.minHeight) {
            htmlEl.style.minHeight = 'auto';
          }
        });

        // 2. Find work experience / education / project blocks and mark
        //    them with break-inside:avoid so they don't get cut mid-entry.
        //    These blocks are typically div containers with bullet lists inside.
        //    Strategy: find elements that contain a job title (bold text) followed
        //    by a company name and bullets — these are the "entry" blocks.
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach((div) => {
          const htmlDiv = div as HTMLElement;
          const children = htmlDiv.children;

          // Heuristic: if this div contains both a bold/h-tag element and
          // a list or multiple paragraphs, it's likely a resume entry block.
          // Mark it to avoid page breaks inside.
          const hasBold = htmlDiv.querySelector('strong, b, h3, h4');
          const hasBullets = htmlDiv.querySelector('ul, ol');
          const hasMultipleP = htmlDiv.querySelectorAll('p').length >= 3;

          if (hasBold && (hasBullets || hasMultipleP)) {
            // Only apply to reasonably-sized blocks (not the entire page)
            const rect = htmlDiv.getBoundingClientRect();
            if (rect.height < 500 && rect.height > 30) {
              htmlDiv.style.breakInside = 'avoid';
              htmlDiv.style.pageBreakInside = 'avoid';
            }
          }

          // Also mark section headers to avoid orphans
          if (children.length >= 1) {
            const firstChild = children[0] as HTMLElement;
            if (firstChild && firstChild.tagName &&
                ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(firstChild.tagName)) {
              htmlDiv.style.breakInside = 'avoid';
              htmlDiv.style.pageBreakInside = 'avoid';
            }
          }
        });
      });
      console.log('[PDF] Page-break optimization done');
    } catch (pageBreakErr) {
      console.warn('[PDF] Page-break optimization failed:', pageBreakErr);
    }

    // For templates with colored sidebars (e.g. Creative), create a position:fixed
    // overlay that paints the sidebar background on EVERY page edge-to-edge.
    // In print/PDF context, position:fixed = repeated on every page.
    // This lets us use Puppeteer margins for content spacing without white gaps.
    try {
      await page.evaluate(() => {
        // Find the flex container (body > fontWrapper > templateRoot)
        const fontWrapper = document.body.firstElementChild as HTMLElement;
        if (!fontWrapper) return;

        let flexContainer: HTMLElement | null = null;
        if (window.getComputedStyle(fontWrapper).display === 'flex') {
          flexContainer = fontWrapper;
        } else if (fontWrapper.firstElementChild) {
          const inner = fontWrapper.firstElementChild as HTMLElement;
          if (window.getComputedStyle(inner).display === 'flex') {
            flexContainer = inner;
          }
        }

        if (!flexContainer) return;

        // Find children with colored backgrounds (sidebars)
        Array.from(flexContainer.children).forEach((child) => {
          const el = child as HTMLElement;
          const bg = window.getComputedStyle(el).backgroundColor;
          if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'rgb(255, 255, 255)' || bg === 'transparent') return;

          const rect = el.getBoundingClientRect();
          const isRightSidebar = rect.left > flexContainer!.getBoundingClientRect().width / 2;
          const isLeftSidebar = rect.left < 10;

          // Create a fixed overlay that repeats the sidebar bg on every page
          const overlay = document.createElement('div');
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.bottom = '0';
          overlay.style.width = rect.width + 'px';
          overlay.style.backgroundColor = bg;
          overlay.style.zIndex = '-1';

          if (isRightSidebar) {
            overlay.style.right = '0';
          } else if (isLeftSidebar) {
            overlay.style.left = '0';
          } else {
            overlay.style.left = rect.left + 'px';
          }

          document.body.appendChild(overlay);
        });
      });
      console.log('[PDF] Sidebar background overlay applied');
    } catch (sidebarErr) {
      console.warn('[PDF] Sidebar overlay failed:', sidebarErr);
    }

    // Generate PDF with top/bottom margins for content spacing.
    // Sidebar backgrounds use position:fixed overlays that render on every page
    // edge-to-edge, so the colored sidebar is seamless despite the margins.
    const pdfBuffer = await page.pdf({
      width: `${styles.pageWidth}px`,
      height: `${styles.pageHeight}px`,
      printBackground: true,
      margin: { top: '0.25in', right: 0, bottom: '0.25in', left: 0 },
    });

    console.log('[PDF] PDF generated, size:', pdfBuffer.length, 'bytes');

    await browser.close();
    browser = null;

    trackEvent({ event: 'pdf_download', metadata: { method: 'server-ssr-puppeteer', template: resumeData.templateId } });

    // Build a nice filename from the candidate's name so Chrome saves directly
    const pd = (resumeData as { personalDetails?: { firstName?: string; lastName?: string } }).personalDetails || {};
    const safe = (v: string | undefined) => (v || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40);
    const nameParts = [safe(pd.firstName), safe(pd.lastName)].filter(Boolean);
    const baseName = nameParts.length ? nameParts.join('_') + '_Resume' : 'Resume';
    const filename = `${baseName}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    const errMsg = error instanceof Error ? error.message : 'PDF generation failed';
    console.error('[PDF] Generation error:', errMsg, error instanceof Error ? error.stack : '');
    logError({ endpoint: '/api/resume/generate-pdf', errorMessage: errMsg });
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}

const { chromium } = require('playwright-chromium');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:4000';
const OUTPUT_DIR = path.join(__dirname, '../public/templates');

// Full UUIDs of each template resume
const TEMPLATES = [
  { id: 'ats-pro',      resumeId: '21f48519-41de-4dab-bc69-14231266c8a7' },
  { id: 'modern',       resumeId: '50be17d1-e38e-4c8e-aa21-e2235710e49c' },
  { id: 'professional', resumeId: 'd45bf3dd-7ce1-4ee5-bf6a-c529d9e6c748' },
  { id: 'minimal',      resumeId: '2d01342a-62e9-44aa-aead-48443f03fe0d' },
  { id: 'executive',    resumeId: '4d9d04c6-6d8a-458c-b5e3-69a931da6522' },
  { id: 'compact',      resumeId: '426ac32e-e24a-4173-a4a2-86876183d5a0' },
  { id: 'elegant',      resumeId: 'b0263243-4949-46e9-9ab6-cb1c3d2f2381' },
  { id: 'technical',    resumeId: '1a9c7efc-cff4-4a5b-b6df-14ed3a238c6c' },
  { id: 'classic',      resumeId: '7ee32dfb-d544-485c-8159-f8572d096226' },
  { id: 'creative',     resumeId: '06dfa463-49ad-4541-bd33-3bcfdcbaf2f5' },
];

// A4 at 96dpi: 794 × 1123px. Use 2x scale for crisp render.
const A4_WIDTH  = 794;
const A4_HEIGHT = 1123;
const SCALE     = 2;

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const { id, resumeId } of TEMPLATES) {
    const url = `${BASE_URL}/preview/${resumeId}`;
    console.log(`📸 Capturing ${id}...`);

    const page = await browser.newPage();
    await page.setViewportSize({ width: A4_WIDTH, height: A4_HEIGHT });

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for fonts + content to settle
      await page.waitForTimeout(1500);

      // Hide Next.js dev overlay if present
      await page.evaluate(() => {
        const el = document.getElementById('__next-build-watcher');
        if (el) el.style.display = 'none';
        // Hide any overlay buttons
        document.querySelectorAll('[data-nextjs-dialog-overlay],[data-nextjs-toast]').forEach(e => e.remove());
      });

      // Get full scroll height for the resume content
      const fullHeight = await page.evaluate(() => {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      });

      console.log(`   Full page height: ${fullHeight}px`);

      const outPath = path.join(OUTPUT_DIR, `${id}.png`);

      // Capture full page at 2x device scale for crisp text
      await page.screenshot({
        path: outPath,
        fullPage: true,
        scale: 'device',
        type: 'png',
      });

      // Re-open at device pixel ratio 2 for high-DPI capture
      await page.close();
      const page2 = await browser.newPage();
      await page2.setViewportSize({ width: A4_WIDTH, height: A4_HEIGHT });

      // Use CDP to set device scale factor
      const session = await page2.context().newCDPSession(page2);
      await session.send('Emulation.setDeviceMetricsOverride', {
        width: A4_WIDTH,
        height: A4_HEIGHT,
        deviceScaleFactor: SCALE,
        mobile: false,
      });

      await page2.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page2.waitForTimeout(1500);

      await page2.evaluate(() => {
        // Remove all Next.js dev overlay elements
        const selectors = [
          '[data-nextjs-dialog-overlay]',
          '[data-nextjs-toast]',
          '#__next-build-watcher',
          'nextjs-portal',
          '[data-nextjs-scroll-focus-boundary]',
          // The issues/error badge
          'body > div[style*="z-index: 2147483647"]',
          'body > div[style*="z-index:2147483647"]',
        ];
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(e => e.remove());
        });
        // Also try shadow DOM portals
        document.querySelectorAll('body > div').forEach(el => {
          if (el.shadowRoot || el.tagName === 'NEXTJS-PORTAL') el.remove();
        });
      });

      const hiFiPath = path.join(OUTPUT_DIR, `${id}.png`);
      await page2.screenshot({
        path: hiFiPath,
        fullPage: true,
        type: 'png',
      });

      await page2.close();
      console.log(`   ✅ Saved: ${hiFiPath}`);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      await page.close().catch(() => {});
    }
  }

  await browser.close();
  console.log('\n🎉 All done!');
}

main().catch(err => { console.error(err); process.exit(1); });

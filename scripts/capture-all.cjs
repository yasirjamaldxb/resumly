/**
 * Captures full-page A4 screenshots of all 10 resume templates
 * using the /preview/[id] page and @sparticuz/chromium
 */
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'templates');
const BASE_URL = 'http://localhost:4000';

// A4 at 96dpi
const A4_W = 794;
const A4_H = 1123;

const RESUMES = {
  'ats-pro':      '21f48519-41de-4dab-bc69-14231266c8a7',
  'modern':       '50be17d1-e38e-4c8e-aa21-e2235710e49c',
  'professional': 'd45bf3dd-7ce1-4ee5-bf6a-c529d9e6c748',
  'minimal':      '2d01342a-62e9-44aa-aead-48443f03fe0d',
  'executive':    '4d9d04c6-6d8a-458c-b5e3-69a931da6522',
  'compact':      '426ac32e-e24a-4173-a4a2-86876183d5a0',
  'elegant':      'b0263243-4949-46e9-9ab6-cb1c3d2f2381',
  'technical':    '1a9c7efc-cff4-4a5b-b6df-14ed3a238c6c',
  'classic':      '7ee32dfb-d544-485c-8159-f8572d096226',
  'creative':     '06dfa463-49ad-4541-bd33-3bcfdcbaf2f5',
};

async function main() {
  // Use system browsers directly — skip @sparticuz/chromium (Lambda-only binary)
  const candidates = [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  let executablePath = null;
  for (const p of candidates) {
    try {
      const stat = fs.statSync(p);
      if (stat.isFile()) { executablePath = p; console.log('✅ Using browser:', p); break; }
    } catch {}
  }

  if (!executablePath) {
    throw new Error('No browser found. Please install Chrome, Edge, or Brave.');
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      `--window-size=${A4_W},${A4_H}`,
    ],
    defaultViewport: { width: A4_W, height: A4_H, deviceScaleFactor: 2 },
  });

  for (const [templateId, resumeId] of Object.entries(RESUMES)) {
    const url = `${BASE_URL}/preview/${resumeId}`;
    console.log(`\n📸 ${templateId.padEnd(14)} → ${url}`);

    const page = await browser.newPage();
    await page.setViewport({ width: A4_W, height: A4_H, deviceScaleFactor: 2 });

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait for fonts
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 1000));

      // Get full page height
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.setViewport({ width: A4_W, height: Math.max(bodyHeight, A4_H), deviceScaleFactor: 2 });

      const outPath = path.join(OUTPUT_DIR, `${templateId}.png`);
      await page.screenshot({ path: outPath, fullPage: true, type: 'png' });

      const stats = fs.statSync(outPath);
      console.log(`   ✅ Saved ${(stats.size / 1024).toFixed(0)}KB → public/templates/${templateId}.png`);
    } catch (e) {
      console.error(`   ❌ Failed:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n🎉 All done!');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });

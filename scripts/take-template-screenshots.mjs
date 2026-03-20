import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'public', 'templates');

const TEMPLATES = [
  'ats-pro',
  'modern',
  'professional',
  'minimal',
  'executive',
  'creative',
  'compact',
  'elegant',
  'technical',
  'classic',
];

const BASE_URL = 'http://localhost:3099/template-screenshot';

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const templateId of TEMPLATES) {
    const url = `${BASE_URL}?template=${templateId}`;
    console.log(`Screenshotting ${templateId}...`);

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for content to render
    await page.waitForSelector('#resume-container', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1000)); // Extra settle time

    const element = await page.$('#resume-container');
    if (element) {
      const outputPath = path.join(outputDir, `${templateId}.png`);
      await element.screenshot({ path: outputPath, type: 'png' });
      console.log(`  Saved: ${outputPath}`);
    } else {
      console.log(`  ERROR: Could not find #resume-container for ${templateId}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('Done! All screenshots saved to public/templates/');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

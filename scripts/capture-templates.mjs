import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'templates');

const SUPABASE_URL = 'https://yfgtdhmpmaqzloewrujv.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3RkaG1wbWFxemxvZXdydWp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ0MjEyMiwiZXhwIjoyMDg5MDE4MTIyfQ.NdGEpo-gkTsSydgM5dw-9Eew8BNWyogkvnPjTS0SrqI';
const USER_EMAIL = 'yj.digitall@gmail.com';
const USER_PASS = 'Resumly2024!';
const BASE_URL = 'http://localhost:4000';

const TEMPLATES = ['ats-pro', 'modern', 'professional', 'minimal', 'executive', 'compact', 'elegant', 'technical', 'classic', 'creative'];

async function main() {
  // 1. Sign in via Supabase to get tokens
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({
    email: USER_EMAIL,
    password: USER_PASS,
  });
  if (signInErr) throw new Error('Sign in failed: ' + signInErr.message);
  const session = signIn.session;
  console.log('✅ Signed in as', USER_EMAIL);

  // 2. Get resumes grouped by template
  const { data: resumes, error: resumeErr } = await supabase
    .from('resumes')
    .select('id, template, data')
    .eq('user_id', signIn.user.id)
    .order('updated_at', { ascending: false });
  if (resumeErr) throw new Error('Fetch resumes failed: ' + resumeErr.message);
  console.log(`✅ Found ${resumes.length} resumes`);

  // Map template → first resume ID
  const templateToResume = {};
  for (const r of resumes) {
    const tpl = r.template || 'ats-pro';
    if (!templateToResume[tpl]) templateToResume[tpl] = r.id;
  }
  console.log('Templates with resumes:', Object.keys(templateToResume));

  // 3. Launch Puppeteer
  const browser = await puppeteer.launch({
    executablePath: execSync('where chrome').toString().trim().split('\n')[0].trim(),
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,900'],
    defaultViewport: { width: 1200, height: 900 },
  });

  const page = await browser.newPage();

  // 4. Inject Supabase session into localStorage
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate((sess, url) => {
    const key = `sb-${new URL(url).hostname.split('.')[0]}-auth-token`;
    localStorage.setItem(key, JSON.stringify(sess));
  }, session, SUPABASE_URL);

  // 5. For each template, navigate to the builder and screenshot the preview
  for (const templateId of TEMPLATES) {
    const resumeId = templateToResume[templateId];
    if (!resumeId) {
      console.log(`⚠️  No resume found for template: ${templateId}, skipping`);
      continue;
    }

    console.log(`📸 Capturing template: ${templateId} (resume: ${resumeId})`);
    await page.goto(`${BASE_URL}/builder/${resumeId}`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Close any modals (press Escape or click X)
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));

    // Click close button on modal if present
    try {
      await page.click('[aria-label="Close"], button:has(svg[data-lucide="x"]), .modal-close', { timeout: 1000 });
    } catch {}

    // Wait for the resume preview to render
    await new Promise(r => setTimeout(r, 2000));

    // Find the preview pane (right side of the builder)
    const previewEl = await page.$('[class*="preview"], [data-preview], .resume-preview, #resume-preview');

    if (previewEl) {
      const box = await previewEl.boundingBox();
      await page.screenshot({
        path: path.join(PUBLIC_DIR, `${templateId}.png`),
        clip: {
          x: box.x,
          y: box.y,
          width: Math.min(box.width, 794),
          height: Math.min(box.height, 1123),
        },
      });
    } else {
      // Fallback: screenshot the right half of the page (preview panel)
      await page.screenshot({
        path: path.join(PUBLIC_DIR, `${templateId}.png`),
        clip: { x: 870, y: 60, width: 660, height: 860 },
      });
    }

    console.log(`✅ Saved: public/templates/${templateId}.png`);
  }

  await browser.close();
  console.log('\n🎉 All template screenshots captured!');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });

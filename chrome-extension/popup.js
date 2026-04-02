// Resumly Chrome Extension — Popup Script
const RESUMLY_URL = 'https://resumly.app';

let extractedData = null;

// State management
function showState(state) {
  document.querySelectorAll('.state').forEach(el => el.classList.remove('active'));
  document.getElementById(`state-${state}`).classList.add('active');
}

// Extract job data from the active tab
async function extractFromTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) { showState('error'); return; }

    // Inject content script and get results
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });

    if (!results?.[0]?.result) { showState('error'); return; }

    extractedData = results[0].result;
    displayPreview();
  } catch (err) {
    console.error('Extract error:', err);
    showState('error');
  }
}

function displayPreview() {
  if (!extractedData) { showState('error'); return; }

  const { jsonLd, meta, text, url } = extractedData;

  // Determine title, company, location from best source
  let title = jsonLd?.title || meta?.['og:title'] || meta?.['twitter:title'] || '';
  let company = jsonLd?.company || meta?.['og:site_name'] || '';
  let location = jsonLd?.location || '';
  let source = 'Page text';

  if (jsonLd?.title) {
    source = 'JSON-LD';
  } else if (meta?.['og:title']) {
    source = 'Meta tags';
  }

  // Clean up title — remove site name suffix
  title = title.replace(/\s*[-|–—]\s*(LinkedIn|Indeed|Glassdoor|Monster|ZipRecruiter|Careers).*$/i, '').trim();
  // If title is too long or looks like a page title, try to extract just the job part
  if (title.length > 80) title = title.slice(0, 80) + '...';

  // If no structured data found, try to get title from page title
  if (!title && extractedData.title) {
    title = extractedData.title.replace(/\s*[-|–—]\s*(LinkedIn|Indeed|Glassdoor|Monster|ZipRecruiter|Careers).*$/i, '').trim();
  }

  // Show preview or error
  if (!title && text.length < 200) {
    showState('error');
    return;
  }

  document.getElementById('preview-title').textContent = title || 'Job listing found';
  document.getElementById('preview-company').textContent = company || 'Unknown company';
  if (location) {
    document.getElementById('preview-location').textContent = location;
    document.getElementById('preview-dot').style.display = 'inline';
  }
  document.getElementById('preview-text-len').textContent = text.length > 1000
    ? Math.round(text.length / 1000) + 'K'
    : text.length;
  document.getElementById('preview-source').textContent = source;

  // Show truncated URL
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    document.getElementById('source-url').textContent = `From ${hostname}`;
  } catch {
    document.getElementById('source-url').textContent = '';
  }

  showState('preview');
}

// Import to Resumly — encode data and open in new tab
async function importToResumly() {
  if (!extractedData) return;
  showState('sending');

  try {
    // Build the payload — prefer JSON-LD, fall back to page text
    const payload = {
      jsonLd: extractedData.jsonLd || null,
      meta: extractedData.meta || {},
      text: extractedData.text || '',
      url: extractedData.url || '',
      pageTitle: extractedData.title || '',
    };

    // Compress: encode as base64
    const jsonStr = JSON.stringify(payload);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

    // Open Resumly import page with data in hash
    const importUrl = `${RESUMLY_URL}/import#data=${encoded}`;
    await chrome.tabs.create({ url: importUrl });

    // Close popup
    window.close();
  } catch (err) {
    console.error('Import error:', err);
    // Fallback: just open resumly with paste mode
    await chrome.tabs.create({ url: `${RESUMLY_URL}/job-preview?url=${encodeURIComponent(extractedData.url)}` });
    window.close();
  }
}

// Event listeners
document.getElementById('btn-import').addEventListener('click', importToResumly);

document.getElementById('btn-paste-fallback').addEventListener('click', async () => {
  await chrome.tabs.create({ url: `${RESUMLY_URL}` });
  window.close();
});

document.getElementById('btn-retry').addEventListener('click', () => {
  showState('extracting');
  extractFromTab();
});

// Start extraction on popup open
extractFromTab();

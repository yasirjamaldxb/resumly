# Resumly — Chrome Extension

One-click import of any job posting into [resumly.app](https://resumly.app). Works on LinkedIn, Indeed, Glassdoor, Wellfound, Lever, Greenhouse, Workday, and every company careers page.

## How it works

1. You open a job posting in any tab
2. Click the Resumly extension icon
3. The extension reads the job — preferring `JobPosting` JSON-LD, falling back to OpenGraph meta tags, falling back to the visible page text
4. A preview card shows the parsed title, company, location, and source
5. Click **Import to Resumly** — the data is base64-encoded and opened at `resumly.app/import#data=…`
6. Resumly's `/import` page decodes the payload, calls `/api/jobs/parse`, saves the job, and drops you into the funnel at `/funnel/[jobId]`

No background API calls, no tracking pixels, no remote content scripts. The extension only talks to the active tab when you click the icon.

## Files

| File | What it does |
|------|--------------|
| `manifest.json` | MV3 manifest. Permissions: `activeTab`, `scripting`. No host permissions. |
| `popup.html` | 340px popup UI with extracting / preview / error / sending states |
| `popup.js` | Injects `content.js` via `chrome.scripting.executeScript`, builds the payload, opens `resumly.app/import#data=…` in a new tab |
| `content.js` | Runs in the page context, extracts JSON-LD / meta / cleaned visible text. Returns a plain object — no network calls |
| `icons/` | 16, 48, 128 px PNGs |

## Local development

1. Open `chrome://extensions`
2. Toggle **Developer mode** on
3. Click **Load unpacked** → select this `chrome-extension/` folder
4. The icon should appear in the toolbar. Pin it
5. Navigate to any job posting and click the icon to test

After editing any file, hit the **reload** button on the extension card, then reload the target page.

## Build a Chrome Web Store ZIP

```bash
cd chrome-extension
zip -r ../resumly-extension.zip . -x "*.DS_Store" "README.md" "PRIVACY.md" "store-listing.md"
```

The resulting `resumly-extension.zip` is what you upload to the Chrome Web Store Developer Dashboard.

## Privacy

See [PRIVACY.md](./PRIVACY.md). Short version: nothing leaves the browser except when you click **Import to Resumly**, and even then the payload is sent to `resumly.app` via a URL hash (not a background fetch).

## Publishing checklist

- [ ] One-time $5 Chrome Web Store developer registration
- [ ] Upload `resumly-extension.zip`
- [ ] Fill in the listing using [store-listing.md](./store-listing.md)
- [ ] Link the privacy policy: `https://resumly.app/privacy`
- [ ] Upload at least 1 screenshot (1280×800 or 640×400) and the 128×128 icon
- [ ] Submit for review — usually approved within 1–3 business days

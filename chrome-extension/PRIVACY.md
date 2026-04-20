# Privacy Policy — Resumly Chrome Extension

_Last updated: April 21, 2026_

The Resumly Chrome Extension ("the extension") is designed with one rule: **nothing leaves your browser unless you click "Import to Resumly".**

## What the extension reads

When — and only when — you click the Resumly icon in the Chrome toolbar, the extension runs a one-time script in the active tab that reads:

- The page URL and title
- Any `application/ld+json` structured data on the page (e.g. `JobPosting` schemas)
- A small set of OpenGraph / Twitter meta tags (title, description, site name)
- The visible text content of the page, with nav/footer/sidebars removed, truncated to ~15 KB

This happens locally in your browser. Nothing is sent to any server at this stage.

## What the extension does with that data

The popup shows you a preview card with the extracted title, company, and location. The full payload is held in memory in the popup process only.

When you click **Import to Resumly**, the extension:

1. Base64-encodes the payload into a URL fragment
2. Opens a new tab at `https://resumly.app/import#data=…`

The payload is placed in the URL hash, which by design is **never transmitted to any server** — not even resumly.app's. The hash is readable only by the JavaScript running on the `/import` page in your browser. That script decodes it, sends it to Resumly's job parser API under your session, saves the parsed job to your account, and redirects you to the funnel.

## What the extension does NOT do

- No background pages, no service workers that run when the popup is closed
- No automatic page scraping — the extension never reads a page without you clicking the icon
- No analytics, no telemetry, no error tracking inside the extension
- No third-party scripts, trackers, or advertising SDKs
- No host permissions — the extension requests only `activeTab` and `scripting`, both of which are scoped to the tab you're on when you click the icon
- No cookies, no passwords, no form data, no browsing history
- The extension does not store anything persistently. It has no access to `chrome.storage`

## Permissions used

| Permission | Why |
|---|---|
| `activeTab` | Read the URL and content of the tab you're on, for the duration of a click. Revokes automatically when you switch tabs |
| `scripting` | Inject `content.js` into the active tab to extract the job data |

## Data handled by resumly.app (the website)

Once the data reaches resumly.app, it is subject to the main [Resumly Privacy Policy](https://resumly.app/privacy). The imported job becomes a row in your account's `jobs` table, linked to the resume and application you create from it.

## Contact

Questions? Email `yj.digitall@gmail.com` or open an issue at the Resumly GitHub repo.

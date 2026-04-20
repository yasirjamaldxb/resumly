# Chrome Web Store listing copy

Paste these fields into the Chrome Web Store Developer Dashboard when you upload `resumly-extension.zip`.

---

## Name (max 45 chars)

```
Resumly — Tailor Your Resume to Any Job
```

Alternate (if the above feels too long):
```
Resumly — Job-to-Resume Importer
```

## Short description (max 132 chars)

```
Turn any job posting into a tailored, ATS-ready resume in 60 seconds. One click from LinkedIn, Indeed, Glassdoor, or careers pages.
```

## Category

`Productivity`

## Language

`English`

---

## Detailed description (full listing page)

```
Stop rewriting your resume for every job. Let Resumly do it in 60 seconds.

Found a job on LinkedIn, Indeed, Glassdoor, Wellfound, a company careers page — anywhere? Click the Resumly icon. The extension reads the job title, company, location, and full description, then drops you straight into Resumly's AI builder, which rewrites your resume and cover letter to match the posting.

— HOW IT WORKS —
1. Open any job listing in Chrome
2. Click the Resumly icon in your toolbar
3. Preview the parsed job (title, company, chars extracted)
4. Click "Import to Resumly" — your tailored resume is ready in under a minute

— WORKS EVERYWHERE —
✓ LinkedIn Jobs
✓ Indeed
✓ Glassdoor
✓ Wellfound (formerly AngelList Talent)
✓ Lever-hosted boards (jobs.lever.co)
✓ Greenhouse-hosted boards (boards.greenhouse.io)
✓ Workday-hosted boards
✓ Any company careers page
✓ Apple, Google, Stripe, Notion, and every other company site we've tested

— WHY THIS BEATS COPY-PASTE —
• Reads structured JSON-LD JobPosting data when available (most boards expose it)
• Falls back to OpenGraph meta + clean visible text — works on sites with no structured data
• 15 KB of page context sent to the AI, so it sees the actual requirements, not just the title
• No more "does this paragraph describe the job?" guesswork

— PRIVACY FIRST —
• The extension only reads a page when you click the icon. No background scraping.
• Permissions are scoped: `activeTab` + `scripting` only. No host permissions, no cookies, no history access.
• Data travels to resumly.app via a URL fragment (#data=…), which is NEVER sent to any server until the /import page decodes it locally in your browser.
• No tracking, no analytics, no third-party scripts inside the extension.

— NEED AN ACCOUNT? —
You'll need a free Resumly account to finish the import. Sign up with Google — no credit card required. The free plan includes 3 tailored resumes, 3 cover letters, and unlimited ATS checks.

Made by a solo developer who got tired of rewriting his own resume. Questions? yj.digitall@gmail.com
```

---

## Promotional tile copy (optional, 440×280 or 1400×560)

Headline: `One click. Tailored resume.`
Subline: `From any job posting to a customised resume in 60 seconds.`

---

## Single-purpose statement

```
This extension has a single purpose: to import a job posting from the active tab into the user's Resumly account, so they can generate a tailored resume from it.
```

## Permission justifications

| Permission | Justification |
|---|---|
| `activeTab` | The extension reads the current tab's URL, title, structured data, and visible text once per user-initiated click, in order to extract job details. |
| `scripting` | Used to inject the job-extraction content script into the active tab at click time via `chrome.scripting.executeScript`. No persistent scripts run. |

## Data usage disclosures

- **Personally identifiable information**: No
- **Health information**: No
- **Financial info**: No
- **Authentication info**: No
- **Personal communications**: No
- **Location**: No (job location is text scraped from the page, not the user's location)
- **Web history**: No
- **User activity**: No
- **Website content**: Yes — the extension reads the active tab's content ONLY when the user clicks the extension icon, in order to import the job posting.

## Certifications

- [x] I do not sell or transfer user data to third parties
- [x] I do not use or transfer user data for purposes unrelated to the item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

## Privacy policy URL

```
https://resumly.app/chrome-extension/privacy
```

(or `https://resumly.app/privacy` — either is accepted)

## Homepage URL

```
https://resumly.app/chrome-extension
```

## Support URL

```
mailto:yj.digitall@gmail.com
```

---

## Screenshot shot list (upload at least 1; recommended 3–5)

Each shot should be 1280×800 or 640×400.

1. **Before**: LinkedIn job posting in background, Resumly popup showing parsed title + "Import to Resumly" button
2. **After**: `/funnel/[jobId]` page with template gallery + AI match score visible
3. **ATS check**: Resume preview next to the ATS score sidebar
4. **Cover letter**: The cover letter step mid-generation
5. **Dashboard**: Applications tracker populated with 3–4 applications in different statuses

Tool suggestion: use the actual extension on linkedin.com/jobs/view/[any-id], then screenshot Chrome at the recommended size.

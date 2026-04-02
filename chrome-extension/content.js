// Content script injected into the active tab to extract job data
(function () {
  const result = { jsonLd: null, meta: {}, text: '', url: window.location.href, title: document.title };

  // 1. Extract JSON-LD JobPosting data
  try {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent);
        const items = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
        for (const item of items) {
          if (item['@type'] === 'JobPosting' || (Array.isArray(item['@type']) && item['@type'].includes('JobPosting'))) {
            result.jsonLd = {
              title: item.title || '',
              company: item.hiringOrganization?.name || '',
              location: (() => {
                const loc = Array.isArray(item.jobLocation) ? item.jobLocation[0] : item.jobLocation;
                if (!loc?.address) return '';
                return [loc.address.addressLocality, loc.address.addressRegion].filter(Boolean).join(', ');
              })(),
              description: item.description || '',
              employmentType: item.employmentType || '',
              salary: (() => {
                const bs = item.baseSalary;
                if (!bs?.value) return '';
                const v = bs.value;
                if (v.minValue && v.maxValue) return `${bs.currency || '$'}${v.minValue} - ${v.maxValue}`;
                return '';
              })(),
            };
            break;
          }
        }
      } catch { /* skip invalid JSON */ }
    }
  } catch { /* no JSON-LD */ }

  // 2. Extract meta tags
  try {
    const metaTags = {
      'og:title': '', 'og:description': '', 'og:site_name': '',
      'description': '', 'twitter:title': '', 'twitter:description': '',
    };
    for (const key of Object.keys(metaTags)) {
      const el = document.querySelector(`meta[property="${key}"], meta[name="${key}"]`);
      if (el) metaTags[key] = el.getAttribute('content') || '';
    }
    result.meta = metaTags;
  } catch { /* */ }

  // 3. Extract visible text from the page
  try {
    // Remove nav, footer, sidebar, cookie banners, etc.
    const clone = document.body.cloneNode(true);
    const removeSelectors = [
      'nav', 'footer', 'header', '[role="navigation"]', '[role="banner"]',
      '[class*="cookie"]', '[class*="banner"]', '[class*="popup"]', '[class*="modal"]',
      '[class*="sidebar"]', '[class*="menu"]', '[class*="footer"]', '[class*="header"]',
      'script', 'style', 'noscript', 'iframe', 'svg', 'img',
    ];
    for (const sel of removeSelectors) {
      try { clone.querySelectorAll(sel).forEach(el => el.remove()); } catch { /* */ }
    }

    // Get text, clean whitespace
    let text = clone.innerText || clone.textContent || '';
    text = text.replace(/\t/g, ' ').replace(/\n{3,}/g, '\n\n').replace(/ {2,}/g, ' ').trim();

    // Truncate to ~15KB to stay within URL hash limits
    result.text = text.slice(0, 15000);
  } catch {
    result.text = document.body?.innerText?.slice(0, 15000) || '';
  }

  return result;
})();

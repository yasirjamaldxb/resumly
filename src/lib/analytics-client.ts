'use client';

// Client-side analytics helper. Fires-and-forgets to /api/analytics/track.
// Never throws — analytics must never break the app.

export type ClientEvent =
  | 'page_view'
  | 'funnel_step_viewed'
  | 'funnel_step_completed'
  | 'funnel_abandoned'
  | 'onboarding_complete'
  | 'upgrade_click'
  | 'checkout_started'
  | 'checkout_success'
  | 'cta_click'
  | 'signup'
  | 'login';

const ANON_KEY = 'rz_anon_id';
const SESSION_KEY = 'rz_session_id';

function getOrCreate(key: string, storage: Storage): string {
  try {
    let v = storage.getItem(key);
    if (!v) {
      v = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      storage.setItem(key, v);
    }
    return v;
  } catch {
    return 'unknown';
  }
}

export function getAnonId(): string {
  if (typeof window === 'undefined') return 'ssr';
  return getOrCreate(ANON_KEY, window.localStorage);
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  return getOrCreate(SESSION_KEY, window.sessionStorage);
}

function parseUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'gclid']) {
    const v = sp.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function track(event: ClientEvent, metadata: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      event,
      metadata: {
        anon_id: getAnonId(),
        session_id: getSessionId(),
        path: window.location.pathname,
        search: window.location.search || undefined,
        referrer: document.referrer || undefined,
        ...parseUtm(),
        ...metadata,
      },
    };
    const body = JSON.stringify(payload);
    // Prefer sendBeacon when available (survives page unload, non-blocking)
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }));
      if (ok) return;
    }
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // swallow
  }
}

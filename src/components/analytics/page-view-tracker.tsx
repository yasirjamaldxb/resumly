'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics-client';

// Mount once in the root layout. Fires a page_view on initial load and on
// every client-side navigation. Anonymous visitors get an anon_id/session_id
// attached by the client tracker.
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Don't spam on admin or internal paths
    if (!pathname || pathname.startsWith('/_')) return;
    track('page_view', {
      title: typeof document !== 'undefined' ? document.title : undefined,
      query: searchParams?.toString() || undefined,
    });
  }, [pathname, searchParams]);

  return null;
}

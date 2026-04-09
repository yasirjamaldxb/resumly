'use client';

import { useContext } from 'react';
import { UpgradeModalContext } from '@/components/upgrade-provider';

export function useUpgradeModal() {
  const context = useContext(UpgradeModalContext);
  if (!context) {
    throw new Error('useUpgradeModal must be used within an UpgradeProvider');
  }
  return context;
}

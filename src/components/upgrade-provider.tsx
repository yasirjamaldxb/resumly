'use client';

import { createContext, useState, useCallback, type ReactNode } from 'react';
import { UpgradeModal } from '@/components/upgrade-modal';

interface UpgradeModalState {
  showUpgrade: boolean;
  openUpgrade: (feature?: string) => void;
  closeUpgrade: () => void;
}

export const UpgradeModalContext = createContext<UpgradeModalState | null>(null);

interface UpgradeProviderProps {
  children: ReactNode;
  currentTier?: string;
}

export function UpgradeProvider({ children, currentTier = 'free' }: UpgradeProviderProps) {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState<string | undefined>(undefined);

  const openUpgrade = useCallback((feat?: string) => {
    setFeature(feat);
    setOpen(true);
  }, []);

  const closeUpgrade = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <UpgradeModalContext.Provider value={{ showUpgrade: open, openUpgrade, closeUpgrade }}>
      {children}
      <UpgradeModal
        open={open}
        onClose={closeUpgrade}
        feature={feature}
        currentTier={currentTier}
      />
    </UpgradeModalContext.Provider>
  );
}

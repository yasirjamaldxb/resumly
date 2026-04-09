import { ExitIntentPopup } from '@/components/marketing/exit-intent';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ExitIntentPopup />
    </>
  );
}

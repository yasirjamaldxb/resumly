import { Metadata } from 'next';
import { PricingClient } from './pricing-client';

export const metadata: Metadata = {
  title: 'Pricing – Simple, Transparent Plans',
  description:
    'Start free, upgrade when you need more. Resumly offers affordable plans for job seekers at every stage.',
  alternates: { canonical: 'https://resumly.app/pricing' },
};

export default function PricingPage() {
  return <PricingClient />;
}

import { Webhooks } from '@polar-sh/nextjs';
import { createClient } from '@supabase/supabase-js';

// Use service role client for webhook handlers (no user session)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionActive: async (payload) => {
    const customerId = payload.data.customer?.externalId;
    if (!customerId) return;

    // Determine tier from product metadata or price
    const productName = payload.data.product?.name?.toLowerCase() || '';
    const tier = productName.includes('pro') ? 'pro' : 'starter';

    await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        polar_customer_id: payload.data.customerId,
        polar_subscription_id: payload.data.id,
      })
      .eq('id', customerId);
  },

  onSubscriptionCanceled: async (payload) => {
    const customerId = payload.data.customer?.externalId;
    if (!customerId) return;

    await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .eq('id', customerId);
  },

  onSubscriptionRevoked: async (payload) => {
    const customerId = payload.data.customer?.externalId;
    if (!customerId) return;

    await supabase
      .from('profiles')
      .update({ subscription_tier: 'free' })
      .eq('id', customerId);
  },

  onSubscriptionUncanceled: async (payload) => {
    const customerId = payload.data.customer?.externalId;
    if (!customerId) return;

    const productName = payload.data.product?.name?.toLowerCase() || '';
    const tier = productName.includes('pro') ? 'pro' : 'starter';

    await supabase
      .from('profiles')
      .update({ subscription_tier: tier })
      .eq('id', customerId);
  },

  onOrderPaid: async (payload) => {
    // For one-time purchases or first subscription payment
    const customerId = payload.data.customer?.externalId;
    if (!customerId) return;

    const productName = payload.data.product?.name?.toLowerCase() || '';
    const tier = productName.includes('pro') ? 'pro' : 'starter';

    await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        polar_customer_id: payload.data.customerId,
      })
      .eq('id', customerId);
  },
});

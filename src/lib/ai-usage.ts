import { SupabaseClient } from '@supabase/supabase-js';

// Gemini 2.5 Flash pricing (per 1M tokens) as of April 2026
const PRICING = {
  'gemini-2.5-flash': { input: 0.15, output: 0.60 },  // $/1M tokens
} as const;

export async function logAiUsage(
  supabase: SupabaseClient,
  userId: string,
  endpoint: string,
  completion: { usage?: { prompt_tokens?: number; completion_tokens?: number } },
  metadata?: Record<string, unknown>,
) {
  const inputTokens = completion.usage?.prompt_tokens || 0;
  const outputTokens = completion.usage?.completion_tokens || 0;
  const model = 'gemini-2.5-flash';
  const pricing = PRICING[model];
  const estimatedCost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;

  await supabase.from('ai_usage_log').insert({
    user_id: userId,
    endpoint,
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    estimated_cost: estimatedCost,
    metadata: metadata || {},
  });
}

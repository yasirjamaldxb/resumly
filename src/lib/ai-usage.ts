import { SupabaseClient } from '@supabase/supabase-js';

// Gemini pricing (per 1M tokens) as of April 2026
const PRICING: Record<string, { input: number; output: number }> = {
  'gemini-2.5-flash': { input: 0.15, output: 0.60 },
  'gemini-2.5-flash-lite': { input: 0.075, output: 0.30 },
};
const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

export async function logAiUsage(
  supabase: SupabaseClient,
  userId: string,
  endpoint: string,
  completion: { model?: string; usage?: { prompt_tokens?: number; completion_tokens?: number } },
  metadata?: Record<string, unknown>,
) {
  const inputTokens = completion.usage?.prompt_tokens || 0;
  const outputTokens = completion.usage?.completion_tokens || 0;
  // Normalize model name — Gemini returns things like "models/gemini-2.5-flash-lite"
  const rawModel = completion.model || DEFAULT_MODEL;
  const model = rawModel.replace(/^models\//, '').split('@')[0];
  const pricing = PRICING[model] || PRICING[DEFAULT_MODEL];
  const estimatedCost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;

  try {
    await supabase.from('ai_usage_log').insert({
      user_id: userId,
      endpoint,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      estimated_cost: estimatedCost,
      metadata: metadata || {},
    });
  } catch (err) {
    // Never let usage logging crash the request path
    console.error('[ai-usage] failed to insert log:', err);
  }
}

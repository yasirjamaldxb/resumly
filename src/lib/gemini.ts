import OpenAI from 'openai';

/**
 * Shared Gemini client + resilient wrapper.
 *
 * Google's `gemini-2.5-flash` endpoint has been returning HTTP 503
 * ("model currently experiencing high demand") intermittently. We can't
 * control upstream capacity, but we can:
 *
 *   1. Retry with exponential backoff on transient 5xx / 429.
 *   2. Automatically fall back to `gemini-2.5-flash-lite` on repeated 503s —
 *      lite is a separate capacity pool and has so far remained available
 *      whenever flash has been throttled.
 *
 * Use `callGemini()` from every /api/ai/* route instead of calling
 * `openai.chat.completions.create` directly, so every endpoint benefits
 * from the same resilience.
 */

export const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  // Disable the SDK's internal retries — we implement our own retry +
  // model-fallback logic in callGemini() below. Without this, each 503
  // takes ~12s because the SDK retries twice on its own.
  maxRetries: 0,
});

// NOTE: We deliberately use gemini-2.5-flash-lite as the PRIMARY model.
// As of April 2026, gemini-2.5-flash has been returning HTTP 503
// ("model currently experiencing high demand") consistently for
// resume-optimization-sized payloads, while flash-lite remains fully
// available and returns equivalent-quality JSON in ~3s for our use case.
// Flash is kept as a fallback in case lite capacity ever degrades.
const PRIMARY_MODEL = 'gemini-2.5-flash-lite';
const FALLBACK_MODEL = 'gemini-2.5-flash';
const MAX_ATTEMPTS = 3;

type ChatCreateParams = Omit<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming, 'model'> & {
  model?: string;
};

function isTransient(status: number | undefined): boolean {
  return status === 503 || status === 502 || status === 429 || status === 500;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Call Gemini with retry + model fallback.
 *
 * Attempt 1 + 2: use the primary model (gemini-2.5-flash) with backoff.
 * Attempt 3 (final): switch to the fallback model (gemini-2.5-flash-lite).
 * Throws the last error if all attempts fail.
 *
 * @param tag Short label for log messages (e.g. 'optimize', 'suggest')
 * @param params Standard OpenAI chat completion params (model is optional and overridden by fallback logic)
 */
export async function callGemini(
  tag: string,
  params: ChatCreateParams,
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const isLastAttempt = attempt === MAX_ATTEMPTS - 1;
    const model = isLastAttempt ? FALLBACK_MODEL : PRIMARY_MODEL;
    try {
      return await gemini.chat.completions.create({ ...params, model });
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: number })?.status;
      if (!isTransient(status)) {
        // Permanent error — don't waste retries
        throw err;
      }
      console.warn(
        `[${tag}] Gemini ${model} -> ${status} on attempt ${attempt + 1}/${MAX_ATTEMPTS}${
          isLastAttempt ? ' (giving up)' : ', retrying...'
        }`,
      );
      if (!isLastAttempt) {
        await sleep(500 * Math.pow(2, attempt)); // 500ms, 1s
      }
    }
  }
  throw lastErr;
}

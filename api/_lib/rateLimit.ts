import { ApiError } from './http';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

declare global {
  var __faceRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const store = globalThis.__faceRateLimitStore
  ?? (globalThis.__faceRateLimitStore = new Map<string, RateLimitEntry>());

const getClientAddress = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
};

export const enforceRateLimit = (
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): void => {
  const now = Date.now();
  const key = `${scope}:${getClientAddress(request)}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
  } else if (current.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    throw new ApiError(
      429,
      'RATE_LIMITED',
      `請稍候 ${retryAfter} 秒後再試。`,
    );
  } else {
    current.count += 1;
  }

  // Serverless instances are short-lived, but keep a hard cap for warm instances.
  if (store.size > 1_000) {
    for (const [entryKey, entry] of store) {
      if (entry.resetAt <= now) store.delete(entryKey);
    }
  }
};

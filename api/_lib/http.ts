const JSON_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
} as const;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const jsonResponse = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
};

export const assertSameOrigin = (request: Request): void => {
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');

  if (fetchSite === 'cross-site') {
    throw new ApiError(403, 'ORIGIN_NOT_ALLOWED', '不允許跨網站呼叫。');
  }

  if (!origin) {
    if (process.env.VERCEL_ENV === 'production') {
      throw new ApiError(403, 'ORIGIN_REQUIRED', '缺少來源資訊。');
    }
    return;
  }

  const requestOrigin = new URL(request.url).origin;
  const configuredOrigin = process.env.APP_ORIGIN?.replace(/\/$/, '');
  if (origin !== requestOrigin && origin !== configuredOrigin) {
    throw new ApiError(403, 'ORIGIN_NOT_ALLOWED', '不允許跨網站呼叫。');
  }
};

export const readJsonBody = async <T>(
  request: Request,
  maxBytes = 8_192,
): Promise<T> => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', '請使用 JSON 格式。');
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ApiError(413, 'PAYLOAD_TOO_LARGE', '請求內容過大。');
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    throw new ApiError(413, 'PAYLOAD_TOO_LARGE', '請求內容過大。');
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'JSON 格式不正確。');
  }
};

export const handleApiError = (error: unknown): Response => {
  if (error instanceof ApiError) {
    return jsonResponse(
      { error: { code: error.code, message: error.message } },
      error.status,
    );
  }

  const safeError = error instanceof Error
    ? { name: error.name, message: error.message }
    : { name: 'UnknownError', message: 'Unknown error' };
  console.error('Gemini function failed', safeError);

  return jsonResponse(
    {
      error: {
        code: 'AI_UNAVAILABLE',
        message: 'AI 服務暫時無法使用，請稍後再試。',
      },
    },
    503,
  );
};

type AccessMode = 'public' | 'login_required' | 'paid';

type ReadingPayload = {
  contentId?: string;
  contentSlug?: string;
  accessMode?: AccessMode;
  anonymousVisitorId?: string;
  sessionId?: string;
  event?: 'open' | 'progress';
  progress?: number;
};

type VercelRequestLike = {
  method?: string;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponseLike = {
  setHeader: (name: string, value: string) => void;
  status: (statusCode: number) => VercelResponseLike;
  json: (body: unknown) => void;
};

type SupabaseUser = {
  id?: string;
  is_anonymous?: boolean;
};

type ReadingRow = {
  id: string;
  view_count: number;
  max_progress: number;
  completed_at: string | null;
  metadata: Record<string, unknown> | null;
};

type EntitlementRow = {
  expires_at: string | null;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const firstHeader = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const sendJson = (response: VercelResponseLike, status: number, body: unknown): void => {
  response.setHeader('Cache-Control', 'private, no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.status(status).json(body);
};

const getServerConfig = (): { supabaseUrl: string; serviceRoleKey: string } => {
  const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) throw new Error('Supabase server storage is not configured');
  return { supabaseUrl: supabaseUrl.replace(/\/$/, ''), serviceRoleKey };
};

const parseBody = (request: VercelRequestLike): ReadingPayload => {
  if (!firstHeader(request.headers?.['content-type'])?.toLowerCase().includes('application/json')) {
    throw new Error('UNSUPPORTED_MEDIA_TYPE');
  }
  if (typeof request.body === 'string') return JSON.parse(request.body) as ReadingPayload;
  if (request.body && typeof request.body === 'object') return request.body as ReadingPayload;
  throw new Error('INVALID_JSON');
};

const assertSameOrigin = (request: VercelRequestLike): void => {
  if (firstHeader(request.headers?.['sec-fetch-site']) === 'cross-site') throw new Error('ORIGIN_NOT_ALLOWED');
  const origin = firstHeader(request.headers?.origin)?.replace(/\/$/, '');
  if (!origin) return;
  const configuredOrigin = process.env.APP_ORIGIN?.replace(/\/$/, '');
  const protocol = firstHeader(request.headers?.['x-forwarded-proto']) ?? 'https';
  const host = firstHeader(request.headers?.host) ?? 'faceyourself.vercel.app';
  if (origin !== `${protocol}://${host}` && origin !== configuredOrigin) throw new Error('ORIGIN_NOT_ALLOWED');
};

const loadAuthenticatedUser = async (
  request: VercelRequestLike,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<SupabaseUser | null> => {
  const authorization = firstHeader(request.headers?.authorization);
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (!token) return null;
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${token}` },
  });
  if (!userResponse.ok) throw new Error('INVALID_SESSION');
  const user = await userResponse.json() as SupabaseUser;
  return user.id && !user.is_anonymous ? user : null;
};

const hasActiveEntitlement = async (
  userId: string,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<boolean> => {
  const url = new URL(`${supabaseUrl}/rest/v1/member_entitlements`);
  url.searchParams.set('select', 'expires_at');
  url.searchParams.set('user_id', `eq.${userId}`);
  url.searchParams.set('product_code', 'eq.face-survival-kit');
  url.searchParams.set('status', 'eq.active');
  const result = await fetch(url, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
  });
  if (!result.ok) throw new Error(`ENTITLEMENT_LOOKUP_FAILED_${result.status}`);
  const rows = await result.json() as EntitlementRow[];
  return rows.some((row) => !row.expires_at || new Date(row.expires_at).getTime() > Date.now());
};

const readExisting = async (
  payload: Required<Pick<ReadingPayload, 'contentId'>>,
  userId: string | null,
  anonymousVisitorId: string | null,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<ReadingRow | null> => {
  const url = new URL(`${supabaseUrl}/rest/v1/content_reading_progress`);
  url.searchParams.set('select', 'id,view_count,max_progress,completed_at,metadata');
  url.searchParams.set('content_id', `eq.${payload.contentId}`);
  if (userId) {
    url.searchParams.set('user_id', `eq.${userId}`);
  } else {
    url.searchParams.set('user_id', 'is.null');
    url.searchParams.set('anonymous_visitor_id', `eq.${anonymousVisitorId}`);
  }
  url.searchParams.set('limit', '1');
  const result = await fetch(url, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
  });
  if (!result.ok) throw new Error(`READING_LOOKUP_FAILED_${result.status}`);
  const rows = await result.json() as ReadingRow[];
  return rows[0] ?? null;
};

const persistReading = async (
  path: string,
  method: 'POST' | 'PATCH',
  body: Record<string, unknown>,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<void> => {
  const result = await fetch(`${supabaseUrl}/rest/v1/content_reading_progress${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (!result.ok) throw new Error(`READING_WRITE_FAILED_${result.status}`);
};

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> {
  if ((request.method ?? 'GET').toUpperCase() !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: { code: 'METHOD_NOT_ALLOWED', message: '此端點僅接受 POST。' } });
    return;
  }

  try {
    assertSameOrigin(request);
    const body = parseBody(request);
    const contentId = body.contentId?.trim().slice(0, 120);
    const contentSlug = body.contentSlug?.trim().slice(0, 180);
    const accessMode = body.accessMode;
    const sessionId = body.sessionId?.trim();
    const progress = Math.max(0, Math.min(100, Math.round(body.progress ?? 0)));
    if (!contentId || !contentSlug || !accessMode || !sessionId || !UUID_PATTERN.test(sessionId)) {
      sendJson(response, 400, { error: { code: 'INVALID_READING_EVENT', message: '閱讀紀錄格式不正確。' } });
      return;
    }

    const { supabaseUrl, serviceRoleKey } = getServerConfig();
    const user = await loadAuthenticatedUser(request, supabaseUrl, serviceRoleKey);
    if (accessMode !== 'public' && !user?.id) {
      sendJson(response, 401, { error: { code: 'LOGIN_REQUIRED', message: '請先登入再繼續閱讀。' } });
      return;
    }
    if (accessMode === 'paid' && user?.id && !await hasActiveEntitlement(user.id, supabaseUrl, serviceRoleKey)) {
      sendJson(response, 403, { error: { code: 'PAYMENT_REQUIRED', message: '此內容需要 FACE Survival 存取權。' } });
      return;
    }

    const anonymousVisitorId = user?.id ? null : body.anonymousVisitorId?.trim() ?? null;
    if (!user?.id && (!anonymousVisitorId || !UUID_PATTERN.test(anonymousVisitorId))) {
      sendJson(response, 400, { error: { code: 'VISITOR_ID_REQUIRED', message: '缺少有效的匿名訪客識別碼。' } });
      return;
    }

    const existing = await readExisting(
      { contentId },
      user?.id ?? null,
      anonymousVisitorId,
      supabaseUrl,
      serviceRoleKey,
    );
    const now = new Date().toISOString();
    const existingMetadata = existing?.metadata && typeof existing.metadata === 'object'
      ? existing.metadata
      : {};
    const isNewSession = existingMetadata.last_session_id !== sessionId;
    const maxProgress = Math.max(existing?.max_progress ?? 0, progress);
    const completedAt = maxProgress >= 90 ? existing?.completed_at ?? now : existing?.completed_at ?? null;
    const metadata = { ...existingMetadata, last_session_id: sessionId, app_version: '2.5.0' };

    if (existing) {
      await persistReading(
        `?id=eq.${encodeURIComponent(existing.id)}`,
        'PATCH',
        {
          content_slug: contentSlug,
          access_mode: accessMode,
          view_count: existing.view_count + (body.event === 'open' && isNewSession ? 1 : 0),
          max_progress: maxProgress,
          last_viewed_at: now,
          completed_at: completedAt,
          metadata,
        },
        supabaseUrl,
        serviceRoleKey,
      );
    } else {
      await persistReading(
        '',
        'POST',
        {
          content_id: contentId,
          content_slug: contentSlug,
          access_mode: accessMode,
          user_id: user?.id ?? null,
          anonymous_visitor_id: anonymousVisitorId,
          view_count: 1,
          max_progress: maxProgress,
          first_viewed_at: now,
          last_viewed_at: now,
          completed_at: completedAt,
          metadata,
        },
        supabaseUrl,
        serviceRoleKey,
      );
    }

    sendJson(response, 200, { recorded: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    if (code === 'ORIGIN_NOT_ALLOWED') {
      sendJson(response, 403, { error: { code, message: '此來源不允許寫入閱讀紀錄。' } });
      return;
    }
    if (code === 'INVALID_SESSION') {
      sendJson(response, 401, { error: { code, message: '登入狀態已失效，請重新登入。' } });
      return;
    }
    if (code === 'UNSUPPORTED_MEDIA_TYPE' || code === 'INVALID_JSON') {
      sendJson(response, 400, { error: { code, message: '請使用正確的 JSON 格式。' } });
      return;
    }
    console.error('[content-reading] failed to persist progress', error);
    sendJson(response, 503, { error: { code: 'ANALYTICS_UNAVAILABLE', message: '目前無法儲存閱讀紀錄。' } });
  }
}

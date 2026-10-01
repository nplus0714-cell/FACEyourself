type FunnelEventType =
  | 'quiz_landing_view'
  | 'quiz_start'
  | 'quiz_question_progress'
  | 'quiz_complete'
  | 'result_view'
  | 'result_share_click'
  | 'result_feedback_click'
  | 'survival_guide_click'
  | 'line_click'
  | 'guide_access'
  | 'guide_read_start';

type FunnelPayload = {
  anonymousVisitorId?: string;
  sessionId?: string;
  eventType?: FunnelEventType;
  path?: string;
  step?: number;
  attribution?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
};

type VercelRequestLike = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponseLike = {
  setHeader: (name: string, value: string) => void;
  status: (statusCode: number) => VercelResponseLike;
  json: (body: unknown) => void;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_VALUE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,119}$/;
const SAFE_PATH_PATTERN = /^\/[a-z0-9/_-]{0,180}$/;
const EVENT_TYPES = new Set<FunnelEventType>([
  'quiz_landing_view',
  'quiz_start',
  'quiz_question_progress',
  'quiz_complete',
  'result_view',
  'result_share_click',
  'result_feedback_click',
  'survival_guide_click',
  'line_click',
  'guide_access',
  'guide_read_start',
]);

const firstHeader = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const sendJson = (response: VercelResponseLike, status: number, body: unknown): void => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.status(status).json(body);
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

const parseBody = (request: VercelRequestLike): FunnelPayload => {
  if (!firstHeader(request.headers?.['content-type'])?.toLowerCase().includes('application/json')) {
    throw new Error('UNSUPPORTED_MEDIA_TYPE');
  }
  if (typeof request.body === 'string') return JSON.parse(request.body) as FunnelPayload;
  if (request.body && typeof request.body === 'object') return request.body as FunnelPayload;
  throw new Error('INVALID_JSON');
};

const normalizeOptional = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (!SAFE_VALUE_PATTERN.test(normalized)) throw new Error('INVALID_FUNNEL_EVENT');
  return normalized;
};

const getServerConfig = (): { supabaseUrl: string; serviceRoleKey: string } => {
  const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) throw new Error('ANALYTICS_UNAVAILABLE');
  return { supabaseUrl: supabaseUrl.replace(/\/$/, ''), serviceRoleKey };
};

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> {
  if ((request.method ?? 'GET').toUpperCase() !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: { code: 'METHOD_NOT_ALLOWED' } });
    return;
  }

  try {
    assertSameOrigin(request);
    const body = parseBody(request);
    const visitorId = body.anonymousVisitorId?.trim();
    const sessionId = body.sessionId?.trim();
    const eventType = body.eventType;
    const path = body.path?.trim() || '/test';
    const step = body.step;
    if (!visitorId || !sessionId || !UUID_PATTERN.test(visitorId) || !UUID_PATTERN.test(sessionId)
      || !eventType || !EVENT_TYPES.has(eventType) || !SAFE_PATH_PATTERN.test(path)
      || (step !== undefined && (!Number.isInteger(step) || step < 1 || step > 24))
      || (eventType === 'quiz_question_progress' && step === undefined)) {
      throw new Error('INVALID_FUNNEL_EVENT');
    }

    const source = normalizeOptional(body.attribution?.source);
    const medium = normalizeOptional(body.attribution?.medium);
    const campaign = normalizeOptional(body.attribution?.campaign);
    const content = normalizeOptional(body.attribution?.content);
    const { supabaseUrl, serviceRoleKey } = getServerConfig();
    const result = await fetch(`${supabaseUrl}/rest/v1/rpc/record_funnel_event`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_anonymous_visitor_id: visitorId,
        p_session_id: sessionId,
        p_event_type: eventType,
        p_path: path,
        p_step: step ?? null,
        p_has_attribution: Boolean(source || medium || campaign || content),
        p_source: source,
        p_medium: medium,
        p_campaign: campaign,
        p_content: content,
      }),
    });
    if (!result.ok) throw new Error('ANALYTICS_UNAVAILABLE');
    sendJson(response, 200, { recorded: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'ANALYTICS_UNAVAILABLE';
    if (code === 'ORIGIN_NOT_ALLOWED') {
      sendJson(response, 403, { error: { code } });
      return;
    }
    if (code === 'UNSUPPORTED_MEDIA_TYPE' || code === 'INVALID_JSON' || code === 'INVALID_FUNNEL_EVENT') {
      sendJson(response, 400, { error: { code } });
      return;
    }
    console.error('[funnel] failed to record event', error);
    sendJson(response, 503, { error: { code: 'ANALYTICS_UNAVAILABLE' } });
  }
}

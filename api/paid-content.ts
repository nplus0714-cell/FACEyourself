const PAID_ARTICLE_FILES: Record<string, string> = {
  'attack-is-changing-gears': '010-attack-is-changing-gears.md',
  'probability-payoff-and-expectancy': '011-probability-payoff-and-expectancy.md',
  'let-time-make-money': '012-let-time-make-money.md',
  'how-far-behind-the-market-is-your-news': '013-how-far-behind-the-market-is-your-news.md',
  'direction-position-and-time': '014-direction-position-and-time.md',
  'let-resources-stay-with-winners': '015-let-resources-stay-with-winners.md',
  'good-stocks-are-amulets': '016-good-stocks-are-amulets.md',
  'leverage-requires-discipline': '017-leverage-requires-discipline.md',
  'follow-the-trend-and-your-nature': '018-follow-the-trend-and-your-nature.md',
  'trading-should-be-sustainable': '019-trading-should-be-sustainable.md',
  'from-holy-grail-to-self-knowledge': '020-from-holy-grail-to-self-knowledge.md',
};

const stripDocumentHeading = (source: string) => source
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  .trimStart()
  .replace(/^#\s+.+\r?\n+/, '')
  .trim();

type VercelRequestLike = {
  method?: string;
  url?: string;
  query?: Record<string, string | string[] | undefined>;
  headers?: Record<string, string | string[] | undefined>;
};

type SupabaseUser = {
  id?: string;
  is_anonymous?: boolean;
};

type EntitlementRow = {
  id: string;
  expires_at: string | null;
};

type VercelResponseLike = {
  setHeader: (name: string, value: string) => void;
  status: (status: number) => VercelResponseLike;
  json: (body: unknown) => void;
};

const sendJson = (response: VercelResponseLike, status: number, body: unknown): void => {
  response.setHeader('Cache-Control', 'private, no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.status(status).json(body);
};

const getServerConfig = (): { supabaseUrl: string; serviceRoleKey: string } => {
  const supabaseUrl = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server storage is not configured');
  }
  return { supabaseUrl: supabaseUrl.replace(/\/$/, ''), serviceRoleKey };
};

const loadAuthenticatedUser = async (
  token: string,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<SupabaseUser | null> => {
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!userResponse.ok) return null;
  return await userResponse.json() as SupabaseUser;
};

const hasActiveEntitlement = async (
  userId: string,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<boolean> => {
  const entitlementUrl = new URL(`${supabaseUrl}/rest/v1/member_entitlements`);
  entitlementUrl.searchParams.set('select', 'id,expires_at');
  entitlementUrl.searchParams.set('user_id', `eq.${userId}`);
  entitlementUrl.searchParams.set('product_code', 'eq.face-survival-kit');
  entitlementUrl.searchParams.set('status', 'eq.active');
  entitlementUrl.searchParams.set('limit', '10');

  const entitlementResponse = await fetch(entitlementUrl, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  if (!entitlementResponse.ok) {
    throw new Error(`Entitlement lookup failed: ${entitlementResponse.status}`);
  }

  const rows = await entitlementResponse.json() as EntitlementRow[];
  const now = Date.now();
  return rows.some((row) => !row.expires_at || new Date(row.expires_at).getTime() > now);
};

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> {
  if (request.method && request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    sendJson(response, 405, { error: { code: 'METHOD_NOT_ALLOWED', message: '僅支援 GET。' } });
    return;
  }

  try {
    const authorizationValue = request.headers?.authorization;
    const authorization = Array.isArray(authorizationValue) ? authorizationValue[0] : authorizationValue;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
    if (!token) {
      sendJson(response, 401, { error: { code: 'LOGIN_REQUIRED', message: '請先登入再繼續閱讀。' } });
      return;
    }

    const { supabaseUrl, serviceRoleKey } = getServerConfig();
    const user = await loadAuthenticatedUser(token, supabaseUrl, serviceRoleKey);
    if (!user?.id || user.is_anonymous) {
      sendJson(response, 401, { error: { code: 'INVALID_SESSION', message: '登入狀態已失效，請重新登入。' } });
      return;
    }

    const querySlug = request.query?.slug;
    const slug = (Array.isArray(querySlug) ? querySlug[0] : querySlug)?.trim()
      ?? new URL(request.url ?? '/', 'https://faceyourself.vercel.app').searchParams.get('slug')?.trim();
    const fileName = slug ? PAID_ARTICLE_FILES[slug] : undefined;
    if (!fileName) {
      sendJson(response, 404, { error: { code: 'CONTENT_NOT_FOUND', message: '找不到這篇內容。' } });
      return;
    }

    if (!await hasActiveEntitlement(user.id, supabaseUrl, serviceRoleKey)) {
      sendJson(response, 403, { error: { code: 'PAYMENT_REQUIRED', message: '此內容需要 FACE Survival 方案權限。' } });
      return;
    }

    const [{ readFile }, pathModule] = await Promise.all([
      import('node:fs/promises'),
      import('node:path'),
    ]);
    const path = pathModule.default;
    const articlePath = path.join(process.cwd(), 'docs', 'content', 'articles', fileName);
    const markdown = stripDocumentHeading(await readFile(articlePath, 'utf8'));
    sendJson(response, 200, { slug, markdown });
  } catch (error) {
    console.error('[paid-content] failed to load article', error);
    sendJson(
      response,
      503,
      { error: { code: 'CONTENT_UNAVAILABLE', message: '內容暫時無法載入，請稍後再試。' } },
    );
  }
}

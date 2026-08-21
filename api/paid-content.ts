import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getAdminClient } from './_lib/supabaseAdmin';

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

    const admin = getAdminClient();
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user || userData.user.is_anonymous) {
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

    const { data: entitlement, error } = await admin
      .from('member_entitlements')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('product_code', 'face-survival-kit')
      .eq('status', 'active')
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .maybeSingle();
    if (error) throw error;
    if (!entitlement) {
      sendJson(response, 403, { error: { code: 'PAYMENT_REQUIRED', message: '此內容需要 FACE Survival 方案權限。' } });
      return;
    }

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

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ApiError, jsonResponse } from './_lib/http';
import { getAdminClient, requireAuthenticatedUser } from './_lib/supabaseAdmin';

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

const handlePaidArticleRequest = async (request: Request): Promise<Response> => {
  try {
    const user = await requireAuthenticatedUser(request);
    const slug = new URL(request.url).searchParams.get('slug')?.trim();
    const fileName = slug ? PAID_ARTICLE_FILES[slug] : undefined;
    if (!fileName) throw new ApiError(404, 'CONTENT_NOT_FOUND', '找不到這篇內容。');

    const { data: entitlement, error } = await getAdminClient()
      .from('member_entitlements')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_code', 'face-survival-kit')
      .eq('status', 'active')
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .maybeSingle();
    if (error) throw error;
    if (!entitlement) throw new ApiError(403, 'PAYMENT_REQUIRED', '此內容需要 FACE Survival 方案權限。');

    const articlePath = path.join(process.cwd(), 'docs', 'content', 'articles', fileName);
    const markdown = stripDocumentHeading(await readFile(articlePath, 'utf8'));
    return jsonResponse({ slug, markdown }, 200, { 'Cache-Control': 'private, no-store' });
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonResponse({ error: { code: error.code, message: error.message } }, error.status);
    }
    console.error('[paid-content] failed to load article', error);
    return jsonResponse(
      { error: { code: 'CONTENT_UNAVAILABLE', message: '內容暫時無法載入，請稍後再試。' } },
      503,
    );
  }
};

export default {
  fetch: handlePaidArticleRequest,
};

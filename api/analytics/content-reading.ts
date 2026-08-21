import { ApiError, assertSameOrigin, jsonResponse, readJsonBody } from '../_lib/http';
import { enforceRateLimit } from '../_lib/rateLimit';
import { getAdminClient, getOptionalAuthenticatedUser } from '../_lib/supabaseAdmin';
import { createLegacyPostHandler } from '../_lib/vercelAdapter';

type ReadingPayload = {
  contentId?: string;
  contentSlug?: string;
  accessMode?: 'public' | 'login_required' | 'paid';
  anonymousVisitorId?: string;
  sessionId?: string;
  event?: 'open' | 'progress';
  progress?: number;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'content-reading', 120, 60_000);
    const body = await readJsonBody<ReadingPayload>(request);
    const user = await getOptionalAuthenticatedUser(request);

    const contentId = body.contentId?.trim().slice(0, 120);
    const contentSlug = body.contentSlug?.trim().slice(0, 180);
    const accessMode = body.accessMode;
    const sessionId = body.sessionId?.trim();
    const progress = Math.max(0, Math.min(100, Math.round(body.progress ?? 0)));
    if (!contentId || !contentSlug || !accessMode || !sessionId || !UUID_PATTERN.test(sessionId)) {
      throw new ApiError(400, 'INVALID_READING_EVENT', '閱讀紀錄格式不正確。');
    }
    if (accessMode !== 'public' && !user) {
      throw new ApiError(401, 'LOGIN_REQUIRED', '這篇內容需要登入後閱讀。');
    }
    if (accessMode === 'paid' && user) {
      const { data: entitlement, error: entitlementError } = await getAdminClient()
        .from('member_entitlements')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_code', 'face-survival-kit')
        .eq('status', 'active')
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .maybeSingle();
      if (entitlementError) throw entitlementError;
      if (!entitlement) throw new ApiError(403, 'PAYMENT_REQUIRED', '這篇內容屬於付費方案。');
    }

    const anonymousVisitorId = user ? null : body.anonymousVisitorId?.trim();
    if (!user && (!anonymousVisitorId || !UUID_PATTERN.test(anonymousVisitorId))) {
      throw new ApiError(400, 'VISITOR_ID_REQUIRED', '缺少匿名閱讀識別碼。');
    }

    const admin = getAdminClient();
    let query = admin
      .from('content_reading_progress')
      .select('id, view_count, max_progress, completed_at, metadata')
      .eq('content_id', contentId);
    query = user
      ? query.eq('user_id', user.id)
      : query.is('user_id', null).eq('anonymous_visitor_id', anonymousVisitorId!);
    const { data: existing, error: readError } = await query.maybeSingle();
    if (readError) throw readError;

    const now = new Date().toISOString();
    const existingMetadata = existing?.metadata && typeof existing.metadata === 'object' && !Array.isArray(existing.metadata)
      ? existing.metadata as Record<string, unknown>
      : {};
    const isNewSession = existingMetadata.last_session_id !== sessionId;
    const maxProgress = Math.max(existing?.max_progress ?? 0, progress);
    const completedAt = maxProgress >= 90 ? existing?.completed_at ?? now : existing?.completed_at ?? null;
    const metadata = {
      ...existingMetadata,
      last_session_id: sessionId,
      app_version: '2.5.0',
    };

    if (existing) {
      const { error } = await admin.from('content_reading_progress').update({
        content_slug: contentSlug,
        access_mode: accessMode,
        view_count: existing.view_count + (body.event === 'open' && isNewSession ? 1 : 0),
        max_progress: maxProgress,
        last_viewed_at: now,
        completed_at: completedAt,
        metadata,
      }).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await admin.from('content_reading_progress').insert({
        content_id: contentId,
        content_slug: contentSlug,
        access_mode: accessMode,
        user_id: user?.id ?? null,
        anonymous_visitor_id: anonymousVisitorId ?? null,
        view_count: 1,
        max_progress: maxProgress,
        first_viewed_at: now,
        last_viewed_at: now,
        completed_at: completedAt,
        metadata,
      });
      if (error) throw error;
    }

    return jsonResponse({ recorded: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonResponse({ error: { code: error.code, message: error.message } }, error.status);
    }

    console.error('[content-reading] failed to persist progress', error);
    return jsonResponse(
      { error: { code: 'ANALYTICS_UNAVAILABLE', message: '暫時無法記錄閱讀進度。' } },
      503,
    );
  }
}

export default createLegacyPostHandler(POST);

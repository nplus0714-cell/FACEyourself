import { ApiError, assertSameOrigin, jsonResponse, readJsonBody } from '../_lib/http.js';
import { enforceRateLimit } from '../_lib/rateLimit.js';
import { getAdminClient, getOptionalAuthenticatedUser } from '../_lib/supabaseAdmin.js';

type NpcQuestionPayload = {
  email?: unknown;
  message?: unknown;
  faceCode?: unknown;
  source?: unknown;
  consent?: unknown;
  website?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FACE_CODE_PATTERN = /^[AP][RI][LT][CD]$/;

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'npc-question', 5, 60 * 60_000);

    const body = await readJsonBody<NpcQuestionPayload>(request, 5_120);
    // Honeypot submissions get a success response but are never stored.
    if (text(body.website)) return jsonResponse({ submitted: true });

    const email = text(body.email).toLowerCase();
    const message = text(body.message);
    const faceCode = text(body.faceCode).toUpperCase();
    const source = text(body.source || 'face-result');

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      throw new ApiError(400, 'INVALID_EMAIL', '請確認 Email 格式是否正確。');
    }
    if (!message) throw new ApiError(400, 'MESSAGE_REQUIRED', '請先寫下想和 NPC 說的話。');
    if (message.length > 4_000) throw new ApiError(400, 'MESSAGE_TOO_LONG', '內容請控制在 4,000 個字以內。');
    if (!FACE_CODE_PATTERN.test(faceCode)) throw new ApiError(400, 'INVALID_FACE_CODE', '測驗結果無法辨識，請重新整理後再試。');
    if (!source || source.length > 100) throw new ApiError(400, 'INVALID_SOURCE', '送出來源格式不正確。');
    if (body.consent !== true) throw new ApiError(400, 'CONSENT_REQUIRED', '請先同意依隱私權政策處理你的留言。');

    const user = await getOptionalAuthenticatedUser(request);
    const { error } = await getAdminClient()
      .from('npc_questions')
      .insert({
        email,
        message,
        face_code: faceCode,
        source,
        user_id: user?.id ?? null,
        consent_version: 'npc-question-v1',
      });
    if (error) throw error;

    return jsonResponse({ submitted: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonResponse({ error: { code: error.code, message: error.message } }, error.status);
    }
    console.error('[npc-questions] failed to submit question', error);
    return jsonResponse(
      { error: { code: 'NPC_UNAVAILABLE', message: '目前無法送出，請稍後再試。' } },
      503,
    );
  }
}

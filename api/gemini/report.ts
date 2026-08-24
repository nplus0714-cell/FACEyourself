import { Type } from '@google/genai';
import {
  GEMINI_HTTP_OPTIONS,
  GEMINI_TEXT_MODEL,
  getGeminiClient,
} from '../_lib/gemini.js';
import {
  ApiError,
  assertSameOrigin,
  handleApiError,
  jsonResponse,
  readJsonBody,
} from '../_lib/http.js';
import { enforceRateLimit } from '../_lib/rateLimit.js';
import {
  parseFaceScores,
  parseProfile,
  validateReport,
} from '../_lib/validation.js';

interface ReportRequest {
  daily?: unknown;
  dna?: unknown;
  profile?: unknown;
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'gemini-report', 3, 5 * 60_000);

    const body = await readJsonBody<ReportRequest>(request);
    if (!body || typeof body !== 'object') {
      throw new ApiError(400, 'INVALID_REPORT_INPUT', '報告資料格式不正確。');
    }

    const dna = parseFaceScores(body.dna, true);
    const daily = parseFaceScores(body.daily, false);
    const profile = parseProfile(body.profile);

    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `您是一位精通行為金融學與禪修的心理教育內容作者。
使用者的 FACE 投資行為風格為「${profile.name}（${profile.code}）」。
基準分數：${JSON.stringify(dna)}
今日覺察分數：${JSON.stringify(daily)}
請比較兩組數據並產出「偏移建議報告」，強調覺察與自我觀察。
不得將內容描述為心理診斷，也不得提供個人化買賣、槓桿、商品或部位配置建議。`,
      config: {
        httpOptions: GEMINI_HTTP_OPTIONS,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            soulPortrait: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                motto: { type: Type.STRING },
              },
              required: ['description', 'motto'],
            },
            innerPain: { type: Type.STRING },
            blindSpot: { type: Type.STRING },
            zenSolution: { type: Type.STRING },
            antiHangover: {
              type: Type.OBJECT,
              properties: {
                mindset: { type: Type.STRING },
                lifesaver: { type: Type.STRING },
                blessing: { type: Type.STRING },
                micro: { type: Type.STRING },
              },
              required: ['mindset', 'lifesaver', 'blessing', 'micro'],
            },
          },
          required: [
            'soulPortrait',
            'innerPain',
            'blindSpot',
            'zenSolution',
            'antiHangover',
          ],
        },
        maxOutputTokens: 2_000,
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || 'null') as unknown;
    return jsonResponse({ report: validateReport(parsed) });
  } catch (error) {
    return handleApiError(error);
  }
}

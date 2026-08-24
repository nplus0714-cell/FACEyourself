import { Type } from '@google/genai';
import {
  GEMINI_HTTP_OPTIONS,
  GEMINI_SEARCH_MODEL,
  getGeminiClient,
} from '../_lib/gemini.js';
import {
  assertSameOrigin,
  handleApiError,
  jsonResponse,
  readJsonBody,
} from '../_lib/http.js';
import { enforceRateLimit } from '../_lib/rateLimit.js';
import { validateQuestions } from '../_lib/validation.js';

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'gemini-market-questions', 2, 5 * 60_000);
    await readJsonBody<unknown>(request, 256);

    const requestedAt = new Date().toISOString();
    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_SEARCH_MODEL,
      contents: `現在時間是 ${requestedAt}。請搜尋台股（TWSE）與主要美股最近一個已收盤交易日的盤勢、熱門板塊與市場情緒。
若台股今日休市，必須改用最近一個交易日，並在題目內清楚寫出日期，不得假裝今日有交易。
根據可驗證的市場現象，為「投資人格日記」產生 5 個今日覺察題目。
題目配額必須是：FOCUS 2 題、ANALYSIS 1 題、CYCLE 1 題、EXPOSURE 1 題。
pair 必須分別使用 FOCUS=[A,P]、ANALYSIS=[R,I]、CYCLE=[L,T]、EXPOSURE=[C,D]。
每題只能有 A、B 兩個選項；內容用於自我覺察，不得提供買賣建議。`,
      config: {
        httpOptions: GEMINI_HTTP_OPTIONS,
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              pair: { type: Type.ARRAY, items: { type: Type.STRING } },
              category: { type: Type.STRING },
              text: {
                type: Type.STRING,
                description: '包含交易日期與可驗證市場現象的覺察問題',
              },
              labels: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '長度必須為 2，分別對應 A 與 B',
              },
            },
            required: ['id', 'pair', 'category', 'text', 'labels'],
          },
        },
        maxOutputTokens: 1_500,
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || 'null') as unknown;
    return jsonResponse({ questions: validateQuestions(parsed) });
  } catch (error) {
    return handleApiError(error);
  }
}

import {
  GEMINI_HTTP_OPTIONS,
  GEMINI_TEXT_MODEL,
  getGeminiClient,
} from '../_lib/gemini';
import {
  assertSameOrigin,
  handleApiError,
  jsonResponse,
  readJsonBody,
} from '../_lib/http';
import { enforceRateLimit } from '../_lib/rateLimit';
import { parseDrinkId } from '../_lib/validation';

const DRINKS = {
  fomo: {
    name: 'FOMO 特調',
    prompt: '我感到 FOMO（錯失恐懼），看著別人的標的狂飆而我的沒動，我感到焦慮。請給我一段極具禪意且富有哲理的寬慰與建議，字數約 120 字。',
  },
  loss: {
    name: '回撤苦艾酒',
    prompt: '我的帳面正在回撤，我感到心跳加速與不安。請以一位智慧長者的口吻，給我一段關於波動與價值的對話，字數約 120 字。',
  },
  doubt: {
    name: '自我懷疑補藥',
    prompt: '我連續交易失利，開始懷疑自己的判斷與能力。請給我一段充滿力量但溫柔的鼓勵，告訴我如何與挫折共處，字數約 120 字。',
  },
  greed: {
    name: '貪婪解毒水',
    prompt: '我發現自己變得很貪婪，不斷想加大槓桿，停不下來。請給我一段嚴肅但慈悲的警示，讓我清醒過來，字數約 120 字。',
  },
} as const;

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'gemini-bar', 5, 60_000);

    const body = await readJsonBody<unknown>(request, 1_024);
    const drinkId = parseDrinkId(body);
    const drink = DRINKS[drinkId as keyof typeof DRINKS];
    if (!drink) {
      return jsonResponse(
        { error: { code: 'INVALID_DRINK', message: '請選擇有效的特調。' } },
        400,
      );
    }

    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `您是一位在深山經營「交易解憂酒吧」的禪修大師。現在一位投資者點了「${drink.name}」。
請針對他的內心苦處提供禪宗式的指引：${drink.prompt}
文案風格：極致優雅、詩意、冷靜，且最後提供一個簡單的「當下動作」來平復心境。
這是一般教育性與自我覺察內容，不得提供個人化買賣、槓桿或部位建議。`,
      config: {
        httpOptions: GEMINI_HTTP_OPTIONS,
        maxOutputTokens: 500,
        temperature: 0.8,
      },
    });

    const text = response.text?.trim();
    if (!text || text.length > 2_000) {
      throw new Error('Gemini returned an invalid bar response');
    }

    return jsonResponse({ text });
  } catch (error) {
    return handleApiError(error);
  }
}

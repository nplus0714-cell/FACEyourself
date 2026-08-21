import { Type } from '@google/genai';
import {
  GEMINI_HTTP_OPTIONS,
  GEMINI_TEXT_MODEL,
  getGeminiClient,
} from '../_lib/gemini';
import {
  ApiError,
  assertSameOrigin,
  handleApiError,
  jsonResponse,
  readJsonBody,
} from '../_lib/http';
import { enforceRateLimit } from '../_lib/rateLimit';
import { createLegacyPostHandler } from '../_lib/vercelAdapter';

interface DailyAwarenessRequest {
  answers?: unknown;
}

const OPTION_LABELS: Record<string, Record<string, string>> = {
  market: {
    strong_up: '明顯上漲', up: '小幅上漲', flat: '平盤震盪', down: '小幅下跌',
    strong_down: '明顯下跌', unknown: '今天沒有留意這項商品',
  },
  q2: {
    calm: '平靜', curious: '好奇', uncertain: '沒底', tense: '緊繃', regretful: '懊悔',
    unwilling: '不甘心', excited: '興奮', confident: '有把握', fomo: '怕錯過',
    recoup: '想追回', prove: '想證明', pause: '想暫停', none: '沒有明顯感覺',
  },
  q3: {
    '1': '幾乎沒有影響', '2': '忍不住多看幾眼', '3': '注意力常被拉回行情',
    '4': '開始改變原本判斷', '5': '很想立刻做點什麼',
  },
  q4: {
    A: '可以清楚寫出原本設定的條件',
    B: '大方向說得出來，但中間有一些臨時調整',
    C: '當時就是覺得應該做點什麼',
    D: '事後回頭看，也不太確定當時為什麼這樣決定',
  },
  q5: {
    downside_concern: '擔心風險繼續往不利方向擴大',
    judgment_challenged: '原本的判斷可能需要被重新檢查',
    missed_opportunity: '一個本來可以參與的機會跑掉',
    loss_attachment: '已經發生的損失或獲利回吐',
    uncertainty: '不確定接下來會發生什麼',
    no_dominant_pull: '今天沒有特別放不下的事',
    opportunity_excitement: '今天走勢讓我覺得機會正在變好',
    confidence_rising: '最近判斷滿順，想把握更多機會',
  },
  q6: {
    none: '今天沒有查看', as_planned: '只在原定時間查看',
    slightly_more: '比原定多看了 1～3 次', much_more: '明顯比原定更頻繁',
    continuous: '幾乎一直盯著，很難停下來',
  },
  q7: {
    same: '會，原本的交易條件沒有改變',
    mostly_same: '大致會，但時間或部位可能不同',
    unsure: '不確定，我是邊看行情邊決定',
    probably_not: '可能不會，今天的走勢明顯影響了我',
    would_not: '不會，我主要是看到價格變化後才行動',
  },
  q8: {
    followed_plan: '所有決定都照原計畫', no_trade: '今天沒有交易',
    early_entry: '比原定時間更早進場', unplanned_entry: '原本不打算買，後來買了',
    chased_price: '追價', oversized: '部位加到超過原本計畫', reduced: '減少部位',
    early_exit: '提前出場或停損', delayed_exit: '延後原本的停損或出場',
    cancelled_trade: '取消原本打算做的交易', rapid_reentry: '停損後短時間再次進場',
    decision_burst: '短時間內做了比平常更多決定', paused_trading: '主動停止後續交易', other: '其他',
  },
  q8_plan: {
    '0': '完全在計畫內', '1': '條件符合，但時間或部位有小幅調整',
    '2': '大方向相同，但不是原本設定好的做法', '3': '多數是盤中臨時決定',
    '4': '和原本計畫相反，或取消了原本紀律', none: '今天開始前沒有設定明確計畫',
  },
};

const LIMITS: Record<string, number> = {
  market: 1, q2: 3, q3: 1, q4: 1, q5: 3, q6: 1, q7: 1, q8: 5, q8_plan: 1,
};

const parseAnswers = (value: unknown): Record<string, string[]> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError(400, 'INVALID_DAILY_ANSWERS', '覺察答案格式不正確。');
  }

  const source = value as Record<string, unknown>;
  const parsed: Record<string, string[]> = {};
  for (const [questionId, labels] of Object.entries(OPTION_LABELS)) {
    const selected = source[questionId];
    if (!Array.isArray(selected) || selected.length < 1 || selected.length > LIMITS[questionId]) {
      throw new ApiError(400, 'INCOMPLETE_DAILY_ANSWERS', '覺察答案尚未完成。');
    }
    if (!selected.every((id) => typeof id === 'string' && Object.hasOwn(labels, id))) {
      throw new ApiError(400, 'INVALID_DAILY_OPTION', '覺察選項不正確。');
    }
    parsed[questionId] = selected as string[];
  }
  return parsed;
};

const FACE_DAILY_PROMPT = `你是 FACE Daily 交易自我覺察引導員。你的任務不是評論交易做得對不對，也不是心理診斷，而是根據八題回答找出共同指向的心理狀態，寫出一段溫暖、克制、有洞察力的繁體中文，幫助使用者看見今天真正影響自己的可能是什麼。

核心理念：情緒本身沒有對錯；真正值得覺察的是，情緒出現之後，有沒有開始改變原本的判斷與行為。

判讀順序：
1. Q1 只作為上漲、下跌、震盪或無明確刺激的市場背景，不可單獨推論心理。
2. 交叉判讀 Q2 與 Q5，找出最主要的一個心理拉力：避免失去、害怕錯過、挽回損失、證明自己、尋求控制、放大獎賞、等待耗損、逃避決定，或穩定執行。不要在輸出中顯示分類名稱。
3. 依 Q3、Q4、Q6、Q7、Q8 判斷拉力目前只有感受、開始拉扯注意力、開始改變判斷，或已開始影響行動。不要將任何層次寫成失敗、失控或犯錯。
4. 找出一個最有解釋力的共同點，不可逐題重述答案。

重要規則：
- 情緒存在但仍照計畫行動時，要指出情緒沒有替使用者做決定，不要把沒有情緒當成理想。
- 停損、提前出場、減碼、不交易、增加部位或頻繁看盤不能單獨視為負面；只有原計畫明顯不同、理由模糊、行情改寫條件，且情緒與行為一致時，才能推論心理拉力開始影響決策。
- 語氣溫暖、平靜、成人、像一面鏡子；有洞察但不說教、不雞湯、不製造罪惡感、不使用臨床診斷語言，也不假裝知道絕對真相。
- 多使用「可能」「比較像是」「值得留意的是」「也許真正拉著你的不是」「你可以看看」「今天值得記住的是」。
- 禁止使用「你就是」「你一定」「你太」「你應該」「你不夠」「你失控了」「你情緒化」「你犯錯了」「你必須改掉」。
- 最終只寫一段約 100～150 個繁體中文字；不要顯示分析、題號、分數、心理分類或標籤。`;

const formatAnswers = (answers: Record<string, string[]>): string => {
  const titles: Record<string, string> = {
    market: 'Q1 商品表現', q2: 'Q2 今日感受', q3: 'Q3 注意力強度', q4: 'Q4 操作理由',
    q5: 'Q5 注意力拉力來源', q6: 'Q6 看盤頻率', q7: 'Q7 行情影響',
    q8: 'Q8 實際行動', q8_plan: 'Q8 行動與原計畫接近程度',
  };
  return Object.keys(OPTION_LABELS)
    .map((questionId) => `${titles[questionId]}：${answers[questionId].map((id) => OPTION_LABELS[questionId][id]).join('、')}`)
    .join('\n');
};

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'gemini-daily-awareness', 8, 10 * 60_000);
    const body = await readJsonBody<DailyAwarenessRequest>(request, 12_000);
    const answers = parseAnswers(body?.answers);

    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `${FACE_DAILY_PROMPT}\n\n以下是使用者今天的回答：\n${formatAnswers(answers)}`,
      config: {
        httpOptions: GEMINI_HTTP_OPTIONS,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: { reflectionText: { type: Type.STRING } },
          required: ['reflectionText'],
        },
        maxOutputTokens: 420,
        temperature: 0.55,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || 'null') as { reflectionText?: unknown } | null;
    const reflectionText = typeof parsed?.reflectionText === 'string' ? parsed.reflectionText.trim() : '';
    const length = Array.from(reflectionText.replace(/\s/g, '')).length;
    if (length < 70 || length > 220) throw new Error('Gemini returned an invalid daily reflection');
    return jsonResponse({ reflectionText });
  } catch (error) {
    return handleApiError(error);
  }
}

export default createLegacyPostHandler(POST);

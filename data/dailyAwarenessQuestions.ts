import type {
  DailyAwarenessPatternCode,
  DailyAwarenessResult,
  DailyAwarenessStateCode,
  DailyAwarenessStatusCode,
} from './dailyAwarenessPreview';

export type DailyQuestionKind = 'single' | 'multi' | 'scale' | 'actions-plan';

export interface DailyAwarenessOption {
  id: string;
  label: string;
  exclusive?: boolean;
  emotionWeight?: number;
  actionIntensity?: number;
  pattern?: Partial<Record<DailyAwarenessStateCode, number>>;
}

export interface DailyAwarenessQuestion {
  id: string;
  eyebrow: string;
  prompt: string;
  hint: string;
  kind: DailyQuestionKind;
  maxSelections: number;
  options: DailyAwarenessOption[];
  planPrompt?: string;
  planOptions?: DailyAwarenessOption[];
}

export const DAILY_AWARENESS_VERSION = 'face-daily-v1.2';

export const MARKET_CONTEXT_QUESTION: DailyAwarenessQuestion = {
  id: 'market',
  eyebrow: '01 · 商品表現',
  prompt: '今天你主要關注的商品，表現比較接近哪一種？',
  hint: '以今天最常關注或主要持有的商品為準；只記錄實際走勢，不需要猜明天',
  kind: 'single',
  maxSelections: 1,
  options: [
    { id: 'strong_up', label: '明顯上漲' },
    { id: 'up', label: '小幅上漲' },
    { id: 'flat', label: '平盤震盪' },
    { id: 'down', label: '小幅下跌' },
    { id: 'strong_down', label: '明顯下跌' },
    { id: 'unknown', label: '今天沒有留意這項商品' },
  ],
};

export const DAILY_AWARENESS_QUESTIONS: DailyAwarenessQuestion[] = [
  {
    id: 'q2', eyebrow: '02 · 今日感受', prompt: '哪些字最接近你今天面對市場的感覺？', hint: '感受和念頭可能同時出現，最多選 3 個', kind: 'multi', maxSelections: 3,
    options: [
      { id: 'calm', label: '平靜', emotionWeight: 0, pattern: { steady: 1 } },
      { id: 'curious', label: '好奇', emotionWeight: 1, pattern: { watching: 1 } },
      { id: 'uncertain', label: '沒底', emotionWeight: 1, pattern: { guarded: 1 } },
      { id: 'tense', label: '緊繃', emotionWeight: 2, pattern: { guarded: 1 } },
      { id: 'regretful', label: '懊悔', emotionWeight: 2, pattern: { attached: 1 } },
      { id: 'unwilling', label: '不甘心', emotionWeight: 3, pattern: { attached: 1, chasing: 1 } },
      { id: 'excited', label: '興奮', emotionWeight: 2, pattern: { chasing: 1 } },
      { id: 'confident', label: '有把握', emotionWeight: 1, pattern: { chasing: 1 } },
      { id: 'fomo', label: '怕錯過', emotionWeight: 3, pattern: { chasing: 1 } },
      { id: 'recoup', label: '想追回', emotionWeight: 3, pattern: { chasing: 1 } },
      { id: 'prove', label: '想證明', emotionWeight: 3, pattern: { attached: 1 } },
      { id: 'pause', label: '想暫停', emotionWeight: 1, pattern: { resetting: 1 } },
      { id: 'none', label: '沒有明顯感覺', emotionWeight: 0, pattern: { steady: 1 }, exclusive: true },
    ],
  },
  {
    id: 'q3', eyebrow: '03 · 波動程度', prompt: '今天的盤勢波動，會讓你……？', hint: '選擇最接近今天整體狀態的程度', kind: 'scale', maxSelections: 1,
    options: [
      { id: '1', label: '幾乎沒有影響' },
      { id: '2', label: '忍不住多看幾眼' },
      { id: '3', label: '注意力常被拉回行情' },
      { id: '4', label: '開始改變原本判斷' },
      { id: '5', label: '很想立刻做點什麼' },
    ],
  },
  {
    id: 'q4', eyebrow: '04 · 操作理由', prompt: '你有辦法清楚表達今天操作或不操作的理由嗎？', hint: '請選最接近今天實際狀況的一項', kind: 'single', maxSelections: 1,
    options: [
      { id: 'A', label: '可以清楚寫出原本設定的條件' },
      { id: 'B', label: '大方向說得出來，但中間有一些臨時調整' },
      { id: 'C', label: '當時就是覺得應該做點什麼' },
      { id: 'D', label: '事後回頭看，也不太確定當時為什麼這樣決定' },
    ],
  },
  {
    id: 'q5', eyebrow: '05 · 注意力拉力', prompt: '今天最影響你注意力的，可能是以下哪些事？', hint: '可以同時有不同拉力，最多選 3 個', kind: 'multi', maxSelections: 3,
    options: [
      { id: 'downside_concern', label: '擔心風險繼續往不利方向擴大', pattern: { guarded: 2 } },
      { id: 'judgment_challenged', label: '原本的判斷可能需要被重新檢查', pattern: { attached: 2 } },
      { id: 'missed_opportunity', label: '一個本來可以參與的機會跑掉', pattern: { chasing: 2 } },
      { id: 'loss_attachment', label: '已經發生的損失或獲利回吐', pattern: { attached: 2 } },
      { id: 'uncertainty', label: '不確定接下來會發生什麼', pattern: { guarded: 2 } },
      { id: 'no_dominant_pull', label: '今天沒有特別放不下的事', pattern: { steady: 2 }, exclusive: true },
      { id: 'opportunity_excitement', label: '今天走勢讓我覺得機會正在變好', pattern: { chasing: 2 } },
      { id: 'confidence_rising', label: '最近判斷滿順，想把握更多機會', pattern: { chasing: 2 } },
    ],
  },
  {
    id: 'q6', eyebrow: '06 · 看盤頻率', prompt: '和你的交易週期及原定計畫相比，今天查看行情的頻率比較接近？', hint: '判斷的是今天有沒有比自己原本需要的更常回去看，不比較你和別人的次數', kind: 'single', maxSelections: 1,
    options: [
      { id: 'none', label: '今天沒有查看', emotionWeight: 0 },
      { id: 'as_planned', label: '只在原定時間查看', emotionWeight: 0 },
      { id: 'slightly_more', label: '比原定多看了 1～3 次', emotionWeight: 1 },
      { id: 'much_more', label: '明顯比原定更頻繁', emotionWeight: 2 },
      { id: 'continuous', label: '幾乎一直盯著，很難停下來', emotionWeight: 3 },
    ],
  },
  {
    id: 'q7', eyebrow: '07 · 行情影響', prompt: '如果今天的價格沒有這樣變化，你還會做出相同的決定嗎？', hint: '包含交易、持有、減碼或選擇不交易', kind: 'single', maxSelections: 1,
    options: [
      { id: 'same', label: '會，原本的交易條件沒有改變' },
      { id: 'mostly_same', label: '大致會，但時間或部位可能不同' },
      { id: 'unsure', label: '不確定，我是邊看行情邊決定' },
      { id: 'probably_not', label: '可能不會，今天的走勢明顯影響了我' },
      { id: 'would_not', label: '不會，我主要是看到價格變化後才行動' },
    ],
  },
  {
    id: 'q8', eyebrow: '08 · 實際行動', prompt: '今天實際發生了哪些事？', hint: '先勾選事實，再確認是否符合原計畫', kind: 'actions-plan', maxSelections: 5,
    options: [
      { id: 'followed_plan', label: '所有決定都照原計畫', actionIntensity: 0, pattern: { steady: 3 }, exclusive: true },
      { id: 'no_trade', label: '今天沒有交易', actionIntensity: 0 },
      { id: 'early_entry', label: '比原定時間更早進場', actionIntensity: 2, pattern: { chasing: 3 } },
      { id: 'unplanned_entry', label: '原本不打算買，後來買了', actionIntensity: 3, pattern: { chasing: 3 } },
      { id: 'chased_price', label: '追價', actionIntensity: 3, pattern: { chasing: 3 } },
      { id: 'oversized', label: '部位加到超過原本計畫', actionIntensity: 4, pattern: { chasing: 3 } },
      { id: 'reduced', label: '減少部位', actionIntensity: 2, pattern: { guarded: 3 } },
      { id: 'early_exit', label: '提前出場或停損', actionIntensity: 2, pattern: { guarded: 3 } },
      { id: 'delayed_exit', label: '延後原本的停損或出場', actionIntensity: 4, pattern: { attached: 3 } },
      { id: 'cancelled_trade', label: '取消原本打算做的交易', actionIntensity: 2, pattern: { guarded: 3 } },
      { id: 'rapid_reentry', label: '停損後短時間再次進場', actionIntensity: 4, pattern: { chasing: 3 } },
      { id: 'decision_burst', label: '短時間內做了比平常更多決定', actionIntensity: 4, pattern: { chasing: 3 } },
      { id: 'paused_trading', label: '主動停止後續交易', actionIntensity: 2, pattern: { resetting: 3 } },
      { id: 'other', label: '其他', actionIntensity: 0 },
    ],
    planPrompt: '這些行動和你今天原本的交易計畫有多接近？',
    planOptions: [
      { id: '0', label: '完全在計畫內' },
      { id: '1', label: '條件符合，但時間或部位有小幅調整' },
      { id: '2', label: '大方向相同，但不是原本設定好的做法' },
      { id: '3', label: '多數是盤中臨時決定' },
      { id: '4', label: '和原本計畫相反，或取消了原本紀律' },
      { id: 'none', label: '今天開始前沒有設定明確計畫' },
    ],
  },
];

export const DAILY_AWARENESS_STEPS = [MARKET_CONTEXT_QUESTION, ...DAILY_AWARENESS_QUESTIONS];

export type DailyAwarenessAnswers = Record<string, string[]>;

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const round = (value: number) => Math.round(clamp(value));
const level = (value: number) => value < 40 ? '低' : value <= 60 ? '中' : '高';

const averageEmotionWeight = (questionId: 'q2', answers: DailyAwarenessAnswers) => {
  const question = DAILY_AWARENESS_QUESTIONS.find((item) => item.id === questionId)!;
  const weights = (answers[questionId] ?? []).map((id) => question.options.find((option) => option.id === id)?.emotionWeight ?? 0);
  if (!weights.length) return 0;
  return weights.reduce((sum, value) => sum + value, 0) / weights.length / 3 * 100;
};

const addPatternEvidence = (
  scores: Record<DailyAwarenessStateCode, number>,
  option?: DailyAwarenessOption,
  oncePerPattern = false,
  seen?: Set<DailyAwarenessStateCode>,
) => {
  Object.entries(option?.pattern ?? {}).forEach(([code, points]) => {
    const pattern = code as DailyAwarenessStateCode;
    if (oncePerPattern && seen?.has(pattern)) return;
    scores[pattern] += points ?? 0;
    seen?.add(pattern);
  });
};

const inferPattern = (answers: DailyAwarenessAnswers, emotionScore: number, actionScore: number): DailyAwarenessPatternCode => {
  const scores: Record<DailyAwarenessStateCode, number> = {
    steady: 0, watching: 0, chasing: 0, attached: 0, guarded: 0, resetting: 0,
  };

  ['q2', 'q5'].forEach((questionId) => {
    const question = DAILY_AWARENESS_QUESTIONS.find((item) => item.id === questionId)!;
    (answers[questionId] ?? []).forEach((id) => addPatternEvidence(scores, question.options.find((option) => option.id === id)));
  });

  const q8 = DAILY_AWARENESS_QUESTIONS.find((item) => item.id === 'q8')!;
  const q8Seen = new Set<DailyAwarenessStateCode>();
  (answers.q8 ?? []).forEach((id) => addPatternEvidence(scores, q8.options.find((option) => option.id === id), true, q8Seen));

  const planValue = answers.q8_plan?.[0];
  if ((planValue === '0' || planValue === '1') && (answers.q8 ?? []).includes('paused_trading')) scores.resetting += 1;
  if ((planValue !== '0' && planValue !== '1') && scores.resetting) scores.resetting = 0;
  if (emotionScore < 40 && actionScore < 40) scores.steady += 1;

  const max = Math.max(...Object.values(scores));
  if (max < 4) return emotionScore < 40 && actionScore < 40 ? 'steady' : 'mixed';
  const winners = (Object.keys(scores) as DailyAwarenessStateCode[]).filter((code) => scores[code] === max);
  return winners.length === 1 ? winners[0] : 'mixed';
};

const inferStatus = (dailyDeviation: number, emotionScore: number, actionScore: number, actionBaselineMissing: boolean): DailyAwarenessStatusCode => {
  let status: DailyAwarenessStatusCode = dailyDeviation <= 20
    ? 'stable'
    : dailyDeviation <= 40
      ? 'fluctuating'
      : dailyDeviation <= 60
        ? 'conflicted'
        : dailyDeviation <= 80
          ? 'deviated'
          : 'pause_needed';

  if (!actionBaselineMissing && actionScore >= 60 && (status === 'stable' || status === 'fluctuating' || status === 'conflicted')) status = 'deviated';
  if (!actionBaselineMissing && actionScore >= 80 && (emotionScore >= 60 || dailyDeviation >= 80)) status = 'pause_needed';
  return status;
};

const MARKET_LABEL: Record<string, string> = {
  strong_up: '明顯上漲', up: '小幅上漲', flat: '平盤震盪', down: '小幅下跌', strong_down: '明顯下跌', unknown: '未記錄',
};

const STATUS_LABEL: Record<DailyAwarenessStatusCode, string> = {
  stable: '穩定', fluctuating: '有波動', conflicted: '拉扯', deviated: '偏離', pause_needed: '需要暫停', not_observed: '尚未觀察',
};

const PATTERN_LABEL: Record<DailyAwarenessPatternCode, string> = {
  steady: '節奏清楚', watching: '等待條件', chasing: '急著追回', attached: '還沒放下', guarded: '先保護自己', resetting: '暫停重整', mixed: '多重拉扯',
};

const PULL_QUESTION: Record<string, string> = {
  downside_concern: '我的退出理由真的改變了，還是只有價格改變了？',
  judgment_challenged: '我現在是在更新判斷，還是在急著證明原本沒有錯？',
  missed_opportunity: '如果它現在沒有上漲，我還會想參與嗎？',
  loss_attachment: '如果沒有上一筆結果，我還會做下一個決定嗎？',
  uncertainty: '我是在補足資訊，還是在用資訊安撫不確定？',
  no_dominant_pull: '今天我做對了哪一個沒有被市場拉走的決定？',
  opportunity_excitement: '機會真的變好，還是只是價格變得更吸引我？',
  confidence_rising: '我是看見條件變好，還是因為最近太順而放寬標準？',
};

const inferExpectationMindset = (market: string, pattern: DailyAwarenessPatternCode, priceInfluenceCode: string) => {
  const positive = market === 'up' || market === 'strong_up';
  const negative = market === 'down' || market === 'strong_down';
  const activated = pattern === 'chasing' || pattern === 'attached' || pattern === 'mixed';
  const defensive = pattern === 'guarded' || pattern === 'resetting';

  let base: string;
  if (market === 'unknown') base = '今天缺少主要商品的走勢背景；從你的答案看，你可能期待市場給出更清楚、可掌握的訊號。';
  else if (positive && activated) base = '你可能原本期待上漲仍有參與空間；行情走高後，注意力逐漸轉向「不能落後」或「還能不能跟上」。';
  else if (positive && defensive) base = '你可能沒有完全預期漲勢的速度或持續性；行情走高後，追高與錯過的風險感同時被放大。';
  else if (positive) base = '你可能已把上漲列為可接受情境，因此仍願意等待條件，不急著跟隨價格。';
  else if (negative && defensive) base = '你可能原本期待風險仍在可控範圍；下跌後，保護部位與暫停行動的需要變得更明顯。';
  else if (negative && activated) base = '你可能原本期待行情修復、或至少不要繼續轉弱；下跌後，更容易出現想追回或改寫結果的拉力。';
  else if (negative) base = '你可能已預留回檔的可能，因此今天的下跌沒有明顯改變原本節奏。';
  else if (activated) base = '你可能原本期待行情更快表態；缺乏方向時，注意力更容易轉向錯過、等待或想先做點什麼。';
  else if (defensive) base = '你可能期待市場給出更清楚的方向；盤整中的不確定讓你更傾向先保護自己。';
  else base = '你可能原本就接受震盪或等待情境，因此仍把焦點放在條件是否完整。';

  if (priceInfluenceCode === 'probably_not' || priceInfluenceCode === 'would_not') return `${base} 你也表示今天的價格變化明顯改變了決定，因此這段預期線索的可信度較高。`;
  if (priceInfluenceCode === 'unsure') return `${base} 你是在行情發展中逐步決定，代表原計畫與即時價格之間仍有拉扯。`;
  if (priceInfluenceCode === 'same') return `${base} 不過你的原始交易條件並未因此改變，今天更像是有感受、但決定仍由計畫主導。`;
  return base;
};

const buildSummary = (emotionScore: number, actionScore: number, actionBaselineMissing: boolean) => {
  if (actionBaselineMissing) return '今天記錄到你的感受、念頭與行動變化；但因為開始前沒有設定清楚的交易基準，這次先不判斷是否偏離計畫。';
  if (emotionScore >= 61 && actionScore < 40) return '今天的內在波動很明顯，但你沒有直接讓感覺替你行動。市場拉動了你，還沒有完全打亂你的計畫。';
  if (emotionScore < 40 && actionScore >= 61) return '你未必感受到強烈情緒，但部分行動已先離開原本計畫。這種安靜的偏離同樣值得留下紀錄。';
  if (emotionScore >= 61 && actionScore >= 61) return '今天的內在拉力與行動偏離正在互相放大。先暫停增加新決定，比急著修正結果更重要。';
  if (emotionScore < 40 && actionScore < 40) return '今天的內在與行動大致仍在可掌握範圍，你有感受到市場，但仍留在自己的交易節奏裡。';
  return '今天市場有拉動你，你也在原計畫與當下感受之間來回；目前最重要的是看清哪一個念頭開始改變行動。';
};

export const scoreDailyAwareness = (answers: DailyAwarenessAnswers, faceCode = 'ARTC'): DailyAwarenessResult => {
  const feelingScore = averageEmotionWeight('q2', answers);
  const intensityScore = ((Number(answers.q3?.[0] ?? 1) - 1) / 4) * 100;
  const clarityScore = ({ A: 0, B: 1, C: 2, D: 3 }[answers.q4?.[0] ?? 'A'] ?? 0) / 3 * 100;
  const checkFrequencyCode = answers.q6?.[0] ?? 'none';
  const checkFrequencyScore = ({ none: 0, as_planned: 0, slightly_more: 33, much_more: 67, continuous: 100 }[checkFrequencyCode] ?? 0);
  const emotionScore = round(0.35 * feelingScore + 0.30 * intensityScore + 0.15 * clarityScore + 0.20 * checkFrequencyScore);

  const q8 = DAILY_AWARENESS_QUESTIONS.find((item) => item.id === 'q8')!;
  const actionIntensity = Math.max(0, ...(answers.q8 ?? []).map((id) => q8.options.find((option) => option.id === id)?.actionIntensity ?? 0));
  const actionStrength = actionIntensity / 4 * 100;
  const planRaw = answers.q8_plan?.[0];
  const actionBaselineMissing = planRaw === 'none' || planRaw === undefined;
  const planDeviation = actionBaselineMissing ? null : Number(planRaw) / 4 * 100;
  const baseActionScore = actionBaselineMissing
    ? actionStrength
    : 0.70 * (planDeviation ?? 0) + 0.30 * (actionStrength * (planDeviation ?? 0) / 100);
  const priceInfluenceCode = answers.q7?.[0] ?? 'unsure';
  const priceInfluenceScore = ({ same: 0, mostly_same: 25, unsure: 50, probably_not: 75, would_not: 100 }[priceInfluenceCode] ?? 50);
  const actionScore = round(0.75 * baseActionScore + 0.25 * priceInfluenceScore);

  const dailyDeviation = round(0.40 * emotionScore + 0.50 * actionScore + 0.10 * (emotionScore * actionScore / 100));
  const patternCode = inferPattern(answers, emotionScore, actionScore);
  const statusCode = inferStatus(dailyDeviation, emotionScore, actionScore, actionBaselineMissing);
  const marketCode = answers.market?.[0] ?? 'unknown';
  const primaryPullCode = answers.q5?.[0] ?? 'no_dominant_pull';

  return {
    modelVersion: DAILY_AWARENESS_VERSION,
    faceCode,
    statusCode,
    statusLabel: STATUS_LABEL[statusCode],
    patternCode,
    patternLabel: PATTERN_LABEL[patternCode],
    marketCode,
    marketLabel: MARKET_LABEL[marketCode] ?? MARKET_LABEL.unknown,
    emotionScore,
    emotionLevel: level(emotionScore),
    checkFrequencyCode,
    checkFrequencyLabel: DAILY_AWARENESS_QUESTIONS.find((item) => item.id === 'q6')?.options.find((option) => option.id === checkFrequencyCode)?.label ?? '未記錄',
    actionScore,
    actionLevel: actionBaselineMissing ? '尚未建立' : level(actionScore),
    dailyDeviation,
    primaryPullCode,
    priceInfluenceCode,
    priceInfluenceLabel: DAILY_AWARENESS_QUESTIONS.find((item) => item.id === 'q7')?.options.find((option) => option.id === priceInfluenceCode)?.label ?? '未記錄',
    inferredMindset: inferExpectationMindset(marketCode, patternCode, priceInfluenceCode),
    summary: buildSummary(emotionScore, actionScore, actionBaselineMissing),
    insight: emotionScore >= 61 && actionScore < 40
      ? '有情緒，不等於已經被情緒接管。'
      : actionBaselineMissing
        ? '先建立交易前的基準，明天才看得見自己偏離了多遠。'
        : '今天的結果不判斷交易對錯，只提醒你行動是否仍由原計畫帶領。',
    reflectionQuestion: PULL_QUESTION[primaryPullCode] ?? PULL_QUESTION.no_dominant_pull,
    confidence: marketCode === 'unknown' || actionBaselineMissing ? 'low' : 'medium',
    actionBaselineMissing,
  };
};

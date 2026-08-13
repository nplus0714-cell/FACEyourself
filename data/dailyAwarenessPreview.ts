export type DailyAwarenessStateCode =
  | 'steady'
  | 'watching'
  | 'chasing'
  | 'attached'
  | 'guarded'
  | 'resetting';

export type DailyAwarenessPatternCode = DailyAwarenessStateCode | 'mixed';

export type DailyAwarenessStatusCode =
  | 'stable'
  | 'fluctuating'
  | 'conflicted'
  | 'deviated'
  | 'pause_needed'
  | 'not_observed';

export interface DailyAwarenessResult {
  modelVersion: string;
  faceCode: string;
  statusCode: DailyAwarenessStatusCode;
  statusLabel: string;
  patternCode: DailyAwarenessPatternCode;
  patternLabel: string;
  marketCode: string;
  marketLabel: string;
  emotionScore: number;
  emotionLevel: string;
  checkFrequencyCode?: string;
  checkFrequencyLabel?: string;
  priceInfluenceCode?: string;
  priceInfluenceLabel?: string;
  actionScore: number;
  actionLevel: string;
  dailyDeviation: number;
  primaryPullCode: string;
  inferredMindset: string;
  summary: string;
  insight: string;
  reflectionQuestion: string;
  confidence: 'medium' | 'low' | 'insufficient';
  actionBaselineMissing: boolean;
}

export interface DailyAwarenessState {
  code: DailyAwarenessStateCode;
  shortName: string;
  headline: string;
  summary: string;
  reminder: string;
  action: string;
  signals: [string, string];
  metrics: { tension: number; deviation: number; attachment: number; readiness: number };
}

// Legacy renderer for entries created before face-daily-v1.
export const DAILY_AWARENESS_STATES: DailyAwarenessState[] = [
  { code: 'steady', shortName: '節奏清楚', headline: '今天大致在自己的節奏裡', summary: '你有感受到市場變化，但沒有急著讓情緒替你下單。', reminder: '繼續等到熟悉的條件出現。', action: '開盤前重看一次進場條件。', signals: ['能接受市場變化', '仍照原定計畫執行'], metrics: { tension: 28, deviation: 18, attachment: 22, readiness: 86 } },
  { code: 'watching', shortName: '等待條件', headline: '今天仍在等待條件變清楚', summary: '你注意到機會，也感受到想出手的拉力，但目前仍願意保留距離。', reminder: '沒有交易也可以是一次完整決定。', action: '寫下還缺哪一個條件。', signals: ['看見機會但尚未行動', '願意重新檢查條件'], metrics: { tension: 42, deviation: 24, attachment: 35, readiness: 78 } },
  { code: 'chasing', shortName: '急著追回', headline: '今天有點急著追回結果', summary: '今天的波動讓你比平常更想快速採取行動。', reminder: '下一筆交易不需要替上一筆討回什麼。', action: '下單前先離開畫面 90 秒。', signals: ['想把結果扳回來', '出現追價或加碼衝動'], metrics: { tension: 82, deviation: 76, attachment: 68, readiness: 36 } },
  { code: 'attached', shortName: '還沒放下', headline: '今天的判斷還沒下班', summary: '交易已經結束，但注意力仍停留在錯過、賣早或做錯的那一刻。', reminder: '承認交易結束，不代表否定當時的自己。', action: '只留下一句可帶走的經驗。', signals: ['持續回想已結束的交易', '想證明原本判斷沒錯'], metrics: { tension: 66, deviation: 48, attachment: 88, readiness: 44 } },
  { code: 'guarded', shortName: '先保護自己', headline: '今天更想先保護自己', summary: '不確定感讓你更想避開風險，但保護也可能是符合計畫的決定。', reminder: '先看條件，再判斷需要多少保護。', action: '確認可承受風險與失效條件。', signals: ['擔心再次犯錯', '想降低市場曝險'], metrics: { tension: 72, deviation: 54, attachment: 58, readiness: 46 } },
  { code: 'resetting', shortName: '暫停重整', headline: '今天選擇暫停重整', summary: '你察覺狀態不適合繼續決定，並願意先停下來。', reminder: '休息也是風險管理的一部分。', action: '先確認身體與情緒，再決定是否交易。', signals: ['主動暫停操作', '讓狀態回到基準'], metrics: { tension: 58, deviation: 30, attachment: 40, readiness: 70 } },
];

export const DAILY_STATUS_META: Record<DailyAwarenessStatusCode, { label: string; description: string }> = {
  stable: { label: '穩定', description: '大致仍在自己的交易節奏裡' },
  fluctuating: { label: '有波動', description: '市場有影響，但尚未明顯改變行動' },
  conflicted: { label: '拉扯', description: '在原計畫與當下感受之間來回' },
  deviated: { label: '偏離', description: '部分行動已離開原本設定' },
  pause_needed: { label: '需要暫停', description: '情緒與行動正在互相放大' },
  not_observed: { label: '尚未觀察', description: '今天沒有足夠資料形成結論' },
};

export const getDailyAwarenessState = (code?: string | null) =>
  DAILY_AWARENESS_STATES.find((state) => state.code === code) ?? DAILY_AWARENESS_STATES[0];

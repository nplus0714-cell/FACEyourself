import { ApiError } from './http.js';

const FACE_KEYS = ['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'] as const;
const VALID_PAIRS = ['AP', 'RI', 'LT', 'CD'] as const;
const VALID_CATEGORIES = ['FOCUS', 'ANALYSIS', 'CYCLE', 'EXPOSURE'] as const;

export type FaceScorePayload = Record<(typeof FACE_KEYS)[number], number>;

export interface QuestionPayload {
  id: string;
  pair: string[];
  category: string;
  text: string;
  labels: string[];
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const isBoundedString = (
  value: unknown,
  minLength: number,
  maxLength: number,
): value is string => {
  return typeof value === 'string'
    && value.trim().length >= minLength
    && value.trim().length <= maxLength;
};

export const parseFaceScores = (
  value: unknown,
  requireDimensionTotals: boolean,
): FaceScorePayload => {
  if (!isPlainObject(value)) {
    throw new ApiError(400, 'INVALID_SCORES', 'FACE 分數格式不正確。');
  }

  const keys = Object.keys(value);
  if (keys.length !== FACE_KEYS.length || !keys.every(key => FACE_KEYS.includes(key as never))) {
    throw new ApiError(400, 'INVALID_SCORES', 'FACE 分數欄位不完整。');
  }

  const scores = {} as FaceScorePayload;
  for (const key of FACE_KEYS) {
    const score = value[key];
    if (!Number.isInteger(score) || (score as number) < 0 || (score as number) > 100) {
      throw new ApiError(400, 'INVALID_SCORES', 'FACE 分數必須是 0–100 的整數。');
    }
    scores[key] = score as number;
  }

  if (
    requireDimensionTotals
    && (
      scores.A + scores.P !== 100
      || scores.R + scores.I !== 100
      || scores.L + scores.T !== 100
      || scores.C + scores.D !== 100
    )
  ) {
    throw new ApiError(400, 'INVALID_SCORES', 'FACE 每組維度必須合計 100。');
  }

  return scores;
};

export const parseProfile = (
  value: unknown,
): { code: string; name: string } => {
  if (
    !isPlainObject(value)
    || !isBoundedString(value.code, 4, 4)
    || !/^[AP][RI][LT][CD]$/.test(value.code)
    || !isBoundedString(value.name, 1, 80)
  ) {
    throw new ApiError(400, 'INVALID_PROFILE', '人格資料格式不正確。');
  }

  return { code: value.code, name: value.name.trim() };
};

export const parseDrinkId = (value: unknown): string => {
  if (!isPlainObject(value) || typeof value.drinkId !== 'string') {
    throw new ApiError(400, 'INVALID_DRINK', '請選擇有效的特調。');
  }
  return value.drinkId;
};

export const validateQuestions = (value: unknown): QuestionPayload[] => {
  if (!Array.isArray(value) || value.length !== 5) {
    throw new Error('Gemini must return exactly five questions');
  }

  const questions = value.map((item): QuestionPayload => {
    if (
      !isPlainObject(item)
      || !isBoundedString(item.id, 1, 40)
      || !Array.isArray(item.pair)
      || item.pair.length !== 2
      || !item.pair.every(trait => typeof trait === 'string')
      || !VALID_PAIRS.includes(item.pair.join('') as never)
      || !isBoundedString(item.category, 1, 80)
      || !VALID_CATEGORIES.some(category => (item.category as string).startsWith(category))
      || !isBoundedString(item.text, 5, 300)
      || !Array.isArray(item.labels)
      || item.labels.length !== 2
      || !item.labels.every(label => isBoundedString(label, 1, 160))
    ) {
      throw new Error('Gemini returned an invalid question');
    }

    return {
      id: item.id.trim(),
      pair: item.pair,
      category: item.category.trim(),
      text: item.text.trim(),
      labels: item.labels.map(label => label.trim()),
    };
  });

  if (new Set(questions.map(question => question.id)).size !== questions.length) {
    throw new Error('Gemini returned duplicate question ids');
  }

  const categoryCounts = questions.reduce<Record<string, number>>((counts, question) => {
    const category = VALID_CATEGORIES.find(value => question.category.startsWith(value));
    if (category) counts[category] = (counts[category] ?? 0) + 1;
    return counts;
  }, {});

  if (
    categoryCounts.FOCUS !== 2
    || categoryCounts.ANALYSIS !== 1
    || categoryCounts.CYCLE !== 1
    || categoryCounts.EXPOSURE !== 1
  ) {
    throw new Error('Gemini returned an invalid FACE dimension quota');
  }

  return questions;
};

export const validateReport = (value: unknown): Record<string, unknown> => {
  if (!isPlainObject(value)) throw new Error('Gemini returned an invalid report');

  const soulPortrait = value.soulPortrait;
  const antiHangover = value.antiHangover;
  if (
    !isPlainObject(soulPortrait)
    || !isBoundedString(soulPortrait.description, 1, 1_500)
    || !isBoundedString(soulPortrait.motto, 1, 300)
    || !isBoundedString(value.innerPain, 1, 1_500)
    || !isBoundedString(value.blindSpot, 1, 1_500)
    || !isBoundedString(value.zenSolution, 1, 1_500)
    || !isPlainObject(antiHangover)
    || !isBoundedString(antiHangover.mindset, 1, 1_000)
    || !isBoundedString(antiHangover.lifesaver, 1, 1_000)
    || !isBoundedString(antiHangover.blessing, 1, 1_000)
    || !isBoundedString(antiHangover.micro, 1, 1_000)
  ) {
    throw new Error('Gemini returned an incomplete report');
  }

  return value;
};

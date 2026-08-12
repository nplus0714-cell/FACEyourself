import type { FaceQuestion, FaceTrait } from '../types';
import { FACE_SEQUENTIAL_MOCKUP_QUESTIONS } from './faceSequentialMockup';

export const FACE_BASELINE_V2_VERSION = 'face-baseline-40q-v2.1-two-stage';
export const FACE_BASELINE_V2_QUESTION_COUNT = 40;

export const FACE_V2_AGREEMENT_SCALE = [
  '非常同意', '有點同意', '中立／不一定', '有點不同意', '非常不同意',
] as const;

const optionId = (side: 'a' | 'b', label: string, trait: FaceTrait) => ({ id: side, label, trait });

export const FACE_BASELINE_V2_QUESTIONS: FaceQuestion[] = FACE_SEQUENTIAL_MOCKUP_QUESTIONS.map((question) => {
  const base: FaceQuestion = {
    id: `face-v2-${String(question.id).padStart(2, '0')}`,
    order: question.id,
    type: question.kind,
    responseMode: question.kind === 'intuition' || question.kind === 'image'
      ? 'binary'
      : question.kind === 'agreement' ? 'agreement' : 'bipolar',
    dimension: question.dimension,
    prompt: question.prompt,
  };

  if (question.kind === 'agreement') {
    return {
      ...base,
      agreement: { agreeTrait: question.traitA, disagreeTrait: question.traitB },
    };
  }

  return {
    ...base,
    options: [
      optionId('a', question.optionA, question.traitA),
      optionId('b', question.optionB, question.traitB),
    ],
    images: question.imageA && question.imageB ? [
      { assetKey: `face-v2-${question.id}-a`, src: question.imageA, alt: `A：${question.optionA}`, prompt: question.optionA, shortLabel: question.shortA },
      { assetKey: `face-v2-${question.id}-b`, src: question.imageB, alt: `B：${question.optionB}`, prompt: question.optionB, shortLabel: question.shortB },
    ] : undefined,
    allowNotApplicable: question.kind === 'scenario',
    scenarioGroup: question.group,
    scenarioGroupTitle: question.groupTitle,
    scenarioStage: question.stage,
  };
});

export const getFaceV2QuestionCounts = (questions = FACE_BASELINE_V2_QUESTIONS) =>
  questions.reduce<Record<'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE', number>>(
    (counts, question) => ({ ...counts, [question.dimension]: counts[question.dimension] + 1 }),
    { FOCUS: 0, ANALYSIS: 0, CYCLE: 0, EXPOSURE: 0 },
  );

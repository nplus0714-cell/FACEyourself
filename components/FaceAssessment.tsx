import React, { useRef, useState } from 'react';
import {
  FACE_BASELINE_V2_QUESTION_COUNT,
  FACE_BASELINE_V2_QUESTIONS,
  FACE_BASELINE_V2_VERSION,
  FACE_V2_AGREEMENT_SCALE,
} from '../data/faceQuestionsV2';
import {
  AssessmentPersistenceError,
  completeFaceAssessmentRun,
  startAssessmentRun,
} from '../services/assessmentPersistence';
import { getSupabaseClient } from '../lib/supabase';
import type {
  AssessmentAnswer,
  FaceAssessmentMeta,
  FaceDimension,
  FaceQuestion,
  FaceScores,
  FaceTrait,
} from '../types';

type FaceResponse = AssessmentAnswer['selected_option'];
type AgreementResponse = Extract<FaceResponse, 'very_agree' | 'somewhat_agree' | 'neutral' | 'somewhat_disagree' | 'very_disagree'>;
type BipolarResponse = Extract<FaceResponse, 'very_a' | 'somewhat_a' | 'balanced' | 'somewhat_b' | 'very_b'>;

const DIMENSION_LABELS = {
  FOCUS: 'F｜獲利動機',
  ANALYSIS: 'A｜決策邏輯',
  CYCLE: 'C｜交易週期',
  EXPOSURE: 'E｜資金管理',
} as const;

const MOBILE_DIMENSION_LABELS: Record<keyof typeof DIMENSION_LABELS, string> = {
  FOCUS: '獲利動機',
  ANALYSIS: '決策邏輯',
  CYCLE: '交易週期',
  EXPOSURE: '資金管理',
};

const TYPE_LABELS = {
  scenario: '情境量尺',
  image: '圖像題',
  intuition: '直覺題',
  agreement: '同意程度',
} as const;

const AGREEMENT_SCORES: Record<AgreementResponse, number> = {
  very_agree: 10,
  somewhat_agree: 7,
  neutral: 5,
  somewhat_disagree: 3,
  very_disagree: 0,
};

const AGREEMENT_RESPONSES: Array<{ id: AgreementResponse; label: string }> = [
  { id: 'very_agree', label: FACE_V2_AGREEMENT_SCALE[0] },
  { id: 'somewhat_agree', label: FACE_V2_AGREEMENT_SCALE[1] },
  { id: 'neutral', label: FACE_V2_AGREEMENT_SCALE[2] },
  { id: 'somewhat_disagree', label: FACE_V2_AGREEMENT_SCALE[3] },
  { id: 'very_disagree', label: FACE_V2_AGREEMENT_SCALE[4] },
];

const BIPOLAR_SCORES: Record<BipolarResponse, number> = {
  very_a: 10,
  somewhat_a: 7,
  balanced: 5,
  somewhat_b: 3,
  very_b: 0,
};

const BIPOLAR_RESPONSES: Array<{ id: BipolarResponse; label: string }> = [
  { id: 'very_a', label: '非常接近 A' },
  { id: 'somewhat_a', label: '比較接近 A' },
  { id: 'balanced', label: '兩者都會\n看情況' },
  { id: 'somewhat_b', label: '比較接近 B' },
  { id: 'very_b', label: '非常接近 B' },
];

const AGREEMENT_COLORS = [
  'border-[#8C635B] bg-[#8C635B] text-white shadow-md',
  'border-[#C8A99E] bg-[#F4E8E3] text-[#6D4F47]',
  'border-[#D1D1C7] bg-white text-[#5D5D56]',
  'border-[#BFC8CC] bg-[#E9EFF0] text-[#47575D]',
  'border-[#56616A] bg-[#56616A] text-white shadow-md',
] as const;

const BIPOLAR_COLORS = [
  'border-[#8C635B] bg-[#8C635B] text-white shadow-md',
  'border-[#C8A99E] bg-[#F4E8E3] text-[#6D4F47]',
  'border-[#D1D1C7] bg-white text-[#5D5D56]',
  'border-[#BFC8CC] bg-[#E9EFF0] text-[#47575D]',
  'border-[#56616A] bg-[#56616A] text-white shadow-md',
] as const;

const DIMENSION_TRAITS: Record<FaceDimension, [FaceTrait, FaceTrait]> = {
  FOCUS: ['A', 'P'],
  ANALYSIS: ['R', 'I'],
  CYCLE: ['L', 'T'],
  EXPOSURE: ['C', 'D'],
};

const emptyScores = (): FaceScores => ({ A: 0, P: 0, R: 0, I: 0, L: 0, T: 0, C: 0, D: 0 });
const emptyDimensionCounts = (): Record<FaceDimension, number> => ({
  FOCUS: 0,
  ANALYSIS: 0,
  CYCLE: 0,
  EXPOSURE: 0,
});
const LOCAL_PENDING_ASSESSMENT_KEY = 'face_pending_assessment_v3';

const cacheCompletedAssessment = (
  answers: Record<string, FaceResponse>,
  scores: FaceScores,
): void => {
  try {
    localStorage.setItem(LOCAL_PENDING_ASSESSMENT_KEY, JSON.stringify({
      assessmentVersion: FACE_BASELINE_V2_VERSION,
      answers,
      scores,
      savedAt: new Date().toISOString(),
    }));
  } catch (error) {
    // The result is still passed back to App below. This only affects the
    // browser backup when storage is unavailable or full.
    console.warn('Unable to cache FACE assessment locally', error);
  }
};

const addScore = (scores: FaceScores, trait: FaceTrait, amount: number) => {
  scores[trait] += amount;
};

const calculateScores = (answers: Record<string, FaceResponse>): { scores: FaceScores; scoreValues: Record<string, number> } => {
  const scores = emptyScores();
  const scoreValues: Record<string, number> = {};
  const answeredCountByDimension = emptyDimensionCounts();
  const skippedQuestionIds: string[] = [];

  FACE_BASELINE_V2_QUESTIONS.forEach((question) => {
    const response = answers[question.id];
    if (!response) return;

    if (response === 'not_applicable') {
      scoreValues[question.id] = 0;
      skippedQuestionIds.push(question.id);
      return;
    }

    answeredCountByDimension[question.dimension] += 1;

    if (question.type === 'agreement') {
      const agreeScore = AGREEMENT_SCORES[response as AgreementResponse];
      const disagreeScore = 10 - agreeScore;
      addScore(scores, question.agreement!.agreeTrait, agreeScore);
      addScore(scores, question.agreement!.disagreeTrait, disagreeScore);
      scoreValues[question.id] = agreeScore;
      return;
    }

    if (question.responseMode === 'bipolar') {
      const aScore = BIPOLAR_SCORES[response as BipolarResponse];
      const bScore = 10 - aScore;
      addScore(scores, question.options![0].trait, aScore);
      addScore(scores, question.options![1].trait, bScore);
      scoreValues[question.id] = aScore;
      return;
    }

    const option = question.options!.find((item) => (item.id === 'a' ? 'A' : 'B') === response);
    if (!option) return;
    addScore(scores, option.trait, 10);
    scoreValues[question.id] = 10;
  });

  const scenarioConsistencyBonuses: NonNullable<FaceAssessmentMeta['scenarioConsistencyBonuses']> = [];
  const scenarioGroups = [...new Set(FACE_BASELINE_V2_QUESTIONS.flatMap((question) => question.scenarioGroup ? [question.scenarioGroup] : []))];
  scenarioGroups.forEach((group) => {
    const groupQuestions = FACE_BASELINE_V2_QUESTIONS.filter((question) => question.scenarioGroup === group);
    const responses = groupQuestions.map((question) => answers[question.id]);
    const usable = responses.every((response) => response && response !== 'balanced' && response !== 'not_applicable');
    const sides = responses.map((response) => response === 'very_a' || response === 'somewhat_a' ? 'a' : 'b');
    if (!usable || !sides.every((side) => side === sides[0])) return;
    const trait = sides[0] === 'a' ? groupQuestions[0].options![0].trait : groupQuestions[0].options![1].trait;
    addScore(scores, trait, 2);
    scenarioConsistencyBonuses.push({ group, title: groupQuestions[0].scenarioGroupTitle ?? group, trait, points: 2 });
  });

  Object.values(DIMENSION_TRAITS).forEach(([firstTrait, secondTrait]) => {
    const rawTotal = scores[firstTrait] + scores[secondTrait];
    const firstScore = rawTotal === 0 ? 50 : Math.round((scores[firstTrait] / rawTotal) * 100);
    scores[firstTrait] = firstScore;
    scores[secondTrait] = 100 - firstScore;
  });

  const confidenceByDimension = Object.fromEntries(
    Object.entries(answeredCountByDimension).map(([dimension, count]) => [
      dimension,
      (() => {
        const expectedCount = FACE_BASELINE_V2_QUESTIONS.filter((question) => question.dimension === dimension).length;
        if (count === expectedCount) return 'high';
        if (count >= Math.max(1, expectedCount - 1)) return 'medium';
        return 'low';
      })(),
    ]),
  ) as FaceAssessmentMeta['confidenceByDimension'];
  const scenarioQuestionCount = FACE_BASELINE_V2_QUESTIONS.filter((question) => question.allowNotApplicable).length;
  const notApplicableRate = scenarioQuestionCount === 0 ? 0 : skippedQuestionIds.length / scenarioQuestionCount;

  scores.assessmentMeta = {
    assessmentVersion: FACE_BASELINE_V2_VERSION,
    answeredCountByDimension,
    skippedQuestionIds,
    scenarioQuestionCount,
    notApplicableRate,
    hasInsufficientData: notApplicableRate > 0.5,
    scenarioConsistencyBonuses,
    confidenceByDimension,
  };

  return { scores, scoreValues };
};

interface FaceAssessmentProps {
  onComplete: (scores: FaceScores) => void;
}

export const FaceAssessment: React.FC<FaceAssessmentProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, FaceResponse>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const clientRunIdRef = useRef<string | null>(null);
  const runIdRef = useRef<string | null>(null);
  const runPromiseRef = useRef<Promise<string> | null>(null);
  const question = FACE_BASELINE_V2_QUESTIONS[step];

  const getOrStartRun = (): Promise<string> => {
    if (runIdRef.current) return Promise.resolve(runIdRef.current);

    if (!runPromiseRef.current) {
      clientRunIdRef.current ??= crypto.randomUUID();
      runPromiseRef.current = startAssessmentRun(
        clientRunIdRef.current,
        FACE_BASELINE_V2_VERSION,
        FACE_BASELINE_V2_QUESTION_COUNT,
      )
        .then((runId) => {
          runIdRef.current = runId;
          return runId;
        })
        .catch((error) => {
          runPromiseRef.current = null;
          throw error;
        });
    }

    return runPromiseRef.current;
  };

  const finish = async (completedAnswers: Record<string, FaceResponse>) => {
    setIsSaving(true);
    setSaveError(null);
    const { scores, scoreValues } = calculateScores(completedAnswers);

    // Keep an anonymous browser copy before attempting the cloud write.
    // App also saves the final result card into its persisted local state.
    cacheCompletedAssessment(completedAnswers, scores);

    try {
      const runId = await getOrStartRun();
      await completeFaceAssessmentRun(runId, FACE_BASELINE_V2_QUESTIONS, completedAnswers, scores, scoreValues);
      const { data: { session } } = await getSupabaseClient().auth.getSession();
      if (session?.user && !session.user.is_anonymous) {
        localStorage.removeItem(LOCAL_PENDING_ASSESSMENT_KEY);
      }
      onComplete(scores);
    } catch (error) {
      console.error('Failed to persist FACE 24q assessment', error);

      // Do not make an anonymous visitor lose a completed result because a
      // cloud write is unavailable. The browser copy remains available until
      // a future signed-in account can merge it.
      onComplete(scores);
      return;

      setSaveError(
        error instanceof AssessmentPersistenceError
          ? error.message
          : '無法保存這次測驗，請確認網路後再試一次。',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const choose = (response: FaceResponse) => {
    if (isSaving) return;

    const updated = { ...answers, [question.id]: response };
    setAnswers(updated);
    if (!runIdRef.current && !runPromiseRef.current) void getOrStartRun().catch(() => undefined);

    if (step === FACE_BASELINE_V2_QUESTIONS.length - 1) {
      void finish(updated);
      return;
    }

    setStep((current) => current + 1);
  };

  const renderChoice = (item: FaceQuestion['options'][number]) => {
    const isOptionA = item.id === 'a';
    const optionTone = isOptionA
      ? 'border-[#E7C0BA] bg-[#FCF2F0] hover:border-[#B8776D] hover:bg-[#F6E0DC]'
      : 'border-[#BFCCD3] bg-[#F0F5F7] hover:border-[#718792] hover:bg-[#E0EBEF]';
    const labelTone = isOptionA ? 'text-[#8C635B]' : 'text-[#56616A]';

    return (
    <button
      key={item.id}
      type="button"
      onClick={() => choose(item.id === 'a' ? 'A' : 'B')}
      disabled={isSaving}
      className={`flex w-full items-center gap-5 border p-6 text-left shadow-sm transition-all duration-300 disabled:cursor-wait disabled:opacity-60 ${optionTone}`}
    >
      <span className={`shrink-0 font-mono text-[11px] tracking-[0.18em] ${labelTone}`}>
        OPTION {item.id.toUpperCase()}
      </span>
      <span className="serif text-lg leading-relaxed text-[#2D2D2D]">{item.label}</span>
    </button>
    );
  };

  return (
    <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col justify-center px-0 sm:px-4 py-2 md:px-8 md:py-4 fade-in">
      <div className="mb-6 md:mb-8 space-y-5 md:space-y-6 text-center">
        <div className="grid grid-cols-4 overflow-hidden border border-[#D1D1C7]/60 bg-white/40 shadow-sm">
          {Object.entries(DIMENSION_LABELS).map(([dimension, label]) => (
            <div
              key={dimension}
              className="border-r border-[#D1D1C7]/60 px-1 py-2.5 text-[11px] tracking-normal text-[#5D5D56] last:border-r-0 md:py-3 md:text-xs"
            >
              <span className="sm:hidden">{MOBILE_DIMENSION_LABELS[dimension as keyof typeof DIMENSION_LABELS]}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-[#8C635B]">{TYPE_LABELS[question.type]}</p>
          <h2 className="serif text-xl tracking-wide text-[#2D2D2D]">FACE 交易人格測驗</h2>
          <div className="mx-auto max-w-lg pt-2" aria-label={`測驗進度：第 ${step + 1} 題，共 ${FACE_BASELINE_V2_QUESTION_COUNT} 題`}>
            <div className="relative h-5">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#D1D1C7]"></div>
              <div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#8C635B] transition-all duration-500" style={{ width: `${((step + 1) / FACE_BASELINE_V2_QUESTION_COUNT) * 100}%` }}></div>
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#8C635B] shadow-sm transition-all duration-500" style={{ left: `${((step + 1) / FACE_BASELINE_V2_QUESTION_COUNT) * 100}%` }}></div>
            </div>
            <div className="flex justify-between font-mono text-[11px] tracking-[0.06em] text-[#8C7E6D]">
              <span>START</span>
              <span>第 {step + 1} 題 / {FACE_BASELINE_V2_QUESTION_COUNT}</span>
              <span>FINISH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-7">
        <div className="space-y-3 text-center">
          {question.type === 'image' && <p className="text-sm text-[#8C7E6D]">不要想太久，選第一眼比較像你的畫面。</p>}
          {question.type === 'intuition' && <p className="text-sm text-[#8C7E6D]">先選第一個直覺反應。</p>}
          {question.responseMode === 'bipolar' && <p className="text-sm text-[#8C7E6D]">先看兩端的做法，再選擇你通常落在哪個位置。</p>}
          {question.scenarioGroup && (
            <div className="mx-auto max-w-lg border-b border-[#D1D1C7] pb-3">
              <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.12em] text-[#8C635B]"><span>{question.scenarioGroup} · {question.scenarioGroupTitle}</span><span>情境進展 {question.scenarioStage} / 2</span></div>
              <div className="mt-2 grid grid-cols-2 gap-2">{[1, 2].map((stage) => <span key={stage} className={`h-1 ${stage <= (question.scenarioStage ?? 0) ? 'bg-[#8C635B]' : 'bg-[#DED7CE]'}`} />)}</div>
            </div>
          )}
          <p className="serif px-2 text-xl leading-[1.7] text-[#2D2D2D] md:text-2xl">{question.prompt}</p>
        </div>

        {question.type === 'image' && question.compositeImage && question.options && (
          <div className="space-y-4">
            <div className="overflow-hidden border border-[#D1D1C7]/70 bg-white shadow-sm">
              <img
                src={question.compositeImage.src}
                alt={question.compositeImage.alt}
                className="block h-auto w-full"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map(renderChoice)}
            </div>
          </div>
        )}

        {question.type === 'image' && !question.compositeImage && question.images && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {question.images.map((item, index) => (
              <button
                key={item.assetKey}
                type="button"
                onClick={() => choose(index === 0 ? 'A' : 'B')}
                disabled={isSaving}
                className="group overflow-hidden border border-[#D1D1C7]/70 bg-white text-left shadow-sm transition-all duration-300 hover:border-[#2D2D2D] hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
              >
                {item.src ? (
                  <span className="flex aspect-[2/3] w-full items-center justify-center overflow-hidden bg-[#F7F4EF]"><img src={item.src} alt={item.alt} className="h-full w-full object-contain" /></span>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_top_left,_#d9d1c7,_#f8f7f4_45%,_#d5c0b9)] p-6 text-center">
                    <p className="serif text-base leading-relaxed text-[#2D2D2D]">{item.alt}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {question.type === 'intuition' && question.images && question.options && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {question.images.map((item, index) => (
              <button
                key={item.assetKey}
                type="button"
                onClick={() => choose(index === 0 ? 'A' : 'B')}
                disabled={isSaving}
                className="group overflow-hidden border border-[#D1D1C7]/70 bg-white text-left shadow-sm transition-all duration-300 hover:border-[#2D2D2D] hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
              >
                <div className="flex min-h-20 items-center gap-4 border-b border-[#E2DCD4] px-5 py-4">
                  <strong className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base text-white ${index === 0 ? 'bg-[#9A6B61]' : 'bg-[#65747A]'}`}>{index === 0 ? 'A' : 'B'}</strong>
                  <span className="text-lg font-bold leading-7 text-[#302C29]">{item.shortLabel}</span>
                </div>
                <span className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-[#F7F4EF] p-2"><img src={item.src} alt={item.alt} className="h-full w-full object-contain" /></span>
                <div className="min-h-24 border-t border-[#E2DCD4] p-5 text-sm font-medium leading-7 text-[#5D554F]">{question.options![index].label}</div>
              </button>
            ))}
          </div>
        )}

        {question.type !== 'image' && question.type !== 'intuition' && question.type !== 'agreement' && question.responseMode !== 'bipolar' && (
          <div className="grid gap-4">{question.options!.map(renderChoice)}</div>
        )}

        {question.responseMode === 'bipolar' && question.options && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-[#E7C0BA] bg-[#FCF2F0] p-5 text-left">
                <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#8C635B]">做法 A</p>
                <p className="serif mt-2 text-base leading-7 text-[#2D2D2D]">{question.options[0].label}</p>
              </div>
              <div className="border border-[#BFCCD3] bg-[#F0F5F7] p-5 text-left">
                <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#56616A]">做法 B</p>
                <p className="serif mt-2 text-base leading-7 text-[#2D2D2D]">{question.options[1].label}</p>
              </div>
            </div>
            <div className="flex items-stretch justify-center gap-1.5 sm:gap-3" aria-label="選擇你接近兩種做法的程度">
              {BIPOLAR_RESPONSES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => choose(item.id)}
                  disabled={isSaving}
                  className={`flex min-h-24 w-[20%] items-center justify-center whitespace-pre-line border px-1.5 py-3 text-center text-[11px] leading-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:cursor-wait disabled:opacity-60 sm:min-h-28 sm:px-2 sm:text-sm ${BIPOLAR_COLORS[index]}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {question.allowNotApplicable && (
              <button
                type="button"
                onClick={() => choose('not_applicable')}
                disabled={isSaving}
                className="mx-auto block border-b border-[#8C7E6D]/50 pb-1 text-xs tracking-[0.08em] text-[#8C7E6D] transition hover:border-[#2D2D2D] hover:text-[#2D2D2D] disabled:cursor-wait disabled:opacity-60"
              >
                這個情境不適用於我
              </button>
            )}
          </div>
        )}

        {question.type === 'agreement' && (
          <div className="flex items-stretch justify-center gap-2 px-1 pt-2 sm:gap-3 sm:px-4">
            {AGREEMENT_RESPONSES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => choose(item.id)}
                disabled={isSaving}
                aria-label={`${item.label}，${index === 0 || index === 4 ? '強烈立場' : index === 2 ? '中立立場' : '較輕立場'}`}
                className={`flex min-h-24 w-[19%] items-center justify-center border px-2 py-3 text-center text-xs leading-relaxed transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:cursor-wait disabled:opacity-60 sm:min-h-28 sm:text-sm ${AGREEMENT_COLORS[index]}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {step > 0 && !isSaving && (
          <button type="button" onClick={() => setStep((current) => current - 1)} className="mx-auto block border-b border-[#2D2D2D]/40 pb-1 text-xs tracking-[0.2em] text-[#2D2D2D] hover:opacity-60">
            回上一題
          </button>
        )}

        {isSaving && <p className="text-center text-sm tracking-[0.15em] text-[#8C7E6D]" role="status">正在保存你的測驗結果…</p>}
        {saveError && (
          <div className="space-y-3 text-center" role="alert">
            <p className="text-sm text-[#8C635B]">{saveError}</p>
            <button type="button" onClick={() => void finish(answers)} className="border border-[#8C635B] px-6 py-3 text-xs tracking-[0.15em] text-[#8C635B] transition-colors hover:bg-[#8C635B] hover:text-white">
              重新嘗試保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

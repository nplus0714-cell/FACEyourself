import React, { useRef, useState } from 'react';
import {
  FACE_AGREEMENT_SCALE,
  FACE_BASELINE_40_QUESTION_COUNT,
  FACE_BASELINE_40_QUESTIONS,
  FACE_BASELINE_40_VERSION,
} from '../data/faceQuestions';
import {
  AssessmentPersistenceError,
  completeFaceAssessmentRun,
  startAssessmentRun,
} from '../services/assessmentPersistence';
import type { AssessmentAnswer, FaceQuestion, FaceScores, FaceTrait } from '../types';

type FaceResponse = AssessmentAnswer['selected_option'];

const DIMENSION_LABELS = {
  FOCUS: 'F｜獲利動機',
  ANALYSIS: 'A｜決策邏輯',
  CYCLE: 'C｜交易週期',
  EXPOSURE: 'E｜資金暴露',
} as const;

const MOBILE_DIMENSION_LABELS: Record<keyof typeof DIMENSION_LABELS, string> = {
  FOCUS: '獲利',
  ANALYSIS: '決策',
  CYCLE: '節奏',
  EXPOSURE: '風險',
};

const TYPE_LABELS = {
  scenario: '情境題',
  image: '圖像題',
  intuition: '直覺題',
  agreement: '是非題',
} as const;

const AGREEMENT_SCORES: Record<Exclude<FaceResponse, 'A' | 'B'>, number> = {
  very_agree: 10,
  somewhat_agree: 7,
  neutral: 5,
  somewhat_disagree: 3,
  very_disagree: 0,
};

const AGREEMENT_RESPONSES: Array<{ id: Exclude<FaceResponse, 'A' | 'B'>; label: string }> = [
  { id: 'very_agree', label: FACE_AGREEMENT_SCALE[0] },
  { id: 'somewhat_agree', label: FACE_AGREEMENT_SCALE[1] },
  { id: 'neutral', label: FACE_AGREEMENT_SCALE[2] },
  { id: 'somewhat_disagree', label: FACE_AGREEMENT_SCALE[3] },
  { id: 'very_disagree', label: FACE_AGREEMENT_SCALE[4] },
];

const AGREEMENT_COLORS = [
  'border-[#8C635B] bg-[#8C635B] text-white shadow-md',
  'border-[#C8A99E] bg-[#F4E8E3] text-[#6D4F47]',
  'border-[#D1D1C7] bg-white text-[#5D5D56]',
  'border-[#BFC8CC] bg-[#E9EFF0] text-[#47575D]',
  'border-[#56616A] bg-[#56616A] text-white shadow-md',
] as const;

const emptyScores = (): FaceScores => ({ A: 0, P: 0, R: 0, I: 0, L: 0, T: 0, C: 0, D: 0 });

const addScore = (scores: FaceScores, trait: FaceTrait, amount: number) => {
  scores[trait] += amount;
};

const calculateScores = (answers: Record<string, FaceResponse>): { scores: FaceScores; scoreValues: Record<string, number> } => {
  const scores = emptyScores();
  const scoreValues: Record<string, number> = {};

  FACE_BASELINE_40_QUESTIONS.forEach((question) => {
    const response = answers[question.id];
    if (!response) return;

    if (question.type === 'agreement') {
      const agreeScore = AGREEMENT_SCORES[response as Exclude<FaceResponse, 'A' | 'B'>];
      const disagreeScore = 10 - agreeScore;
      addScore(scores, question.agreement!.agreeTrait, agreeScore);
      addScore(scores, question.agreement!.disagreeTrait, disagreeScore);
      scoreValues[question.id] = agreeScore;
      return;
    }

    const option = question.options!.find((item) => (item.id === 'a' ? 'A' : 'B') === response);
    if (!option) return;
    addScore(scores, option.trait, 10);
    scoreValues[question.id] = 10;
  });

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
  const question = FACE_BASELINE_40_QUESTIONS[step];

  const getOrStartRun = (): Promise<string> => {
    if (runIdRef.current) return Promise.resolve(runIdRef.current);

    if (!runPromiseRef.current) {
      clientRunIdRef.current ??= crypto.randomUUID();
      runPromiseRef.current = startAssessmentRun(
        clientRunIdRef.current,
        FACE_BASELINE_40_VERSION,
        FACE_BASELINE_40_QUESTION_COUNT,
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

    try {
      const runId = await getOrStartRun();
      const { scores, scoreValues } = calculateScores(completedAnswers);
      await completeFaceAssessmentRun(runId, FACE_BASELINE_40_QUESTIONS, completedAnswers, scores, scoreValues);
      onComplete(scores);
    } catch (error) {
      console.error('Failed to persist FACE 40q assessment', error);
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

    if (step === FACE_BASELINE_40_QUESTIONS.length - 1) {
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
      <span className={`shrink-0 font-mono text-[10px] tracking-[0.22em] ${labelTone}`}>
        OPTION {item.id.toUpperCase()}
      </span>
      <span className="serif text-lg leading-relaxed text-[#2D2D2D]">{item.label}</span>
    </button>
    );
  };

  return (
    <div className="mx-auto flex min-h-[72vh] max-w-2xl flex-col justify-center px-0 sm:px-4 py-2 md:px-8 md:py-4 fade-in">
      <div className="mb-6 md:mb-8 space-y-5 md:space-y-6 text-center">
        <div className="grid grid-cols-4 overflow-hidden border border-[#D1D1C7]/60 bg-white/40 shadow-sm">
          {Object.entries(DIMENSION_LABELS).map(([dimension, label]) => (
            <div
              key={dimension}
              className="border-r border-[#D1D1C7]/60 px-1 py-2.5 text-[10px] tracking-normal text-[#5D5D56] last:border-r-0 md:py-3 md:text-xs"
            >
              <span className="sm:hidden">{MOBILE_DIMENSION_LABELS[dimension as keyof typeof DIMENSION_LABELS]}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#8C635B]">{TYPE_LABELS[question.type]}</p>
          <h2 className="serif text-xl tracking-wide text-[#2D2D2D]">FACE 交易人格測驗</h2>
          <div className="mx-auto max-w-lg pt-2" aria-label={`測驗進度：第 ${step + 1} 題，共 ${FACE_BASELINE_40_QUESTION_COUNT} 題`}>
            <div className="relative h-5">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#D1D1C7]"></div>
              <div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#8C635B] transition-all duration-500" style={{ width: `${((step + 1) / FACE_BASELINE_40_QUESTION_COUNT) * 100}%` }}></div>
              <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#8C635B] shadow-sm transition-all duration-500" style={{ left: `${((step + 1) / FACE_BASELINE_40_QUESTION_COUNT) * 100}%` }}></div>
            </div>
            <div className="flex justify-between font-mono text-[10px] tracking-[0.08em] text-[#8C7E6D]">
              <span>START</span>
              <span>第 {step + 1} 題 / {FACE_BASELINE_40_QUESTION_COUNT}</span>
              <span>FINISH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-7">
        <div className="space-y-3 text-center">
          {question.type === 'image' && <p className="text-sm text-[#8C7E6D]">不要想太久，選第一眼比較像你的畫面。</p>}
          {question.type === 'intuition' && <p className="text-sm text-[#8C7E6D]">先選第一個直覺反應。</p>}
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
                <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_top_left,_#d9d1c7,_#f8f7f4_45%,_#d5c0b9)] p-6 text-center">
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-[#8C635B]">圖片待補</span>
                    <p className="serif text-base leading-relaxed text-[#2D2D2D]">{item.alt}</p>
                  </div>
                </div>
                <div className="p-5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#8C7E6D]">OPTION {index === 0 ? 'A' : 'B'}</span>
                  <p className="serif mt-2 text-base leading-relaxed text-[#2D2D2D]">{question.options![index].label}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type !== 'image' && question.type !== 'agreement' && (
          <div className="grid gap-4">{question.options!.map(renderChoice)}</div>
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

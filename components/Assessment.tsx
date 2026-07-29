import React, { useRef, useState } from 'react';
import { FaceScores, Language, Question } from '../types';
import { translations } from '../i18n';
import {
  AssessmentPersistenceError,
  completeAssessmentRun,
  startAssessmentRun,
} from '../services/assessmentPersistence';

interface AssessmentProps {
  questions: Question[];
  onComplete: (scores: FaceScores) => void;
  title: string;
  weightPerQuestion: number;
  language: Language;
  assessmentVersion?: string;
}

export const Assessment: React.FC<AssessmentProps> = ({
  questions,
  onComplete,
  title,
  weightPerQuestion,
  language,
  assessmentVersion,
}) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const clientRunIdRef = useRef<string | null>(null);
  const runIdRef = useRef<string | null>(null);
  const runPromiseRef = useRef<Promise<string> | null>(null);
  const t = translations[language];

  const currentQ = questions[step];
  const totalSteps = questions.length;

  const getOrStartRun = (): Promise<string> => {
    if (!assessmentVersion) {
      return Promise.reject(new Error('This assessment is not configured for persistence.'));
    }

    if (runIdRef.current) {
      return Promise.resolve(runIdRef.current);
    }

    if (!runPromiseRef.current) {
      clientRunIdRef.current ??= crypto.randomUUID();
      runPromiseRef.current = startAssessmentRun(
        clientRunIdRef.current,
        assessmentVersion,
        questions.length,
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

  const calculateScores = (
    completedAnswers: Record<string, 'A' | 'B'>,
  ): FaceScores => {
    const final: FaceScores = { A: 0, P: 0, R: 0, I: 0, L: 0, T: 0, C: 0, D: 0 };

    questions.forEach(q => {
      const choice = completedAnswers[q.id];
      if (!choice) return;

      const primaryTrait = q.pair[0];
      const secondaryTrait = q.pair[1];

      if (choice === 'A') {
        (final as any)[primaryTrait] += weightPerQuestion;
      } else {
        (final as any)[secondaryTrait] += weightPerQuestion;
      }
    });

    return final;
  };

  const finishAssessment = async (
    completedAnswers: Record<string, 'A' | 'B'>,
  ) => {
    const final = calculateScores(completedAnswers);

    if (!assessmentVersion) {
      onComplete(final);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const runId = await getOrStartRun();
      await completeAssessmentRun(
        runId,
        assessmentVersion,
        questions,
        completedAnswers,
        final,
        weightPerQuestion,
      );
      onComplete(final);
    } catch (error) {
      console.error('Failed to persist assessment', error);
      setSaveError(
        error instanceof AssessmentPersistenceError
          ? error.message
          : '測驗答案尚未保存，請重試。',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChoice = (choice: 'A' | 'B') => {
    if (isSaving) return;

    const updated = { ...answers, [currentQ.id]: choice };
    setAnswers(updated);

    if (assessmentVersion && !runIdRef.current && !runPromiseRef.current) {
      void getOrStartRun().catch(() => undefined);
    }
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      void finishAssessment(updated);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const categories = [
    { en: 'FOCUS', zh: '動機', key: 'FOCUS 動機' },
    { en: 'ANALYSIS', zh: '邏輯', key: 'ANALYSIS 邏輯' },
    { en: 'CYCLE', zh: '頻率', key: 'CYCLE 頻率' },
    { en: 'EXPOSURE', zh: '行為', key: 'EXPOSURE 行為' }
  ];

  return (
    <div className="max-w-xl mx-auto py-4 px-8 flex flex-col min-h-[75vh] justify-center fade-in">
      
      {/* 頂部維度：比照 Aman 風格，增加字距與可讀性 */}
      <div className="text-center mb-8 space-y-6">
        <div className="grid grid-cols-4 gap-0 border-[0.5px] border-[#D1D1C7]/60 w-full overflow-hidden bg-white/40 shadow-sm">
          {categories.map((cat) => {
            const isActive = currentQ.category === cat.key;
            return (
              <div 
                key={cat.en} 
                className={`flex flex-col items-center justify-center py-4 px-1 transition-all duration-700 ${
                  isActive 
                  ? 'bg-[#2D2D2D] text-white scale-100' 
                  : 'text-[#8C7E6D] opacity-60'
                }`}
              >
                {/* ✅ 放大：text-[8px] -> text-[10px] md:text-xs，增加字距 */}
                <span className="text-[10px] tracking-[0.25em] font-mono leading-none">{cat.en}</span>
                {/* ✅ 放大：text-[9px] -> text-xs (12px) */}
                <span className="text-xs tracking-widest serif mt-1.5 leading-none font-bold">
                  {language === 'zh' ? cat.zh : cat.en}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          {/* ✅ 放大標題層次 */}
          <h2 className="text-lg md:text-xl serif text-[#2D2D2D] tracking-[0.2em] font-light">
            {title}
          </h2>
          <div className="w-10 h-[0.5px] bg-[#2D2D2D]/30 mx-auto"></div>
        </div>
        
        <div className="flex justify-between items-center px-1 max-w-md mx-auto">
            {/* ✅ 放大：text-[8px] -> text-xs (12px) 並增加字距 */}
            <p className="text-xs tracking-[0.35em] text-[#8C7E6D] uppercase font-mono">
              {t.common.step} {step + 1} / {totalSteps}
            </p>
            {step > 0 && (
              <button 
                onClick={handleBack}
                disabled={isSaving}
                /* ✅ 放大：text-[8px] -> text-xs (12px) */
                className="text-xs tracking-[0.2em] text-[#2D2D2D] uppercase border-b border-[#2D2D2D]/40 pb-1 hover:opacity-60 transition-opacity"
              >
                {t.common.back}
              </button>
            )}
        </div>
      </div>
      
      {/* 題目區塊：比照安縵，讓文字更有份量 */}
      <div className="space-y-8">
        <div className="text-center min-h-[80px] flex items-center justify-center px-8">
          {/* ✅ 確保題目在手機上是顯眼的 20px (text-xl) */}
          <p className="text-xl md:text-2xl leading-[1.6] serif text-[#2D2D2D] italic font-normal tracking-wide">
            {currentQ.text}
          </p>
        </div>

        {/* 選項區塊：增加點擊範圍與文字易讀性 */}
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleChoice('A')}
            disabled={isSaving}
            className="group relative flex items-center p-6 bg-white border border-[#D1D1C7]/60 hover:border-[#2D2D2D] hover:bg-[#2D2D2D] transition-all duration-500 rounded-none text-left shadow-sm"
          >
            <div className="flex items-center gap-6 w-full">
              {/* ✅ 選項標籤放大：text-[8px] -> text-[10px] */}
              <span className="text-[10px] font-mono text-[#8C7E6D] group-hover:text-white/40 tracking-widest uppercase shrink-0">OPTION A</span>
              {/* ✅ 核心選項文字：text-lg (18px)，與 16Personalities 對標 */}
              <span className="text-lg md:text-xl tracking-tight text-[#2D2D2D] group-hover:text-white font-normal transition-colors serif flex-grow">
                {currentQ.labels[0]}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-xl">›</span>
            </div>
          </button>

          <button 
            onClick={() => handleChoice('B')}
            disabled={isSaving}
            className="group relative flex items-center p-6 bg-white border border-[#D1D1C7]/60 hover:border-[#2D2D2D] hover:bg-[#2D2D2D] transition-all duration-500 rounded-none text-left shadow-sm"
          >
            <div className="flex items-center gap-6 w-full">
              <span className="text-[10px] font-mono text-[#8C7E6D] group-hover:text-white/40 tracking-widest uppercase shrink-0">OPTION B</span>
              <span className="text-lg md:text-xl tracking-tight text-[#2D2D2D] group-hover:text-white font-normal transition-colors serif flex-grow">
                {currentQ.labels[1]}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-xl">›</span>
            </div>
          </button>
        </div>

        {isSaving && (
          <p className="text-center text-xs tracking-[0.2em] text-[#8C7E6D]" role="status">
            正在安全保存測驗結果…
          </p>
        )}

        {saveError && (
          <div className="space-y-3 text-center" role="alert">
            <p className="text-sm text-[#8C635B]">{saveError}</p>
            <button
              type="button"
              onClick={() => void finishAssessment(answers)}
              disabled={isSaving}
              className="px-6 py-3 border border-[#8C635B] text-[#8C635B] text-xs tracking-[0.2em] hover:bg-[#8C635B] hover:text-white transition-colors"
            >
              重新嘗試保存
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block py-3 border-t border-[#D1D1C7]/30 w-full max-w-[200px]">
          {/* ✅ 底部資訊放大至可閱讀尺寸 */}
          <p className="text-[10px] tracking-[0.5em] text-[#8C7E6D] uppercase font-light italic opacity-60">
            SOUL MINDFULNESS
          </p>
        </div>
      </div>
    </div>
  );
};

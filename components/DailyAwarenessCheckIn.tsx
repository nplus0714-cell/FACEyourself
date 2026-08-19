import React, { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { DAILY_AWARENESS_STEPS, type DailyAwarenessAnswers } from '../data/dailyAwarenessQuestions';

interface DailyAwarenessCheckInProps {
  onComplete: (answers: DailyAwarenessAnswers) => void | Promise<void>;
  onExit: () => void;
}

export const DailyAwarenessCheckIn: React.FC<DailyAwarenessCheckInProps> = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DailyAwarenessAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const question = DAILY_AWARENESS_STEPS[step];
  const selected = answers[question.id] ?? [];
  const selectedPlan = answers.q8_plan?.[0];
  const progress = Math.round(((step + 1) / DAILY_AWARENESS_STEPS.length) * 100);
  const canContinue = !isSubmitting && selected.length > 0 && (question.kind !== 'actions-plan' || Boolean(selectedPlan));
  const selectedLabels = useMemo(() => new Set(selected), [selected]);

  const toggle = (optionId: string, exclusive = false) => {
    setAnswers((current) => {
      const currentAnswers = current[question.id] ?? [];
      let next: string[];
      if (question.kind !== 'multi' && question.kind !== 'actions-plan') next = [optionId];
      else if (currentAnswers.includes(optionId)) next = currentAnswers.filter((id) => id !== optionId);
      else if (exclusive) next = [optionId];
      else {
        const withoutExclusive = currentAnswers.filter((id) => !question.options.find((item) => item.id === id)?.exclusive);
        next = withoutExclusive.length >= question.maxSelections
          ? withoutExclusive
          : [...withoutExclusive, optionId];
      }
      return { ...current, [question.id]: next };
    });
  };

  const next = async () => {
    if (!canContinue) return;
    if (step === DAILY_AWARENESS_STEPS.length - 1) {
      setIsSubmitting(true);
      try {
        await onComplete(answers);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setStep((value) => value + 1);
  };

  const stepLabel = `${step + 1}/${DAILY_AWARENESS_STEPS.length}`;

  return (
    <section className="mx-auto max-w-3xl pb-24 fade-in">
      <div className="flex items-center justify-between border-b border-[#D1D1C7] pb-5">
        <button type="button" onClick={onExit} className="text-[14px] font-medium leading-[1.6] text-[#70665D]">← 稍後再做</button>
        <p className="text-[13px] font-normal leading-[1.7] tracking-[0.16em] text-[#8C635B]">FACE DAILY · {stepLabel}</p>
      </div>
      <div className="mt-5 h-1 bg-[#E7E0D6]"><div className="h-full bg-[#8C635B] transition-all" style={{ width: `${progress}%` }} /></div>

      <header className="py-9 md:py-12">
        <p className="text-[13px] font-normal leading-[1.7] tracking-[0.16em] text-[#8C635B]">{question.eyebrow}</p>
        <h1 className="mt-4 serif text-[2rem] font-normal leading-[1.5] text-[#2D2D2D] md:text-[2.75rem] md:leading-[1.45]">{question.prompt}</h1>
        <p className="mt-4 text-[15px] font-normal leading-[1.9] text-[#766B62] md:text-base">{question.hint}</p>
      </header>

      {question.kind === 'scale' ? (
        <div className="flex flex-wrap gap-3">
          {question.options.map((option) => {
            const active = selectedLabels.has(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(option.id)}
                className={`inline-flex min-h-12 max-w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-left transition ${active ? 'border-[#4A382D] bg-[#4A382D] text-white' : 'border-[#D1D1C7] bg-white text-[#2D2D2D] hover:border-[#8C635B] hover:bg-[#FBF8F4]'}`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border serif text-[17px] ${active ? 'border-white/45 bg-white/10' : 'border-[#D8CDBD] bg-[#F7F2EC] text-[#79584D]'}`}>{option.id}</span>
                <span className="text-[15px] font-normal leading-[1.85] md:text-base">{option.label}</span>
                {active && <Check className="shrink-0" size={16} strokeWidth={1.8} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {question.options.map((option) => {
            const active = selectedLabels.has(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(option.id, option.exclusive)}
                className={`inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-[14px] border px-4 py-2.5 text-left text-[15px] font-normal leading-[1.85] transition md:text-base ${active ? 'border-[#4A382D] bg-[#4A382D] text-white' : 'border-[#D1D1C7] bg-white text-[#2D2D2D] hover:border-[#8C635B] hover:bg-[#FBF8F4]'}`}
              >
                <span>{option.label}</span>
                {active && <Check className="shrink-0" size={16} strokeWidth={1.8} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}

      {question.kind === 'actions-plan' && question.planOptions && (
        <section className="mt-10 border-t border-[#D1D1C7] pt-9">
          <p className="serif text-[1.55rem] font-normal leading-[1.65] text-[#2D2D2D] md:text-[1.75rem]">{question.planPrompt}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {question.planOptions.map((option) => {
              const active = selectedPlan === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setAnswers((current) => ({ ...current, q8_plan: [option.id] }))}
                  className={`inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-[14px] border px-4 py-2.5 text-left text-[15px] font-normal leading-[1.85] transition md:text-base ${active ? 'border-[#8C635B] bg-[#F0E5E0] text-[#2D2D2D]' : 'border-[#D1D1C7] bg-white text-[#5F574F] hover:border-[#8C635B] hover:bg-[#FBF8F4]'}`}
                >
                  <span>{option.label}</span>
                  {active && <Check className="shrink-0 text-[#8C635B]" size={16} strokeWidth={1.8} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-9 flex items-center justify-between gap-4">
        <button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="px-3 py-3 text-sm font-bold text-[#70665D] disabled:invisible">上一步</button>
        <button type="button" disabled={!canContinue} onClick={next} className="min-w-40 bg-[#8C635B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#754F48] disabled:cursor-not-allowed disabled:opacity-35">
          {isSubmitting ? '正在整理今日覺察…' : step === DAILY_AWARENESS_STEPS.length - 1 ? '完成今日照鏡' : '下一題'}
        </button>
      </div>
      <p className="mt-8 border-l-4 border-[#B59E7B] bg-white px-5 py-4 text-xs leading-6 text-[#70665D]">這些題目只記錄今天。系統會把商品表現、感受、看盤頻率與行動放在一起，於結果最後提供一段「可能的預期心態」供你核對；它不會改變你的動物人格。</p>
    </section>
  );
};

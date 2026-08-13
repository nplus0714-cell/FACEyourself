import React, { useMemo, useState } from 'react';
import { DAILY_AWARENESS_STEPS, type DailyAwarenessAnswers } from '../data/dailyAwarenessQuestions';

interface DailyAwarenessCheckInProps {
  onComplete: (answers: DailyAwarenessAnswers) => void;
  onExit: () => void;
}

export const DailyAwarenessCheckIn: React.FC<DailyAwarenessCheckInProps> = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DailyAwarenessAnswers>({});
  const question = DAILY_AWARENESS_STEPS[step];
  const selected = answers[question.id] ?? [];
  const selectedPlan = answers.q8_plan?.[0];
  const progress = Math.round(((step + 1) / DAILY_AWARENESS_STEPS.length) * 100);
  const canContinue = selected.length > 0 && (question.kind !== 'actions-plan' || Boolean(selectedPlan));
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

  const next = () => {
    if (!canContinue) return;
    if (step === DAILY_AWARENESS_STEPS.length - 1) onComplete(answers);
    else setStep((value) => value + 1);
  };

  const stepLabel = `${step + 1}/${DAILY_AWARENESS_STEPS.length}`;

  return (
    <section className="mx-auto max-w-3xl pb-24 fade-in">
      <div className="flex items-center justify-between border-b border-[#D1D1C7] pb-5">
        <button type="button" onClick={onExit} className="text-sm font-bold text-[#70665D]">← 稍後再做</button>
        <p className="text-xs font-bold tracking-[0.16em] text-[#8C635B]">FACE DAILY · {stepLabel}</p>
      </div>
      <div className="mt-5 h-1 bg-[#E7E0D6]"><div className="h-full bg-[#8C635B] transition-all" style={{ width: `${progress}%` }} /></div>

      <header className="py-10 md:py-14">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">{question.eyebrow}</p>
        <h1 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-5xl">{question.prompt}</h1>
        <p className="mt-4 text-sm leading-7 text-[#8C7E6D]">{question.hint}</p>
      </header>

      {question.kind === 'scale' ? (
        <div className="grid gap-3 sm:grid-cols-5">
          {question.options.map((option) => {
            const active = selectedLabels.has(option.id);
            return <button key={option.id} type="button" aria-pressed={active} onClick={() => toggle(option.id)} className={`min-h-36 border px-4 py-5 text-center transition ${active ? 'border-[#4A382D] bg-[#4A382D] text-white' : 'border-[#D1D1C7] bg-white text-[#2D2D2D] hover:border-[#8C635B]'}`}><span className="serif block text-3xl">{option.id}</span><span className="mt-3 block text-sm font-bold leading-6">{option.label}</span></button>;
          })}
        </div>
      ) : (
        <div className={`grid gap-3 ${question.kind === 'multi' ? 'sm:grid-cols-2' : ''}`}>
          {question.options.map((option) => {
            const active = selectedLabels.has(option.id);
            return (
              <button key={option.id} type="button" aria-pressed={active} onClick={() => toggle(option.id, option.exclusive)} className={`flex min-h-16 items-center justify-between border px-5 py-4 text-left text-base font-bold leading-7 transition ${active ? 'border-[#4A382D] bg-[#4A382D] text-white' : 'border-[#D1D1C7] bg-white text-[#2D2D2D] hover:border-[#8C635B]'}`}>
                <span>{option.label}</span><span aria-hidden="true">{active ? '✓' : '＋'}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.kind === 'actions-plan' && question.planOptions && (
        <section className="mt-10 border-t border-[#D1D1C7] pt-9">
          <p className="serif text-2xl leading-10 text-[#2D2D2D]">{question.planPrompt}</p>
          <div className="mt-5 grid gap-3">
            {question.planOptions.map((option) => {
              const active = selectedPlan === option.id;
              return <button key={option.id} type="button" aria-pressed={active} onClick={() => setAnswers((current) => ({ ...current, q8_plan: [option.id] }))} className={`flex min-h-14 items-center justify-between border px-5 py-3 text-left text-sm font-bold leading-7 transition ${active ? 'border-[#8C635B] bg-[#F0E5E0] text-[#2D2D2D]' : 'border-[#D1D1C7] bg-white text-[#5F574F]'}`}><span>{option.label}</span><span>{active ? '✓' : ''}</span></button>;
            })}
          </div>
        </section>
      )}

      <div className="mt-9 flex items-center justify-between gap-4">
        <button type="button" disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="px-3 py-3 text-sm font-bold text-[#70665D] disabled:invisible">上一步</button>
        <button type="button" disabled={!canContinue} onClick={next} className="min-w-40 bg-[#8C635B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#754F48] disabled:cursor-not-allowed disabled:opacity-35">
          {step === DAILY_AWARENESS_STEPS.length - 1 ? '完成今日照鏡' : '下一題'}
        </button>
      </div>
      <p className="mt-8 border-l-4 border-[#B59E7B] bg-white px-5 py-4 text-xs leading-6 text-[#70665D]">這些題目只記錄今天。系統會把商品表現、感受、看盤頻率與行動放在一起，於結果最後提供一段「可能的預期心態」供你核對；它不會改變你的動物人格。</p>
    </section>
  );
};

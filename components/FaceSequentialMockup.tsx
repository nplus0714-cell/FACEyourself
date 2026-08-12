import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import {
  FACE_SEQUENTIAL_MOCKUP_QUESTIONS,
  MOCK_DIMENSIONS,
  MOCK_TRAIT_LABELS,
  MockAnswer,
  scoreSequentialMockup,
} from '../data/faceSequentialMockup';

interface Props { onExit: () => void; }

const SCALE: Array<{ answer: MockAnswer; label: string }> = [
  { answer: 'very_a', label: '非常接近 A' },
  { answer: 'somewhat_a', label: '比較接近 A' },
  { answer: 'balanced', label: '兩者都會／看情況' },
  { answer: 'somewhat_b', label: '比較接近 B' },
  { answer: 'very_b', label: '非常接近 B' },
];

const AGREEMENT_SCALE: Array<{ answer: MockAnswer; label: string }> = [
  { answer: 'very_a', label: '非常同意' },
  { answer: 'somewhat_a', label: '有點同意' },
  { answer: 'balanced', label: '中立／不一定' },
  { answer: 'somewhat_b', label: '有點不同意' },
  { answer: 'very_b', label: '非常不同意' },
];

const sectionLabel = (id: number) => id <= 8 ? '直覺題' : id <= 16 ? '圖片題' : id <= 24 ? '同意程度題' : '兩階段情境題';

export const FaceSequentialMockup: React.FC<Props> = ({ onExit }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, MockAnswer>>({});
  const [finished, setFinished] = useState(false);
  const question = FACE_SEQUENTIAL_MOCKUP_QUESTIONS[index];
  const result = useMemo(() => scoreSequentialMockup(answers), [answers]);

  const choose = (answer: MockAnswer) => {
    setAnswers((previous) => ({ ...previous, [question.id]: answer }));
    if (index === FACE_SEQUENTIAL_MOCKUP_QUESTIONS.length - 1) setFinished(true);
    else setIndex((value) => value + 1);
  };

  const restart = () => { setAnswers({}); setIndex(0); setFinished(false); window.scrollTo({ top: 0 }); };

  if (finished) {
    const insufficient = result.notApplicableCount > 8;
    return (
      <div className="mx-auto max-w-5xl px-1 py-8 sm:px-5 sm:py-14">
        <div className="border border-[#D4CCC1] bg-[#FBF9F5] p-6 shadow-[0_20px_60px_rgba(70,55,43,0.08)] sm:p-10 lg:p-14">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D8D0C5] pb-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.24em] text-[#9A6B61]">FACE 2.0 · MOCKUP RESULT</p>
              <h1 className="mt-3 serif text-3xl text-[#2D2D2D] sm:text-5xl">你的測試代碼：{result.code}</h1>
            </div>
            <span className="border border-[#BFAFA1] bg-white px-4 py-2 text-xs tracking-[0.14em] text-[#6E6259]">僅供審稿 · 未儲存</span>
          </div>

          {insufficient && (
            <div className="mt-6 border border-[#B98A83] bg-[#F8EFED] px-5 py-4 text-sm leading-7 text-[#75463F]" role="alert">
              問卷回答缺少足夠數據，產出結果可能失真。你在 16 題連續情境中有 {result.notApplicableCount} 題選擇「這個情境不適用於我」。
            </div>
          )}

          <section className="mt-9 grid gap-7 md:grid-cols-2">
            {MOCK_DIMENSIONS.map(({ key, label, left, right }) => (
              <div key={key} className="border border-[#DDD6CD] bg-white p-5">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-[10px] font-bold tracking-[0.2em] text-[#9A6B61]">{key}</p><h2 className="mt-1 text-lg text-[#332F2B]">{label}</h2></div>
                  <p className="text-sm text-[#766C64]">{MOCK_TRAIT_LABELS[left]} {result.scores[left]}% · {MOCK_TRAIT_LABELS[right]} {result.scores[right]}%</p>
                </div>
                <div className="mt-5 flex h-3 overflow-hidden bg-[#DDE2E3]" aria-label={`${MOCK_TRAIT_LABELS[left]} ${result.scores[left]}%，${MOCK_TRAIT_LABELS[right]} ${result.scores[right]}%`}>
                  <span className="bg-[#9A6B61]" style={{ width: `${result.scores[left]}%` }} />
                  <span className="flex-1 bg-[#65747A]" />
                </div>
                <div className="mt-3 flex justify-between text-xs font-bold text-[#5E554F]"><span>{left} · {MOCK_TRAIT_LABELS[left]}</span><span>{right} · {MOCK_TRAIT_LABELS[right]}</span></div>
              </div>
            ))}
          </section>

          <section className="mt-10 border-t border-[#D8D0C5] pt-8">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#9A6B61]">SEQUENTIAL CONSISTENCY</p>
            <h2 className="mt-2 serif text-2xl text-[#2D2D2D]">連續情境同向加成檢查</h2>
            <p className="mt-3 text-sm leading-7 text-[#756B63]">同組兩題皆明確選向同一側時，該行為模式加 2 點；中立、不適用或方向改變都不加分。</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {result.bonuses.map((bonus) => (
                <div key={bonus.group} className={`flex items-center justify-between gap-4 border px-4 py-4 ${bonus.trait ? 'border-[#B99B8E] bg-[#F8F1EC]' : 'border-[#DDD6CD] bg-white'}`}>
                  <div><span className="text-xs font-black tracking-[0.14em] text-[#8C635B]">{bonus.group}</span><p className="mt-1 text-sm text-[#3D3834]">{bonus.title}</p></div>
                  <span className="whitespace-nowrap text-xs font-bold text-[#625A53]">{bonus.trait ? `${bonus.trait} +2` : '無加成'}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={restart} className="flex min-h-13 flex-1 items-center justify-center gap-2 border border-[#4A382D] bg-[#4A382D] px-6 py-4 text-sm font-bold tracking-[0.12em] text-white hover:bg-[#34261F]"><RotateCcw size={16} />重新測驗</button>
            <button type="button" onClick={onExit} className="min-h-13 flex-1 border border-[#B9B0A5] bg-white px-6 py-4 text-sm font-bold tracking-[0.12em] text-[#4E4741] hover:bg-[#F5F1EB]">離開 Mockup</button>
          </div>
        </div>
      </div>
    );
  }

  const imageMode = Boolean(question.imageA);
  return (
    <div className="mx-auto max-w-5xl px-1 py-5 sm:px-5 sm:py-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <button type="button" onClick={() => index > 0 ? setIndex(index - 1) : onExit()} className="flex items-center gap-2 text-sm text-[#6C625B] hover:text-[#2D2D2D]"><ArrowLeft size={17} />{index > 0 ? '上一題' : '離開'}</button>
        <span className="border border-[#CFC6BA] bg-white/80 px-3 py-2 text-[10px] font-bold tracking-[0.18em] text-[#8C635B]">MOCKUP · 不會儲存</span>
      </div>

      <div className="h-1 overflow-hidden bg-[#E1DAD1]"><div className="h-full bg-[#8C635B] transition-all" style={{ width: `${((index + 1) / 40) * 100}%` }} /></div>
      <div className="mt-4 flex items-center justify-between text-xs text-[#80766E]"><span>{sectionLabel(question.id)}</span><span>{question.id} / 40</span></div>

      <main className="mt-6 border border-[#D4CCC1] bg-[#FBF9F5] p-5 shadow-[0_18px_55px_rgba(70,55,43,0.07)] sm:p-8 lg:p-11">
        {question.group && (
          <div className="mb-6 border-b border-[#D8D0C5] pb-5">
            <div className="flex items-center justify-between gap-4"><p className="text-[11px] font-bold tracking-[0.2em] text-[#9A6B61]">{question.group} · {question.groupTitle}</p><p className="text-xs font-bold text-[#6E645D]">情境進展 {question.stage} / 2</p></div>
            <div className="mt-3 grid grid-cols-2 gap-2">{[1, 2].map((stage) => <span key={stage} className={`h-1 ${stage <= (question.stage ?? 0) ? 'bg-[#8C635B]' : 'bg-[#DED7CE]'}`} />)}</div>
          </div>
        )}
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#8C635B]">{question.dimension} · {question.title}</p>
        <h1 className="mt-4 serif text-2xl leading-[1.55] text-[#2D2D2D] sm:text-3xl lg:text-[2.15rem]">{question.prompt}</h1>

        {imageMode ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {([['very_a', 'A', question.shortA, question.optionA, question.imageA], ['very_b', 'B', question.shortB, question.optionB, question.imageB]] as const).map(([answer, side, shortLabel, description, src]) => (
              <button key={side} type="button" onClick={() => choose(answer)} className={`group flex h-full flex-col overflow-hidden border bg-white text-left transition hover:-translate-y-0.5 hover:border-[#8C635B] hover:shadow-lg ${answers[question.id] === answer ? 'border-[#8C635B] ring-2 ring-[#8C635B]/20' : 'border-[#D6CEC4]'}`}>
                {question.kind === 'intuition' && (
                  <span className="flex min-h-20 items-center gap-4 border-b border-[#E2DCD4] px-5 py-4 sm:px-6">
                    <strong className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base text-white ${side === 'A' ? 'bg-[#9A6B61]' : 'bg-[#65747A]'}`}>{side}</strong>
                    <span className="text-lg font-bold leading-7 text-[#302C29] sm:text-xl">{shortLabel}</span>
                  </span>
                )}
                <span className={`flex w-full items-center justify-center overflow-hidden bg-[#F7F4EF] ${question.kind === 'image' ? 'aspect-[2/3]' : 'aspect-[4/3] p-2 sm:p-3'}`}>
                  <img src={src} alt={`${side}：${description}`} className="h-full w-full object-contain" />
                </span>
                {question.kind === 'intuition' && (
                  <span className="flex min-h-24 flex-1 items-center border-t border-[#E2DCD4] px-5 py-4 text-sm font-medium leading-7 text-[#5D554F] sm:px-6 sm:text-[15px]">{description}</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <>
            {question.kind !== 'agreement' && <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="border border-[#CDBCB2] bg-[#F7EFEA] p-5"><p className="text-xs font-black tracking-[0.18em] text-[#8C635B]">A</p><p className="mt-3 text-[15px] leading-7 text-[#403934]">{question.optionA}</p></div>
              <div className="border border-[#BEC8CB] bg-[#EEF2F2] p-5"><p className="text-xs font-black tracking-[0.18em] text-[#56676D]">B</p><p className="mt-3 text-[15px] leading-7 text-[#384246]">{question.optionB}</p></div>
            </div>}
            <div className="mt-6 grid gap-2 sm:grid-cols-5">
              {(question.kind === 'agreement' ? AGREEMENT_SCALE : SCALE).map(({ answer, label }, scaleIndex) => (
                <button key={answer} type="button" onClick={() => choose(answer)} className={`min-h-14 border px-3 py-3 text-xs font-bold leading-5 transition hover:border-[#8C635B] ${answers[question.id] === answer ? 'border-[#8C635B] bg-[#8C635B] text-white' : scaleIndex < 2 ? 'border-[#D5C4BA] bg-[#FAF2ED] text-[#76554D]' : scaleIndex > 2 ? 'border-[#C6D0D2] bg-[#F0F4F4] text-[#53646A]' : 'border-[#D4CEC6] bg-white text-[#655D57]'}`}>{answers[question.id] === answer && <Check size={13} className="mr-1 inline" />}{label}</button>
              ))}
            </div>
            {question.group && <button type="button" onClick={() => choose('not_applicable')} className={`mt-4 w-full border px-5 py-3 text-xs font-bold tracking-[0.08em] transition ${answers[question.id] === 'not_applicable' ? 'border-[#80756C] bg-[#80756C] text-white' : 'border-dashed border-[#BDB5AC] bg-transparent text-[#756C65] hover:bg-white'}`}>這個情境不適用於我</button>}
          </>
        )}
      </main>
      <p className="mt-5 text-center text-xs leading-6 text-[#8A817A]">沒有標準答案，請選擇更接近你平常實際反應的一側。</p>
    </div>
  );
};

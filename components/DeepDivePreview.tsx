import React, { useState } from 'react';
import { DEEP_DIVE_PREVIEWS } from '../data/deepDivePreview';
import { FACE_MAP } from '../constants';

interface DeepDivePreviewProps {
  code: string;
  onBack: () => void;
}

export const DeepDivePreview: React.FC<DeepDivePreviewProps> = ({ code, onBack }) => {
  const preview = DEEP_DIVE_PREVIEWS[code];
  const role = FACE_MAP[code];
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const tone = code.startsWith('A') ? '#9A655C' : '#667784';

  if (!preview || !role) {
    return (
      <section className="mx-auto max-w-3xl py-24 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE DEEP DIVE · PROTOTYPE</p>
        <h1 className="mt-5 serif text-4xl text-[#2D2D2D]">這一型的預覽尚未製作</h1>
        <p className="mt-5 text-base leading-8 text-[#70665D]">目前先以 ARTC 獵豹狙擊手確認內容深度與版型，再決定是否擴展到其餘 15 型。</p>
        <button type="button" onClick={onBack} className="mt-9 border border-[#2D2D2D] px-7 py-3 text-sm font-bold">回到人格結果</button>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-6xl pb-28 fade-in">
      <button type="button" onClick={onBack} className="mb-7 text-sm font-bold text-[#70665D] transition hover:text-[#2D2D2D]">← 回到 {preview.name} 結果</button>

      <header className="overflow-hidden border border-[#CFC6B8] bg-[#F3EDE6]">
        <div className="grid md:grid-cols-[0.78fr_1.22fr]">
          <div className="relative min-h-[24rem] overflow-hidden bg-white">
            <img src={role.landscapeImageUrl} alt={preview.name} className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/35 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 bg-[#2D2D2D] px-3 py-2 text-[11px] font-bold tracking-[0.16em] text-white">{preview.code} · {preview.animal}</span>
          </div>
          <div className="flex flex-col justify-center px-7 py-12 md:px-14 md:py-16">
            <p className="text-xs font-bold tracking-[0.2em]" style={{ color: tone }}>FACE DEEP DIVE</p>
            <p className="mt-3 text-sm font-bold tracking-[0.08em] text-[#70665D]">{preview.eyebrow}</p>
            <h1 className="mt-6 serif text-4xl leading-[1.55] text-[#2D2D2D] md:text-5xl">{preview.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-[2] text-[#5F574F]">{preview.introduction}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-14 max-w-5xl space-y-16 md:mt-20 md:space-y-24">
        <aside className="border-l-4 bg-white px-6 py-5 text-sm leading-7 text-[#5F574F]" style={{ borderColor: tone }}>
          這是生存包的免費預覽體驗，只展開一條常見壓力路徑。它不是完整人格報告、心理診斷或投資建議，也不會替你判斷這筆交易該買、賣或續抱。
        </aside>

        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <div><p className="font-mono text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>01</p><h2 className="mt-2 serif text-3xl text-[#2D2D2D]">壓力現場</h2></div>
          <div className="border border-[#D1D1C7] bg-white p-7 md:p-10">
            <p className="text-xs font-bold tracking-[0.14em]" style={{ color: tone }}>MARKET SCENE</p>
            <h3 className="mt-4 serif text-3xl leading-[1.6] text-[#2D2D2D]">{preview.scene.title}</h3>
            <p className="mt-5 text-lg leading-[2] text-[#5F574F]">{preview.scene.body}</p>
            <p className="mt-7 border-t border-[#D1D1C7] pt-6 text-sm leading-8 text-[#70665D]">{preview.scene.marketNote}</p>
          </div>
        </section>

        <section className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-2">
          <div className="bg-[#F7F4EF] p-8 md:p-11">
            <p className="text-xs font-bold tracking-[0.14em]" style={{ color: tone }}>02 · PRESSURE SWITCH</p>
            <h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D]">{preview.pressureSwitch.title}</h2>
            <p className="mt-5 text-base leading-[2] text-[#5F574F]">{preview.pressureSwitch.body}</p>
          </div>
          <div className="bg-white p-8 md:p-11">
            <p className="text-xs font-bold tracking-[0.14em]" style={{ color: tone }}>03 · {preview.instinct.label}</p>
            <blockquote className="mt-5 serif text-3xl leading-[1.65] text-[#2D2D2D]">「{preview.instinct.thought}」</blockquote>
            <p className="mt-5 text-base leading-[2] text-[#5F574F]">{preview.instinct.body}</p>
          </div>
        </section>

        <section>
          <div className="text-center"><p className="text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>04 · LOSS OF CONTROL CHAIN</p><h2 className="mt-4 serif text-3xl text-[#2D2D2D] md:text-4xl">一條可能的失控鏈</h2></div>
          <ol className="mt-9 grid gap-3 md:grid-cols-5">
            {preview.chain.map((step, index) => (
              <li key={step.label} className="relative border border-[#D1D1C7] bg-white p-6">
                <span className="font-mono text-xs font-bold" style={{ color: tone }}>0{index + 1}</span>
                <h3 className="mt-5 font-bold text-[#2D2D2D]">{step.label}</h3>
                <p className="mt-3 text-sm leading-7 text-[#70665D]">{step.body}</p>
                {index < preview.chain.length - 1 && <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 bg-[#F7F4EF] px-1 text-[#B59E7B] md:block">→</span>}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-[#D1D1C7] py-12 md:py-16">
          <p className="text-center text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>05 · PAUSE AND CHOOSE</p>
          <h2 className="mt-4 text-center serif text-3xl leading-[1.6] text-[#2D2D2D]">{preview.choice.prompt}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {preview.choice.options.map((option, index) => (
              <button key={option.label} type="button" onClick={() => setSelectedChoice(index)} className={`min-h-28 border p-6 text-left transition ${selectedChoice === index ? 'border-[#2D2D2D] bg-[#2D2D2D] text-white' : 'border-[#D1D1C7] bg-white text-[#2D2D2D] hover:border-[#8C635B]'}`}>
                <span className="font-mono text-xs opacity-60">{String.fromCharCode(65 + index)}</span>
                <span className="mt-3 block text-lg font-bold">{option.label}</span>
              </button>
            ))}
          </div>
          {selectedChoice !== null && <div className="mt-5 border-l-4 bg-[#F1EAE2] p-6 text-base leading-8 text-[#493E37]" style={{ borderColor: tone }}><b className="mr-2">鏡面提示</b>{preview.choice.options[selectedChoice].reflection}</div>}
        </section>

        <section className="grid gap-7 md:grid-cols-[10rem_1fr]">
          <div><p className="font-mono text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>06</p><h2 className="mt-2 serif text-3xl text-[#2D2D2D]">帶走一個工具</h2></div>
          <div className="overflow-hidden border border-[#2D2D2D] bg-white">
            <div className="bg-[#2D2D2D] px-7 py-6 text-white md:px-10"><p className="text-xs font-bold tracking-[0.16em] text-white/55">FREE RESET CARD</p><h3 className="mt-3 serif text-3xl">{preview.resetCard.title}</h3></div>
            <div className="p-7 md:p-10">
              <p className="font-bold leading-8" style={{ color: tone }}>{preview.resetCard.duration}</p>
              <ol className="mt-6 space-y-4">
                {preview.resetCard.questions.map((question, index) => <li key={question} className="flex gap-4 border-t border-[#D1D1C7] pt-4 text-base leading-8 text-[#493E37]"><span className="font-mono text-xs font-bold" style={{ color: tone }}>0{index + 1}</span><span>{question}</span></li>)}
              </ol>
              <p className="mt-7 bg-[#F7F4EF] px-5 py-4 text-sm font-bold leading-7 text-[#2D2D2D]">{preview.resetCard.rule}</p>
            </div>
          </div>
        </section>

        <section className="px-7 py-14 text-center text-white md:px-16 md:py-20" style={{ backgroundColor: tone }}>
          <p className="text-xs font-bold tracking-[0.18em] text-white/65">07 · THE UNRESOLVED QUESTION</p>
          <h2 className="mx-auto mt-6 max-w-4xl serif text-3xl leading-[1.75] md:text-4xl">{preview.unresolvedQuestion}</h2>
        </section>

        <section className="border border-[#CFC6B8] bg-[#F1EAE2] px-7 py-12 text-center md:px-14 md:16">
          <p className="text-xs font-bold tracking-[0.18em]" style={{ color: tone }}>TRADING SURVIVAL KIT</p>
          <h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D]">這裡才會接到你定義的交易生存包</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5F574F]">Deep Dive 到這裡結束。生存包要提供哪些完整工具、章節與交付內容，會等你把構想交給我後再設計，不在這份預覽裡擅自承諾。</p>
          <button type="button" disabled className="mt-8 cursor-not-allowed bg-[#2D2D2D] px-8 py-4 text-sm font-bold tracking-[0.08em] text-white opacity-55">交易生存包｜內容準備中</button>
        </section>
      </div>
    </article>
  );
};

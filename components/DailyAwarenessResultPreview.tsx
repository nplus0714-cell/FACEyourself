import React from 'react';
import { FACE_MAP } from '../constants';
import type { DailyAwarenessResult } from '../data/dailyAwarenessPreview';

interface DailyAwarenessResultPreviewProps {
  result: DailyAwarenessResult;
  faceCode?: string | null;
  onBack: () => void;
  onOpenJournal?: () => void;
}

const STATUS_TONE: Record<string, string> = {
  stable: '#56705A', fluctuating: '#667784', conflicted: '#9A725A', deviated: '#A06050', pause_needed: '#8C4E4B', not_observed: '#70665D',
};

export const DailyAwarenessResultPreview: React.FC<DailyAwarenessResultPreviewProps> = ({ result, faceCode, onBack, onOpenJournal }) => {
  const role = FACE_MAP[faceCode ?? result.faceCode] ?? FACE_MAP.ARTC;
  const statusTone = STATUS_TONE[result.statusCode] ?? '#8C635B';

  return (
    <article className="mx-auto max-w-6xl pb-28 fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="text-sm font-bold text-[#70665D]">← 返回今日覺察</button>
        <p className="text-xs font-bold tracking-[0.16em] text-[#8C635B]">FACE DAILY v1 · 可測 Prototype</p>
      </div>

      <section className="border border-[#74564A] bg-[#F8F4EE] p-2 shadow-[0_20px_60px_rgba(73,55,45,0.10)] md:p-3">
        <div className="border border-[#D8CDBD] bg-[#FBFAF7]">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D8CDBD] px-6 py-5 md:px-9">
            <div><p className="text-[10px] font-bold tracking-[0.2em] text-[#8C635B]">TODAY'S FACE · PRIVATE RECORD</p><p className="mt-2 text-sm font-bold text-[#2D2D2D]">{role.name}的每日照鏡</p></div>
            <span className="px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: statusTone }}>今日狀態：{result.statusLabel}</span>
          </header>

          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="relative min-h-[23rem] overflow-hidden border-b border-[#D8CDBD] bg-[#EDE5DB] lg:min-h-[45rem] lg:border-b-0 lg:border-r">
              <img src={role.landscapeImageUrl} alt={role.name} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/75 via-[#2D2D2D]/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white"><p className="text-[10px] font-bold tracking-[0.2em] text-white/70">固定交易人格 · {role.code}</p><h2 className="mt-2 serif text-3xl">{role.name}</h2><p className="mt-3 text-sm leading-7 text-white/80">人格沒有改變；今天記錄的是市場如何拉動這套交易本能。</p></div>
            </aside>

            <div className="px-6 py-9 md:px-10 md:py-12 lg:px-12">
              <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">今天較接近</p>
              <h1 className="mt-4 serif text-4xl leading-[1.5] text-[#2D2D2D] md:text-5xl">{result.patternLabel}</h1>
              <p className="mt-6 text-base leading-[2] text-[#5F574F] md:text-lg">{result.summary}</p>

              <div className="mt-8 grid gap-px border border-[#D1D1C7] bg-[#D1D1C7] sm:grid-cols-5">
                <div className="bg-white px-5 py-5"><p className="text-[10px] font-bold tracking-[0.16em] text-[#8C7E6D]">商品表現</p><p className="mt-2 font-bold text-[#2D2D2D]">{result.marketLabel}</p></div>
                <div className="bg-white px-5 py-5"><p className="text-[10px] font-bold tracking-[0.16em] text-[#8C7E6D]">情緒波動</p><p className="mt-2 font-bold text-[#2D2D2D]">{result.emotionLevel}</p></div>
                <div className="bg-white px-5 py-5"><p className="text-[10px] font-bold tracking-[0.16em] text-[#8C7E6D]">看盤頻率</p><p className="mt-2 font-bold text-[#2D2D2D]">{result.checkFrequencyLabel ?? '未記錄'}</p></div>
                <div className="bg-white px-5 py-5"><p className="text-[10px] font-bold tracking-[0.16em] text-[#8C7E6D]">行情影響</p><p className="mt-2 font-bold text-[#2D2D2D]">{result.priceInfluenceLabel ?? '未記錄'}</p></div>
                <div className="bg-white px-5 py-5"><p className="text-[10px] font-bold tracking-[0.16em] text-[#8C7E6D]">行為偏離</p><p className="mt-2 font-bold text-[#2D2D2D]">{result.actionLevel}</p></div>
              </div>

              <section className="mt-8 border-l-4 border-[#8C635B] bg-[#F3EFE9] px-6 py-5"><p className="text-[10px] font-bold tracking-[0.18em] text-[#8C635B]">今天值得記住</p><p className="mt-3 serif text-2xl leading-9 text-[#2D2D2D]">{result.insight}</p></section>

              <section className="mt-8"><p className="text-[10px] font-bold tracking-[0.18em] text-[#8C7E6D]">今日一問</p><p className="mt-3 text-xl font-bold leading-9 text-[#2D2D2D]">{result.reflectionQuestion}</p></section>

              <section className="mt-9 border-t border-[#D8CDBD] pt-8">
                <p className="text-[10px] font-bold tracking-[0.18em] text-[#8C635B]">系統反推 · 可能的預期心態</p>
                <p className="mt-3 text-base leading-8 text-[#5F574F]">{result.inferredMindset}</p>
                <p className="mt-3 text-xs leading-6 text-[#8C7E6D]">這是根據今天主要商品的表現、感受詞、看盤頻率與行動反推的覺察假設，不是對你內心的定論。你可以用日記補充或不同意它。</p>
              </section>
            </div>
          </div>

          <footer className="flex flex-col justify-between gap-4 border-t border-[#D8CDBD] px-6 py-7 sm:flex-row sm:items-center md:px-10">
            <p className="text-xs leading-6 text-[#8C7E6D]">同一天再次完成會覆蓋今日結果，但保留你已寫的日記文字。</p>
            <button type="button" onClick={onOpenJournal} className="bg-[#4A382D] px-7 py-4 text-sm font-bold text-white">進入我的自我覺察日記</button>
          </footer>
        </div>
      </section>
    </article>
  );
};

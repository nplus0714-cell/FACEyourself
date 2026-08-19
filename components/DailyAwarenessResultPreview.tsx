import React from 'react';
import { FACE_MAP } from '../constants';
import type { DailyAwarenessResult } from '../data/dailyAwarenessPreview';

interface DailyAwarenessResultPreviewProps {
  result: DailyAwarenessResult;
  faceCode?: string | null;
  onBack: () => void;
  onOpenJournal?: () => void;
}

export const DailyAwarenessResultPreview: React.FC<DailyAwarenessResultPreviewProps> = ({ result, faceCode, onBack, onOpenJournal }) => {
  const role = FACE_MAP[faceCode ?? result.faceCode] ?? FACE_MAP.ARTC;
  const reflectionText = result.reflectionText ?? result.inferredMindset ?? result.summary;

  return (
    <article className="mx-auto max-w-5xl pb-28 fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="text-[14px] font-medium leading-[1.6] text-[#70665D]">← 返回今日覺察</button>
        <p className="text-[13px] font-normal leading-[1.7] tracking-[0.16em] text-[#8C635B]">FACE DAILY · PRIVATE</p>
      </div>

      <section className="border border-[#74564A] bg-[#F8F4EE] p-2 shadow-[0_20px_60px_rgba(73,55,45,0.10)] md:p-3">
        <div className="border border-[#D8CDBD] bg-[#FBFAF7]">
          <header className="border-b border-[#D8CDBD] px-6 py-5 md:px-9">
            <p className="text-[13px] font-normal leading-[1.7] tracking-[0.16em] text-[#8C635B]">TODAY'S FACE · 今日照鏡</p>
          </header>

          <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="relative min-h-[20rem] overflow-hidden border-b border-[#D8CDBD] bg-[#EDE5DB] lg:min-h-[38rem] lg:border-b-0 lg:border-r">
              <img src={role.landscapeImageUrl} alt={role.name} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/72 via-[#2D2D2D]/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-[12px] font-normal leading-[1.65] tracking-[0.16em] text-white/70">固定交易人格 · {role.code}</p>
                <h2 className="mt-2 serif text-3xl font-normal">{role.name}</h2>
              </div>
            </aside>

            <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-14 lg:px-12">
              <p className="text-[13px] font-normal leading-[1.7] tracking-[0.16em] text-[#9A655C]">今天真正影響你的，可能是什麼？</p>
              <p className="mt-6 serif text-[1.45rem] font-normal leading-[1.9] text-[#352E2A] md:text-[1.85rem]">{reflectionText}</p>
              <p className="mt-8 border-t border-[#D8CDBD] pt-5 text-[15px] font-normal leading-[1.9] text-[#766B62]">
                這是一段根據今天回答形成的覺察假設，不是對你內心的定論。你可以保留、補充，也可以不同意它。
              </p>
            </div>
          </div>

          <footer className="flex flex-col justify-between gap-4 border-t border-[#D8CDBD] px-6 py-7 sm:flex-row sm:items-center md:px-10">
            <p className="text-[13px] font-normal leading-[1.7] text-[#8C7E6D]">同一天再次完成，會以最新一次的覺察文字更新今日紀錄。</p>
            {onOpenJournal && (
              <button type="button" onClick={onOpenJournal} className="bg-[#4A382D] px-7 py-4 text-[14px] font-medium leading-[1.6] text-white">
                進入我的自我覺察日記
              </button>
            )}
          </footer>
        </div>
      </section>
    </article>
  );
};

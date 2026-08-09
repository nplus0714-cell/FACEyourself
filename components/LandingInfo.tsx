import React from 'react';
import { SurvivalKitPricing } from './SurvivalKitPricing';

interface LandingInfoProps {
  onStartTest: () => void;
  onExploreTypes: () => void;
  onOpenContent: () => void;
  onAbout: () => void;
}

export const LandingInfo: React.FC<LandingInfoProps> = ({ onStartTest, onExploreTypes, onOpenContent, onAbout }) => (
  <section className="mx-auto mt-12 max-w-6xl space-y-16 pb-24 pt-12 md:mt-20 md:space-y-24 md:pt-20" aria-label="FACE 介紹">
    <div className="border-y border-[#D1D1C7] py-12 text-center md:py-16">
      <p className="text-xs font-bold tracking-[0.28em] text-[#8C635B]">WHAT IS FACE</p>
      <h2 className="mx-auto mt-5 max-w-3xl serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-5xl">不是幫你找標準答案，<br className="hidden md:block" />而是找出你能持續執行的方式。</h2>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-[2] text-[#70665D] md:text-lg">FACE 從機會、判斷、節奏與風險承受度四個方向，陪你看見自己的交易習慣。</p>
      <button type="button" onClick={onAbout} className="mt-8 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D]">認識 FACE →</button>
    </div>

    <div className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-3">
      <button type="button" onClick={onStartTest} className="group min-h-64 bg-[#F7F4EF] p-8 text-left transition hover:bg-white md:p-10">
        <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">01 · TEST</p>
        <h3 className="mt-12 serif text-3xl text-[#2D2D2D]">交易人格測驗</h3>
        <p className="mt-5 text-base leading-[1.9] text-[#70665D]">用 40 題，整理你在真實交易情境裡的第一反應。</p>
        <p className="mt-8 text-sm font-bold text-[#2D2D2D] group-hover:text-[#8C635B]">開始探索 →</p>
      </button>
      <button type="button" onClick={onExploreTypes} className="group min-h-64 bg-white p-8 text-left transition hover:bg-[#F7F4EF] md:p-10">
        <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">02 · TYPES</p>
        <h3 className="mt-12 serif text-3xl text-[#2D2D2D]">人格圖鑑</h3>
        <p className="mt-5 text-base leading-[1.9] text-[#70665D]">先看看不同交易人格的優勢、盲點與壓力反應。</p>
        <p className="mt-8 text-sm font-bold text-[#2D2D2D] group-hover:text-[#8C635B]">瀏覽 16 型 →</p>
      </button>
      <button type="button" onClick={onOpenContent} className="group min-h-64 bg-[#F7F4EF] p-8 text-left transition hover:bg-white md:p-10">
        <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">03 · LIBRARY</p>
        <h3 className="mt-12 serif text-3xl text-[#2D2D2D]">影片與專欄</h3>
        <p className="mt-5 text-base leading-[1.9] text-[#70665D]">在 FACE 站內看影片、讀文章，慢慢建立自己的交易語言。</p>
        <p className="mt-8 text-sm font-bold text-[#2D2D2D] group-hover:text-[#8C635B]">進入內容中心 →</p>
      </button>
    </div>

    <SurvivalKitPricing />
  </section>
);

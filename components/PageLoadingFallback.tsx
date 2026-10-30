import React from 'react';

const SKELETON_CARDS = [0, 1, 2] as const;

export const PageLoadingFallback: React.FC = () => (
  <section className="relative min-h-[32rem] overflow-hidden border border-[#D9CFC2] bg-[#F7F2EC] px-6 py-16 text-center" role="status" aria-live="polite" aria-busy="true">
    <img src="/images/homepage-trading-salon-lineart.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08] mix-blend-multiply" />
    <div className="relative mx-auto max-w-2xl">
      <p className="text-[11px] font-bold tracking-[0.24em] text-[#A36F63]">FACE TRADER · 正在整理內容</p>
      <div className="mx-auto mt-8 h-12 w-12 rounded-full border border-[#B9AA9D] p-2">
        <span className="block h-full w-full animate-pulse rounded-full bg-[#8C635B]/35 motion-reduce:animate-none" />
      </div>
      <h2 className="mt-6 serif text-3xl leading-[1.5] text-[#2D2D2D]">正在翻開下一頁</h2>
      <p className="mt-3 text-sm leading-7 text-[#70665D]">人格圖鑑、文章與深度解讀正在載入中。</p>
      <div className="mt-10 grid gap-3 sm:grid-cols-3" aria-hidden="true">
        {SKELETON_CARDS.map((item) => <div key={item} className="h-24 animate-pulse border border-[#D8CEC2] bg-white/70 motion-reduce:animate-none" />)}
      </div>
    </div>
  </section>
);

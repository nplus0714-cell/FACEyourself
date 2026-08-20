import React from 'react';

interface NotFoundPageProps {
  onHome: () => void;
  onExploreTypes: () => void;
  onOpenContent: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onHome, onExploreTypes, onOpenContent }) => (
  <section className="mx-auto max-w-3xl py-20 text-center sm:py-28">
    <p className="text-xs font-medium tracking-[0.3em] text-[#8C635B]">404 · PAGE NOT FOUND</p>
    <h1 className="mt-6 serif text-5xl leading-[1.35] text-[#2D2D2D] sm:text-6xl">這一頁已經離開原本的路徑</h1>
    <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#70665D]">
      網址可能已更新，或內容仍在整理中。你可以回到首頁、查看 16 型人格，或繼續閱讀交易心理內容。
    </p>
    <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
      <a href="/" onClick={(event) => { event.preventDefault(); onHome(); }} className="bg-[#2D2D2D] px-7 py-4 text-sm font-medium text-white transition hover:bg-black">回到首頁</a>
      <a href="/types" onClick={(event) => { event.preventDefault(); onExploreTypes(); }} className="border border-[#8C7E6D] bg-white px-7 py-4 text-sm font-medium text-[#4A382D] transition hover:bg-[#F3F0EB]">查看 16 型人格</a>
      <a href="/watch" onClick={(event) => { event.preventDefault(); onOpenContent(); }} className="border border-[#D1D1C7] bg-white px-7 py-4 text-sm font-medium text-[#4A382D] transition hover:bg-[#F3F0EB]">前往內容中心</a>
    </div>
  </section>
);

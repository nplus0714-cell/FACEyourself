import React from 'react';

interface PersonalTradingManualProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onOpenMemberHome: () => void;
}

export const PersonalTradingManual: React.FC<PersonalTradingManualProps> = ({ isLoggedIn, onLogin, onOpenMemberHome }) => (
  <div className="mx-auto max-w-5xl pb-24 fade-in">
    <header className="border border-[#D1D1C7] bg-[#FCFBF8] px-7 py-12 text-center sm:px-12 sm:py-16">
      <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE TRADER · 知己交易</p>
      <h1 className="mt-5 serif text-4xl leading-[1.45] text-[#2D2D2D] sm:text-5xl">個人交易使用說明書</h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#625A53]">完整人格分析登入即可免費看；這份規劃中的付費說明書，會把後面的進攻、歸真篇章與交易工具接起來。售價與開放時間尚未確定。</p>
    </header>

    <section className="mt-10 grid gap-px border border-[#D1D1C7] bg-[#D1D1C7] sm:grid-cols-2" aria-label="方案規劃內容">
      {[
        ['01', '進攻篇完整版', '持續獲利：從勝率、賠率、部位與持有節奏，建立能重複執行的方法。'],
        ['02', '歸真篇完整版', '認識自己：把市場條件與你的性格、承受力、生活節奏重新放在一起。'],
        ['03', '從人格分析到個人方法', '承接登入後免費可看的完整人格分析，把優勢與盲點轉成自己的交易規則。'],
        ['04', '交易輔助道具', '承接閱讀後的練習與實際決策；四個道具的內容與交付形式仍在整理。'],
      ].map(([number, title, description]) => <article key={number} className="bg-white p-7 sm:p-9"><p className="font-mono text-xs text-[#9A6D62]">{number}</p><h2 className="mt-3 serif text-2xl text-[#2D2D2D]">{title}</h2><p className="mt-4 text-sm leading-7 text-[#70665D]">{description}</p></article>)}
    </section>

    <section className="mx-auto mt-12 max-w-3xl bg-[#2D2D2D] px-7 py-10 text-center text-white sm:px-12">
      <p className="text-xs font-bold tracking-[0.18em] text-[#D9C7A9]">完整版閱讀權限</p>
      <h2 className="mt-4 serif text-3xl">分析免費，付費內容稍後解鎖</h2>
      <p className="mt-4 text-sm leading-7 text-white/75">登入後可免費看完整人格分析；進攻與歸真目前提供試讀，完整版仍需要付費權限。價格尚未公布，也尚未開放購買。</p>
      {!isLoggedIn ? <button type="button" onClick={onLogin} className="mt-7 min-h-12 bg-white px-7 py-3 text-sm font-bold text-[#2D2D2D]">登入，免費看完整人格分析 →</button> : <div className="mt-7"><p className="border border-white/30 px-6 py-4 text-sm text-white/85">已登入 · 完整人格分析可在「我的 FACE」查看；付費篇章尚未開賣</p><button type="button" onClick={onOpenMemberHome} className="mt-5 border-b border-white pb-1 text-sm font-bold text-white">前往我的 FACE →</button></div>}
    </section>
  </div>
);

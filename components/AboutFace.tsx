import React from 'react';

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61585260510757&locale=zh_TW' },
  { label: 'Instagram', href: 'https://www.instagram.com/the_trading_post234/' },
  { label: 'Threads', href: 'https://www.threads.com/@the_trading_post234?xmt=AQF0L-LuDhBrr-ph13qsPUU4fAPWhMiGrETCyAWw6c6fOHk' },
];

interface AboutFaceProps {
  onGoToMirrorTrade: () => void;
}

export const AboutFace: React.FC<AboutFaceProps> = ({ onGoToMirrorTrade }) => (
  <div className="mx-auto max-w-6xl space-y-20 pb-28 pt-2 fade-in md:space-y-28 md:pt-8">
    <header className="grid overflow-hidden border border-[#D1D1C7] bg-[#F4F0E9] md:grid-cols-[1.1fr_0.9fr]">
      <div className="p-8 md:p-14 lg:p-16">
        <p className="text-xs font-bold tracking-[0.3em] text-[#8C635B]">ABOUT FACE</p>
        <h1 className="mt-6 serif text-4xl leading-[1.5] text-[#2D2D2D] md:text-6xl">先看懂自己，<br />再看懂市場。</h1>
        <p className="mt-7 max-w-xl text-base leading-[2] text-[#70665D] md:text-lg">FACE 是一套交易自我覺察工具。它不替你選標的，也不告訴你買賣答案；它幫你看見自己習慣怎麼面對機會、波動、決策與風險。</p>
      </div>
      <div className="relative min-h-72 overflow-hidden bg-[#2D2D2D] p-8 text-white md:p-14">
        <span className="absolute -right-6 -top-10 serif text-[14rem] leading-none text-white/[0.06]">F</span>
        <div className="relative flex h-full flex-col justify-between"><p className="text-xs font-bold tracking-[0.24em] text-white/50">TRADING SELF-AWARENESS</p><p className="max-w-sm serif text-3xl leading-[1.65] md:text-4xl">投資沒有標準答案，只有比較適合你的交易方式。</p></div>
      </div>
    </header>

    <section className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">WHY FACE</p>
      <h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-5xl">你不需要變成別人，<br />而是需要更了解自己。</h2>
      <p className="mt-7 text-base leading-[2.05] text-[#70665D] md:text-lg">很多交易困擾，表面上是選股、進場或停損；更深一層，常常是方法和自己的性格、生活狀態不一致。FACE 想做的，是提供一面鏡子，讓你先辨識這些差異。</p>
    </section>

    <section className="grid items-center gap-10 border-y border-[#D1D1C7] py-12 md:grid-cols-[0.9fr_1.1fr] md:py-20">
      <div className="relative mx-auto w-full max-w-sm"><div className="absolute -left-4 -top-4 h-full w-full border border-[#8C635B]/25" /><img src="/images/NPC Bartender.jpg" alt="FACE Founder" className="relative aspect-square w-full object-cover grayscale-[0.2]" loading="lazy" /></div>
      <div><p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">FOUNDER'S NOTE</p><h2 className="mt-5 serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-5xl">交易不是考試，<br />但每一次選擇都值得回頭看。</h2><p className="mt-7 text-base leading-[2.05] text-[#70665D] md:text-lg">FACE 來自「上班不要 Trade」與「交易解憂 Bar」想做的一件事：讓交易者能夠把困擾說清楚，而不只是反覆追問下一檔標的。從一次測驗、一篇文章或一支影片開始，慢慢建立屬於自己的交易語言。</p></div>
    </section>

    <section className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-3">
      <article className="bg-white p-7 md:p-9"><p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE DOES</p><h2 className="mt-5 serif text-3xl text-[#2D2D2D]">幫你整理自己</h2><p className="mt-5 text-sm leading-[1.9] text-[#70665D]">從習慣、壓力反應與交易節奏，找到值得持續觀察的地方。</p></article>
      <article className="bg-white p-7 md:p-9"><p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE DOES NOT</p><h2 className="mt-5 serif text-3xl text-[#2D2D2D]">不替你報明牌</h2><p className="mt-5 text-sm leading-[1.9] text-[#70665D]">它不是投資建議、心理診斷或適合度評估，也不替你決定該買什麼。</p></article>
      <article className="bg-white p-7 md:p-9"><p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FOR YOU</p><h2 className="mt-5 serif text-3xl text-[#2D2D2D]">適合願意回頭看的人</h2><p className="mt-5 text-sm leading-[1.9] text-[#70665D]">不論剛開始交易，或已累積許多經驗，只要你想理解自己的選擇，都可以從 FACE 開始。</p></article>
    </section>

    <section className="grid gap-5 md:grid-cols-3">
      {[['01', '做測驗', '用 40 題了解目前的交易傾向。'], ['02', '看內容', '用影片與專欄，把感覺變成可以整理的觀察。'], ['03', '需要時再聊', '當問題真的困擾你，再主動進入 LINE@ 諮詢。']].map(([number, title, copy]) => <article key={number} className="border border-[#D1D1C7] bg-[#F7F4EF] p-7 md:p-8"><p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">{number}</p><h3 className="mt-8 serif text-3xl text-[#2D2D2D]">{title}</h3><p className="mt-4 text-sm leading-[1.9] text-[#70665D]">{copy}</p></article>)}
    </section>

    <section className="mx-auto max-w-2xl border border-[#D1D1C7] bg-[#F7F4EF] px-6 py-12 text-center md:px-12 md:py-16">
      <p className="text-[11px] font-black tracking-[0.22em] text-[#8C635B]">NEXT STEP · RATE</p>
      <h2 className="mt-5 serif text-2xl leading-[1.65] text-[#2D2D2D] md:text-3xl"><span className="block">認識自己用 FACE，</span><span className="block">檢驗持倉用 RATE。</span></h2>
      <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[#5F574F]"><span className="block">用 RATE 鏡相診股，檢查真實持倉是否符合你的交易人格。</span><span className="mt-1 block">找出讓你焦慮、猶豫或抱不住的策略落差。</span></p>
      <button type="button" onClick={onGoToMirrorTrade} className="mt-8 border border-[#2D2D2D] bg-[#2D2D2D] px-8 py-4 text-sm font-bold tracking-[0.12em] text-white transition hover:bg-transparent hover:text-[#2D2D2D]">前往 RATE 鏡相診股</button>
    </section>

    <section className="bg-[#2D2D2D] px-7 py-12 text-center text-white md:px-16 md:py-16"><p className="text-xs font-bold tracking-[0.24em] text-white/50">STAY CONNECTED</p><h2 className="mt-4 serif text-3xl leading-[1.55] md:text-4xl">想繼續聊交易，也可以從內容開始。</h2><div className="mt-8 flex flex-wrap justify-center gap-3">{socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="border border-white/30 px-5 py-3 text-sm font-bold transition hover:bg-white hover:text-[#2D2D2D]">{social.label}</a>)}<a href="https://line.me/ti/p/@227bctxh" target="_blank" rel="noopener noreferrer" className="bg-white px-5 py-3 text-sm font-bold text-[#2D2D2D] transition hover:bg-[#D9C7A9]">加入 LINE@</a></div></section>
  </div>
);

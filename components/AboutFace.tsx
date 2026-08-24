import React from 'react';

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61585260510757&locale=zh_TW' },
  { label: 'Instagram', href: 'https://www.instagram.com/the_trading_post234/' },
  { label: 'Threads', href: 'https://www.threads.com/@the_trading_post234?xmt=AQF0L-LuDhBrr-ph13qsPUU4fAPWhMiGrETCyAWw6c6fOHk' },
];

const dimensions = [
  ['機會', '你面對報酬與不確定性時，比較想主動靠近，還是先守住穩定。'],
  ['判斷', '你做決定時，通常更相信可驗證的條件，還是市場的情境與感受。'],
  ['節奏', '你習慣陪一個想法走多久，又會多快對新的訊號做出反應。'],
  ['風險', '你會把信念放在少數機會，還是分配到不同標的與可能性。'],
];

interface AboutFaceProps {
  onGoToMirrorTrade: () => void;
  onOpenCoach: () => void;
  onStartTest: () => void;
  onExploreTypes: () => void;
  onOpenContent: () => void;
}

export const AboutFace: React.FC<AboutFaceProps> = ({ onGoToMirrorTrade, onOpenCoach, onStartTest, onExploreTypes, onOpenContent }) => (
  <div className="mx-auto max-w-6xl space-y-16 pb-28 pt-2 fade-in md:space-y-24 md:pt-8">
    <header className="grid overflow-hidden border border-[#D1D1C7] bg-[#F4F0E9] md:grid-cols-[1.05fr_.95fr]">
      <div className="flex flex-col items-start justify-center p-8 md:p-14 lg:p-16">
        <p className="text-xs font-bold tracking-[0.3em] text-[#8C635B]">ABOUT FACE</p>
        <h1 className="mt-6 serif text-4xl leading-[1.45] text-[#2D2D2D] md:text-6xl">先看懂自己，<br />再看懂市場。</h1>
        <p className="mt-7 max-w-xl text-base leading-[2] text-[#70665D] md:text-lg">FACE 是一套交易自我覺察工具。它不替你選標的，也不告訴你買賣答案；它陪你整理面對機會、波動、決策與風險時，最常出現的第一反應。</p>
        <button type="button" onClick={onStartTest} className="mt-8 bg-[#2D2D2D] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#8C635B]">開始 FACE 測驗 →</button>
        <p className="mt-4 text-xs text-[#8C7E6D]">約 5 分鐘。沒有好壞，也不是投資建議。</p>
      </div>
      <div className="relative min-h-[330px] overflow-hidden bg-[#2D2D2D]">
        <img src="/images/face-og-v25.jpg" alt="FACE 動物交易人格的交易場景" className="absolute inset-0 h-full w-full object-cover object-[46%_center]" />
        <span className="absolute inset-0 bg-gradient-to-br from-[#252525]/65 via-[#252525]/20 to-[#252525]/15" aria-hidden="true" />
        <p className="absolute bottom-8 left-8 right-8 serif text-3xl leading-[1.55] text-[#FFF9ED] [text-shadow:0_2px_14px_rgba(28,20,17,.85)] md:bottom-12 md:left-12 md:text-4xl">投資沒有標準答案，<br />只有比較適合你的交易方式。</p>
      </div>
    </header>

    <section className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">WHAT FACE LOOKS AT</p>
      <h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-5xl">FACE 看的不是你會不會賺錢，<br />而是你怎麼做決定。</h2>
      <p className="mt-7 text-base leading-[2.05] text-[#70665D] md:text-lg">同一個方法，放在不同人身上，可能會變成不同的行為。FACE 從四個方向，讓你把習慣說得更清楚。</p>
    </section>

    <section className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-2">
      {dimensions.map(([title, copy]) => (
        <article key={title} className="bg-white p-7 md:p-10">
          <p className="text-xs font-normal tracking-[0.2em] text-[#8C635B]">FACE DIMENSION</p>
          <h3 className="mt-5 serif text-3xl text-[#2D2D2D]">{title}</h3>
          <p className="mt-4 max-w-md text-sm leading-[1.95] text-[#70665D] md:text-base">{copy}</p>
        </article>
      ))}
    </section>

    <section className="border-y border-[#D1D1C7] py-12 md:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">YOUR FACE JOURNEY</p>
        <h2 className="mt-5 serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-5xl">測完以後，不是拿到一個標籤就結束。</h2>
      </div>
      <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-0">
        {[
          ['01', '做測驗', '用約 24 題交易情境，選出更接近你真實反應的一邊。'],
          ['02', '看結果', '認識你的動物交易人格、四個傾向，還有壓力下容易忽略的地方。'],
          ['03', '帶回交易', '從交易解憂 Bar、生存指南或 RATE 鏡相診股，找到下一個可做的調整。'],
        ].map(([number, title, copy], index) => (
          <article key={number} className={`relative pr-8 md:px-9 ${index < 2 ? 'md:border-r md:border-[#D1D1C7]' : ''}`}>
            <p className="text-xs font-normal tracking-[0.2em] text-[#8C635B]">{number}</p>
            <h3 className="mt-6 serif text-3xl text-[#2D2D2D]">{title}</h3>
            <p className="mt-4 text-sm leading-[1.9] text-[#70665D]">{copy}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="grid gap-5 md:grid-cols-3">
      <button type="button" onClick={onStartTest} className="group min-h-64 border border-[#D1D1C7] bg-[#F7F4EF] p-8 text-left transition hover:border-[#8C635B] hover:bg-white md:p-10">
        <p className="text-xs font-normal tracking-[0.2em] text-[#8C635B]">還沒測驗</p>
        <h2 className="mt-10 serif text-3xl text-[#2D2D2D]">先認識自己</h2>
        <p className="mt-5 text-sm leading-[1.9] text-[#70665D]">從交易情境開始，不需要先懂任何人格名詞。</p>
        <span className="mt-8 inline-block border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] group-hover:text-[#8C635B]">開始 FACE 測驗 →</span>
      </button>
      <button type="button" onClick={onExploreTypes} className="group min-h-64 border border-[#D1D1C7] bg-white p-8 text-left transition hover:border-[#8C635B] hover:bg-[#F7F4EF] md:p-10">
        <p className="text-xs font-normal tracking-[0.2em] text-[#8C635B]">想先看看</p>
        <h2 className="mt-10 serif text-3xl text-[#2D2D2D]">認識 16 型人格</h2>
        <p className="mt-5 text-sm leading-[1.9] text-[#70665D]">每一型都有優勢、壓力反應與適合的提醒。</p>
        <span className="mt-8 inline-block border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] group-hover:text-[#8C635B]">前往人格圖鑑 →</span>
      </button>
      <button type="button" onClick={onOpenContent} className="group min-h-64 border border-[#D1D1C7] bg-[#F7F4EF] p-8 text-left transition hover:border-[#8C635B] hover:bg-white md:p-10">
        <p className="text-xs font-normal tracking-[0.2em] text-[#8C635B]">現在正卡住</p>
        <h2 className="mt-10 serif text-3xl text-[#2D2D2D]">先聊眼前的問題</h2>
        <p className="mt-5 text-sm leading-[1.9] text-[#70665D]">追高、套牢、賣飛、停損，把心裡的話先說清楚。</p>
        <span className="mt-8 inline-block border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] group-hover:text-[#8C635B]">走進交易解憂 Bar →</span>
      </button>
    </section>

    <section className="grid items-center gap-10 border-y border-[#D1D1C7] py-12 md:grid-cols-[.8fr_1.2fr] md:py-20">
      <div className="relative mx-auto w-full max-w-sm"><div className="absolute -left-4 -top-4 h-full w-full border border-[#8C635B]/25" /><img src="/images/NPC Bartender.jpg" alt="交易解憂 Bar 創作者" className="relative aspect-square w-full object-cover grayscale-[0.2]" loading="lazy" /></div>
      <div><p className="text-xs font-bold tracking-[0.24em] text-[#8C635B]">FOUNDER'S NOTE</p><h2 className="mt-5 serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-5xl">交易不是考試，<br />但每一次選擇都值得回頭看。</h2><p className="mt-7 text-base leading-[2.05] text-[#70665D] md:text-lg">FACE 來自「上班不要 Trade」與「交易解憂 Bar」想做的一件事：讓交易者能夠把困擾說清楚，而不只是反覆追問下一檔標的。從一次測驗、一篇文章或一支影片開始，慢慢建立屬於自己的交易語言。</p><button type="button" onClick={onOpenCoach} className="mt-7 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] transition hover:border-[#8C635B] hover:text-[#8C635B]">認識陪你整理交易的人 →</button></div>
    </section>

    <section className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-2">
      <article className="bg-white p-7 md:p-10"><p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE DOES</p><h2 className="mt-5 serif text-3xl text-[#2D2D2D]">幫你整理自己</h2><p className="mt-5 text-sm leading-[1.9] text-[#70665D]">讓你的習慣、壓力反應與交易節奏，有一套可以回頭核對的語言與內容。</p></article>
      <article className="bg-white p-7 md:p-10"><p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">FACE DOES NOT</p><h2 className="mt-5 serif text-3xl text-[#2D2D2D]">不替你報明牌</h2><p className="mt-5 text-sm leading-[1.9] text-[#70665D]">它不是投資建議、心理診斷或績效保證，也不替你決定該買什麼。</p></article>
    </section>

    <section className="mx-auto max-w-2xl border border-[#D1D1C7] bg-[#F7F4EF] px-6 py-12 text-center md:px-12 md:py-16">
      <p className="text-[11px] font-bold tracking-[0.22em] text-[#8C635B]">NEXT STEP · RATE</p>
      <h2 className="mt-5 serif text-2xl leading-[1.65] text-[#2D2D2D] md:text-3xl">認識自己用 FACE，<br />檢驗持倉用 RATE。</h2>
      <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-[#5F574F]">用 RATE 鏡相診股，檢查真實持倉是否符合你的交易人格，找出讓你焦慮、猶豫或抱不住的策略落差。</p>
      <button type="button" onClick={onGoToMirrorTrade} className="mt-8 border border-[#2D2D2D] bg-[#2D2D2D] px-8 py-4 text-sm font-bold tracking-[0.12em] text-white transition hover:bg-transparent hover:text-[#2D2D2D]">前往 RATE 鏡相診股</button>
    </section>

    <section className="bg-[#2D2D2D] px-7 py-12 text-center text-white md:px-16 md:py-16"><p className="text-xs font-bold tracking-[0.24em] text-white/50">STAY CONNECTED</p><h2 className="mt-4 serif text-3xl leading-[1.55] md:text-4xl">想繼續聊交易，也可以從內容開始。</h2><div className="mt-8 flex flex-wrap justify-center gap-3">{socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="border border-white/30 px-5 py-3 text-sm font-bold transition hover:bg-white hover:text-[#2D2D2D]">{social.label}</a>)}<a href="https://line.me/ti/p/@227bctxh" target="_blank" rel="noopener noreferrer" className="bg-white px-5 py-3 text-sm font-bold text-[#2D2D2D] transition hover:bg-[#D9C7A9]">加入 LINE@</a></div></section>
  </div>
);

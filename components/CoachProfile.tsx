import React from 'react';

interface CoachProfileProps {
  onStartTest: () => void;
  onBackToAbout: () => void;
}

const journey = [
  ['研究市場', '7 年投顧研究員經驗，理解產業、公司、數據與市場敘事如何影響投資判斷。'],
  ['設計工具', '3 年量化金融產品經理經驗，把複雜指標轉成一般人能使用的決策工具。'],
  ['回到使用者', '看見多數人卡住的並非資訊不足，而是壓力來時，策略與行動開始分開。'],
];

const boundaries = [
  ['不給明牌', '不替你預測明天漲跌，而是一起整理你做決定時能依靠的規則。'],
  ['不代替下單', '每筆買賣仍由你決定；我協助你把理由、風險與停損條件說清楚。'],
  ['不保證獲利', '市場沒有保證。目標是減少「明明知道卻做不到」帶來的反覆焦慮。'],
];

export const CoachProfile: React.FC<CoachProfileProps> = ({ onStartTest, onBackToAbout }) => (
  <div className="mx-auto max-w-6xl space-y-16 pb-28 pt-2 fade-in md:space-y-24 md:pt-8">
    <button type="button" onClick={onBackToAbout} className="text-sm text-[#70665D] transition hover:text-[#2D2D2D]">← 回到關於 FACE</button>

    <header className="grid overflow-hidden border border-[#D1D1C7] bg-[#F7F4EF] lg:grid-cols-[1.03fr_0.97fr]">
      <div className="p-8 sm:p-12 md:p-16">
        <p className="text-xs font-bold tracking-[0.28em] text-[#8C635B]">MEET YOUR COACH</p>
        <h1 className="mt-6 serif text-[2.35rem] leading-[1.48] text-[#2D2D2D] sm:text-5xl md:text-6xl">不替你選股票<br />陪你建立自己的<br />交易方式。</h1>
        <p className="mt-8 max-w-xl text-base leading-[2.05] text-[#70665D] md:text-lg">我相信，投資的關鍵不只在於看懂市場，也在於你是否能在波動來臨時，持續做出自己理解、也承受得起的選擇。</p>
      </div>
      <div className="relative flex min-h-[25rem] items-center justify-center overflow-hidden bg-[#2D2D2D] p-8 text-white sm:p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px)', backgroundSize: '3.25rem 3.25rem' }} />
        <span className="absolute -right-7 -top-12 serif text-[16rem] leading-none text-white/[0.05]">F</span>
        <div className="relative w-full max-w-sm border border-white/30 p-7 sm:p-9">
          <p className="text-[11px] font-bold tracking-[0.24em] text-white/55">A SIMPLE METHOD</p>
          <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center"><div><p className="serif text-4xl">FACE</p><p className="mt-2 text-xs leading-6 text-white/65">看見你的<br />交易習慣</p></div><span className="text-white/45">＋</span><div><p className="serif text-4xl">RATE</p><p className="mt-2 text-xs leading-6 text-white/65">檢查持股與<br />行為是否一致</p></div></div>
          <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm leading-7 text-white/75">把市場裡模糊的焦慮，整理成能執行的下一步。</div>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold tracking-[0.26em] text-[#8C635B]">WHY I BUILT FACE</p><h2 className="mt-5 serif text-3xl leading-[1.65] text-[#2D2D2D] md:text-5xl">資訊很多，<br />但真正困住人的，常常是壓力下的那個選擇。</h2><p className="mt-7 text-base leading-[2.05] text-[#70665D] md:text-lg">看過市場研究與金融產品的兩端後，我越來越確定：許多人不是不知道該怎麼做，而是在追高、虧損、空手或創新高時，暫時失去了原本相信的規則。</p></section>

    <section className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-3">{journey.map(([title, copy], index) => <article key={title} className="bg-white p-8 md:p-10"><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">0{index + 1}</p><h2 className="mt-8 serif text-3xl text-[#2D2D2D]">{title}</h2><p className="mt-5 text-base leading-[2] text-[#70665D]">{copy}</p></article>)}</section>

    <section className="grid items-start gap-10 border-y border-[#D1D1C7] py-12 md:grid-cols-[0.82fr_1.18fr] md:gap-16 md:py-20"><div><p className="text-xs font-bold tracking-[0.26em] text-[#8C635B]">WHAT WE CAN WORK ON</p><h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-5xl">當你的交易<br />開始讓你不安。</h2></div><div className="grid gap-4 sm:grid-cols-2">{['總是在追高後後悔，卻不知道下一次怎麼避免。', '持股讓你睡不好，但又捨不得調整。', '策略換了很多次，始終無法長期執行。', '想把選股、部位、進出規則整理成一套自己的系統。'].map((item, index) => <div key={item} className="border border-[#D1D1C7] bg-[#F7F4EF] p-6"><p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">0{index + 1}</p><p className="mt-4 text-base leading-[1.9] text-[#4F4943]">{item}</p></div>)}</div></section>

    <section><div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.26em] text-[#8C635B]">MY WORKING BOUNDARY</p><h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-5xl">我可以陪你整理，<br />但不替你做決定。</h2></div><div className="mt-10 grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-3">{boundaries.map(([title, copy]) => <article key={title} className="bg-white p-8 md:p-10"><h3 className="serif text-2xl text-[#2D2D2D]">{title}</h3><p className="mt-5 text-base leading-[2] text-[#70665D]">{copy}</p></article>)}</div><p className="mt-5 text-sm leading-7 text-[#8C7E6D]">FACE 與諮詢內容屬於交易行為探索與教育性討論，不構成個別投資建議、買賣推薦或獲利保證。</p></section>

    <section className="mx-auto max-w-3xl border border-[#D1D1C7] bg-[#F7F4EF] px-7 py-12 text-center md:px-14 md:py-16"><p className="text-xs font-bold tracking-[0.26em] text-[#8C635B]">START HERE</p><h2 className="mt-5 serif text-3xl leading-[1.65] text-[#2D2D2D] md:text-5xl">諮詢前，先讓 FACE<br />幫你把問題說清楚。</h2><p className="mx-auto mt-6 max-w-xl text-base leading-[2] text-[#70665D]">先完成 40 題交易風格測驗。當你知道自己的慣性，後續對話才會更具體，也更有幫助。</p><button type="button" onClick={onStartTest} className="mt-8 border border-[#2D2D2D] bg-[#2D2D2D] px-8 py-4 text-sm font-bold tracking-[0.12em] text-white transition hover:bg-transparent hover:text-[#2D2D2D]">開始交易風格測驗</button><p className="mt-5 text-sm text-[#8C7E6D]">首次免費諮詢的預約系統準備中。</p></section>
  </div>
);

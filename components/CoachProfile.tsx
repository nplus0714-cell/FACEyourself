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

const LINE_CONSULTATION_URL = 'https://line.me/ti/p/@227bctxh';

export const CoachProfile: React.FC<CoachProfileProps> = ({ onStartTest, onBackToAbout }) => (
  <div className="mx-auto max-w-6xl space-y-16 pb-28 pt-2 fade-in md:space-y-24 md:pt-8">
    <button type="button" onClick={onBackToAbout} className="text-sm text-[#70665D] transition hover:text-[#2D2D2D]">← 回到關於 FACE</button>

    <header className="grid overflow-hidden border border-[#D1D1C7] bg-[#F7F4EF] lg:grid-cols-[1.03fr_0.97fr]">
      <div className="p-8 sm:p-12 md:p-16">
        <p className="text-xs font-bold tracking-[0.28em] text-[#8C635B]">MEET YOUR COACH</p>
        <h1 className="mt-6 serif text-[2.35rem] leading-[1.48] text-[#2D2D2D] sm:text-5xl md:text-6xl">不替你選股票<br />陪你建立自己的<br />交易方式。</h1>
        <p className="mt-8 max-w-xl text-base leading-[2.05] text-[#70665D] md:text-lg">我相信，投資的關鍵不只在於看懂市場，也在於你是否能在波動來臨時，持續做出自己理解、也承受得起的選擇。</p>
      </div>
      <div className="relative min-h-[25rem] overflow-hidden bg-[#2D2D2D] text-white">
        <img src="/images/NPC Bartender.jpg" alt="FACE 內容設計者 NPC" className="absolute inset-0 h-full w-full object-cover object-center grayscale-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#251D19]/95 via-[#251D19]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
          <p className="text-[11px] font-medium tracking-[0.24em] text-white/60">FACE CONTENT DESIGNER</p>
          <p className="mt-3 serif text-3xl leading-[1.4] text-white">NPC</p>
          <p className="mt-2 text-sm leading-7 text-white/75">FACE 如鏡內容設計者／交易解憂 Bar 主理人</p>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold tracking-[0.26em] text-[#8C635B]">WHY I BUILT FACE</p><h2 className="mt-5 serif text-3xl leading-[1.65] text-[#2D2D2D] md:text-5xl">資訊很多，<br />但真正困住人的，常常是壓力下的那個選擇。</h2><p className="mt-7 text-base leading-[2.05] text-[#70665D] md:text-lg">我是 NPC。過去在投顧研究與量化金融產品設計的工作裡，我長期站在資訊、工具與使用者決策之間，也越來越確定：許多人不是不知道該怎麼做，而是在追高、虧損、空手或創新高時，暫時失去了原本相信的規則。FACE 因此不是用來替你預測市場，而是幫你把模糊的感受整理成看得懂、做得到、可以反覆檢查的下一步。</p></section>

    <section className="grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-3">{journey.map(([title, copy], index) => <article key={title} className="bg-white p-8 md:p-10"><p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">0{index + 1}</p><h2 className="mt-8 serif text-3xl text-[#2D2D2D]">{title}</h2><p className="mt-5 text-base leading-[2] text-[#70665D]">{copy}</p></article>)}</section>

    <section className="grid items-start gap-10 border-y border-[#D1D1C7] py-12 md:grid-cols-[0.82fr_1.18fr] md:gap-16 md:py-20"><div><p className="text-xs font-bold tracking-[0.26em] text-[#8C635B]">WHAT WE CAN WORK ON</p><h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-5xl">當你的交易<br />開始讓你不安。</h2></div><div className="grid gap-4 sm:grid-cols-2">{['總是在追高後悔，卻不知道下一次怎麼避免。', '持股讓你睡不好，但又捨不得調整。', '策略換了很多次，始終無法長期執行。', '想把選股、部位、進出規則整理成一套自己的系統。'].map((item, index) => <div key={item} className="border border-[#D1D1C7] bg-[#F7F4EF] p-6"><p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">0{index + 1}</p><p className="mt-4 text-base leading-[1.9] text-[#4F4943]">{item}</p></div>)}</div></section>

    <section><div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.26em] text-[#8C635B]">MY WORKING BOUNDARY</p><h2 className="mt-5 serif text-3xl leading-[1.6] text-[#2D2D2D] md:text-5xl">我可以陪你整理，<br />但不替你做決定。</h2></div><div className="mt-10 grid gap-px overflow-hidden border border-[#D1D1C7] bg-[#D1D1C7] md:grid-cols-3">{boundaries.map(([title, copy]) => <article key={title} className="bg-white p-8 md:p-10"><h3 className="serif text-2xl text-[#2D2D2D]">{title}</h3><p className="mt-5 text-base leading-[2] text-[#70665D]">{copy}</p></article>)}</div><p className="mt-5 text-sm leading-7 text-[#8C7E6D]">FACE 與諮詢內容屬於交易行為探索與教育性討論，不構成個別投資建議、買賣推薦或獲利保證。</p></section>

    <section className="overflow-hidden border border-[#BFAFA3] bg-[#F7F4EF] md:grid md:grid-cols-[0.9fr_1.1fr]">
      <div className="bg-[#5F4540] px-7 py-11 text-white sm:px-10 md:px-12 md:py-14">
        <p className="text-xs font-medium tracking-[0.26em] text-[#D9C7A9]">START A CONVERSATION</p>
        <h2 className="mt-5 serif text-3xl leading-[1.6] md:text-4xl">需要時，我們可以把問題慢慢說清楚。</h2>
        <p className="mt-6 text-sm leading-[1.95] text-white/75">如果你已經知道自己卡在哪裡，可以直接從 LINE@ 留下目前的交易困擾。我會先理解你的情境，再確認這場對話是否適合幫助你。</p>
      </div>
      <div className="px-7 py-11 sm:px-10 md:px-12 md:py-14">
        <p className="text-sm font-medium tracking-[0.12em] text-[#8C635B]">第一次對話，可以從這些問題開始</p>
        <ul className="mt-6 space-y-3 text-base leading-8 text-[#4F4943]">
          <li className="border-b border-[#D8CDBD] pb-3">目前最困擾你的交易情境</li>
          <li className="border-b border-[#D8CDBD] pb-3">明明有方法，卻總是做不到的地方</li>
          <li>想重新整理的決策、風險與複查流程</li>
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={LINE_CONSULTATION_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 flex-1 items-center justify-center bg-[#2D2D2D] px-6 py-4 text-sm font-medium tracking-[0.08em] text-white transition hover:bg-[#4A382D]">前往 LINE@ 諮詢 →</a>
          <button type="button" onClick={onStartTest} className="min-h-14 flex-1 border border-[#8C7E6D] bg-transparent px-6 py-4 text-sm font-medium tracking-[0.08em] text-[#4F4943] transition hover:bg-white">先完成 FACE 測驗</button>
        </div>
        <p className="mt-5 text-xs leading-6 text-[#8C7E6D]">諮詢聚焦交易行為、決策流程與自我覺察，不提供個別股票買賣建議、進出場時點、目標價或報酬保證。</p>
      </div>
    </section>
  </div>
);

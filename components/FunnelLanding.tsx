import React from 'react';

interface FunnelLandingProps {
  hasResult: boolean;
  isLoggedIn: boolean;
  onStartTest: () => void;
  onViewResult: () => void;
  onOpenMemberHome: () => void;
  onLogin: () => void;
}

export const FunnelLanding: React.FC<FunnelLandingProps> = ({ hasResult, isLoggedIn, onStartTest, onViewResult, onOpenMemberHome, onLogin }) => (
  <div className="-mx-4 fade-in sm:-mx-6 md:mx-0">
    <section className="relative isolate min-h-[680px] overflow-hidden border-y border-[#CFC6B8] bg-[#F6F1E9] sm:min-h-[760px] lg:min-h-[800px] lg:border">
      <div className="absolute inset-x-0 bottom-0 h-[42%] overflow-hidden sm:h-[50%] lg:h-[58%]" aria-hidden="true">
        <img
          src="/images/homepage-trading-salon.png"
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-[52%_center] opacity-70 mix-blend-multiply saturate-[0.82] contrast-[0.92]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#F6F1E9_0%,rgba(246,241,233,0.95)_12%,rgba(246,241,233,0.54)_40%,rgba(246,241,233,0.08)_78%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,253,248,0.94),transparent_46%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-64 pt-14 text-center sm:px-12 sm:pb-72 sm:pt-20 lg:px-16 lg:pb-80 lg:pt-24">
        <p className="text-[11px] font-bold tracking-[0.24em] text-[#8C635B]">FACE TRADER · 知己交易</p>
        <h1 className="mt-6 max-w-3xl serif text-[2rem] leading-[1.55] text-[#2D2D2D] sm:text-5xl sm:leading-[1.45] lg:text-6xl">
          看懂你的交易人格<br />找到更適合你的決策方式
        </h1>
        <p className="mt-7 max-w-xl text-base leading-8 text-[#625A53] sm:text-lg sm:leading-9">
          透過 24 個真實交易情境，看見你的優勢、壓力反應，以及最容易卡住的地方。
        </p>
        <p className="mt-4 text-sm font-medium tracking-[0.08em] text-[#7A6E64]">約 5 分鐘 · 不需登入 · 完成後立即看結果</p>

        <a
          href="/test"
          onClick={(event) => { event.preventDefault(); onStartTest(); }}
          className="group mt-9 flex min-h-16 w-full max-w-sm items-center justify-center gap-4 bg-[#4A382D] px-7 py-4 text-base font-bold tracking-[0.1em] text-white shadow-[0_14px_34px_rgba(74,56,45,0.2)] transition hover:bg-[#34261F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C635B] sm:text-lg"
        >
          開始 FACE 測驗
          <span className="text-2xl font-light transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>

        {hasResult && (
          <button type="button" onClick={onViewResult} className="mt-5 border-b border-[#7A6E64]/50 pb-1 text-sm text-[#5F574F] transition hover:border-[#2D2D2D] hover:text-[#2D2D2D]">
            {isLoggedIn ? '查看我的完整人格分析' : '已完成測驗？查看上次結果'}
          </button>
        )}
        {isLoggedIn ? (
          <button type="button" onClick={onOpenMemberHome} className="mt-4 text-sm font-medium text-[#5F574F] underline decoration-[#7A6E64]/50 underline-offset-4">前往我的 FACE →</button>
        ) : (
          <button type="button" onClick={onLogin} className="mt-4 text-xs text-[#7A6E64] underline decoration-[#7A6E64]/40 underline-offset-4">已有帳號？登入後接續閱讀</button>
        )}
      </div>
    </section>

    <section className="border-b border-[#D1D1C7] bg-[#FCFBF8] px-6 py-12 sm:px-10 sm:py-16" aria-label="你會得到什麼">
      <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3 sm:text-left">
        {[
          ['01', '看見自己的模式', '理解你在機會、判斷、節奏與風險前的自然反應。'],
          ['02', '認出優勢與盲點', '知道什麼值得保留，以及壓力下最容易用過頭的能力。'],
          ['03', '帶走一個下一步', '不是更多理論，而是一個現在就能使用的交易提醒。'],
        ].map(([number, title, body]) => (
          <article key={number}>
            <p className="font-mono text-xs tracking-[0.18em] text-[#9A6D62]">{number}</p>
            <h2 className="mt-3 serif text-2xl text-[#2D2D2D]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#70665D]">{body}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

import React from 'react';
import { isPlainNavigationClick } from '../lib/navigation';

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
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/homepage-trading-salon-768.webp" />
          <img
            src="/images/homepage-trading-salon-1440.webp"
            alt=""
            width="1440"
            height="810"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.03] object-cover object-[52%_center] opacity-70 mix-blend-multiply saturate-[0.82] contrast-[0.92]"
          />
        </picture>
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,#F6F1E9_0%,rgba(246,241,233,0.95)_12%,rgba(246,241,233,0.54)_40%,rgba(246,241,233,0.08)_78%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,253,248,0.94),transparent_46%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-56 pt-10 text-center sm:px-12 sm:pb-72 sm:pt-20 lg:px-16 lg:pb-80 lg:pt-24">
        <p className="text-[11px] font-bold tracking-[0.24em] text-[#8C635B]">FACE TRADER · 知己交易</p>
        <h1 className="mt-6 max-w-3xl serif text-[2rem] leading-[1.55] text-[#2D2D2D] sm:text-5xl sm:leading-[1.45] lg:text-6xl">
          先看懂自己，<br /><span className="whitespace-nowrap">再做交易決定。</span>
        </h1>
        <p className="mt-7 max-w-xl text-base leading-8 text-[#625A53] sm:text-lg sm:leading-9">
          FACE Trader 提供交易教育與自我覺察工具。從 24 題人格測驗與免費指南，整理你的決策習慣、壓力反應與下一步。
        </p>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#70665D]">給常在追高、停損或持有之間猶豫，想建立自己交易方式的人。</p>
        <p className="mt-4 text-sm font-medium tracking-[0.08em] text-[#7A6E64]">約 5 分鐘 · 不需登入 · 完成後立即看結果</p>

        <a
          href="/test"
          onClick={(event) => { if (!isPlainNavigationClick(event)) return; event.preventDefault(); onStartTest(); }}
          className="group mt-9 flex min-h-16 w-full max-w-sm items-center justify-center gap-4 bg-[#4A382D] px-7 py-4 text-base font-bold tracking-[0.1em] text-white shadow-[0_14px_34px_rgba(74,56,45,0.2)] transition hover:bg-[#34261F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C635B] sm:text-lg"
        >
          測測你的交易人格
          <span className="text-2xl font-light transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>
        <a href="/manual#available-now" className="mt-3 inline-flex min-h-12 items-center justify-center border-b border-[#7A6E64]/60 px-2 text-sm font-medium text-[#4A382D] transition hover:border-[#4A382D]">看看免費內容與工具狀態 →</a>

        {hasResult && (
          <button type="button" onClick={onViewResult} className="mt-4 inline-flex min-h-11 items-center border-b border-[#7A6E64]/50 py-1 text-sm text-[#5F574F] transition hover:border-[#2D2D2D] hover:text-[#2D2D2D]">
            {isLoggedIn ? '查看我的完整人格分析' : '已完成測驗？查看上次結果'}
          </button>
        )}
        {isLoggedIn ? (
          <button type="button" onClick={onOpenMemberHome} className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[#5F574F] underline decoration-[#7A6E64]/50 underline-offset-4">前往我的 FACE →</button>
        ) : (
          <button type="button" onClick={onLogin} className="mt-2 inline-flex min-h-11 items-center text-xs text-[#7A6E64] underline decoration-[#7A6E64]/40 underline-offset-4">已有帳號？登入後接續閱讀</button>
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

    <section className="border-b border-[#D1D1C7] px-6 py-12 sm:px-10 sm:py-16" aria-labelledby="choose-start-title">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">從你的需要開始</p>
        <h2 id="choose-start-title" className="mt-3 serif text-3xl leading-[1.5] text-[#2D2D2D]">先認識自己，或先讀一個問題。</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            { label: '免費・免登入', title: '我想看懂交易習慣', body: '用 24 題整理你的決策偏好，完成後立即看人格結果。', href: '/test', cta: '開始人格測驗' },
            { label: '免費閱讀', title: '我想先整理交易方法', body: '直接讀破繭與生存篇章，從交易理由、風險與停損開始。', href: '/guide/line', cta: '閱讀免費指南' },
            { label: '可用狀態總覽', title: '我想知道有哪些工具', body: '區分現在可用的內容、會員示範，以及尚未開放的規劃。', href: '/manual#available-now', cta: '查看內容與工具狀態' },
          ].map((item) => <a key={item.href} href={item.href} className="group flex flex-col border border-[#D1D1C7] bg-[#FCFBF8] p-6 text-left transition hover:border-[#8C635B] hover:bg-white">
            <p className="text-xs font-medium text-[#8C635B]">{item.label}</p>
            <h3 className="mt-4 serif text-2xl leading-[1.5] text-[#2D2D2D]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#70665D]">{item.body}</p>
            <span className="mt-auto pt-6 text-sm font-bold text-[#4A382D]">{item.cta} →</span>
          </a>)}
        </div>
        <p className="mt-7 text-sm leading-7 text-[#70665D]">FACE 描述決策偏好，協助你回頭核對自己的交易；不構成心理診斷、投資建議或績效保證。<a href="/about" className="inline-flex min-h-11 items-center px-1 font-medium text-[#4A382D] underline underline-offset-4">了解 FACE 的方法與邊界 →</a></p>
      </div>
    </section>
  </div>
);

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CONTENT_CATALOG } from '../data/contentCatalog';
import { trackFunnelEvent } from '../services/funnelAnalytics';

const LINE_URL = 'https://line.me/ti/p/@227bctxh';

const stages = [
  { number: '01', title: '破繭', meaning: '理解交易', access: 'LINE 領取完整版' },
  { number: '02', title: '生存', meaning: '學習停損', access: '一篇公開試讀；LINE 領取完整版' },
  { number: '03', title: '進攻', meaning: '持續獲利', access: '免費試讀；完整版規劃為付費內容' },
  { number: '04', title: '歸真', meaning: '認識自己', access: '免費試讀；完整版規劃為付費內容' },
];

const survivalSample = CONTENT_CATALOG.find((item) => item.id === 'article-008')!;
const sampleSections = survivalSample.bodyMarkdown?.split(/\r?\n---\r?\n/) ?? [];
const caseExcerpt = sampleSections.find((section) => section.includes('舉一個很簡單的例子。'))?.trim() ?? '';
const questionsExcerpt = sampleSections
  .find((section) => section.includes('你可以在進場以前先問自己兩個問題。'))
  ?.trim().split(/\r?\n\r?\n/).slice(0, 3).join('\n\n') ?? '';

const excerptComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-3 text-sm leading-8 text-[#5F574F]">{children}</p>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-[#2D2D2D]">{children}</strong>,
};

export const SurvivalGuideLanding: React.FC = () => (
  <div className="mx-auto max-w-5xl pb-20 fade-in">
    <section className="border border-[#D1D1C7] bg-[#FCFBF8] px-7 py-12 text-center sm:px-12 sm:py-16">
      <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">FACE TRADER · 知己交易</p>
      <h1 className="mx-auto mt-5 max-w-3xl serif text-4xl leading-[1.45] text-[#2D2D2D] sm:text-5xl">交易生存指南</h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#625A53] sm:text-lg">了解自己只是開始的第一步。一個交易者會不斷經歷四個階段：破繭、生存、進攻、歸真。先看一篇實際內容，再決定要不要繼續讀。</p>
    </section>

    <section className="mt-10 border border-[#D1D1C7] bg-white p-7 sm:p-10" aria-labelledby="sample-case-title">
      <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">生存篇 · 原文節錄</p>
      <h2 id="sample-case-title" className="mt-4 serif text-3xl leading-[1.45] text-[#2D2D2D]">{survivalSample.title}</h2>
      <div className="mt-5"><ReactMarkdown components={excerptComponents}>{caseExcerpt}</ReactMarkdown></div>
      <div className="mt-6 border-l-2 border-[#C5AA90] bg-[#F7F4EF] px-5 py-4 [&>p:last-child]:mb-0">
        <ReactMarkdown components={excerptComponents}>{questionsExcerpt}</ReactMarkdown>
      </div>
      <a href="/guide#sample" className="mt-6 inline-flex min-h-12 items-center border-b border-[#8C635B] text-sm font-bold text-[#4A382D]">直接閱讀這篇完整試讀 →</a>
    </section>

    <section className="mt-10" aria-labelledby="stages-title">
      <h2 id="stages-title" className="serif text-3xl text-[#2D2D2D]">這份指南會帶你走到哪裡？</h2>
      <div className="mt-6 grid gap-px border border-[#D1D1C7] bg-[#D1D1C7] sm:grid-cols-2">
        {stages.map((stage) => <article key={stage.number} className="bg-[#FCFBF8] p-6 sm:p-8"><p className="font-mono text-xs text-[#9A6D62]">{stage.number}</p><h3 className="mt-3 serif text-2xl text-[#2D2D2D]">{stage.title} <span className="text-base text-[#70665D]">｜{stage.meaning}</span></h3><p className="mt-3 text-sm leading-7 text-[#70665D]">{stage.access}</p></article>)}
      </div>
    </section>

    <section className="mx-auto mt-12 max-w-3xl bg-[#2D2D2D] px-7 py-10 text-center text-white sm:px-12" aria-labelledby="line-steps-title">
      <p className="text-xs font-bold tracking-[0.2em] text-[#D9C7A9]">免費領取</p>
      <h2 id="line-steps-title" className="mt-4 serif text-3xl leading-[1.5] sm:text-4xl">加入 LINE，回覆「生存」</h2>
      <p className="mt-5 text-sm leading-8 text-white/75">在 LINE 回覆「生存」，向我們索取網頁閱讀連結：破繭與生存的完整篇章，以及進攻與歸真的試讀內容。</p>
      <a href={LINE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackFunnelEvent('line_click')} className="mt-8 inline-flex min-h-14 w-full max-w-sm items-center justify-center bg-white px-7 py-4 text-base font-bold text-[#2D2D2D] transition hover:bg-[#D9C7A9]">前往 LINE 索取免費章節 →</a>
    </section>
  </div>
);

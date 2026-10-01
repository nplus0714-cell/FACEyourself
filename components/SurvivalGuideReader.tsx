import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CONTENT_CATALOG, type ContentItem } from '../data/contentCatalog';
import { trackFunnelEvent } from '../services/funnelAnalytics';

const freeArticles = CONTENT_CATALOG.filter((item) => item.channel === 'face-survival-guide' && Number(item.articleNumber) <= 9);
const survivalSample = freeArticles.find((item) => item.slug === 'stop-loss-is-an-entry-fee')!;
const paidPreview = CONTENT_CATALOG.filter((item) => item.channel === 'face-survival-guide' && Number(item.articleNumber) >= 10);

interface SurvivalGuideReaderProps {
  fullFree?: boolean;
  onOpenManual: () => void;
}

const ArticleBody = ({ item }: { item: ContentItem }) => <div className="mt-8 text-[15px] text-[#4A382D]"><ReactMarkdown components={{ p: ({ children }) => <p className="mb-5 leading-8">{children}</p>, strong: ({ children }) => <strong className="font-bold text-[#2D2D2D]">{children}</strong>, hr: () => <hr className="my-9 border-[#D1D1C7]" /> }}>{item.bodyMarkdown ?? ''}</ReactMarkdown></div>;

export const SurvivalGuideReader: React.FC<SurvivalGuideReaderProps> = ({ fullFree = false, onOpenManual }) => {
  const [selectedArticle, setSelectedArticle] = useState<ContentItem>(freeArticles[0]);

  useEffect(() => {
    trackFunnelEvent('guide_access');
    let started = false;
    const handleScroll = () => {
      if (started || window.scrollY < 120) return;
      started = true;
      trackFunnelEvent('guide_read_start');
      window.removeEventListener('scroll', handleScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (window.location.hash === '#sample') window.setTimeout(() => document.getElementById('sample')?.scrollIntoView(), 80);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <article className="mx-auto max-w-5xl pb-24 fade-in">
      <header className="border-b border-[#D1D1C7] pb-10 pt-6 text-center sm:pb-14">
        <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">FACE TRADER · 知己交易</p>
        <h1 className="mt-5 serif text-4xl leading-[1.4] text-[#2D2D2D] sm:text-6xl">交易生存指南</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#625A53]">{fullFree ? '破繭與生存完整閱讀｜進攻與歸真試讀' : '公開試讀｜先讀一篇生存篇，再決定要不要領取更多'}</p>
      </header>

      {!fullFree && <section className="mx-auto max-w-3xl py-9 text-center"><p className="text-sm leading-8 text-[#70665D]">這裡公開一篇〈停損不是失敗，是入場費〉。加入 LINE 並回覆「生存」，即可收到破繭與生存完整篇章的閱讀連結。</p><a href="/survival-kit" className="mt-5 inline-flex bg-[#2D2D2D] px-7 py-3 text-sm font-bold text-white">前往 LINE 領取方式 →</a></section>}

      {!fullFree && <section id="sample" className="scroll-mt-6 border border-[#D1D1C7] bg-white p-6 sm:p-10" aria-labelledby="sample-title">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">生存篇 · 公開完整試讀</p>
        <h2 id="sample-title" className="mt-4 serif text-3xl leading-[1.45] text-[#2D2D2D]">{survivalSample.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#70665D]">{survivalSample.summary}</p>
        <ArticleBody item={survivalSample} />
      </section>}

      {fullFree && <section className="mt-14" aria-labelledby="free-chapters-title">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">LINE 領取 · 完整篇章</p>
        <h2 id="free-chapters-title" className="mt-3 serif text-3xl text-[#2D2D2D]">破繭與生存</h2>
        <p className="mt-4 text-sm leading-7 text-[#70665D]">選一篇開始讀。這些文章原本就是 FACE Trader 的破繭與生存篇完整內容。</p>
        <div className="mt-7 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <nav className="space-y-2" aria-label="免費篇章目錄">{freeArticles.map((item) => <button key={item.id} type="button" onClick={() => setSelectedArticle(item)} aria-current={selectedArticle.id === item.id ? 'page' : undefined} className={`w-full border px-4 py-3 text-left text-sm leading-6 ${selectedArticle.id === item.id ? 'border-[#8C635B] bg-[#F3EAE4] text-[#2D2D2D]' : 'border-[#D1D1C7] bg-white text-[#70665D]'}`}><span className="block text-xs text-[#8C635B]">{item.series} · {item.articleNumber}</span>{item.title}</button>)}</nav>
          <div className="min-w-0 border border-[#D1D1C7] bg-white p-6 sm:p-9"><p className="text-xs font-bold text-[#8C635B]">{selectedArticle.series} · {selectedArticle.articleNumber}</p><h3 className="mt-3 serif text-3xl leading-[1.5] text-[#2D2D2D]">{selectedArticle.title}</h3><ArticleBody item={selectedArticle} /></div>
        </div>
      </section>}

      <section className="mt-14 border-t border-[#D1D1C7] pt-10" aria-labelledby="preview-title">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">進攻・歸真｜免費試讀</p>
        <h2 id="preview-title" className="mt-3 serif text-3xl text-[#2D2D2D]">試讀目錄</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">{paidPreview.map((item) => <div key={item.id} className="border border-[#D1D1C7] bg-[#FCFBF8] px-5 py-4"><p className="text-xs text-[#8C635B]">{item.series} · {item.articleNumber}</p><h3 className="mt-2 serif text-lg text-[#2D2D2D]">{item.title}</h3><p className="mt-2 text-sm leading-7 text-[#70665D]">{item.summary}</p></div>)}</div>
        <div className="mt-9 bg-[#2D2D2D] px-6 py-8 text-center text-white"><h3 className="serif text-2xl">想讀進攻與歸真的完整版？</h3><p className="mt-3 text-sm leading-7 text-white/75">完整版規劃納入《個人交易使用說明書》。先登入，待價格與開放時間公布後再解鎖。</p><button type="button" onClick={onOpenManual} className="mt-6 bg-white px-6 py-3 text-sm font-bold text-[#2D2D2D]">了解付費內容 →</button></div>
      </section>
    </article>
  );
};

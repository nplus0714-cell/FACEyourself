import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { LockKeyhole } from 'lucide-react';
import { CONTENT_CATALOG, type ContentItem } from '../data/contentCatalog';
import { trackFunnelEvent } from '../services/funnelAnalytics';
import { EarlyAccessWaitlistForm } from './EarlyAccessWaitlistForm';

const guideArticles = CONTENT_CATALOG
  .filter((item) => item.channel === 'face-survival-guide' && item.status === 'published')
  .sort((a, b) => Number(a.articleNumber) - Number(b.articleNumber));
const freeArticles = guideArticles.filter((item) => !item.requiresPurchase);
const survivalSample = freeArticles.find((item) => item.slug === 'stop-loss-is-an-entry-fee')!;
const paidArticles = guideArticles.filter((item) => item.requiresPurchase);

interface SurvivalGuideReaderProps {
  fullFree?: boolean;
  onOpenManual: () => void;
}

const ArticleBody = ({ item }: { item: ContentItem }) => (
  <div className="mt-8 text-[15px] text-[#4A382D]">
    <ReactMarkdown components={{
      p: ({ children }) => <p className="mb-5 leading-8">{children}</p>,
      strong: ({ children }) => <strong className="font-bold text-[#2D2D2D]">{children}</strong>,
      hr: () => <hr className="my-9 border-[#D1D1C7]" />,
    }}>
      {item.bodyMarkdown ?? ''}
    </ReactMarkdown>
  </div>
);

const BlurredPaidPreview = ({ item, onOpenManual }: { item: ContentItem; onOpenManual: () => void }) => (
  <div className="min-w-0 border border-[#D1D1C7] bg-white p-6 sm:p-9">
    <p className="text-xs font-bold text-[#8C635B]">{item.series} · {item.articleNumber}</p>
    <div className="mt-3 flex items-start justify-between gap-4">
      <h3 className="serif text-3xl leading-[1.5] text-[#2D2D2D]">{item.title}</h3>
      <span className="inline-flex shrink-0 items-center gap-1.5 border border-[#B87972] bg-[#FBF0EE] px-2.5 py-1 text-[11px] tracking-[0.08em] text-[#8A3F38]"><LockKeyhole size={12} aria-hidden="true" />解鎖</span>
    </div>
    <p className="mt-4 text-sm leading-7 text-[#70665D]">{item.summary}</p>

    <section className="relative mt-8 overflow-hidden border-y border-[#E4DDD4] py-6 sm:py-8" aria-label="付費篇章預覽">
      <div className="pointer-events-none absolute inset-0 select-none space-y-5 px-1 py-8 text-[15px] leading-8 text-[#655C55] blur-[5px] opacity-55" aria-hidden="true">
        <p>走到這一步，交易不再只是看對或看錯。你會開始面對：什麼時候該放大，什麼時候又該先退一步。</p>
        <p>每一次選擇都需要理由，也需要一個自己做得到的節奏。方向、部位與時間，必須一起被看見。</p>
        <p>市場不會替任何人保留機會。真正要練習的，是在機會出現時，仍能用自己承受得住的方式前進。</p>
        <p>你不必急著證明判斷有多準。先讓每個決定可以被回頭檢查，才能知道下一次該修正的是方法還是自己。</p>
        <p>當規則可以穿過波動、獲利與虧損，它才會慢慢成為你的交易系統。</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/35 to-white/95" aria-hidden="true" />

      <div className="relative mx-2 bg-[#2D2D2D] p-5 text-white shadow-2xl sm:mx-7 sm:p-8">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.18em] text-[#D9C7A9]">完整版閱讀權限</p>
            <h4 className="mt-4 serif text-3xl leading-[1.45] text-white">分析免費，付費內容稍後解鎖</h4>
            <p className="mt-4 text-sm leading-7 text-white/75">進攻與歸真會收錄在完整版閱讀權限。價格與開放時間尚未確定，現在先留下通知方式。</p>
            <button type="button" onClick={onOpenManual} className="mt-6 w-fit bg-white px-5 py-3 text-sm font-medium text-[#2D2D2D] transition hover:bg-[#E6D5B8]">了解完整版內容 →</button>
          </div>
          <div className="border border-white/15 bg-white/[0.06] p-5 sm:p-6">
            <p className="text-xs tracking-[0.16em] text-[#D9C7A9]">OPENING NOTICE · EMAIL ONLY</p>
            <h5 className="mt-3 serif text-2xl leading-[1.45] text-white">想知道何時開放？</h5>
            <p className="mt-2 text-sm leading-7 text-white/70">內容、價格與取得方式確定後，再通知你決定要不要加入。</p>
            <div className="mt-5"><EarlyAccessWaitlistForm source={`survival-guide-${item.articleNumber}-locked`} variant="manual" /></div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export const SurvivalGuideReader: React.FC<SurvivalGuideReaderProps> = ({ fullFree = false, onOpenManual }) => {
  const [selectedArticle, setSelectedArticle] = useState<ContentItem>(freeArticles[0]);
  const [isContentsOpen, setIsContentsOpen] = useState(false);
  const readingPanelRef = useRef<HTMLDivElement>(null);
  const contentsButtonRef = useRef<HTMLButtonElement>(null);
  const selectedIsPaid = !!selectedArticle.requiresPurchase;
  const selectedIndex = useMemo(() => guideArticles.findIndex((item) => item.id === selectedArticle.id), [selectedArticle.id]);

  const selectArticle = (item: ContentItem) => {
    setSelectedArticle(item);
    setIsContentsOpen(false);
    window.requestAnimationFrame(() => {
      readingPanelRef.current?.focus({ preventScroll: true });
      readingPanelRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  };

  const returnToContents = () => {
    setIsContentsOpen(true);
    contentsButtonRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    contentsButtonRef.current?.focus({ preventScroll: true });
  };

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
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#625A53]">{fullFree ? '完整章節目錄｜破繭、生存免費閱讀，進攻與歸真稍後解鎖' : '公開試讀｜先讀一篇生存篇，再決定要不要繼續閱讀'}</p>
      </header>

      {!fullFree && <section className="mx-auto max-w-3xl py-9 text-center"><p className="text-sm leading-8 text-[#70665D]">這裡公開一篇〈停損不是失敗，是入場費〉。想繼續讀，可以直接開啟破繭與生存的完整篇章。</p><a href="/guide/line" className="mt-5 inline-flex bg-[#2D2D2D] px-7 py-3 text-sm font-bold text-white">免費閱讀完整篇章 →</a></section>}

      {!fullFree && <section id="sample" className="scroll-mt-6 border border-[#D1D1C7] bg-white p-6 sm:p-10" aria-labelledby="sample-title">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">生存篇 · 公開完整試讀</p>
        <h2 id="sample-title" className="mt-4 serif text-3xl leading-[1.45] text-[#2D2D2D]">{survivalSample.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[#70665D]">{survivalSample.summary}</p>
        <ArticleBody item={survivalSample} />
      </section>}

      {fullFree && <section className="mt-14" aria-labelledby="chapters-title">
        <div className="border-b border-[#D1D1C7] pb-6">
          <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">TABLE OF CONTENTS</p>
          <h2 id="chapters-title" className="mt-3 serif text-3xl text-[#2D2D2D]">交易生存指南目錄</h2>
          <p className="mt-3 text-sm leading-7 text-[#70665D]">選擇章節即可接續閱讀。破繭與生存提供免費全文；進攻與歸真先看內容方向，完整版尚未開放。</p>
        </div>
        <div className="mt-7 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div>
          <button ref={contentsButtonRef} type="button" aria-expanded={isContentsOpen} aria-controls="guide-chapter-list" onClick={() => setIsContentsOpen((open) => !open)} className="flex min-h-14 w-full items-center justify-between gap-4 border border-[#B9AA9D] bg-[#F7F1EC] px-4 py-3 text-left text-sm font-medium text-[#4A382D] lg:hidden">
            <span>{isContentsOpen ? '收起章節目錄' : '選擇章節'}<span className="mt-1 block text-xs font-normal text-[#70665D]">目前：{selectedArticle.articleNumber} · {selectedArticle.title}</span></span><span aria-hidden="true">{isContentsOpen ? '−' : '＋'}</span>
          </button>
          <nav id="guide-chapter-list" className={`${isContentsOpen ? 'block' : 'hidden'} mt-3 space-y-2 lg:mt-0 lg:block`} aria-label="交易生存指南章節目錄">
            {guideArticles.map((item) => {
              const isSelected = selectedArticle.id === item.id;
              const isPaid = !!item.requiresPurchase;
              return <button key={item.id} type="button" onClick={() => selectArticle(item)} aria-current={isSelected ? 'page' : undefined} className={`w-full border px-4 py-3 text-left text-sm leading-6 transition ${isSelected ? 'border-[#8C635B] bg-[#F3EAE4] text-[#2D2D2D]' : 'border-[#D1D1C7] bg-white text-[#70665D] hover:border-[#B9AA9D] hover:bg-[#FCFBF8]'}`}>
                <span className="flex items-center justify-between gap-3 text-xs text-[#8C635B]"><span>{item.series} · {item.articleNumber}</span>{isPaid ? <span className="inline-flex items-center gap-1 text-[#8A3F38]"><LockKeyhole size={11} aria-hidden="true" />付費規劃</span> : <span className="text-[#2E6154]">免費全文</span>}</span>
                <span className="mt-1 block">{item.title}</span>
              </button>;
            })}
          </nav>
          </div>
          <div ref={readingPanelRef} tabIndex={-1} role="region" aria-label={`目前章節：${selectedArticle.articleNumber} ${selectedArticle.title}`} className="min-w-0 scroll-mt-6 focus:outline-none">
            {selectedIsPaid ? <BlurredPaidPreview item={selectedArticle} onOpenManual={onOpenManual} /> : <div className="border border-[#D1D1C7] bg-white p-6 sm:p-9"><p className="text-xs font-bold text-[#8C635B]">{selectedArticle.series} · {selectedArticle.articleNumber}</p><h3 className="mt-3 serif text-3xl leading-[1.5] text-[#2D2D2D]">{selectedArticle.title}</h3><ArticleBody item={selectedArticle} /></div>}
            <p className="mt-5 text-right text-xs text-[#978A7E]">章節 {String(selectedIndex + 1).padStart(2, '0')} / {String(guideArticles.length).padStart(2, '0')}</p>
            <button type="button" onClick={returnToContents} className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-[#4A382D] underline underline-offset-4 lg:hidden">返回章節目錄 ↑</button>
          </div>
        </div>
      </section>}

      {!fullFree && <section className="mt-14 border-t border-[#D1D1C7] pt-10" aria-labelledby="preview-title">
        <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">進攻・歸真｜完整版章節</p>
        <h2 id="preview-title" className="mt-3 serif text-3xl text-[#2D2D2D]">接下來會讀到什麼</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">{paidArticles.map((item) => <div key={item.id} className="border border-[#D1D1C7] bg-[#FCFBF8] px-5 py-4"><p className="text-xs text-[#8C635B]">{item.series} · {item.articleNumber}</p><h3 className="mt-2 serif text-lg text-[#2D2D2D]">{item.title}</h3><p className="mt-2 text-sm leading-7 text-[#70665D]">{item.summary}</p></div>)}</div>
        <div className="mt-9 bg-[#2D2D2D] px-6 py-8 text-center text-white"><p className="text-xs tracking-[0.18em] text-[#D9C7A9]">完整版閱讀權限</p><h3 className="mt-3 serif text-2xl">分析免費，付費內容稍後解鎖</h3><button type="button" onClick={onOpenManual} className="mt-6 bg-white px-6 py-3 text-sm font-medium text-[#2D2D2D]">了解完整版內容 →</button></div>
      </section>}
    </article>
  );
};

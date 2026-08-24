import React from 'react';
import { CONTENT_CATALOG, ContentItem, ContentSeries } from '../data/contentCatalog';
import { Language } from '../types';

interface ContentHubProps {
  hasDna: boolean;
  isLoggedIn: boolean;
  hasSurvivalKitAccess: boolean;
  language: Language;
  onStartTest: () => void;
  onViewResult: () => void;
  onLoginRequest: () => void;
  onOpenPricing: () => void;
  onOpenContent: (item: ContentItem) => void;
}

const ARTICLE_SERIES: Array<{ id: ContentSeries; english: string; description: string }> = [
  { id: '序言', english: 'PROLOGUE', description: '先理解這座市場如何運作，也看見自己如何面對沒有答案的時候。' },
  { id: '破繭篇', english: 'BREAKTHROUGH', description: '鬆開對正確答案的執著，建立屬於自己的判斷、相信與行動。' },
  { id: '生存篇', english: 'SURVIVAL', description: '把風險、學費與停損放回可承擔的範圍，替下一次機會保留選擇。' },
  { id: '進攻篇・上', english: 'ADVANCE · I', description: '從換檔、期望值、持有與消息開始，把看見的優勢轉成可執行的選擇。' },
  { id: '進攻篇・下', english: 'ADVANCE · II', description: '讓方向、部位與時間互相配合，在紀律之內逐步放大有效的交易。' },
  { id: '歸真篇', english: 'RETURN', description: '把市場方法放回自己的個性、生活與承受範圍，形成可以長期重複的節奏。' },
];

export const ContentHub: React.FC<ContentHubProps> = ({ hasDna, isLoggedIn, hasSurvivalKitAccess, language, onStartTest, onViewResult, onLoginRequest, onOpenPricing, onOpenContent }) => {
  const isZh = language === 'zh';
  const publishedArticles = CONTENT_CATALOG.filter((item) => item.kind === 'article' && item.status === 'published');
  const survivalGuideArticles = publishedArticles.filter((item) => item.channel === 'face-survival-guide');
  const topicArticles = publishedArticles.filter((item) => item.channel === 'topic-articles');

  const openArticle = (item: ContentItem) => {
    if (item.requiresLogin && !isLoggedIn) {
      onLoginRequest();
      return;
    }
    if (item.requiresPurchase && !hasSurvivalKitAccess) {
      onOpenPricing();
      return;
    }
    onOpenContent(item);
  };

  const getAccessLabel = (item: ContentItem) => {
    if (item.requiresPurchase) return 'LOCK · 方案限定';
    if (item.requiresLogin) return 'LOCK · 登入限定';
    return item.series;
  };

  const getActionLabel = (item: ContentItem) => {
    if (item.requiresLogin && !isLoggedIn) return '登入閱讀 →';
    if (item.requiresPurchase && !hasSurvivalKitAccess) return '查看方案 →';
    return '閱讀文章 →';
  };

  return (
    <section className="mx-auto max-w-6xl space-y-14 pb-28 pt-4 md:space-y-20 md:pt-10 fade-in">
      <section aria-label="文章分類" className="space-y-12 md:space-y-16">

        <nav className="grid gap-5 md:grid-cols-2" aria-label="文章索引">
          <a href="#survival-guide" className="group relative min-h-[320px] overflow-hidden border border-[#D1D1C7] bg-[#F7F4EF] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4 md:min-h-[360px]">
            <img src="/images/content-hub/survival-guide-cover.png" alt="金雕與北極熊閱讀 FACE 生存指南" className="absolute inset-0 h-full w-full object-cover saturate-125 contrast-105 transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211916]/90 via-[#211916]/32 to-[#211916]/5" />
            <div className="relative flex h-full max-w-md flex-col justify-end p-7 text-[#FFF9ED] md:p-10 [text-shadow:0_2px_14px_rgba(28,20,17,0.9)]">
              <p className="text-xs font-normal tracking-[0.22em] text-[#70443C] [text-shadow:none]">FACE 交易生存指南</p>
              <h4 className="mt-4 serif text-4xl leading-[1.45] md:text-5xl">教你如何建構你的交易計畫</h4>
              <p className="mt-4 text-[15px] font-medium leading-[1.9] text-[#FFF9ED]/90 md:text-base">從破繭、生存、進攻到歸真，慢慢整理出一套你做得出來的交易過程。</p>
              <span className="mt-7 inline-block w-fit border-b border-[#FFF9ED]/80 pb-1 text-sm font-semibold">查看生存指南目錄 →</span>
            </div>
          </a>
          <a href="#topic-articles" className="group relative min-h-[320px] overflow-hidden border border-[#2D2D2D] bg-[#2D2D2D] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4 md:min-h-[360px]">
            <img src="/images/content-hub/trading-bar-cover.png" alt="夜梟、獵豹與酒保在交易解憂 Bar 交談" className="absolute inset-0 h-full w-full object-cover saturate-125 contrast-105 transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211916]/90 via-[#211916]/32 to-[#211916]/5" />
            <div className="relative flex h-full max-w-md flex-col justify-end p-7 text-[#FFF9ED] md:p-10 [text-shadow:0_2px_14px_rgba(28,20,17,0.9)]">
              <p className="text-xs font-normal tracking-[0.22em] text-[#E9D39A] [text-shadow:none]">交易解憂 Bar</p>
              <h4 className="mt-4 serif text-4xl leading-[1.45] md:text-5xl">聊聊交易計畫以外的事情</h4>
              <p className="mt-4 text-[15px] font-medium leading-[1.9] text-[#FFF9ED]/90 md:text-base">追高、套牢、賣飛、停損。把心裡那句沒寫進交易計畫的話，先說清楚，隨時保持清醒交易。</p>
              <span className="mt-7 inline-block w-fit border-b border-[#FFF9ED]/80 pb-1 text-sm font-semibold">查看交易解憂 Bar →</span>
            </div>
          </a>
        </nav>

        {topicArticles.length > 0 && <section id="topic-articles" aria-labelledby="topic-articles-heading" className="space-y-6 scroll-mt-8">
          <div className="flex flex-col gap-3 border-l-2 border-[#A05F54] pl-5 md:flex-row md:items-end md:justify-between md:gap-8 md:pl-7">
            <div>
              <p className="text-xs font-medium tracking-[0.22em] text-[#A05F54]">TOPIC ARTICLES</p>
              <h4 id="topic-articles-heading" className="mt-2 serif text-3xl text-[#2D2D2D] md:text-4xl">交易解憂 Bar</h4>
            </div>
            <p className="max-w-2xl text-[15px] leading-[1.9] text-[#70665D] md:text-right md:text-base">從你現在最卡的問題開始：追高、套牢、賣飛、停損、部位、焦慮與交易復盤。</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {topicArticles.map((item) => (
              <a key={item.id} href={`/watch/${item.slug}`} onClick={(event) => { event.preventDefault(); openArticle(item); }} className="group flex min-h-64 flex-col justify-between border border-[#D1D1C7] bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B18A80] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4 md:p-8">
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] text-[#A05F54]">交易心理主題</p>
                  <h5 className="mt-5 serif text-2xl leading-[1.55] text-[#2D2D2D] transition group-hover:text-[#8C635B] md:text-3xl">{item.title}</h5>
                  <p className="mt-4 text-[15px] leading-[1.9] text-[#70665D]">{item.summary}</p>
                </div>
                <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#E3DED6] pt-5">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">{item.faceTags.map((tag) => <span key={tag} className="text-xs text-[#8C7E6D]">{tag}</span>)}</div>
                  <span className="shrink-0 text-sm font-medium text-[#2D2D2D]">閱讀文章 →</span>
                </div>
              </a>
            ))}
          </div>
        </section>}

        <section id="survival-guide" className="scroll-mt-8">
          <div className="border-y border-[#D8D2CA] py-8 md:flex md:items-end md:justify-between md:gap-10 md:py-10">
            <div>
              <p className="text-xs font-medium tracking-[0.24em] text-[#A05F54]">FACE GUIDE · TABLE OF CONTENTS</p>
              <h4 className="mt-3 serif text-3xl text-[#2D2D2D] md:text-5xl">FACE 生存指南</h4>
            </div>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.95] text-[#70665D] md:mt-0 md:text-right md:text-base">從破繭、生存、進攻到歸真，一步一步建構你的交易計畫。每一章都可直接閱讀、登入後閱讀，或取得方案後解鎖。</p>
          </div>

          <div className="mt-7 border border-[#D1D1C7] bg-white">
            {ARTICLE_SERIES.map((series, seriesIndex) => {
          const articles = survivalGuideArticles
            .filter((item) => item.series === series.id)
            .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

          return (
            <section key={series.id} className="border-b border-[#D1D1C7] last:border-b-0">
              <div className="bg-[#F7F4EF] px-6 py-5 md:flex md:items-end md:justify-between md:gap-8 md:px-8">
                <div>
                  <p className="text-xs font-medium tracking-[0.22em] text-[#A05F54]">{String(seriesIndex + 1).padStart(2, '0')} · {series.english}</p>
                  <h5 className="mt-2 serif text-2xl text-[#2D2D2D] md:text-3xl">{series.id}</h5>
                </div>
                <p className="mt-3 max-w-2xl text-[14px] leading-[1.8] text-[#70665D] md:mt-0 md:text-right md:text-[15px]">{series.description}</p>
              </div>
              <div>
                {articles.map((item) => (
                  <a
                    key={item.id}
                    href={`/watch/${item.slug}`}
                    onClick={(event) => { event.preventDefault(); openArticle(item); }}
                    className="group grid gap-4 border-b border-[#E3DED6] px-6 py-5 transition hover:bg-[#FBF8F4] last:border-b-0 md:grid-cols-[4.5rem_minmax(0,1fr)_9rem] md:items-center md:gap-7 md:px-8"
                  >
                    <p className="font-mono text-sm tracking-[0.18em] text-[#A05F54]">{item.articleNumber}</p>
                    <div>
                      <h6 className="serif text-xl leading-[1.55] text-[#2D2D2D] transition group-hover:text-[#8C635B] md:text-2xl">{item.title}</h6>
                      <p className="mt-2 text-[14px] leading-[1.75] text-[#70665D] md:text-[15px]">{item.summary}</p>
                    </div>
                    <span className={`w-fit text-sm font-medium ${item.requiresLogin ? 'border border-[#B9AA9D] bg-[#F7F1EC] px-3 py-2 text-[#7A5148]' : 'text-[#2D2D2D]'}`}>{getActionLabel(item)}</span>
                  </a>
                ))}
              </div>
            </section>
          );
            })}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-5 border border-[#B9AA9D] bg-[#F7F1EC] p-6 md:flex-row md:items-center md:px-8">
            <p className="max-w-2xl text-[15px] leading-[1.85] text-[#5F574F]">取得 FACE Survival 後，可閱讀完整生存指南，並把內容轉成適合你交易習慣的使用說明書。</p>
            <a href="/survival-kit" onClick={(event) => { event.preventDefault(); onOpenPricing(); }} className="shrink-0 bg-[#2D2D2D] px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-[#3A302B]">查看方案與解鎖內容 →</a>
          </div>
        </section>
      </section>

      <button
        type="button"
        onClick={hasDna ? onViewResult : onStartTest}
        className="group grid w-full overflow-hidden border border-[#D1D1C7] bg-[#F7F4EF] text-left transition-colors hover:border-[#8C635B] md:grid-cols-[.95fr_1.05fr]"
      >
        <div className="relative min-h-56 overflow-hidden md:min-h-72">
          <img
            src="/images/face-og-v25.jpg"
            alt="FACE 動物交易人格的交易場景"
            className="absolute inset-0 h-full w-full object-cover object-[42%_center] transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[#3A302B]/20" />
        </div>
        <div className="flex min-h-56 flex-col items-start justify-center px-7 py-8 md:min-h-72 md:px-12">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#8C635B]">FACE TEST</p>
          <p className="serif mt-3 max-w-md text-2xl leading-[1.35] text-[#2D2D2D] md:text-3xl">先知道自己的交易傾向<br />內容會更有方向</p>
          <p className="mt-4 max-w-md text-sm leading-[1.8] text-[#70665D]">用一組問題，整理你面對機會、波動與風險時，最常出現的第一反應。</p>
          <span className="mt-6 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D] transition-colors group-hover:border-[#8C635B] group-hover:text-[#8C635B]">
            {hasDna ? '查看我的 FACE 結果' : '先做 FACE 測驗'} →
          </span>
        </div>
      </button>
    </section>
  );
};

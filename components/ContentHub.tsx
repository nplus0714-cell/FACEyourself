import React from 'react';
import { CONTENT_CATALOG, ContentItem, ContentSeries } from '../data/contentCatalog';
import { Language } from '../types';

interface ContentHubProps {
  hasDna: boolean;
  isLoggedIn: boolean;
  language: Language;
  onStartTest: () => void;
  onViewResult: () => void;
  onLoginRequest: () => void;
  onOpenPricing: () => void;
  onOpenContent: (item: ContentItem) => void;
}

const VideoCover: React.FC<{ item: ContentItem }> = ({ item }) => (
  <div className="relative aspect-[16/9] overflow-hidden bg-[#EAE6DF]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(140,99,91,0.28),transparent_32%),linear-gradient(135deg,#F7F4EF_0%,#DDE2E2_100%)]" />
    <div className="absolute inset-x-6 bottom-6 border-l-2 border-[#8C635B] pl-4">
      <p className="text-[10px] font-bold tracking-[0.24em] text-[#8C635B]">FACE VIDEO</p>
      <p className="mt-2 max-w-[16rem] text-lg leading-[1.5] text-[#2D2D2D]">{item.title}</p>
    </div>
    <span className="absolute right-4 top-4 bg-[#2D2D2D] px-2.5 py-1 text-xs tracking-[0.08em] text-white">{item.duration}</span>
    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 pl-1 text-[#8C635B] shadow-lg" aria-hidden="true">▶</span>
  </div>
);

const ARTICLE_SERIES: Array<{ id: ContentSeries; english: string; description: string }> = [
  { id: '序言', english: 'PROLOGUE', description: '先理解這座市場如何運作，也看見自己如何面對沒有答案的時候。' },
  { id: '破繭篇', english: 'BREAKTHROUGH', description: '鬆開對正確答案的執著，建立屬於自己的判斷、相信與行動。' },
  { id: '生存篇', english: 'SURVIVAL', description: '把風險、學費與停損放回可承擔的範圍，替下一次機會保留選擇。' },
];

const ARTICLE_CHANNELS = [
  {
    id: 'face-survival-guide',
    number: '01',
    title: 'FACE 生存指南',
    description: '從不確定、判斷與行動開始，逐步建立能留在市場裡的方法。',
    available: true,
  },
  {
    id: 'topic-articles',
    number: '02',
    title: '主題文章',
    description: '針對交易心理、市場行為與實際決策，整理單一主題的深度文章。',
    available: false,
  },
  {
    id: 'market-notes',
    number: '03',
    title: '我的看盤筆記',
    description: '留下盤勢觀察、交易想法，以及事情發生後重新整理的判斷。',
    available: false,
  },
] as const;

export const ContentHub: React.FC<ContentHubProps> = ({ hasDna, isLoggedIn, language, onStartTest, onViewResult, onLoginRequest, onOpenPricing, onOpenContent }) => {
  const isZh = language === 'zh';
  const publishedVideos = CONTENT_CATALOG.filter((item) => item.kind === 'video' && item.status === 'published');
  const publishedArticles = CONTENT_CATALOG.filter((item) => item.kind === 'article' && item.status === 'published');
  const survivalGuideArticles = publishedArticles.filter((item) => item.channel === 'face-survival-guide');

  const openArticle = (item: ContentItem) => {
    if (item.requiresLogin && !isLoggedIn) {
      onLoginRequest();
      return;
    }
    onOpenContent(item);
  };

  return (
    <section className="mx-auto max-w-6xl space-y-14 pb-28 pt-4 md:space-y-20 md:pt-10 fade-in">
      <header className="mx-auto max-w-3xl space-y-6 text-center md:space-y-8">
        <p className="text-xs font-bold tracking-[0.35em] text-[#8C635B] uppercase">FACE CONTENT LIBRARY</p>
        <h2 className="serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-5xl md:leading-[1.5]">
          {isZh ? '用內容，慢慢看懂你的交易方式' : 'Learn your trading style through content'}
        </h2>
        <p className="text-base leading-[2] text-[#70665D] md:text-lg">
          {isZh
            ? '影片和文章都會留在 FACE。先從你正在經歷的交易問題開始，再慢慢找到適合自己的做法。'
            : 'Videos and articles stay in FACE and are organised around your trading questions.'}
        </p>
      </header>

      {publishedVideos.length > 0 && <section aria-labelledby="video-heading">
        <div className="mb-7 flex items-end justify-between gap-6 border-b border-[#D1D1C7] pb-5">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">WATCH</p>
            <h3 id="video-heading" className="mt-2 serif text-3xl text-[#2D2D2D]">影片精選</h3>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-[1.8] text-[#70665D] md:block">目前為版面示範影片；正式內容上架後，會直接在此播放。</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {publishedVideos.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenContent(item)}
              className="group overflow-hidden border border-[#D1D1C7] bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4"
              aria-label={`觀看影片：${item.title}`}
            >
              <VideoCover item={item} />
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {item.faceTags.map((tag) => <span key={tag} className="border border-[#D1D1C7] px-2 py-1 text-[10px] tracking-[0.1em] text-[#70665D]">{tag}</span>)}
                </div>
                <h4 className="mt-4 text-xl font-bold leading-[1.55] text-[#2D2D2D] group-hover:text-[#8C635B]">{item.title}</h4>
                <p className="mt-3 text-sm leading-[1.8] text-[#70665D]">{item.summary}</p>
                <p className="mt-6 text-xs font-bold tracking-[0.16em] text-[#8C635B]">站內觀看 →</p>
              </div>
            </button>
          ))}
        </div>
      </section>}

      <section aria-labelledby="collection-heading" className="space-y-12 md:space-y-16">
        <div className="border-b border-[#D1D1C7] pb-5">
          <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">ARTICLE LIBRARY</p>
          <h3 id="collection-heading" className="mt-2 serif text-3xl text-[#2D2D2D]">文章分類</h3>
          <p className="mt-3 max-w-2xl text-sm leading-[1.9] text-[#70665D] md:text-base">內容將分成三個方向。目前先從 FACE 生存指南開始，依照篇章順序完整閱讀。</p>
        </div>

        <nav className="grid gap-4 md:grid-cols-3" aria-label="文章分類">
          {ARTICLE_CHANNELS.map((channel) => (
            <div
              key={channel.id}
              className={`relative min-h-56 border p-6 md:p-7 ${channel.available ? 'border-[#9A6D62] bg-[#F7F1EC]' : 'border-[#D8D2CA] bg-white'}`}
              aria-current={channel.available ? 'page' : undefined}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs tracking-[0.2em] text-[#A05F54]">{channel.number}</span>
                <span className={`text-xs tracking-[0.12em] ${channel.available ? 'text-[#8C635B]' : 'text-[#9B938A]'}`}>{channel.available ? '目前閱讀' : '準備中'}</span>
              </div>
              <h4 className="mt-9 serif text-2xl leading-[1.5] text-[#2D2D2D]">{channel.title}</h4>
              <p className="mt-4 text-[15px] leading-[1.9] text-[#70665D]">{channel.description}</p>
              {channel.available && <span className="absolute inset-x-0 bottom-0 h-1 bg-[#A05F54]" aria-hidden="true" />}
            </div>
          ))}
        </nav>

        <div className="border-y border-[#D8D2CA] py-8 md:flex md:items-end md:justify-between md:gap-10 md:py-10">
          <div>
            <p className="text-xs font-medium tracking-[0.24em] text-[#A05F54]">FACE GUIDE</p>
            <h4 className="mt-3 serif text-3xl text-[#2D2D2D] md:text-5xl">FACE 生存指南</h4>
          </div>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.95] text-[#70665D] md:mt-0 md:text-right md:text-base">從序言開始，依序走過破繭與生存。每一篇都承接上一篇留下的問題，也替下一篇準備一個新的視角。</p>
        </div>

        <div className="grid overflow-hidden border border-[#B9AA9D] bg-[#F7F4EF] md:grid-cols-[1fr_auto]">
          <div className="p-6 md:p-8">
            <p className="text-xs font-medium tracking-[0.2em] text-[#8C635B]">FACE 交易生存指南 · 完整方案</p>
            <h4 className="mt-3 serif text-2xl leading-[1.55] text-[#2D2D2D] md:text-3xl">想把文章裡的觀念，變成你這一型的交易使用說明書？</h4>
            <p className="mt-3 text-[15px] leading-[1.9] text-[#70665D]">查看完整內容、七個關鍵問題與早鳥方案。</p>
          </div>
          <a href="/survival-kit" onClick={(event) => { event.preventDefault(); onOpenPricing(); }} className="flex min-h-24 items-center justify-between gap-8 bg-[#2D2D2D] px-7 py-5 text-left text-white transition hover:bg-[#3A302B] md:min-w-64 md:px-9">
            <span><span className="block text-xs tracking-[0.16em] text-white/55">EARLY ACCESS</span><span className="mt-2 block serif text-2xl">查看方案</span></span>
            <span className="text-xl" aria-hidden="true">→</span>
          </a>
        </div>

        {ARTICLE_SERIES.map((series, seriesIndex) => {
          const articles = survivalGuideArticles
            .filter((item) => item.series === series.id)
            .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

          return (
            <div key={series.id} className="space-y-6">
              <div className="flex flex-col gap-3 border-l-2 border-[#A05F54] pl-5 md:flex-row md:items-end md:justify-between md:gap-8 md:pl-7">
                <div>
                  <p className="text-xs font-medium tracking-[0.22em] text-[#A05F54]">{String(seriesIndex + 1).padStart(2, '0')} · {series.english}</p>
                  <h4 className="mt-2 serif text-3xl text-[#2D2D2D] md:text-4xl">{series.id}</h4>
                </div>
                <p className="max-w-2xl text-[15px] leading-[1.9] text-[#70665D] md:text-right md:text-base">{series.description}</p>
              </div>

              <div className={`grid gap-5 ${articles.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}>
                {articles.map((item) => (
                  <a
                    key={item.id}
                    href={`/watch/${item.slug}`}
                    onClick={(event) => { event.preventDefault(); openArticle(item); }}
                    className={`group flex min-h-72 flex-col justify-between border bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B18A80] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4 md:p-9 ${item.requiresLogin ? 'border-[#B9AA9D]' : 'border-[#D1D1C7]'} ${articles.length === 1 ? 'md:min-h-80' : ''}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-5">
                        <p className="font-mono text-sm tracking-[0.18em] text-[#A05F54]">{item.articleNumber}</p>
                        <p className={`text-xs tracking-[0.12em] ${item.requiresLogin ? 'border border-[#B9AA9D] bg-[#F7F1EC] px-2.5 py-1 text-[#7A5148]' : 'text-[#8C7E6D]'}`}>
                          {item.requiresLogin ? 'LOCK · 登入限定' : item.series}
                        </p>
                      </div>
                      <h5 className={`mt-8 serif leading-[1.55] text-[#2D2D2D] transition group-hover:text-[#8C635B] ${articles.length === 1 ? 'max-w-4xl text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>{item.title}</h5>
                      <p className={`mt-5 leading-[1.95] text-[#70665D] ${articles.length === 1 ? 'max-w-3xl text-base md:text-lg' : 'text-[15px] md:text-base'}`}>{item.summary}</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#E3DED6] pt-5">
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {item.faceTags.map((tag) => <span key={tag} className="text-xs text-[#8C7E6D]">{tag}</span>)}
                      </div>
                      <span className="shrink-0 text-sm font-medium text-[#2D2D2D]">{item.requiresLogin && !isLoggedIn ? '登入閱讀 →' : '閱讀文章 →'}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <div className="border-y border-[#D1D1C7]/70 py-10 text-center md:py-12">
        <p className="serif text-2xl text-[#2D2D2D] md:text-3xl">先知道自己的交易傾向，內容會更有方向</p>
        <button type="button" onClick={hasDna ? onViewResult : onStartTest} className="mt-6 border-b border-[#2D2D2D] pb-1 text-sm font-bold text-[#2D2D2D]">
          {hasDna ? '查看我的 FACE 結果' : '先做 FACE 測驗'} →
        </button>
      </div>
    </section>
  );
};

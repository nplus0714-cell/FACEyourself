import React from 'react';
import { CONTENT_CATALOG, CONTENT_COLLECTIONS, ContentItem } from '../data/contentCatalog';
import { Language } from '../types';

interface ContentHubProps {
  hasDna: boolean;
  language: Language;
  onStartTest: () => void;
  onViewResult: () => void;
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

export const ContentHub: React.FC<ContentHubProps> = ({ hasDna, language, onStartTest, onViewResult, onOpenContent }) => {
  const isZh = language === 'zh';

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

      <section aria-labelledby="video-heading">
        <div className="mb-7 flex items-end justify-between gap-6 border-b border-[#D1D1C7] pb-5">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">WATCH</p>
            <h3 id="video-heading" className="mt-2 serif text-3xl text-[#2D2D2D]">影片精選</h3>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-[1.8] text-[#70665D] md:block">目前為版面示範影片；正式內容上架後，會直接在此播放。</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CONTENT_CATALOG.filter((item) => item.kind === 'video').map((item) => (
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
      </section>

      <section aria-labelledby="collection-heading">
        <div className="mb-7 border-b border-[#D1D1C7] pb-5">
          <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">READ &amp; EXPLORE</p>
          <h3 id="collection-heading" className="mt-2 serif text-3xl text-[#2D2D2D]">專欄試讀</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-[1.35fr_0.65fr]">
          {CONTENT_CATALOG.filter((item) => item.kind === 'article').map((item) => (
            <button key={item.id} type="button" onClick={() => onOpenContent(item)} className="group border border-[#D1D1C7] bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8C635B] focus:ring-offset-4 md:p-10">
              <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">FACE COLUMN · 免費試讀</p>
              <h4 className="mt-7 max-w-2xl serif text-3xl leading-[1.55] text-[#2D2D2D] group-hover:text-[#8C635B] md:text-4xl">{item.title}</h4>
              <p className="mt-5 max-w-2xl text-base leading-[2] text-[#70665D]">{item.summary}</p>
              <p className="mt-8 text-sm font-bold text-[#2D2D2D]">閱讀試讀內容 →</p>
            </button>
          ))}
          <div className="border border-[#D1D1C7] bg-[#F7F4EF] p-7 md:p-9">
            <p className="text-xs font-bold tracking-[0.18em] text-[#8C635B]">MEMBERSHIP</p>
            <h4 className="mt-6 serif text-2xl leading-[1.5] text-[#2D2D2D]">讓深度內容，成為你的固定練習</h4>
            <p className="mt-5 text-sm leading-[1.9] text-[#70665D]">未來這裡會清楚標示：哪些能免費閱讀、哪些需要單篇解鎖或訂閱。</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3 md:gap-7" aria-label="未來主題">
        {CONTENT_COLLECTIONS.map((collection, index) => (
          <article key={collection.id} className="min-h-48 border border-[#D1D1C7] bg-white p-7 shadow-sm">
            <p className="font-mono text-xs tracking-[0.22em] text-[#8C635B]">0{index + 1}</p>
            <h4 className="mt-8 serif text-2xl text-[#2D2D2D]">{collection.title}</h4>
            <p className="mt-4 text-sm leading-[1.9] text-[#70665D]">{collection.description}</p>
          </article>
        ))}
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

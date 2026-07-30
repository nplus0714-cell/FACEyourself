import React from 'react';
import { ContentItem } from '../data/contentCatalog';

interface ContentDetailProps {
  item: ContentItem;
  onBack: () => void;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({ item, onBack }) => {
  const embedUrl = item.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
    : undefined;

  return (
    <article className="mx-auto max-w-4xl pb-28 pt-4 md:pt-10 fade-in">
      <button type="button" onClick={onBack} className="text-sm font-bold text-[#70665D] transition hover:text-[#2D2D2D]">← 回到內容中心</button>
      <header className="mt-10 border-b border-[#D1D1C7] pb-9 text-center md:mt-14 md:pb-12">
        <p className="text-xs font-bold tracking-[0.28em] text-[#8C635B]">FACE {item.kind === 'video' ? 'VIDEO' : 'COLUMN'} {item.isDemo ? '· DEMO' : ''}</p>
        <h1 className="mx-auto mt-5 max-w-3xl serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-5xl">{item.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-[2] text-[#70665D] md:text-lg">{item.summary}</p>
      </header>

      {item.kind === 'video' ? <>
        <div className="mt-10 overflow-hidden border border-[#D1D1C7] bg-black shadow-lg md:mt-14">
          {embedUrl ? <iframe className="aspect-video w-full" src={embedUrl} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : null}
        </div>
        {item.isDemo && <p className="mt-3 text-center text-xs leading-[1.7] text-[#8C7E6D]">這是播放版面示範。正式發布時會換成你的 YouTube 影片，不會改變頁面網址或流程。</p>}
      </> : <section className="mx-auto mt-10 max-w-2xl md:mt-14">
        <div className="space-y-7 text-lg leading-[2.05] text-[#413C38] md:text-xl">
          {(item.body ?? []).slice(0, item.previewParagraphs ?? 0).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="relative mt-2 overflow-hidden pt-14">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/90 to-white" />
          <div className="select-none space-y-7 blur-[5px] text-lg leading-[2.05] text-[#70665D] md:text-xl" aria-hidden="true">
            {(item.body ?? []).slice(item.previewParagraphs ?? 0).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex min-h-64 items-end justify-center bg-gradient-to-t from-white via-white/95 to-transparent px-4 pb-3 text-center">
            <div className="max-w-md border border-[#D1D1C7] bg-[#F7F4EF] p-7 shadow-lg md:p-9">
              <p className="text-xs font-bold tracking-[0.2em] text-[#8C635B]">MEMBERS ONLY</p>
              <h2 className="mt-3 serif text-2xl text-[#2D2D2D]">後半篇留給訂閱讀者</h2>
              <p className="mt-3 text-sm leading-[1.8] text-[#70665D]">正式版將在這裡提供單篇解鎖與月訂閱；現在先讓你確認閱讀和鎖定內容的呈現方式。</p>
              <button type="button" disabled className="mt-6 cursor-not-allowed bg-[#2D2D2D] px-6 py-4 text-sm font-bold text-white opacity-50">解鎖完整文章（示範）</button>
            </div>
          </div>
        </div>
      </section>}

      <section className="mt-14 border border-[#D1D1C7] bg-[#F7F4EF] p-7 text-center md:p-10">
        <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">NEXT STEP</p>
        <h2 className="mt-3 serif text-2xl text-[#2D2D2D] md:text-3xl">這個問題，也正在困擾你嗎？</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.9] text-[#70665D]">之後這裡會放你的 LINE@ 諮詢入口；使用者看完內容後，再選擇是否主動和你聊聊。</p>
        <button type="button" disabled className="mt-7 cursor-not-allowed bg-[#2D2D2D] px-6 py-4 text-sm font-bold text-white opacity-50">LINE@ 諮詢入口（等待你的連結）</button>
      </section>
    </article>
  );
};

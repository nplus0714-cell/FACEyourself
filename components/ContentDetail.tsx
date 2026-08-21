import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CONTENT_CATALOG, ContentItem } from '../data/contentCatalog';
import { createReadingSessionId, recordContentReading } from '../services/contentReading';
import { getPaidArticleMarkdown } from '../services/paidContent';

interface ContentDetailProps {
  item: ContentItem;
  isLoggedIn: boolean;
  hasSurvivalKitAccess: boolean;
  onBack: () => void;
  onLoginRequest: () => void;
  onOpenPricing: () => void;
  onOpenContent: (item: ContentItem) => void;
  onStartTest: () => void;
}

export const ContentDetail: React.FC<ContentDetailProps> = ({ item, isLoggedIn, hasSurvivalKitAccess, onBack, onLoginRequest, onOpenPricing, onOpenContent, onStartTest }) => {
  const articleRef = useRef<HTMLElement>(null);
  const readingSessionRef = useRef(createReadingSessionId());
  const [paidArticleMarkdown, setPaidArticleMarkdown] = useState<string | null>(null);
  const [paidArticleStatus, setPaidArticleStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [paidArticleReloadKey, setPaidArticleReloadKey] = useState(0);
  const embedUrl = item.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
    : undefined;
  const isLoginLocked = item.kind === 'article' && item.requiresLogin && !isLoggedIn;
  const isPurchaseLocked = item.kind === 'article' && item.requiresPurchase && !hasSurvivalKitAccess;
  const isLocked = isLoginLocked || isPurchaseLocked;
  const renderedMarkdown = item.requiresPurchase ? paidArticleMarkdown : item.bodyMarkdown;
  const orderedArticles = CONTENT_CATALOG
    .filter((entry) => entry.kind === 'article' && entry.status === 'published')
    .sort((a, b) => Number(a.articleNumber ?? 0) - Number(b.articleNumber ?? 0));
  const articleIndex = orderedArticles.findIndex((entry) => entry.id === item.id);
  const previousArticle = articleIndex > 0 ? orderedArticles[articleIndex - 1] : null;
  const nextArticle = articleIndex >= 0 && articleIndex < orderedArticles.length - 1 ? orderedArticles[articleIndex + 1] : null;

  useEffect(() => {
    setPaidArticleMarkdown(null);
    if (item.kind !== 'article' || !item.requiresPurchase || isLocked) {
      setPaidArticleStatus('idle');
      return undefined;
    }

    let active = true;
    setPaidArticleStatus('loading');
    void getPaidArticleMarkdown(item.slug)
      .then((markdown) => {
        if (!active) return;
        setPaidArticleMarkdown(markdown);
        setPaidArticleStatus('idle');
      })
      .catch((error) => {
        console.warn('Unable to load paid article content', error);
        if (active) setPaidArticleStatus('error');
      });

    return () => { active = false; };
  }, [isLocked, item.kind, item.requiresPurchase, item.slug, paidArticleReloadKey]);

  useEffect(() => {
    if (isLocked) return undefined;
    const sessionId = readingSessionRef.current;
    let maxProgress = 0;
    let lastSentProgress = 0;
    let animationFrame = 0;
    void recordContentReading(item, sessionId, 'open', 0)
      .catch((error) => console.warn('Unable to record article open', error));

    const measure = () => {
      animationFrame = 0;
      const element = articleRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const readableHeight = Math.max(1, element.scrollHeight);
      const readPixels = Math.max(0, Math.min(readableHeight, window.innerHeight - rect.top));
      maxProgress = Math.max(maxProgress, Math.round((readPixels / readableHeight) * 100));
      if (maxProgress >= lastSentProgress + 10 || maxProgress >= 90) {
        lastSentProgress = maxProgress;
        void recordContentReading(item, sessionId, 'progress', maxProgress)
          .catch((error) => console.warn('Unable to record reading progress', error));
      }
    };
    const onScroll = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (maxProgress > lastSentProgress) {
        void recordContentReading(item, sessionId, 'progress', maxProgress).catch(() => undefined);
      }
    };
  }, [isLocked, item]);

  return (
    <article ref={articleRef} className="mx-auto max-w-4xl pb-28 pt-4 md:pt-10 fade-in">
      <a href="/watch" onClick={(event) => { event.preventDefault(); onBack(); }} className="text-sm font-bold text-[#70665D] transition hover:text-[#2D2D2D]">← 回到內容中心</a>
      <header className="mt-10 border-b border-[#D1D1C7] pb-9 text-center md:mt-14 md:pb-12">
        <p className="text-xs font-bold tracking-[0.28em] text-[#8C635B]">
          FACE {item.kind === 'video' ? 'VIDEO' : 'COLUMN'} {item.series ? `· ${item.articleNumber} · ${item.series}` : item.isDemo ? '· DEMO' : ''}
        </p>
        <h1 className="mx-auto mt-5 max-w-3xl serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-5xl">{item.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-[2] text-[#70665D] md:text-lg">{item.summary}</p>
        {item.requiresLogin && <p className="mx-auto mt-6 w-fit border border-[#B9AA9D] bg-[#F7F1EC] px-4 py-2 text-xs font-medium tracking-[0.12em] text-[#7A5148]">{item.requiresPurchase ? 'PLAN · 登入與方案限定' : 'LOCK · 登入限定文章'}</p>}
      </header>

      {item.kind === 'video' ? <>
        <div className="mt-10 overflow-hidden border border-[#D1D1C7] bg-black shadow-lg md:mt-14">
          {embedUrl ? <iframe className="aspect-video w-full" src={embedUrl} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : null}
        </div>
        {item.isDemo && <p className="mt-3 text-center text-xs leading-[1.7] text-[#8C7E6D]">這是播放版面示範。正式發布時會換成你的 YouTube 影片，不會改變頁面網址或流程。</p>}
      </> : isLocked ? (
        <section className="mx-auto mt-10 max-w-2xl border border-[#B9AA9D] bg-[#F7F1EC] p-7 text-center md:mt-14 md:p-12">
          <p className="text-xs font-medium tracking-[0.22em] text-[#8C635B]">{item.requiresPurchase ? 'FACE SURVIVAL · PLAN ACCESS' : 'MEMBER READING'}</p>
          <h2 className="mt-4 serif text-3xl leading-[1.55] text-[#2D2D2D]">{isLoginLocked ? '先登入，再繼續這段閱讀' : '取得 FACE Survival 後閱讀'}</h2>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-[1.95] text-[#70665D]">
            {item.requiresPurchase
              ? isLoginLocked
                ? '這篇屬於 FACE Survival 文字版內容。先登入確認帳號；已有方案權限可直接閱讀，尚未取得則可查看早鳥資訊。'
                : '這篇屬於 FACE Survival 文字版內容。取得方案後，會以同一個會員帳號開放完整閱讀。'
              : '這篇文章屬於 FACE 生存指南的會員內容。登入不需要付費，完成登入後即可繼續閱讀。'}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {isLoginLocked && <button type="button" onClick={onLoginRequest} className="bg-[#2D2D2D] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#3A302B]">登入並繼續 →</button>}
            {(item.requiresPurchase || !isLoginLocked) && <a href="/survival-kit" onClick={(event) => { event.preventDefault(); onOpenPricing(); }} className="border border-[#9A6D62] bg-white px-7 py-4 text-sm font-medium text-[#5F443D] transition hover:bg-[#F2E8E2]">查看方案與早鳥資訊</a>}
          </div>
        </section>
      ) : item.requiresPurchase && paidArticleStatus === 'loading' ? (
        <section className="mx-auto mt-14 max-w-xl py-16 text-center" role="status" aria-live="polite">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border border-[#CFC6B8] border-t-[#8C635B]" aria-hidden="true" />
          <p className="mt-5 text-sm leading-7 text-[#70665D]">正在確認權限並載入文章…</p>
        </section>
      ) : item.requiresPurchase && paidArticleStatus === 'error' ? (
        <section className="mx-auto mt-14 max-w-xl border border-[#B9AA9D] bg-[#F7F1EC] p-8 text-center">
          <h2 className="serif text-2xl text-[#2D2D2D]">文章暫時無法載入</h2>
          <p className="mt-4 text-sm leading-7 text-[#70665D]">你的方案權限仍然保留。請稍後重試，或重新整理頁面。</p>
          <button type="button" onClick={() => setPaidArticleReloadKey((value) => value + 1)} className="mt-6 bg-[#2D2D2D] px-7 py-3 text-sm font-medium text-white">重新載入</button>
        </section>
      ) : renderedMarkdown ? (
        <section className="mx-auto mt-10 max-w-[44rem] md:mt-14">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="mb-6 mt-16 border-l-2 border-[#A05F54] pl-5 serif text-[1.75rem] leading-[1.55] text-[#2D2D2D] md:text-[2rem]">{children}</h2>,
              h3: ({ children }) => <h3 className="mb-5 mt-12 serif text-2xl leading-[1.6] text-[#2D2D2D]">{children}</h3>,
              p: ({ children }) => <p className="my-5 text-[17px] font-normal leading-[2] text-[#413C38] md:text-lg">{children}</p>,
              strong: ({ children }) => <strong className="font-medium text-[#A05F54]">{children}</strong>,
              hr: () => <hr className="my-12 border-0 border-t border-[#D8D0C6]" />,
              ul: ({ children }) => <ul className="my-6 list-disc space-y-3 pl-6 text-[17px] leading-[1.9] text-[#413C38] md:text-lg">{children}</ul>,
              ol: ({ children }) => <ol className="my-6 list-decimal space-y-3 pl-6 text-[17px] leading-[1.9] text-[#413C38] md:text-lg">{children}</ol>,
              blockquote: ({ children }) => <blockquote className="my-10 border-l-2 border-[#A05F54] bg-[#F7F1EC] px-6 py-4 text-[#594A43]">{children}</blockquote>,
            }}
          >
            {renderedMarkdown}
          </ReactMarkdown>
        </section>
      ) : (
        <section className="mx-auto mt-10 max-w-2xl space-y-7 text-lg leading-[2.05] text-[#413C38] md:mt-14 md:text-xl">
          {(item.body ?? []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      )}

      {item.kind === 'article' && !isLocked && <section className="mt-16 grid overflow-hidden border border-[#B9AA9D] bg-[#F7F4EF] md:grid-cols-[1fr_auto]">
        <div className="p-7 md:p-9">
          <p className="text-xs font-medium tracking-[0.2em] text-[#8C635B]">FACE 交易生存指南 · 完整方案</p>
          <h2 className="mt-3 serif text-2xl leading-[1.55] text-[#2D2D2D] md:text-3xl">把閱讀變成適合你這一型的交易使用說明書</h2>
          <p className="mt-3 text-[15px] leading-[1.9] text-[#70665D]">查看七個關鍵問題、完整內容與早鳥方案。</p>
        </div>
        <a href="/survival-kit" onClick={(event) => { event.preventDefault(); onOpenPricing(); }} className="flex min-h-24 items-center justify-between gap-8 bg-[#2D2D2D] px-7 py-5 text-left text-white transition hover:bg-[#3A302B] md:min-w-64 md:px-9">
          <span><span className="block text-xs tracking-[0.16em] text-white/55">PLAN PREVIEW</span><span className="mt-2 block serif text-2xl">查看方案</span></span>
          <span className="text-xl" aria-hidden="true">→</span>
        </a>
      </section>}

      {item.kind === 'article' && <nav className="mt-12 grid gap-3 border-t border-[#D1D1C7] pt-8 sm:grid-cols-2" aria-label="上一篇與下一篇文章">
        {previousArticle ? <a href={`/watch/${previousArticle.slug}`} onClick={(event) => { event.preventDefault(); onOpenContent(previousArticle); }} className="border border-[#D1D1C7] bg-white px-5 py-5 transition hover:border-[#8C635B]">
          <span className="text-xs tracking-[0.14em] text-[#8C7E6D]">← 上一篇</span>
          <span className="mt-2 block serif text-xl leading-[1.55] text-[#2D2D2D]">{previousArticle.title}</span>
        </a> : <span />}
        {nextArticle && <a href={`/watch/${nextArticle.slug}`} onClick={(event) => { event.preventDefault(); onOpenContent(nextArticle); }} className="border border-[#D1D1C7] bg-white px-5 py-5 text-right transition hover:border-[#8C635B]">
          <span className="text-xs tracking-[0.14em] text-[#8C7E6D]">下一篇 →</span>
          <span className="mt-2 block serif text-xl leading-[1.55] text-[#2D2D2D]">{nextArticle.title}</span>
        </a>}
      </nav>}

      {item.kind === 'article' && <aside className="mt-8 border-y border-[#D1D1C7] py-8 text-center">
        <p className="serif text-2xl leading-[1.6] text-[#2D2D2D]">文章談的是市場，也可能正在說你的決策習慣</p>
        <a href="/test" onClick={(event) => { event.preventDefault(); onStartTest(); }} className="mt-5 inline-block border-b border-[#2D2D2D] pb-1 text-sm font-medium text-[#2D2D2D]">用 24 題找到我的 FACE →</a>
      </aside>}

      {item.kind === 'video' && <section className="mt-14 border border-[#D1D1C7] bg-[#F7F4EF] p-7 text-center md:p-10">
        <p className="text-xs font-bold tracking-[0.22em] text-[#8C635B]">NEXT STEP</p>
        <h2 className="mt-3 serif text-2xl text-[#2D2D2D] md:text-3xl">這個問題，也正在困擾你嗎？</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.9] text-[#70665D]">之後這裡會放你的 LINE@ 諮詢入口；使用者看完內容後，再選擇是否主動和你聊聊。</p>
        <button type="button" disabled className="mt-7 cursor-not-allowed bg-[#2D2D2D] px-6 py-4 text-sm font-bold text-white opacity-50">LINE@ 諮詢入口（等待你的連結）</button>
      </section>}
    </article>
  );
};

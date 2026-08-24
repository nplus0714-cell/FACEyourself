import React, { useEffect, useRef, useState } from 'react';
import { PRODUCT_PREVIEW_DISCLAIMER, SITE_IDENTITY } from '../data/siteIdentity';
import { CheckoutError, startEcpayCheckout } from '../services/ecpayCheckout';
import { EarlyAccessWaitlistForm } from './EarlyAccessWaitlistForm';

const painPoints = [
  '你是否做了許多研究，但每次判斷仍帶著急迫與不安？',
  '你是否知道你的操作原則，但每次面對價格波動時，卻又失控？',
  '一筆一筆交易結束，卻不知道自己為什麼賺、為什麼賠，每一次都像重新摸索？',
];

const learningPath = [
  { step: '01', title: '破繭｜停止追逐答案' },
  { step: '02', title: '生存｜為錯誤設下邊界' },
  { step: '03', title: '進攻｜讓優勢形成結果' },
  { step: '04', title: '歸真｜建立自己的方法' },
];

const deliveryFiles = [
  {
    number: '01',
    title: 'FACE Daily 自我覺察日誌',
    description: '在交易前後記下情緒、注意力與行動，慢慢看見自己的決策模式。',
  },
  {
    number: '02',
    title: 'FACE Plan 交易計畫卡',
    description: '把進場理由、持有條件與離場依據放在同一張卡上，讓市場波動時仍有清楚的參照。',
  },
  {
    number: '03',
    title: 'FACE Calc 期望值計算機',
    description: '把勝率、風險與潛在報酬放回同一個框架，讓直覺成為可以檢查與比較的選擇。',
  },
];

const productSlides = [
  {
    title: 'FACE 四項數位內容',
    description: '從閱讀、覺察到計畫與計算，建立一套可以反覆使用的交易整理方式。',
    src: '/images/survival-kit/face-detail-complete-set.png',
    alt: 'FACE Survival 電子書與三項交易輔助內容示意',
  },
  {
    title: 'FACE Survival 電子書版',
    description: '從破繭、生存、進攻到歸真，梳理一條更能長期走下去的交易路徑。',
    src: '/images/survival-kit/face-detail-survival-chapters.png',
    alt: 'FACE Survival 交易生存指南封面與四階段章節內頁示意',
  },
  {
    title: '在不確定中，仍有方向',
    description: '市場讓你感到混亂時，回到原則、風險與下一個可以完成的決定。',
    src: '/images/survival-kit/face-detail-survival-guide.png',
    alt: 'FACE Survival 交易生存指南封面與內容示意',
  },
  {
    title: 'FACE Daily 自我覺察日誌',
    description: '把每天的情緒與行動留下來，看見市場如何影響你的決策節奏。',
    src: '/images/survival-kit/face-detail-daily-journal.png',
    alt: 'FACE Daily 自我覺察日誌內容示意',
  },
  {
    title: 'FACE Plan × FACE Calc',
    description: '把交易理由與風險報酬整理清楚，讓每一次出手都有可以回看的依據。',
    src: '/images/survival-kit/face-detail-trading-tools.png',
    alt: 'FACE 交易計畫、風險報酬與持股診斷工作文件示意',
  },
  {
    title: '讓方法成為日常',
    description: '閱讀建立觀念，記錄與工具承接行動，陪你把交易慢慢整理成自己的方法。',
    src: '/images/survival-kit/face-physical-design-board.png',
    alt: 'FACE Survival 電子書與交易工作文件整體設計示意',
  },
];

const productLoopSlides = [...productSlides, productSlides[0]];

interface SurvivalKitPricingProps {
  isLoggedIn?: boolean;
  hasAccess?: boolean;
  onRequireLogin?: () => void;
  onOpenMemberAccess?: () => void;
}

export const SurvivalKitPricing: React.FC<SurvivalKitPricingProps> = ({
  isLoggedIn = false,
  hasAccess = false,
  onRequireLogin,
  onOpenMemberAccess,
}) => {
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const [isProductCarouselPaused, setIsProductCarouselPaused] = useState(false);
  const [isCheckoutStarting, setIsCheckoutStarting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const productCarouselRef = useRef<HTMLDivElement>(null);
  const productLoopResetTimerRef = useRef<number | null>(null);
  const isProductLoopingRef = useRef(false);
  const productDragRef = useRef({ isDragging: false, pointerId: -1, startX: 0, startScrollLeft: 0 });

  const showProductSlide = (index: number) => {
    const carousel = productCarouselRef.current;
    if (productLoopResetTimerRef.current !== null) {
      window.clearTimeout(productLoopResetTimerRef.current);
      productLoopResetTimerRef.current = null;
    }
    isProductLoopingRef.current = false;

    if (index >= productSlides.length && carousel) {
      isProductLoopingRef.current = true;
      setActiveProductSlide(0);
      carousel.scrollTo({ left: carousel.clientWidth * productSlides.length, behavior: 'smooth' });
      productLoopResetTimerRef.current = window.setTimeout(() => {
        carousel.scrollTo({ left: 0, behavior: 'auto' });
        isProductLoopingRef.current = false;
        setActiveProductSlide(0);
        productLoopResetTimerRef.current = null;
      }, 700);
      return;
    }

    const nextIndex = (index + productSlides.length) % productSlides.length;
    setActiveProductSlide(nextIndex);
    carousel?.scrollTo({ left: carousel.clientWidth * nextIndex, behavior: index < 0 ? 'auto' : 'smooth' });
  };

  const syncProductSlide = () => {
    const carousel = productCarouselRef.current;
    if (!carousel || carousel.clientWidth === 0 || isProductLoopingRef.current) return;
    const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
    if (nextIndex >= 0 && nextIndex < productSlides.length) setActiveProductSlide(nextIndex);
  };

  const startProductDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !productCarouselRef.current) return;
    productDragRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: productCarouselRef.current.scrollLeft,
    };
    productCarouselRef.current.setPointerCapture(event.pointerId);
    setIsProductCarouselPaused(true);
  };

  const moveProductDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = productCarouselRef.current;
    const drag = productDragRef.current;
    if (!carousel || !drag.isDragging || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    carousel.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
  };

  const finishProductDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = productCarouselRef.current;
    const drag = productDragRef.current;
    if (!carousel || !drag.isDragging || drag.pointerId !== event.pointerId) return;
    if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
    productDragRef.current.isDragging = false;
    showProductSlide(Math.round(carousel.scrollLeft / carousel.clientWidth));
    setIsProductCarouselPaused(false);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isProductCarouselPaused || prefersReducedMotion || document.hidden) return;
    const timer = window.setTimeout(() => showProductSlide(activeProductSlide + 1), 4600);
    return () => window.clearTimeout(timer);
  }, [activeProductSlide, isProductCarouselPaused]);

  useEffect(() => () => {
    if (productLoopResetTimerRef.current !== null) window.clearTimeout(productLoopResetTimerRef.current);
  }, []);

  const showStageCheckout = new URLSearchParams(window.location.search).get('checkout') === 'stage';

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    setCheckoutError(null);
    setIsCheckoutStarting(true);
    try {
      await startEcpayCheckout();
    } catch (error) {
      setCheckoutError(error instanceof CheckoutError ? error.message : '目前無法前往付款頁，請稍後再試。');
      setIsCheckoutStarting(false);
    }
  };

  return (
    <section id="survival-kit" className="flex min-w-0 scroll-mt-8 flex-col overflow-hidden border border-[#C8B5A8] bg-[#F3ECE5] [overflow-wrap:anywhere]" aria-labelledby="survival-kit-title">
      <div className="order-5 grid border-t border-[#C8B5A8] lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)]">
        <div className="order-2 flex flex-col justify-center border-b border-[#CDBCAF] bg-[#F3ECE5] p-7 sm:p-10 lg:order-none lg:border-b-0 lg:border-r lg:p-14">
          <p className="text-xs font-medium tracking-[0.24em] text-[#8C635B]">FACE SURVIVAL · EARLY ACCESS</p>
          <h2 id="survival-kit-title" className="mt-5 serif text-4xl leading-[1.4] text-[#2D2D2D] md:text-5xl">
            讓每一次決定，<br />都有理由可循
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-[1.9] text-[#5F554E]">
            市場不會替你變得確定；你可以為自己建立一套在波動裡，依然<span className="text-[#9D665C]">站得住的交易方式</span>。
          </p>
          <p className="mt-5 max-w-xl text-base leading-[1.95] text-[#70665D]">
            FACE Survival 將交易心理、風險意識與執行方法，整理成一套可以閱讀、書寫與反覆使用的數位內容，陪你把市場經驗真正留下來。
          </p>
          <div className="mt-8 border-y border-[#D1C3B7] py-5">
            <p className="serif text-xl leading-[1.75] text-[#2D2D2D]">穩定，不是沒有情緒。</p>
            <p className="mt-1 text-sm leading-7 text-[#7B7067]">而是情緒出現時，你依然知道自己為什麼留下、又該在何時離開。</p>
          </div>
        </div>

        <div
          className="order-1 border-b border-[#CDBCAF] bg-[#82685E] p-5 text-white sm:p-8 lg:order-none lg:border-b-0 lg:p-10"
          onMouseEnter={() => setIsProductCarouselPaused(true)}
          onMouseLeave={() => setIsProductCarouselPaused(false)}
          onFocusCapture={() => setIsProductCarouselPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsProductCarouselPaused(false);
          }}
          onTouchStart={() => setIsProductCarouselPaused(true)}
          onTouchEnd={() => setIsProductCarouselPaused(false)}
        >
          <p className="mb-5 text-xs tracking-[0.22em] text-white/50">PRODUCT PREVIEW · DIGITAL DELIVERY</p>
          <div role="region" aria-roledescription="carousel" aria-label="FACE 數位產品內容預覽">
            <div
              ref={productCarouselRef}
              onScroll={syncProductSlide}
              onPointerDown={startProductDrag}
              onPointerMove={moveProductDrag}
              onPointerUp={finishProductDrag}
              onPointerCancel={finishProductDrag}
              className="flex cursor-grab snap-x snap-mandatory select-none overflow-x-auto active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {productLoopSlides.map((slide, index) => {
                const isLoopClone = index === productSlides.length;
                return (
                  <figure key={`${slide.src}-${index}`} className="min-w-full snap-center border border-[#D8C6B8] bg-[#F2EAE1]" aria-hidden={isLoopClone || undefined}>
                    <div className="aspect-[4/3] overflow-hidden bg-[#F2EAE1] p-2 sm:p-3">
                      <img src={slide.src} alt={isLoopClone ? '' : slide.alt} loading="lazy" decoding="async" draggable={false} className="block h-full w-full object-contain object-center" />
                    </div>
                    <figcaption className="border-t border-white/15 bg-[#74584F] px-5 py-4">
                      <p className="serif text-xl leading-[1.5] text-white">{slide.title}</p>
                      <p className="mt-1 text-sm leading-[1.75] text-white/70">{slide.description}</p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
          <div className="mt-5 flex gap-2" aria-label="選擇產品圖片">
            {productSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => showProductSlide(index)}
                className={`h-2 transition-all ${activeProductSlide === index ? 'w-8 bg-[#D9C7A9]' : 'w-2 bg-white/30 hover:bg-white/55'}`}
                aria-label={`查看第 ${index + 1} 張：${slide.title}`}
                aria-current={activeProductSlide === index ? 'true' : undefined}
              />
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-white/55">{PRODUCT_PREVIEW_DISCLAIMER}</p>
        </div>
      </div>

      <div className="order-1 grid bg-[#F7F2EC] lg:grid-cols-[0.78fr_1.22fr]">
        <div className="min-w-0 border-b border-[#765850] bg-[#654943] p-7 text-white sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <p className="text-xs font-medium tracking-[0.22em] text-[#E6D5B8]">DOES THIS SOUND LIKE YOU?</p>
          <h3 className="mt-5 serif text-3xl leading-[1.55] text-white">你不是不夠努力，<br />而是需要一套能在市場裡用得上的方法。</h3>
        </div>
        <div className="min-w-0 p-7 sm:p-10 lg:p-14">
          <ul className="space-y-5">
            {painPoints.map((item, index) => (
              <li key={item} className="grid grid-cols-[2.25rem_1fr] gap-4 border-b border-[#D8C8BB] pb-5 last:border-b-0 last:pb-0">
                <span className="pt-1 text-sm tracking-[0.12em] text-[#9D665C]">0{index + 1}</span>
                <p className="min-w-0 serif text-xl leading-[1.8] text-[#3F3833]">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-2 grid border-t border-[#C8B5A8] bg-[#E8DDD2] lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-[#CDBCAF] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <p className="text-xs font-medium tracking-[0.22em] text-[#8C635B]">WHY I MADE THIS</p>
          <h3 className="mt-4 serif text-3xl leading-[1.55] text-[#2D2D2D]">把研究，整理成交易者真正用得上的方法</h3>
        </div>
        <div className="p-7 sm:p-10 lg:p-14">
          <p className="text-lg leading-[2] text-[#4F4943]">
            過去 7 年投顧研究與 3 年量化金融產品設計的工作，讓我長期站在資訊與決策之間，看見同一個反覆出現的難題。
          </p>
          <p className="mt-5 text-base leading-[2] text-[#70665D]">
            真正困難的，往往不是看不懂市場，而是市場變化時，能否保留原本的判斷。FACE Survival 因此從交易者的真實處境出發，將抽象的心理與紀律，整理成可以閱讀、書寫與複查的流程。它不替你做決定，而是讓每一次決定，都更接近你原本相信的方法。
          </p>
          <a href="/coach" className="mt-7 inline-block border-b border-[#8C635B] pb-1 text-sm font-medium text-[#6F4D47]">了解內容設計者與方法邊界 →</a>
        </div>
      </div>

      <div className="order-3 border-t border-[#C8B5A8] bg-[#F4EEE7] p-7 sm:p-10 lg:p-14">
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.22em] text-[#8C635B]">WHAT YOU WILL RECEIVE</p>
          <h3 className="mt-4 serif text-3xl leading-[1.55] text-[#2D2D2D] md:text-4xl">四項數位內容，陪你完成交易前、中、後的整理</h3>
          <p className="mt-5 text-base leading-[1.95] text-[#70665D]">一次取得、長期使用。內容以數位形式交付，讓閱讀不只停在理解，也能自然走進每日覺察、交易計畫與風險評估。</p>
        </div>
        <div className="mt-9 grid gap-px overflow-hidden border border-[#CFC2B6] bg-[#CFC2B6] lg:grid-cols-[1.05fr_1.9fr]">
          <article className="bg-[#5F4540] p-7 text-white sm:p-9">
            <p className="text-xs tracking-[0.2em] text-[#D9C7A9]">CORE · E-BOOK</p>
            <h4 className="mt-6 serif text-3xl leading-[1.5]">FACE Survival<br /><span className="text-xl text-[#E6D5B8]">電子書版</span></h4>
            <ol className="mt-7 space-y-0 border-y border-white/15">
              {learningPath.map((item) => (
                <li key={item.step} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-white/10 py-4 last:border-b-0">
                  <span className="text-xs tracking-[0.12em] text-[#D9C7A9]">{item.step}</span>
                  <span className="text-sm leading-6 text-white/80">{item.title}</span>
                </li>
              ))}
            </ol>
          </article>
          <div className="grid gap-px bg-[#CFC2B6] sm:grid-cols-2">
            {deliveryFiles.map((item) => (
              <article key={item.number} className="flex aspect-square min-w-0 flex-col bg-white p-7 sm:p-7 xl:p-9">
                <p className="text-xs tracking-[0.16em] text-[#9D665C]">FILE {item.number}</p>
                <h4 className="mt-5 serif text-xl leading-[1.48] text-[#2D2D2D] xl:text-2xl">{item.title}</h4>
                <p className="mt-4 text-sm leading-[1.78] text-[#70665D]">{item.description}</p>
              </article>
            ))}
            <a
              href="/watch/trading-decisions-under-uncertainty"
              className="group relative flex aspect-square min-w-0 items-end overflow-hidden bg-[#DCCCBD] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8C635B]"
              aria-label="免費試讀 FACE Survival 序言"
            >
              <img
                src="/images/survival-kit/face-detail-survival-chapters.png"
                alt="FACE Survival 電子書封面與章節內容示意"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D211D]/90 via-[#2D211D]/15 to-transparent" />
              <div className="relative w-full p-6 text-white sm:p-7 xl:p-8">
                <p className="text-[11px] tracking-[0.18em] text-white/70">FREE PREVIEW · 序言</p>
                <span className="mt-4 inline-flex min-h-11 items-center bg-[#F7F2EC] px-5 py-3 text-sm font-medium text-[#654943] transition group-hover:bg-white">免費試讀 →</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="order-4 border-t border-[#C8B5A8] bg-[#5F4540] p-7 text-white sm:p-10 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:gap-16">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium tracking-[0.24em] text-[#D9C7A9]">EARLY ACCESS · EMAIL ONLY</p>
            <h3 className="mt-5 serif text-3xl leading-[1.5] text-white">為早鳥優惠，保留一個位置</h3>
            <p className="mt-4 text-sm leading-[1.9] text-white/75">留下 Email，正式開放時你會優先收到完整內容、交付方式與早鳥購買連結。無須現在承諾購買，先把選擇留給未來的自己。</p>
            <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-3">
              <div>
                <p className="mb-2 text-xs tracking-[0.14em] text-[#D9C7A9]">預計早鳥價</p>
                <p className="serif text-5xl leading-none md:text-6xl"><span className="mr-2 text-lg">NT$</span>590</p>
              </div>
              <div className="pb-1">
                <p className="mb-1 text-xs tracking-[0.1em] text-white/45">預計正式定價</p>
                <p className="text-sm text-white/45 line-through">NT$1,190</p>
              </div>
            </div>
            <div className="mt-7 border-y border-white/15 py-5 text-sm leading-7 text-white/75">
              <p>FACE Survival ＋ FACE Daily ＋ FACE Plan ＋ FACE Calc</p>
              <p>一次付費、數位交付，可長期保存使用</p>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:border-l lg:border-white/15 lg:pl-16">
            <EarlyAccessWaitlistForm source="survival-guide-early-access" />
            {showStageCheckout && (
              <div className="mt-7 border border-[#D9C7A9]/45 bg-black/10 p-5" aria-label="綠界 Stage 付款驗收">
                <p className="text-xs font-medium tracking-[0.16em] text-[#D9C7A9]">INTERNAL CHECKOUT · STAGE</p>
                <p className="mt-3 text-sm leading-7 text-white/75">測試環境，不會產生正式商品訂單；此入口僅供登入、付款返回與會員權限驗收。</p>
                {checkoutError && <p className="mt-3 border border-[#E8B4AA]/50 bg-[#5B302B]/50 px-4 py-3 text-sm leading-6 text-[#FFE6DF]" role="alert">{checkoutError}</p>}
                {hasAccess ? (
                  <button type="button" onClick={onOpenMemberAccess} className="mt-5 min-h-12 w-full bg-[#F7F2EC] px-5 py-3 text-sm font-medium text-[#654943] transition hover:bg-white">
                    已取得內容權限，前往會員中心 →
                  </button>
                ) : (
                  <button type="button" onClick={() => void handleCheckout()} disabled={isCheckoutStarting} className="mt-5 min-h-12 w-full bg-[#F7F2EC] px-5 py-3 text-sm font-medium text-[#654943] transition hover:bg-white disabled:cursor-wait disabled:opacity-60">
                    {isCheckoutStarting ? '正在建立測試訂單…' : isLoggedIn ? '前往綠界 Stage 測試付款 NT$590 →' : '登入後進行測試付款 →'}
                  </button>
                )}
              </div>
            )}
            <p className="mt-5 text-xs leading-6 text-white/45">本產品提供交易教育與自我覺察內容，不提供個別標的、買賣時點、持倉建議或報酬保證。</p>
            <dl className="mt-5 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 border-t border-white/10 pt-4 text-xs leading-6 text-white/50">
              <dt>品牌</dt><dd>{SITE_IDENTITY.brand}</dd>
              <dt>聯絡信箱</dt><dd><a href={`mailto:${SITE_IDENTITY.email}`} className="underline underline-offset-4">{SITE_IDENTITY.email}</a></dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

import type { ContentItem, } from '../data/contentCatalog';
import type { PersonalityProfile } from '../types';
import { FACE_MAP } from '../constants';

const SITE_ORIGIN = 'https://faceyourself.vercel.app';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/face-og-v25.jpg`;

type PageMetadataInput = {
  path: string;
  profile?: PersonalityProfile | null;
  content?: ContentItem | null;
  isNotFound?: boolean;
};

const upsertMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
};

// 每頁的 JSON-LD（結構化資料）。人格頁與文章頁輸出 Article + 麵包屑，
// 其他頁面則移除，避免殘留上一頁的資料。全站層級的 Organization / WebSite
// 已靜態寫在 index.html，這裡只負責「當前頁」的結構化資料。
const PAGE_LD_ID = 'ld-page';

const upsertPageJsonLd = (graph: unknown[] | null) => {
  const existing = document.getElementById(PAGE_LD_ID);
  if (!graph || graph.length === 0) {
    existing?.remove();
    return;
  }
  const payload = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  if (existing) {
    existing.textContent = payload;
    return;
  }
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = PAGE_LD_ID;
  script.textContent = payload;
  document.head.appendChild(script);
};

const buildPageGraph = (input: PageMetadataInput, meta: { title: string; description: string; canonicalUrl: string; imageUrl: string }) => {
  const { path, profile, content } = input;
  const breadcrumb = (items: Array<{ name: string; url: string }>) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });

  if (profile) {
    return [
      {
        '@type': 'Article',
        headline: meta.title,
        description: meta.description,
        image: meta.imageUrl,
        inLanguage: 'zh-TW',
        about: `FACE 交易人格 ${profile.code}`,
        mainEntityOfPage: meta.canonicalUrl,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      breadcrumb([
        { name: '首頁', url: `${SITE_ORIGIN}/` },
        { name: '交易人格圖鑑', url: `${SITE_ORIGIN}/types` },
        { name: profile.name, url: meta.canonicalUrl },
      ]),
    ];
  }

  if (content) {
    return [
      {
        '@type': 'Article',
        headline: content.title,
        description: content.summary,
        image: meta.imageUrl,
        inLanguage: 'zh-TW',
        mainEntityOfPage: meta.canonicalUrl,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      breadcrumb([
        { name: '首頁', url: `${SITE_ORIGIN}/` },
        { name: '生存指南', url: `${SITE_ORIGIN}/watch` },
        { name: content.title, url: meta.canonicalUrl },
      ]),
    ];
  }

  if (path === '/about') {
    const services = [
      ['FACE 24 題測驗', `${SITE_ORIGIN}/test`, '透過真實交易情境，看見個人的交易決策模式。'],
      ['FACE 完整人格分析', `${SITE_ORIGIN}/types`, '理解交易天賦、壓力反應與失控警訊。'],
      ['交易解憂 Bar', `${SITE_ORIGIN}/watch`, '從追高、套牢、賣飛、停損與焦慮等問題開始閱讀。'],
      ['FACE 生存指南', `${SITE_ORIGIN}/survival-kit`, '將覺察轉成風險管理、停損與可重複的交易步驟。'],
      ['RATE 鏡相診股', `${SITE_ORIGIN}/mirror-trade`, '對照 FACE 人格與真實持倉之間的策略落差。'],
      ['1V1 交易初談', `${SITE_ORIGIN}/coach`, '與教練一起整理當前交易問題的優先順序。'],
    ];
    return [
      {
        '@type': 'AboutPage',
        name: meta.title,
        description: meta.description,
        url: meta.canonicalUrl,
        inLanguage: 'zh-TW',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#organization` },
        mainEntity: {
          '@type': 'ItemList',
          name: 'FACE Trader 產品與服務',
          itemListElement: services.map(([name, url, description], index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: { '@type': 'Service', name, url, description, provider: { '@id': `${SITE_ORIGIN}/#organization` } },
          })),
        },
      },
      breadcrumb([
        { name: '首頁', url: `${SITE_ORIGIN}/` },
        { name: '關於 FACE', url: meta.canonicalUrl },
      ]),
    ];
  }

  if (path === '/types') {
    return [
      {
        '@type': 'CollectionPage',
        name: meta.title,
        description: meta.description,
        url: meta.canonicalUrl,
        inLanguage: 'zh-TW',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          name: 'FACE 16 型交易人格',
          itemListElement: Object.values(FACE_MAP).map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${item.name} ${item.code}`,
            url: `${SITE_ORIGIN}/types/${item.code}`,
          })),
        },
      },
      breadcrumb([
        { name: '首頁', url: `${SITE_ORIGIN}/` },
        { name: '交易人格圖鑑', url: meta.canonicalUrl },
      ]),
    ];
  }

  if (path === '/watch') {
    return [
      {
        '@type': 'CollectionPage',
        name: meta.title,
        description: meta.description,
        url: meta.canonicalUrl,
        inLanguage: 'zh-TW',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: ['交易心理', '風險管理', '交易紀律', '停損'],
      },
      breadcrumb([
        { name: '首頁', url: `${SITE_ORIGIN}/` },
        { name: 'FACE 生存指南', url: meta.canonicalUrl },
      ]),
    ];
  }

  return null;
};

const getPageCopy = ({ path, profile, content, isNotFound }: PageMetadataInput) => {
  if (isNotFound) return {
    title: '找不到頁面｜FACE 交易人格測驗',
    description: '這個網址不存在，請回到 FACE 首頁、交易人格圖鑑或內容中心。',
  };
  if (profile) return {
    title: `${profile.name} ${profile.code}｜${profile.attributes.replaceAll(' / ', '・')}的交易人格`,
    description: `${profile.name}（${profile.code}）的 FACE 交易人格圖鑑：看懂決策偏好、交易天賦、壓力盲點與可執行的調整方式。`,
  };
  if (content) return {
    title: `${content.title}｜交易心理與風險管理`,
    description: content.summary,
  };
  if (path === '/') return {
    title: 'FACE Trader 知己交易｜交易人格測驗與免費指南',
    description: 'FACE Trader 提供交易教育與自我覺察工具：用 24 題交易人格測驗了解決策偏好，從免費生存指南整理交易理由、風險與停損。',
  };
  if (path === '/types') return {
    title: 'FACE 16 型交易人格圖鑑｜交易人格測驗的 16 種結果',
    description: '瀏覽 FACE 交易人格測驗的 16 型結果，理解不同交易者的交易心理、天賦、盲點與互補思考方式。',
  };
  if (path === '/watch') return {
    title: 'FACE 生存指南｜交易心理、紀律與風險管理',
    description: '從交易心理、停損、紀律與風險管理出發，學會在不確定中做決定。',
  };
  if (path === '/about') return {
    title: '關於 FACE｜交易人格與自我覺察工具',
    description: 'FACE 用四個交易決策面向，幫助你理解自己的交易行為，並把覺察轉成可執行的下一步。',
  };
  if (path === '/coach') return {
    title: '關於創作者｜FACE 交易人格與交易解憂 Bar',
    description: '認識 FACE 的研究脈絡、交易心理觀點與內容創作背景。',
  };
  if (path === '/survival-kit') return {
    title: '交易生存指南｜FACE Trader 知己交易',
    description: '公開閱讀生存篇試讀，並免費閱讀破繭與生存的完整網頁篇章。',
  };
  if (path === '/guide') return {
    title: '交易生存指南公開試讀｜FACE Trader 知己交易',
    description: '免費閱讀生存篇〈停損不是失敗，是入場費〉，了解破繭、生存、進攻與歸真的交易旅程。',
  };
  if (path === '/guide/line') return {
    title: '破繭與生存完整篇章｜FACE Trader 知己交易',
    description: '免費閱讀交易生存指南的破繭與生存完整篇章。',
  };
  if (path === '/manual') return {
    title: '個人交易使用說明書｜FACE Trader 知己交易',
    description: '查看已開放的免費內容、會員示範工具與個人交易使用說明書規劃。價格及開放時間未定。',
  };
  if (path === '/privacy') return {
    title: '隱私權政策｜FACE Trader 知己交易',
    description: '了解 FACE Trader 如何收集、使用、保存與保護帳號、測驗、覺察及交易資料。',
  };
  if (path === '/terms') return {
    title: '使用條款｜FACE Trader 知己交易',
    description: 'FACE Trader 網站、交易人格測驗、數位內容與付費服務的使用約定。',
  };
  if (path === '/refund-policy') return {
    title: '退款與取消政策｜FACE Trader 知己交易',
    description: 'FACE 數位內容的候補登記、交付、取消、退款條件與申請方式。',
  };
  if (path === '/data-deletion') return {
    title: '帳號與資料刪除說明｜FACE Trader 知己交易',
    description: '申請刪除 FACE 帳號、測驗結果與自我覺察資料的方式及處理時間。',
  };
  if (path === '/test') return {
    title: '24 題 FACE 交易人格測驗｜找到你的決策模式',
    description: '透過 24 題交易情境、直覺、圖像與同意程度題，整理你的四個 FACE 決策偏好。',
  };
  if (path === '/my-result') return {
    title: '我的 FACE 交易人格結果',
    description: '查看你的 FACE 交易人格與四個決策面向。',
  };
  if (path === '/me') return {
    title: '我的 FACE｜會員中心',
    description: '保存 FACE 測驗結果與個人交易覺察紀錄。',
  };
  return {
    title: 'FACE 交易人格測驗｜FACE Trader 知己交易',
    description: '看懂你的交易心理與決策模式，在不確定中建立適合自己的交易方式。',
  };
};

const shouldNoIndex = (path: string, content?: ContentItem | null, isNotFound?: boolean) => {
  if (isNotFound || content?.requiresLogin) return true;
  return [
    '/test',
    '/test-mockup',
    '/my-result',
    '/guide/line',
    '/manual',
    '/me',
    '/daily-awareness',
    '/daily-awareness-result',
    '/research-admin',
    '/preview-results',
    '/reading-prototype',
    '/mirror-trade',
    '/journal/',
  ].some((privatePath) => path === privatePath || path.startsWith(privatePath));
};

export const applyPageMetadata = (input: PageMetadataInput) => {
  const { path, profile, content, isNotFound } = input;
  const { title, description } = getPageCopy(input);
  const canonicalPath = profile
    ? `/types/${profile.code}`
    : content
      ? `/watch/${content.slug}`
      : path;
  const canonicalUrl = `${SITE_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`;
  const imageUrl = profile?.landscapeImageUrl
    ? new URL(profile.landscapeImageUrl, SITE_ORIGIN).toString()
    : DEFAULT_IMAGE;
  const robots = shouldNoIndex(path, content, isNotFound)
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large';

  document.title = title;
  upsertMeta('meta[name="description"]', { name: 'description' }, description);
  upsertMeta('meta[name="robots"]', { name: 'robots' }, robots);
  upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title);
  upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
  upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
  upsertMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl);
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl);
  upsertCanonical(canonicalUrl);

  // 被 noindex 的頁面不輸出結構化資料，公開內容頁才輸出。
  const pageGraph = shouldNoIndex(path, content, isNotFound)
    ? null
    : buildPageGraph(input, { title, description, canonicalUrl, imageUrl });
  upsertPageJsonLd(pageGraph);
};

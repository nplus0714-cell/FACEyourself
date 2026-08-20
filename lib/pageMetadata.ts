import type { ContentItem, } from '../data/contentCatalog';
import type { PersonalityProfile } from '../types';

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
    title: 'FACE 交易人格測驗｜看懂你的交易心理與決策模式',
    description: '用 24 題看懂你的獲利動機、決策邏輯、交易週期與資金管理偏好，找到屬於你的 16 型交易人格。',
  };
  if (path === '/types') return {
    title: 'FACE 16 型交易人格圖鑑｜找到你的決策模式',
    description: '瀏覽 FACE 16 型交易人格，理解不同交易者的天賦、盲點與互補思考方式。',
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
    title: 'FACE 交易生存指南｜個人交易使用說明書',
    description: '把交易人格轉成風險、部位、紀律與情緒管理的實作方向。正式交付完成前暫不收款。',
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
    title: 'FACE 交易人格測驗｜交易解憂 Bar',
    description: '看懂你的交易心理與決策模式，在不確定中建立適合自己的交易方式。',
  };
};

const shouldNoIndex = (path: string, content?: ContentItem | null, isNotFound?: boolean) => {
  if (isNotFound || content?.requiresLogin) return true;
  return [
    '/test',
    '/test-mockup',
    '/my-result',
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
};

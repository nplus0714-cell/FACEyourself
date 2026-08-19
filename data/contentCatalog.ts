import article001Source from '../docs/content/articles/001-trading-decisions-under-uncertainty.md?raw';
import article002Source from '../docs/content/articles/002-investing-or-speculating.md?raw';
import article003Source from '../docs/content/articles/003-no-holy-grail-from-many-cups-to-humility.md?raw';
import article004Source from '../docs/content/articles/004-trading-requires-belief.md?raw';
import article005Source from '../docs/content/articles/005-action-over-prediction.md?raw';
import article006Source from '../docs/content/articles/006-survival-stay-alive-to-have-a-voice.md?raw';
import article007Source from '../docs/content/articles/007-what-is-your-tuition-budget.md?raw';
import article008Source from '../docs/content/articles/008-stop-loss-is-an-entry-fee.md?raw';
import article009Source from '../docs/content/articles/009-three-dimensions-for-surviving-the-trading-jungle.md?raw';

export type ContentKind = 'video' | 'article';
export type ContentSeries = '序言' | '破繭篇' | '生存篇';
export type ContentChannel = 'face-survival-guide' | 'topic-articles' | 'market-notes';

export interface ContentItem {
  id: string;
  slug: string;
  kind: ContentKind;
  title: string;
  summary: string;
  faceTags: string[];
  duration?: string;
  youtubeId?: string;
  body?: string[];
  bodyMarkdown?: string;
  previewParagraphs?: number;
  isDemo?: boolean;
  articleNumber?: string;
  channel?: ContentChannel;
  series?: ContentSeries;
  seriesOrder?: number;
  requiresLogin?: boolean;
  status: 'draft' | 'published';
}

const getArticleBody = (source: string) => source
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  .trimStart()
  .replace(/^#\s+.+\r?\n+/, '')
  .trim();

// 之後新增內容時，只要在此加入一筆資料即可。影片只需要填入 youtubeId。
// 這三支為版面與流程示範；正式上線前請換成自己的影片。
export const CONTENT_CATALOG: ContentItem[] = [
  {
    id: 'demo-first-entry',
    slug: 'demo-first-entry',
    kind: 'video',
    title: '為什麼你總在等「更確定」才敢進場？',
    summary: '從猶豫、追價到錯過行情，拆解進場前最常見的心理拉扯。',
    faceTags: ['Focus｜獲利動機', 'Analysis｜決策邏輯'],
    duration: '08:42',
    youtubeId: 'M7lc1UVf-VE',
    isDemo: true,
    status: 'published',
  },
  {
    id: 'demo-position',
    slug: 'demo-position',
    kind: 'video',
    title: '部位不是越大越有信心：找到你能承受的節奏',
    summary: '用一個簡單框架，分辨「看好」和「壓力過大」之間的差別。',
    faceTags: ['Exposure｜資金管理', 'Cycle｜交易週期'],
    duration: '11:05',
    youtubeId: 'M7lc1UVf-VE',
    isDemo: true,
    status: 'published',
  },
  {
    id: 'demo-review',
    slug: 'demo-review',
    kind: 'video',
    title: '交易後不要只看損益：三個問題幫你做復盤',
    summary: '把一次交易留下來，下一次才知道該調整策略、情緒還是風險。',
    faceTags: ['Analysis｜決策邏輯', 'Cycle｜交易週期'],
    duration: '06:18',
    youtubeId: 'M7lc1UVf-VE',
    isDemo: true,
    status: 'published',
  },
  {
    id: 'article-001',
    slug: 'trading-decisions-under-uncertainty',
    kind: 'article',
    articleNumber: '001',
    channel: 'face-survival-guide',
    series: '序言',
    seriesOrder: 1,
    title: '交易不是找到正確性，而是學會在不確定中做決定',
    summary: '真正讓人留在市場裡的，通常不是知道更多答案，而是慢慢知道自己該怎麼面對沒有答案的時候。',
    faceTags: ['Analysis｜決策邏輯', 'Focus｜獲利動機'],
    bodyMarkdown: getArticleBody(article001Source),
    status: 'published',
  },
  {
    id: 'article-002',
    slug: 'investing-or-speculating',
    kind: 'article',
    articleNumber: '002',
    channel: 'face-survival-guide',
    series: '破繭篇',
    seriesOrder: 1,
    title: '一筆交易，到底是投資，還是投機？',
    summary: '比起急著定義自己是哪一種人，更重要的是：你知不知道自己現在為什麼還持有。',
    faceTags: ['Analysis｜決策邏輯', 'Cycle｜交易週期'],
    bodyMarkdown: getArticleBody(article002Source),
    status: 'published',
  },
  {
    id: 'article-003',
    slug: 'no-holy-grail-from-many-cups-to-humility',
    kind: 'article',
    articleNumber: '003',
    channel: 'face-survival-guide',
    series: '破繭篇',
    seriesOrder: 2,
    title: '交易沒有聖杯：從千杯，到謙卑',
    summary: '真正重要的，不是找到最厲害的方法，而是開始不再需要證明自己什麼都懂。',
    faceTags: ['Analysis｜決策邏輯', 'Focus｜獲利動機'],
    bodyMarkdown: getArticleBody(article003Source),
    status: 'published',
  },
  {
    id: 'article-004',
    slug: 'trading-requires-belief',
    kind: 'article',
    articleNumber: '004',
    channel: 'face-survival-guide',
    series: '破繭篇',
    seriesOrder: 3,
    title: '交易其實需要「相信」',
    summary: '相信不是確定自己會對，而是在答案還沒出現時，仍然知道自己為什麼留下。',
    faceTags: ['Focus｜獲利動機', 'Analysis｜決策邏輯'],
    bodyMarkdown: getArticleBody(article004Source),
    status: 'published',
  },
  {
    id: 'article-005',
    slug: 'action-over-prediction',
    kind: 'article',
    articleNumber: '005',
    channel: 'face-survival-guide',
    series: '破繭篇',
    seriesOrder: 4,
    title: '行動大於預測',
    summary: '看對只是觀點，做對才是交易；市場最後留下的是你真正做過的決定。',
    faceTags: ['Analysis｜決策邏輯', 'Exposure｜資金管理'],
    bodyMarkdown: getArticleBody(article005Source),
    status: 'published',
  },
  {
    id: 'article-006',
    slug: 'survival-stay-alive-to-have-a-voice',
    kind: 'article',
    articleNumber: '006',
    channel: 'face-survival-guide',
    series: '生存篇',
    seriesOrder: 1,
    title: '生存——活下來才有發言權',
    summary: '生存不是不受傷，而是受傷以後還走得下去，仍然保有下一次選擇。',
    faceTags: ['Exposure｜資金管理', 'Focus｜獲利動機'],
    bodyMarkdown: getArticleBody(article006Source),
    status: 'published',
  },
  {
    id: 'article-007',
    slug: 'what-is-your-tuition-budget',
    kind: 'article',
    articleNumber: '007',
    channel: 'face-survival-guide',
    series: '生存篇',
    seriesOrder: 2,
    title: '你的學費預算是多少？',
    summary: '學費可以繳，但不要繳到自己動不了；每一次付出都要知道自己正在學什麼。',
    faceTags: ['Exposure｜資金管理', 'Analysis｜決策邏輯'],
    bodyMarkdown: getArticleBody(article007Source),
    status: 'published',
  },
  {
    id: 'article-008',
    slug: 'stop-loss-is-an-entry-fee',
    kind: 'article',
    articleNumber: '008',
    channel: 'face-survival-guide',
    series: '生存篇',
    seriesOrder: 3,
    requiresLogin: true,
    title: '停損不是失敗，是入場費',
    summary: '停損不是證明你錯了，而是讓你在看錯時，只付一開始願意付的價格。',
    faceTags: ['Exposure｜資金管理', 'Analysis｜決策邏輯'],
    bodyMarkdown: getArticleBody(article008Source),
    status: 'published',
  },
  {
    id: 'article-009',
    slug: 'three-dimensions-for-surviving-the-trading-jungle',
    kind: 'article',
    articleNumber: '009',
    channel: 'face-survival-guide',
    series: '生存篇',
    seriesOrder: 4,
    requiresLogin: true,
    title: '在交易叢林生存，只看三個維度',
    summary: '有錢、有策略、有膽識：三者互相配合，才有機會從活下來走向進攻。',
    faceTags: ['Exposure｜資金管理', 'Focus｜獲利動機'],
    bodyMarkdown: getArticleBody(article009Source),
    status: 'published',
  },
];

export const CONTENT_COLLECTIONS = [
  {
    id: 'focus',
    title: '機會與風險',
    description: '看見你面對機會、波動與停損時的第一反應。',
  },
  {
    id: 'decision',
    title: '決策與選股',
    description: '整理規則、直覺與市場訊息如何影響你的判斷。',
  },
  {
    id: 'rhythm',
    title: '節奏與配置',
    description: '從持有時間到部位集中度，找到讓你舒服的節奏。',
  },
] as const;

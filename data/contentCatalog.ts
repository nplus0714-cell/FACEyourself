export type ContentKind = 'video' | 'article';

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
  previewParagraphs?: number;
  isDemo?: boolean;
  status: 'draft' | 'published';
}

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
    id: 'demo-article-comfort-zone',
    slug: 'demo-article-comfort-zone',
    kind: 'article',
    title: '交易舒適圈不是保守，而是你能持續執行的範圍',
    summary: '當一筆部位讓你睡不好，問題不一定是你不夠勇敢，而是規則還不夠適合你。',
    faceTags: ['Exposure｜資金管理', 'Focus｜獲利動機'],
    body: [
      '很多人把「敢不敢下單」當成交易能力的證明。但真正讓人走得久的，通常不是一次壓對，而是你能不能在波動出現時，仍然照著原本的規則行動。',
      '先從一個很簡單的問題開始：如果這筆部位明天上下波動 5%，你還能正常工作、睡覺，並且不急著改變計畫嗎？如果不能，部位可能已經超過你目前能承受的範圍。',
      '舒適圈不是把風險降到零，而是把風險放到你能辨識、能處理的位置。這會影響你選擇的標的數量、持有週期，以及進出場的規則。',
      '第一步，請把「我看好」和「我願意承受多少波動」分開寫。前者是觀點，後者才是部位管理。兩件事混在一起時，市場的一點變化就很容易變成情緒壓力。',
      '第二步，替每一筆交易寫下一個不需要臨場思考的調整條件。例如價格跌破什麼位置、基本面出現何種變化、或你的整體曝險來到多少時，才需要重新檢視。',
      '最後，不要用別人的部位大小來評價自己。你的交易舒適圈會隨經驗、資金與生活狀態改變；能穩定執行的節奏，才是可以慢慢擴大的起點。',
    ],
    previewParagraphs: 3,
    isDemo: true,
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

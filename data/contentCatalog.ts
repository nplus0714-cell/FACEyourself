import article001Source from '../docs/content/articles/001-trading-decisions-under-uncertainty.md?raw';
import article002Source from '../docs/content/articles/002-investing-or-speculating.md?raw';
import article003Source from '../docs/content/articles/003-no-holy-grail-from-many-cups-to-humility.md?raw';
import article004Source from '../docs/content/articles/004-trading-requires-belief.md?raw';
import article005Source from '../docs/content/articles/005-action-over-prediction.md?raw';
import article006Source from '../docs/content/articles/006-survival-stay-alive-to-have-a-voice.md?raw';
import article007Source from '../docs/content/articles/007-what-is-your-tuition-budget.md?raw';
import article008Source from '../docs/content/articles/008-stop-loss-is-an-entry-fee.md?raw';
import article009Source from '../docs/content/articles/009-three-dimensions-for-surviving-the-trading-jungle.md?raw';
import topicFomoSource from '../docs/content/topic-articles/fomo-chasing-price/article.md?raw';
import topicStopLossSource from '../docs/content/topic-articles/stop-loss/article.md?raw';
import topicTrappedSource from '../docs/content/topic-articles/trapped-position/article.md?raw';
import topicWinnersSource from '../docs/content/topic-articles/selling-winners/article.md?raw';
import topicPositionSource from '../docs/content/topic-articles/position-sizing/article.md?raw';
import topicDiversificationSource from '../docs/content/topic-articles/over-diversification/article.md?raw';
import topicAnxietySource from '../docs/content/topic-articles/decision-anxiety/article.md?raw';
import topicReviewSource from '../docs/content/topic-articles/trading-review/article.md?raw';

export type ContentKind = 'video' | 'article';
export type ContentSeries = '序言' | '破繭篇' | '生存篇' | '進攻篇・上' | '進攻篇・下' | '歸真篇';
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
  requiresPurchase?: boolean;
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
    status: 'draft',
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
    status: 'draft',
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
    status: 'draft',
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
  {
    id: 'article-010', slug: 'attack-is-changing-gears', kind: 'article', articleNumber: '010', channel: 'face-survival-guide', series: '進攻篇・上', seriesOrder: 1, requiresLogin: true, requiresPurchase: true,
    title: '進攻不是一個階段，而是換檔', summary: '進攻不是把膽子放大，而是在不同市場裡，持續調整願意承擔的風險。', faceTags: ['Exposure｜資金管理', 'Focus｜獲利動機'], status: 'published',
  },
  {
    id: 'article-011', slug: 'probability-payoff-and-expectancy', kind: 'article', articleNumber: '011', channel: 'face-survival-guide', series: '進攻篇・上', seriesOrder: 2, requiresLogin: true, requiresPurchase: true,
    title: '勝率、賠率與期望值：選股，其實是在選機會成本', summary: '有限的資金該放在哪裡，不只看勝率，更要比較看錯的代價與看對的空間。', faceTags: ['Analysis｜決策邏輯', 'Exposure｜資金管理'], status: 'published',
  },
  {
    id: 'article-012', slug: 'let-time-make-money', kind: 'article', articleNumber: '012', channel: 'face-survival-guide', series: '進攻篇・上', seriesOrder: 3, requiresLogin: true, requiresPurchase: true,
    title: '讓時間替你賺錢：看對就抱，看錯就走', summary: '真正阻止你賺大錢的，常常不是市場，而是沒有能力持有一筆正在獲利的交易。', faceTags: ['Cycle｜交易週期', 'Focus｜獲利動機'], status: 'published',
  },
  {
    id: 'article-013', slug: 'how-far-behind-the-market-is-your-news', kind: 'article', articleNumber: '013', channel: 'face-survival-guide', series: '進攻篇・上', seriesOrder: 4, requiresLogin: true, requiresPurchase: true,
    title: '你的消息，落後市場多久了？', summary: '消息本身不夠；你還要知道市場反映了多少，以及資金正往哪裡移動。', faceTags: ['Analysis｜決策邏輯', 'Focus｜獲利動機'], status: 'published',
  },
  {
    id: 'article-014', slug: 'direction-position-and-time', kind: 'article', articleNumber: '014', channel: 'face-survival-guide', series: '進攻篇・下', seriesOrder: 1, requiresLogin: true, requiresPurchase: true,
    title: '看對方向、買好買滿、讓獲利奔跑', summary: '放大獲利不必先靠槓桿；方向、部位與時間同時站在你這邊，才是真正的槓桿。', faceTags: ['Exposure｜資金管理', 'Cycle｜交易週期'], status: 'published',
  },
  {
    id: 'article-015', slug: 'let-resources-stay-with-winners', kind: 'article', articleNumber: '015', channel: 'face-survival-guide', series: '進攻篇・下', seriesOrder: 2, requiresLogin: true, requiresPurchase: true,
    title: '投資飲料店的故事：讓資源留在會賺錢的地方', summary: '別一直替虧錢的店續命，卻急著把正在賺錢的店關掉。', faceTags: ['Exposure｜資金管理', 'Focus｜獲利動機'], status: 'published',
  },
  {
    id: 'article-016', slug: 'good-stocks-are-amulets', kind: 'article', articleNumber: '016', channel: 'face-survival-guide', series: '進攻篇・下', seriesOrder: 3, requiresLogin: true, requiresPurchase: true,
    title: '好股票是護身符：錢生錢、錢生膽、膽再生錢', summary: '真正的好股票，是已替你產生獲利、成本與現價逐漸拉開的部位。', faceTags: ['Exposure｜資金管理', 'Focus｜獲利動機'], status: 'published',
  },
  {
    id: 'article-017', slug: 'leverage-requires-discipline', kind: 'article', articleNumber: '017', channel: 'face-survival-guide', series: '進攻篇・下', seriesOrder: 4, requiresLogin: true, requiresPurchase: true,
    title: '槓桿是給守紀律、有獲利的人用的', summary: '槓桿沒有善惡；它只會把你原本的能力、紀律、獲利與錯誤一起放大。', faceTags: ['Exposure｜資金管理', 'Analysis｜決策邏輯'], status: 'published',
  },
  {
    id: 'article-018', slug: 'follow-the-trend-and-your-nature', kind: 'article', articleNumber: '018', channel: 'face-survival-guide', series: '歸真篇', seriesOrder: 1, requiresLogin: true, requiresPurchase: true,
    title: '順勢，更要順性', summary: '真正走得久的，不是硬逼自己追上市場，而是讓市場方向與自己的節奏能一起往前。', faceTags: ['Focus｜獲利動機', 'Analysis｜決策邏輯', 'Cycle｜交易週期', 'Exposure｜資金管理'], status: 'published',
  },
  {
    id: 'article-019', slug: 'trading-should-be-sustainable', kind: 'article', articleNumber: '019', channel: 'face-survival-guide', series: '歸真篇', seriesOrder: 2, requiresLogin: true, requiresPurchase: true,
    title: '交易是一輩子的事，所以要做得舒服', summary: '舒服不是沒有壓力，而是在市場波動時，你仍做得出原本會做的事。', faceTags: ['Exposure｜資金管理', 'Cycle｜交易週期'], status: 'published',
  },
  {
    id: 'article-020', slug: 'from-holy-grail-to-self-knowledge', kind: 'article', articleNumber: '020', channel: 'face-survival-guide', series: '歸真篇', seriesOrder: 3, requiresLogin: true, requiresPurchase: true,
    title: '從找聖杯，到看懂自己', summary: '真正的問題不只是方法好不好，而是哪一個方法放在你身上，你做不做得出來。', faceTags: ['Analysis｜決策邏輯', 'Focus｜獲利動機'], status: 'published',
  },
  {
    id: 'topic-fomo-chasing-price', slug: 'fomo-chasing-price', kind: 'article', articleNumber: '101', channel: 'topic-articles',
    title: '為什麼明知追高危險，還是忍不住進場？', summary: 'FOMO 不一定是貪心；有時候，是你賣掉後仍沒放下原本相信的未來。', faceTags: ['FOMO', '機會與風險', '交易心理'], bodyMarkdown: getArticleBody(topicFomoSource), status: 'published',
  },
  {
    id: 'topic-stop-loss', slug: 'stop-loss', kind: 'article', articleNumber: '102', channel: 'topic-articles',
    title: '停損怎麼設，才不會一跌就被洗掉？', summary: '停損不是一個數字。先分清楚你在保護本金、保護判斷，還是只想逃離不舒服的波動。', faceTags: ['停損', '生存', '決策邏輯'], bodyMarkdown: getArticleBody(topicStopLossSource), status: 'published',
  },
  {
    id: 'topic-trapped-position', slug: 'trapped-position', kind: 'article', articleNumber: '103', channel: 'topic-articles',
    title: '股票套牢該停損還是續抱？先問自己這 4 個問題', summary: '股票套牢時，最危險的不是虧損，而是你逐漸說不清楚自己為什麼還留著。', faceTags: ['套牢', '信念', '交易心理'], bodyMarkdown: getArticleBody(topicTrappedSource), status: 'published',
  },
  {
    id: 'topic-selling-winners', slug: 'selling-winners', kind: 'article', articleNumber: '104', channel: 'topic-articles',
    title: '股票一賺就想賣，怎麼改善？', summary: '股票一賺就想賣，不一定是沒有耐心。你可能還不相信自己能把一筆看對的交易抱下去。', faceTags: ['賣飛', '持有', '交易心理'], bodyMarkdown: getArticleBody(topicWinnersSource), status: 'published',
  },
  {
    id: 'topic-position-sizing', slug: 'position-sizing', kind: 'article', articleNumber: '105', channel: 'topic-articles',
    title: '單一持股比例多少才合理？先看你能承受多少', summary: '部位一旦大到改變你的睡眠與判斷，就該重新看它是否仍適合你。', faceTags: ['部位管理', '風險承受', '交易心理'], bodyMarkdown: getArticleBody(topicPositionSource), status: 'published',
  },
  {
    id: 'topic-over-diversification', slug: 'over-diversification', kind: 'article', articleNumber: '106', channel: 'topic-articles',
    title: '股票持有太多檔怎麼整理？', summary: '持有很多檔股票不一定更安全。當每一檔都說得出一點理由，卻沒有一檔真的看得懂，該開始整理了。', faceTags: ['過度分散', '持股整理', '決策負擔'], bodyMarkdown: getArticleBody(topicDiversificationSource), status: 'published',
  },
  {
    id: 'topic-decision-anxiety', slug: 'decision-anxiety', kind: 'article', articleNumber: '107', channel: 'topic-articles',
    title: '看了很多消息，反而更不敢下單怎麼辦？', summary: '看越多消息越焦慮，不一定是資訊不夠。你可能是在等一個能替你承擔結果的答案。', faceTags: ['決策焦慮', '消息', '判斷'], bodyMarkdown: getArticleBody(topicAnxietySource), status: 'published',
  },
  {
    id: 'topic-trading-review', slug: 'trading-review', kind: 'article', articleNumber: '108', channel: 'topic-articles',
    title: '交易日誌要記什麼，才真的能改善決策？', summary: '交易日誌不只記買賣價格。留下當時相信什麼、害怕什麼，下一次才看得見真正需要調整的地方。', faceTags: ['交易復盤', '自我覺察', '決策'], bodyMarkdown: getArticleBody(topicReviewSource), status: 'published',
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

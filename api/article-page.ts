const SITE_ORIGIN = 'https://faceyourself.vercel.app';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/face-og-v25.jpg`;

type PublicArticle = {
  title: string;
  summary: string;
  file: string;
};

const PUBLIC_ARTICLES: Record<string, PublicArticle> = {
  'trading-decisions-under-uncertainty': {
    title: '交易不是找到正確性，而是學會在不確定中做決定',
    summary: '真正讓人留在市場裡的，通常不是知道更多答案，而是慢慢知道自己該怎麼面對沒有答案的時候。',
    file: 'articles/001-trading-decisions-under-uncertainty.md',
  },
  'investing-or-speculating': {
    title: '一筆交易，到底是投資，還是投機？',
    summary: '比起急著定義自己是哪一種人，更重要的是：你知不知道自己現在為什麼還持有。',
    file: 'articles/002-investing-or-speculating.md',
  },
  'no-holy-grail-from-many-cups-to-humility': {
    title: '交易沒有聖杯：從千杯，到謙卑',
    summary: '真正重要的，不是找到最厲害的方法，而是開始不再需要證明自己什麼都懂。',
    file: 'articles/003-no-holy-grail-from-many-cups-to-humility.md',
  },
  'trading-requires-belief': {
    title: '交易其實需要「相信」',
    summary: '相信不是確定自己會對，而是在答案還沒出現時，仍然知道自己為什麼留下。',
    file: 'articles/004-trading-requires-belief.md',
  },
  'action-over-prediction': {
    title: '行動大於預測',
    summary: '看對只是觀點，做對才是交易；市場最後留下的是你真正做過的決定。',
    file: 'articles/005-action-over-prediction.md',
  },
  'survival-stay-alive-to-have-a-voice': {
    title: '生存——活下來才有發言權',
    summary: '生存不是不受傷，而是受傷以後還走得下去，仍然保有下一次選擇。',
    file: 'articles/006-survival-stay-alive-to-have-a-voice.md',
  },
  'what-is-your-tuition-budget': {
    title: '你的學費預算是多少？',
    summary: '學費可以繳，但不要繳到自己動不了；每一次付出都要知道自己正在學什麼。',
    file: 'articles/007-what-is-your-tuition-budget.md',
  },
  'stop-loss-is-an-entry-fee': {
    title: '停損不是失敗，是入場費',
    summary: '停損不是證明你錯了，而是讓你在看錯時，只付一開始願意付的價格。',
    file: 'articles/008-stop-loss-is-an-entry-fee.md',
  },
  'fomo-chasing-price': {
    title: '為什麼明知追高危險，還是忍不住進場？',
    summary: 'FOMO 不一定是貪心；有時候，是你賣掉後仍沒放下原本相信的未來。',
    file: 'topic-articles/fomo-chasing-price/article.md',
  },
  'stop-loss': {
    title: '停損怎麼設，才不會一跌就被洗掉？',
    summary: '停損不是一個數字。先分清楚你在保護本金、保護判斷，還是只想逃離不舒服的波動。',
    file: 'topic-articles/stop-loss/article.md',
  },
  'trapped-position': {
    title: '股票套牢該停損還是續抱？先問自己這 4 個問題',
    summary: '股票套牢時，最危險的不是虧損，而是你逐漸說不清楚自己為什麼還留著。',
    file: 'topic-articles/trapped-position/article.md',
  },
  'selling-winners': {
    title: '股票一賺就想賣，怎麼改善？',
    summary: '股票一賺就想賣，不一定是沒有耐心。你可能還不相信自己能把一筆看對的交易抱下去。',
    file: 'topic-articles/selling-winners/article.md',
  },
  'position-sizing': {
    title: '單一持股比例多少才合理？先看你能承受多少',
    summary: '部位一旦大到改變你的睡眠與判斷，就該重新看它是否仍適合你。',
    file: 'topic-articles/position-sizing/article.md',
  },
  'over-diversification': {
    title: '股票持有太多檔怎麼整理？',
    summary: '持有很多檔股票不一定更安全。當每一檔都說得出一點理由，卻沒有一檔真的看得懂，該開始整理了。',
    file: 'topic-articles/over-diversification/article.md',
  },
  'decision-anxiety': {
    title: '看了很多消息，反而更不敢下單怎麼辦？',
    summary: '看越多消息越焦慮，不一定是資訊不夠。你可能是在等一個能替你承擔結果的答案。',
    file: 'topic-articles/decision-anxiety/article.md',
  },
  'trading-review': {
    title: '交易日誌要記什麼，才真的能改善決策？',
    summary: '交易日誌不只記買賣價格。留下當時相信什麼、害怕什麼，下一次才看得見真正需要調整的地方。',
    file: 'topic-articles/trading-review/article.md',
  },
};

type VercelRequestLike = {
  url?: string;
  query?: Record<string, string | string[] | undefined>;
  headers?: { host?: string };
};

type VercelResponseLike = {
  setHeader: (name: string, value: string) => void;
  status: (status: number) => VercelResponseLike;
  send: (body: string) => void;
};

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const replaceFirst = (html: string, pattern: RegExp, replacement: string): string =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

const stripFrontmatterAndTitle = (source: string): string => source
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  .trimStart()
  .replace(/^#\s+.+\r?\n+/, '')
  .trim();

const markdownToCrawlerHtml = (markdown: string): string => {
  const cleanInline = (value: string) => escapeHtml(value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .trim());

  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const heading = line.match(/^(#{2,3})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${cleanInline(heading[2])}</h${level}>`;
      }
      if (/^[-*]\s+/.test(line)) return `<p>• ${cleanInline(line.replace(/^[-*]\s+/, ''))}</p>`;
      return `<p>${cleanInline(line)}</p>`;
    })
    .join('');
};

const buildArticleJsonLd = (article: PublicArticle, pageUrl: string): string => {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.summary,
        image: DEFAULT_IMAGE,
        inLanguage: 'zh-TW',
        mainEntityOfPage: pageUrl,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: '交易心理內容', item: `${SITE_ORIGIN}/watch` },
          { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
        ],
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
};

const loadAppShell = async (): Promise<string> => {
  const response = await fetch(`${SITE_ORIGIN}/index.html`);
  if (!response.ok) throw new Error(`APP_SHELL_FAILED_${response.status}`);
  return response.text();
};

const renderPublicArticle = async (slug: string, article: PublicArticle): Promise<string> => {
  const [{ readFile }, pathModule, shell] = await Promise.all([
    import('node:fs/promises'),
    import('node:path'),
    loadAppShell(),
  ]);
  const path = pathModule.default;
  const markdown = stripFrontmatterAndTitle(await readFile(
    path.join(process.cwd(), 'docs', 'content', article.file),
    'utf8',
  ));
  const pageUrl = `${SITE_ORIGIN}/watch/${slug}`;
  const title = `${article.title}｜交易心理與風險管理`;
  let html = shell;

  html = replaceFirst(html, /<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceFirst(html, /<meta name="description" content="[^"]*">/i, `<meta name="description" content="${escapeHtml(article.summary)}">`);
  html = replaceFirst(html, /<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${escapeHtml(pageUrl)}">`);
  html = replaceFirst(html, /<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="${escapeHtml(pageUrl)}">`);
  html = replaceFirst(html, /<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${escapeHtml(title)}">`);
  html = replaceFirst(html, /<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${escapeHtml(article.summary)}">`);
  html = replaceFirst(html, /<meta name="twitter:url" content="[^"]*">/i, `<meta name="twitter:url" content="${escapeHtml(pageUrl)}">`);
  html = replaceFirst(html, /<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
  html = replaceFirst(html, /<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${escapeHtml(article.summary)}">`);
  html = replaceFirst(html, /<meta name="robots" content="[^"]*">/i, '<meta name="robots" content="index, follow, max-image-preview:large">');
  html = replaceFirst(html, /<\/head>/i, `${buildArticleJsonLd(article, pageUrl)}</head>`);
  html = replaceFirst(
    html,
    /<div id="root">\s*<\/div>/i,
    `<div id="root"><article><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.summary)}</p>${markdownToCrawlerHtml(markdown)}</article></div>`,
  );
  return html;
};

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> {
  try {
    const querySlug = request.query?.slug;
    const slug = (Array.isArray(querySlug) ? querySlug[0] : querySlug)?.trim()
      ?? new URL(request.url ?? '/', `https://${request.headers?.host ?? 'faceyourself.vercel.app'}`).searchParams.get('slug')?.trim()
      ?? '';
    const article = PUBLIC_ARTICLES[slug];
    let html: string;
    if (article) {
      html = await renderPublicArticle(slug, article);
    } else {
      html = await loadAppShell();
      html = replaceFirst(html, /<meta name="robots" content="[^"]*">/i, '<meta name="robots" content="noindex, nofollow">');
    }

    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.status(200).send(html);
  } catch (error) {
    console.error('[article-page] failed to render article', error);
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.status(503).send('文章暫時無法載入，請稍後再試。');
  }
}

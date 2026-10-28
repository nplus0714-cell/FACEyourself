// This small route index intentionally stays separate from contentCatalog.ts.
// contentCatalog imports every article's Markdown body, so importing it just to
// validate a URL would make the public landing page download the whole library.
const PUBLISHED_CONTENT_SLUGS = new Set([
  'trading-decisions-under-uncertainty',
  'investing-or-speculating',
  'no-holy-grail-from-many-cups-to-humility',
  'trading-requires-belief',
  'action-over-prediction',
  'survival-stay-alive-to-have-a-voice',
  'what-is-your-tuition-budget',
  'stop-loss-is-an-entry-fee',
  'three-dimensions-for-surviving-the-trading-jungle',
  'attack-is-changing-gears',
  'probability-payoff-and-expectancy',
  'let-time-make-money',
  'how-far-behind-the-market-is-your-news',
  'direction-position-and-time',
  'let-resources-stay-with-winners',
  'good-stocks-are-amulets',
  'leverage-requires-discipline',
  'follow-the-trend-and-your-nature',
  'trading-should-be-sustainable',
  'from-holy-grail-to-self-knowledge',
  'fomo-chasing-price',
  'stop-loss',
  'trapped-position',
  'selling-winners',
  'position-sizing',
  'over-diversification',
  'decision-anxiety',
  'trading-review',
]);

export const isPublishedContentSlug = (slug: string) => PUBLISHED_CONTENT_SLUGS.has(slug);

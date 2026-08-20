const SITE_ORIGIN = 'https://faceyourself.vercel.app';

type ShareProfile = {
  code: string;
  name: string;
  motto: string;
  landscapeImageUrl: string;
};

const SHARE_PROFILES: Record<string, ShareProfile> = {
  ARLC: { code: 'ARLC', name: '金雕大統帥', motto: '最好的操作就是什麼都不做；我看準了，我重壓，然後我去睡覺。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-01-golden-eagle-commander-landscape.png' },
  ARLD: { code: 'ARLD', name: '北極熊謀士', motto: '我不需要預測哪一匹馬會贏，我直接買下整個賽馬場；只要時代在前進，我的資產就會起飛。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-02-polar-bear-strategist-landscape.png' },
  ARTC: { code: 'ARTC', name: '獵豹狙擊手', motto: '先定義，再出手；錯過可以，失去標準不行。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-03-cheetah-sniper-landscape.png' },
  ARTD: { code: 'ARTD', name: '獵犬占星師', motto: '我不是在賭博，我是在經營賭場；我不依賴單一運氣，我依靠系統性的機率優勢。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-04-hound-astrologer-landscape.png' },
  AILC: { code: 'AILC', name: '黑豹傳教士', motto: '別人笑我太瘋癲，我笑他人看不穿；我買的不是代碼，而是人類的下一個紀元。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-05-black-panther-evangelist-landscape.png' },
  AILD: { code: 'AILD', name: '松鼠收藏家', motto: '這個看起來會漲，那個故事也很棒！小朋友才做選擇，我全都要！', landscapeImageUrl: '/images/personalities-v2-landscape/v2-06-squirrel-collector-landscape.png' },
  AITC: { code: 'AITC', name: '劍齒虎賭俠', motto: '聽見市場的脈搏，在那一秒全倉出擊；要嘛贏得世界，要嘛回家吃土。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-07-sabertooth-gambler-landscape.png' },
  AITD: { code: 'AITD', name: '獼猴派對主', motto: '天下武功，唯快不破，我玩的不是股票，是心跳！', landscapeImageUrl: '/images/personalities-v2-landscape/v2-08-macaque-host-landscape.png' },
  PRLC: { code: 'PRLC', name: '白鹿鑑古師', motto: '眾人皆醉我獨醒；我不看價格，我只看價值。只要公司沒壞，股價腰斬正如我意。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-09-white-deer-appraiser-landscape.png' },
  PRLD: { code: 'PRLD', name: '鼴鼠導引者', motto: '飛得快不一定飛得遠；我不求暴利，只求軟著陸。活著，就是最大的勝利。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-10-mole-guide-landscape.png' },
  PRTC: { code: 'PRTC', name: '鱷魚精算師', motto: '我從不賭博，我只在看見底牌時才下注；與其在大海中冒險，我寧願撿拾岸邊確定的貝殼。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-11-crocodile-actuary-landscape.png' },
  PRTD: { code: 'PRTD', name: '大象典獄長', motto: '我每天檢查一百道鎖，調度一千次衛兵；雖然很累且沒賺多少，但至少今晚我很安全。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-12-elephant-warden-landscape.png' },
  PILC: { code: 'PILC', name: '犀牛親衛隊', motto: '我不懂財報，但我相信這家公司；只要它還在，我就不會離開。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-13-rhinoceros-guard-landscape.png' },
  PILD: { code: 'PILD', name: '樹懶思想家', motto: '不看就不會虧，只要我心如止水，股市波動就與我無關。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-14-sloth-thinker-landscape.png' },
  PITC: { code: 'PITC', name: '夜梟前哨兵', motto: '看見的不只是獲利，而是獲利背後那 100 種可能讓我受傷的方式。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-15-night-owl-sentinel-landscape.png' },
  PITD: { code: 'PITD', name: '考拉隨行者', motto: '可以參考別人的地圖，但最後一段路，要知道自己為什麼走。', landscapeImageUrl: '/images/personalities-v2-landscape/v2-16-koala-companion-landscape.png' },
};

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

type VercelRequestLike = {
  url?: string;
  headers?: { host?: string };
};

type VercelResponseLike = {
  redirect: (status: number, location: string) => void;
  setHeader: (name: string, value: string) => void;
  status: (status: number) => VercelResponseLike;
  send: (body: string) => void;
};

export default function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): void {
  const requestUrl = new URL(request.url ?? '/', `https://${request.headers?.host ?? 'faceyourself.vercel.app'}`);
  const code = (requestUrl.searchParams.get('code') ?? '').toUpperCase();
  const profile = SHARE_PROFILES[code];

  if (!profile) {
    response.redirect(302, `${SITE_ORIGIN}/types`);
    return;
  }

  const dnaShare = requestUrl.searchParams.get('dna_share');
  const destination = dnaShare
    ? `${SITE_ORIGIN}/?dna_share=${encodeURIComponent(dnaShare)}`
    : `${SITE_ORIGIN}/types/${profile.code}`;
  const shareUrl = `${SITE_ORIGIN}/share/${profile.code}`;
  const imageUrl = new URL(profile.landscapeImageUrl, SITE_ORIGIN).toString();
  const title = `FACE 交易人格｜${profile.name}`;
  const description = `「${profile.motto}」`;

  const html = `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="noindex,follow,max-image-preview:large">
    <link rel="canonical" href="${escapeHtml(`${SITE_ORIGIN}/types/${profile.code}`)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(shareUrl)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(imageUrl)}">
    <meta property="og:image:width" content="1672">
    <meta property="og:image:height" content="941">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
    <script>window.location.replace(${JSON.stringify(destination)});</script>
  </head>
  <body>
    <p><a href="${escapeHtml(destination)}">查看 ${escapeHtml(profile.name)} 的 FACE 交易人格</a></p>
  </body>
</html>`;

  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.status(200).send(html);
}

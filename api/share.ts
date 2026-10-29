const SITE_ORIGIN = 'https://faceyourself.vercel.app';

// 人格分享資料自帶於此檔（不 import 專案其他模組），確保 Vercel serverless 穩定執行。
// 資料來源為 constants.tsx 的 FACE_MAP；若人格資料更新，重跑 `node scripts/gen-share-profiles.mjs` 同步。
type ShareProfile = {
  code: string;
  name: string;
  motto: string;
  attributes: string;
  portrait: string;
  mechanism: string;
  scene: string;
  landscapeImageUrl: string;
};

const SHARE_PROFILES: Record<string, ShareProfile> = {
  "ARLC": {
    "code": "ARLC",
    "name": "金雕大統帥",
    "motto": "最好的操作就是什麼都不做；我看準了，我重壓，然後我去睡覺。",
    "attributes": "A 積極 / R 理性 / L 長期 / C 集中",
    "portrait": "海中智商最高的頂級掠食者，擁有冷酷的邏輯與極致的耐心。懂得利用複利洋流節省體力，狩獵風格是「三年不開張，開張吃三年」，目標是鎖定擁有護城河的超級獵物並重倉咬住。是巴菲特與蒙格的忠實信徒。",
    "mechanism": "智力傲慢與孤獨感。深受確認偏誤與過度自信影響，容易愛上自己的判斷，當市場與分析背道而馳時會感到「智力羞辱感」。",
    "scene": "最難受的時刻是「垃圾股狂飆」。看著鄰居買迷因股賺錢而績效股不動時，會因相對剝奪感而在黎明前放棄價值。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-01-golden-eagle-commander-landscape.png"
  },
  "ARLD": {
    "code": "ARLD",
    "name": "北極熊謀士",
    "motto": "我不需要預測哪一匹馬會贏，我直接買下整個賽馬場；只要時代在前進，我的資產就會起飛。",
    "attributes": "A 積極 / R 理性 / L 長期 / D 分散",
    "portrait": "擁有宏觀經濟視野與精密藍圖。選擇用「系統化」方式佈局全球，透過資產配置建立獲利帝國，不追求單一馬匹，而是買下整個賽馬場。",
    "mechanism": "理性囚籠與相對剝奪感。因數據組合穩健卻慢如烏龜，看著憑感覺賺錢的人會感到「智商受辱」。",
    "scene": "邏輯失效時最易崩潰。看著本益比高得離譜的股票狂漲，會因孤獨感而破壞紀律衝動交易。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-02-polar-bear-strategist-landscape.png"
  },
  "ARTC": {
    "code": "ARTC",
    "name": "獵豹狙擊手",
    "motto": "先定義，再出手；錯過可以，失去標準不行。",
    "attributes": "A 積極 / R 理性 / T 交易 / C 集中",
    "portrait": "擅長等待條件成形，並在窗口出現時快速集中注意力。真正的考驗不是敢不敢出手，而是市場不給完美答案時，能不能守住原本的標準。",
    "mechanism": "你可能習慣先把交易條件定義清楚，再迅速執行；當訊號不完整時，可以觀察自己是否會在等待與急著補上機會之間擺盪。",
    "scene": "如果錯過原本規劃的進場點，值得留意踏空的懊悔是否正在降低你下一次出手的標準。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-03-cheetah-sniper-landscape.png"
  },
  "ARTD": {
    "code": "ARTD",
    "name": "獵犬占星師",
    "motto": "我不是在賭博，我是在經營賭場；我不依賴單一運氣，我依靠系統性的機率優勢。",
    "attributes": "A 積極 / R 理性 / T 交易 / D 分散",
    "portrait": "狼群首領與塔台調度員。依靠「大數法則」與「期望值」，在市場中進行高頻率、多目標的戰術圍捕。相信系統性的機率優勢。",
    "mechanism": "資訊過載與系統焦慮。大腦處於多工高壓，害怕模型參數失靈導致狼群集體迷失方向。",
    "scene": "最痛苦的是「賺了指數賠了價差」的瞎忙時刻。高努力低回報的效率感失落引發自我懷疑。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-04-hound-astrologer-landscape.png"
  },
  "AILC": {
    "code": "AILC",
    "name": "黑豹傳教士",
    "motto": "別人笑我太瘋癲，我笑他人看不穿；我買的不是代碼，而是人類的下一個紀元。",
    "attributes": "A 積極 / I 感性 / L 長期 / C 集中",
    "portrait": "投資的是「未來」而非股票。\n\n對破壞式創新有宗教般的熱忱，能無視嘲笑與暴跌，用「鑽石手」死抱直到未來實現或歸零。別人在崩盤群組裡發哭哭表情，你在發你剛讀完的第 47 篇技術白皮書。",
    "mechanism": "信仰綁架與身分認同。將標的與價值觀綁定，只聽利多訊息，有著「孤獨先知感」。",
    "scene": "最難受的是「漫長的死寂」。股價盤整多年而傳產股創新高時，會產生信仰無法變現的無力感。你渴望的不是財富，而是「在別人都看不懂的時候，我看懂了」的先知感；越渴望被證明是對的，就越害怕面對自己可能錯了的證據。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-05-black-panther-evangelist-landscape.png"
  },
  "AILD": {
    "code": "AILD",
    "name": "松鼠收藏家",
    "motto": "這個看起來會漲，那個故事也很棒！小朋友才做選擇，我全都要！",
    "attributes": "A 積極 / I 感性 / L 長期 / D 分散",
    "portrait": "依靠敏銳直覺尋找爆發趨勢，將資金分散在各種激動人心的題材。投資組合像「未來博物館」，收藏各種創新種子。",
    "mechanism": "錯失恐懼 (FOMO) 與囤積症。怕錯過下一個特斯拉，導致持股數量膨脹到照顧不來。",
    "scene": "最感挫折的是「賺了熱鬧沒賺到錢」。因買太散，個別飆股對總資產貢獻微乎其微。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-06-squirrel-collector-landscape.png"
  },
  "AITC": {
    "code": "AITC",
    "name": "劍齒虎賭俠",
    "motto": "聽見市場的脈搏，在那一秒全倉出擊；要嘛贏得世界，要嘛回家吃土。",
    "attributes": "A 積極 / I 感性 / T 交易 / C 集中",
    "portrait": "依靠本能與直覺生存，字典裡只有「進攻」。在轉折點全倉出擊，追求「獵殺」或是「飢餓」的極端感。",
    "mechanism": "控制幻覺與多巴胺成癮。獲利是巨大成就感，連續虧損時會感到「自我價值」崩塌。",
    "scene": "最恐懼失去「盤感」。失利後會演變成「報復性交易」，為了贏回尊嚴而加倍下注。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-07-sabertooth-gambler-landscape.png"
  },
  "AITD": {
    "code": "AITD",
    "name": "獼猴派對主",
    "motto": "天下武功，唯快不破，我玩的不是股票，是心跳！",
    "attributes": "A 積極 / I 感性 / T 交易 / D 分散",
    "portrait": "頻率最高反應最快，在熱門股間快速切換。不愛持有愛波動，相信積少成多維持高速飛行。",
    "mechanism": "多巴胺成癮與注意力耗竭。注意被切細碎，感到心智耗竭，月底結算常原地踏步。",
    "scene": "最崩潰是「顧此失彼」。盤勢劇烈波動時來不及處理 10 檔短線股，陷入失控感。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-08-macaque-host-landscape.png"
  },
  "PRLC": {
    "code": "PRLC",
    "name": "白鹿鑑古師",
    "motto": "眾人皆醉我獨醒；我不看價格，我只看價值。只要公司沒壞，股價腰斬正如我意。",
    "attributes": "P 保守 / R 理性 / L 長期 / C 集中",
    "portrait": "棲息在險峻峭壁，遠離市場雜訊。專注研究財報數據尋找低估價值。確認岩石穩固才將全重壓上。",
    "mechanism": "認知失調與孤獨感。最大痛苦是「市場不認同邏輯」，導致智商被羞辱的挫折感。",
    "scene": "最崩潰是「價值陷阱」。發現守護的是正在腐爛的石頭，損失的是判斷力信仰。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-09-white-deer-appraiser-landscape.png"
  },
  "PRLD": {
    "code": "PRLD",
    "name": "鼴鼠導引者",
    "motto": "飛得快不一定飛得遠；我不求暴利，只求軟著陸。活著，就是最大的勝利。",
    "attributes": "P 保守 / R 理性 / L 長期 / D 分散",
    "portrait": "在惡劣海象中長時間滑翔而不費力。極度厭惡風險，追求萬無一失的「平安抵達」。",
    "mechanism": "損失趨避與遺憾恐懼。內心對虧損與犯錯有生理性排斥，常感「守規矩卻是輸家」。",
    "scene": "最崩潰是「通膨的嘲笑」。穩健成長 3% 卻敵不過房價便當大漲，堡壘正被腐蝕。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-10-mole-guide-landscape.png"
  },
  "PRTC": {
    "code": "PRTC",
    "name": "鱷魚精算師",
    "motto": "我從不賭博，我只在看見底牌時才下注；與其在大海中冒險，我寧願撿拾岸邊確定的貝殼。",
    "attributes": "P 保守 / R 理性 / T 交易 / C 集中",
    "portrait": "多疑且機警，尋找極低風險的套利機會。勝率超 90% 才重倉咬下一口即逃。哲學是絕對不賠。",
    "mechanism": "完美主義與錯失焦慮的矛盾。最痛苦是「看對不敢做」，陷入無限等待迴圈。",
    "scene": "最崩潰是「被軋空手」。精算隨時崩盤卻看著無視基本面狂漲，受不了衝動進場即反轉。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-11-crocodile-actuary-landscape.png"
  },
  "PRTD": {
    "code": "PRTD",
    "name": "大象典獄長",
    "motto": "我每天檢查一百道鎖，調度一千次衛兵；雖然很累且沒賺多少，但至少今晚我很安全。",
    "attributes": "P 保守 / R 理性 / T 交易 / D 分散",
    "portrait": "謹慎的象群守護者，試圖用笨重身軀跳輕靈舞步。習慣分散且時刻警戒頻繁調度。",
    "mechanism": "控制強迫症與無效忙碌。最痛苦是「高努力低回報」，渴望掌控一切卻被細節拖垮。",
    "scene": "最崩潰是「小幅震盪頻繁停損」。嚴格 1% 停損導致在波動中不斷被洗掉。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-12-elephant-warden-landscape.png"
  },
  "PILC": {
    "code": "PILC",
    "name": "犀牛親衛隊",
    "motto": "我不懂財報，但我相信這家公司；只要它還在，我就不會離開。",
    "attributes": "P 保守 / I 感性 / L 長期 / C 集中",
    "portrait": "溫和但固執。依靠直覺、信任與人情決策。認定公司便誓死守護持有到天荒地老。",
    "mechanism": "月暈效應與情感稟賦。把好公司當好股票，盲目信任產生「背叛」恐懼與責任感。",
    "scene": "最心碎是「偶像崩塌」。形象良善企業爆醜聞，不甘心導致無法賣出跟著沈船。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-13-rhinoceros-guard-landscape.png"
  },
  "PILD": {
    "code": "PILD",
    "name": "樹懶思想家",
    "motto": "不看就不會虧，只要我心如止水，股市波動就與我無關。",
    "attributes": "P 保守 / I 感性 / L 長期 / D 分散",
    "portrait": "擁有「防禦性忽略」超能力，不看就不會虧。買得散以求心安，擅長的事情是遺忘。",
    "mechanism": "鴕鳥心態與習得性無助。放棄掌控感以自我保護，怕發現逃避現實且無能為力。",
    "scene": "最尷尬是「被動得知壞消息」。公司掏空下市直到新聞報導才知道，有強烈羞愧感。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-14-sloth-thinker-landscape.png"
  },
  "PITC": {
    "code": "PITC",
    "name": "夜梟前哨兵",
    "motto": "看見的不只是獲利，而是獲利背後那 100 種可能讓我受傷的方式。",
    "attributes": "P 保守 / I 感性 / T 交易 / C 集中",
    "portrait": "對風聲最敏感。生存哲學是極致防禦性掠奪，趨勢反轉瞬間離場。拆彈專家般的獨行俠。",
    "mechanism": "過度警覺與損失趨避。杏仁核常態過熱，難享受獲利，每筆單都覺攸關生死。",
    "scene": "看著 K 線跳動都覺是定時炸彈。為了安全感犧牲利潤，導致績效停滯。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-15-night-owl-sentinel-landscape.png"
  },
  "PITD": {
    "code": "PITD",
    "name": "考拉隨行者",
    "motto": "可以參考別人的地圖，但最後一段路，要知道自己為什麼走。",
    "attributes": "P 保守 / I 感性 / T 交易 / D 分散",
    "portrait": "擅長從市場氣氛、可信任的人與群體行動中收集線索。真正的課題不是停止聽別人，而是借用資訊時，不把最後的決定也一起借出去。",
    "mechanism": "你可能習慣先聽市場與可信任來源怎麼看，再決定是否跟上；可以觀察參考別人何時開始取代自己的驗證。",
    "scene": "當原本一致的意見突然分裂，值得留意自己是否會繼續尋找更多聲音，只為延後必須親自做的決定。",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-16-koala-companion-landscape.png"
  }
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

const replaceFirst = (html: string, pattern: RegExp, replacement: string): string =>
  pattern.test(html) ? html.replace(pattern, replacement) : html;

// 把含換行的長文轉成多個 <p>，供爬蟲讀取的真實內文。
const toParagraphs = (text: string): string => text
  .split(/\n{1,}/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => `<p>${escapeHtml(line)}</p>`)
  .join('');

// 給不執行 JavaScript 的爬蟲（含 AI 引擎）閱讀的內文。React 掛載時 createRoot
// 會清空 #root 並以互動版取代，一般使用者不會看到這段，但爬蟲讀得到真實文字。
const buildSeoBody = (profile: ShareProfile): string =>
  `<article>`
  + `<h1>${escapeHtml(profile.name)}（${escapeHtml(profile.code)}）</h1>`
  + `<p>${escapeHtml(profile.attributes)}</p>`
  + `<blockquote>${escapeHtml(profile.motto)}</blockquote>`
  + `<section><h2>人格描述</h2>${toParagraphs(profile.portrait)}</section>`
  + `<section><h2>核心心理機制</h2><p>${escapeHtml(profile.mechanism)}</p><p>${escapeHtml(profile.scene)}</p></section>`
  + `</article>`;

const buildProfileJsonLd = (profile: ShareProfile, pageUrl: string, imageUrl: string, title: string, description: string): string => {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        image: imageUrl,
        inLanguage: 'zh-TW',
        about: `FACE 交易人格 ${profile.code}`,
        mainEntityOfPage: pageUrl,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: '交易人格圖鑑', item: `${SITE_ORIGIN}/types` },
          { '@type': 'ListItem', position: 3, name: profile.name, item: pageUrl },
        ],
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
};

const renderAppShell = async (profile: ShareProfile): Promise<string> => {
  const pageUrl = `${SITE_ORIGIN}/types/${profile.code}`;
  const imageUrl = new URL(profile.landscapeImageUrl, SITE_ORIGIN).toString();
  // 與前端 lib/pageMetadata.ts 的 getPageCopy 對齊，避免 Google 在 JS 執行後看到不同標題。
  const title = `${profile.name} ${profile.code}｜${profile.attributes.replaceAll(' / ', '・')}的交易人格`;
  const description = `${profile.name}（${profile.code}）的 FACE 交易人格圖鑑：看懂決策偏好、交易天賦、壓力盲點與可執行的調整方式。`;
  const shellResponse = await fetch(`${SITE_ORIGIN}/index.html`);
  let html = await shellResponse.text();

  html = replaceFirst(html, /<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceFirst(html, /<meta name="description" content="[^"]*">/i, `<meta name="description" content="${escapeHtml(description)}">`);
  html = replaceFirst(html, /<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${escapeHtml(pageUrl)}">`);
  html = replaceFirst(html, /<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="${escapeHtml(pageUrl)}">`);
  html = replaceFirst(html, /<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${escapeHtml(title)}">`);
  html = replaceFirst(html, /<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${escapeHtml(description)}">`);
  html = replaceFirst(html, /<meta property="og:image" content="[^"]*">/i, `<meta property="og:image" content="${escapeHtml(imageUrl)}">`);
  html = replaceFirst(html, /<meta property="og:image:type" content="[^"]*">/i, '<meta property="og:image:type" content="image/png">');
  html = replaceFirst(html, /<meta property="og:image:width" content="[^"]*">/i, '<meta property="og:image:width" content="1672">');
  html = replaceFirst(html, /<meta property="og:image:height" content="[^"]*">/i, '<meta property="og:image:height" content="941">');
  html = replaceFirst(html, /<meta name="twitter:url" content="[^"]*">/i, `<meta name="twitter:url" content="${escapeHtml(pageUrl)}">`);
  html = replaceFirst(html, /<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
  html = replaceFirst(html, /<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${escapeHtml(description)}">`);
  html = replaceFirst(html, /<meta name="twitter:image" content="[^"]*">/i, `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`);
  html = replaceFirst(html, /<meta name="robots" content="[^"]*">/i, '<meta name="robots" content="index, follow, max-image-preview:large">');
  html = replaceFirst(html, /<\/head>/i, `${buildProfileJsonLd(profile, pageUrl, imageUrl, title, description)}</head>`);
  html = replaceFirst(html, /<div id="root">\s*<\/div>/i, `<div id="root">${buildSeoBody(profile)}</div>`);

  return html;
};

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
): Promise<void> {
  const requestUrl = new URL(request.url ?? '/', `https://${request.headers?.host ?? 'faceyourself.vercel.app'}`);
  const code = (requestUrl.searchParams.get('code') ?? '').toUpperCase();
  const profile = SHARE_PROFILES[code];

  if (!profile) {
    response.redirect(302, `${SITE_ORIGIN}/types`);
    return;
  }

  if (requestUrl.searchParams.get('render') === 'app') {
    const appHtml = await renderAppShell(profile);
    response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.status(200).send(appHtml);
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

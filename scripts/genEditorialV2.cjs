// 由 作圖/v2/NN_*_交易人格測驗_優化版.md 產生 data/personalityEditorialV2.ts。
// 用法： node scripts/genEditorialV2.cjs
// 改內容時：先改對應的 Markdown（SRC 資料夾），再重跑本腳本。
const fs = require('fs');
const path = require('path');

const SRC = process.env.FACE_V2_MD_DIR || 'C:/Users/nplus chang/Desktop/作圖/v2';
const OUT = path.join(__dirname, '..', 'data', 'personalityEditorialV2.ts');

// FACE 代碼 ↔ 編號 / slug / V2 動物名（來源：v2對照表.md、generate_v2_personality_cards.py）
const TYPES = [
  { n: 1, code: 'ARLC', slug: 'golden-eagle-commander', name: '金雕大統帥' },
  { n: 2, code: 'ARLD', slug: 'polar-bear-strategist', name: '北極熊謀士' },
  { n: 3, code: 'ARTC', slug: 'cheetah-sniper', name: '獵豹狙擊手' },
  { n: 4, code: 'ARTD', slug: 'hound-astrologer', name: '獵犬占星師' },
  { n: 5, code: 'AILC', slug: 'black-panther-evangelist', name: '黑豹傳教士' },
  { n: 6, code: 'AILD', slug: 'squirrel-collector', name: '松鼠收藏家' },
  { n: 7, code: 'AITC', slug: 'sabertooth-gambler', name: '劍齒虎賭俠' },
  { n: 8, code: 'AITD', slug: 'macaque-host', name: '獼猴派對主' },
  { n: 9, code: 'PRLC', slug: 'white-deer-appraiser', name: '白鹿鑑古師' },
  { n: 10, code: 'PRLD', slug: 'mole-guide', name: '鼴鼠導引者' },
  { n: 11, code: 'PRTC', slug: 'crocodile-actuary', name: '鱷魚精算師' },
  { n: 12, code: 'PRTD', slug: 'elephant-warden', name: '大象典獄長' },
  { n: 13, code: 'PILC', slug: 'rhinoceros-guard', name: '犀牛親衛隊' },
  { n: 14, code: 'PILD', slug: 'sloth-thinker', name: '樹懶思想家' },
  { n: 15, code: 'PITC', slug: 'night-owl-sentinel', name: '夜梟前哨兵' },
  { n: 16, code: 'PITD', slug: 'koala-companion', name: '考拉隨行者' },
];
const NAME_TO_CODE = Object.fromEntries(TYPES.map((t) => [t.name, t.code]));

const warnings = [];
const warn = (code, msg) => warnings.push(`[${code}] ${msg}`);

function findMdFile(n) {
  const prefix = String(n).padStart(2, '0') + '_';
  const file = fs.readdirSync(SRC).find((f) => f.startsWith(prefix) && f.endsWith('.md'));
  if (!file) throw new Error(`找不到編號 ${prefix} 的 md`);
  return path.join(SRC, file);
}

const stripBold = (s) => s.replace(/\*\*/g, '');
const firstBold = (s) => {
  const m = s.match(/\*\*([^*]+)\*\*/);
  return m ? m[1].trim() : '';
};
// 去除 markdown 行尾強制換行的兩個空白與清單縮排
const tidy = (s) => s.replace(/\s+$/g, '').trim();

function parse(entry) {
  const { n, code, slug } = entry;
  const raw = fs.readFileSync(findMdFile(n), 'utf8').replace(/\r\n/g, '\n');
  const allLines = raw.split('\n');

  // 先把「一句話祝福」切出來，避免污染 section 04 的解析
  const blessIdx = allLines.findIndex((l) => l.replace(/\s/g, '').startsWith('>一句話祝福'));
  let blessing = '';
  if (blessIdx >= 0) {
    blessing = allLines
      .slice(blessIdx + 1)
      .filter((l) => l.trim().startsWith('>'))
      .map((l) => l.replace(/^>\s?/, '').trim())
      .join('\n')
      .trim();
  }
  const lines = blessIdx >= 0 ? allLines.slice(0, blessIdx) : allLines;

  const startBody = lines.findIndex((l) => l.startsWith('## 01'));
  const head = lines.slice(0, startBody);

  // ---- 表頭 ----
  const attrLine = head.find((l) => l.startsWith('### ')) || '';
  const attrs = (attrLine.split('｜')[1] || '').trim();

  const mottoMarker = head.findIndex((l) => l.replace(/\s/g, '').startsWith('>座右銘'));
  let motto = '';
  if (mottoMarker >= 0) {
    motto = head
      .slice(mottoMarker + 1)
      .filter((l) => l.trim().startsWith('>'))
      .map((l) => l.replace(/^>\s?/, '').trim())
      .join('\n')
      .trim();
  }

  const afterBar = (prefix) => {
    const l = head.find((x) => x.startsWith(prefix)) || '';
    return (l.split('｜')[1] || '').trim();
  };
  const slangName = afterBar('別人眼中的你');
  const statusLine = afterBar('你眼中的自己');

  const tagLine = head.find((l) => l.includes('`#')) || '';
  const tags = [...tagLine.matchAll(/`#([^`]+)`/g)].map((m) => m[1].trim());

  // ---- 切 section ----
  const sections = {};
  let cur = null;
  for (const l of lines.slice(startBody)) {
    const m = l.match(/^##\s+(\d{2})\s+(.*)$/);
    if (m) {
      cur = { num: m[1], lines: [] };
      sections[m[1]] = cur;
    } else if (cur) {
      cur.lines.push(l);
    }
  }
  const secLines = (num) => (sections[num] ? sections[num].lines : []);

  // 段落：把非空行以空白行為界合併
  const paragraphs = (arr) => {
    const out = [];
    let buf = [];
    for (const l of arr) {
      if (l.trim() === '' || l.trim() === '---') {
        if (buf.length) out.push(buf.join('').trim());
        buf = [];
      } else {
        buf.push(l.trim());
      }
    }
    if (buf.length) out.push(buf.join('').trim());
    return out.filter(Boolean);
  };

  // ---- 01 你是這樣的人 ----
  const s01 = secLines('01');
  const detStart = s01.findIndex((l) => l.trim().startsWith('<details>'));
  const detEnd = s01.findIndex((l) => l.trim().startsWith('</details>'));
  const portrait = paragraphs(detStart >= 0 ? s01.slice(0, detStart) : s01);
  let master = { name: '', body: '' };
  if (detStart >= 0 && detEnd >= 0) {
    const inner = s01
      .slice(detStart + 1, detEnd)
      .filter((l) => !l.trim().startsWith('<summary>') && l.trim() !== '');
    const body = inner.map((l) => l.trim()).join('\n\n').trim();
    master = { name: firstBold(body), body };
  } else {
    warn(code, '找不到 <details> 大師區塊');
  }

  // ---- 02 你天生的優勢 ----
  const strength = paragraphs(secLines('02'));

  // ---- 03 一個值得覺察的地方 ----
  const s03 = secLines('03');
  const awarenessBody = paragraphs(s03.filter((l) => !l.trim().startsWith('>')));
  const noteLine = s03.find((l) => l.trim().startsWith('>')) || '';
  const awareness = { body: awarenessBody, note: noteLine.replace(/^>\s?/, '').trim() };

  // ---- 04 讓自己更好 ----
  const s04 = secLines('04');
  // 切子標題 ### 1./2./3.
  const subs = {};
  let subKey = 'intro';
  subs.intro = [];
  for (const l of s04) {
    const hm = l.match(/^###\s+(\d)\./);
    if (hm) {
      subKey = hm[1];
      subs[subKey] = [];
    } else {
      subs[subKey].push(l);
    }
  }
  const dropComments = (arr) => {
    const out = [];
    let inComment = false;
    for (const l of arr) {
      const t = l.trim();
      if (t.startsWith('<!--')) inComment = true;
      if (inComment) {
        if (t.endsWith('-->')) inComment = false;
        continue;
      }
      out.push(l);
    }
    return out;
  };

  const improveIntro = paragraphs(subs.intro || []).join('\n\n');

  // 兩種未來
  const futures = [];
  {
    const arr = dropComments(subs['1'] || []);
    let cur2 = null;
    for (const l of arr) {
      const t = l.trim();
      if (t === '') continue;
      const lm = t.match(/^\*\*(🅐|🅑)\s*(.+?)\*\*$/);
      if (lm) {
        if (cur2) futures.push(cur2);
        cur2 = { label: `${lm[1]} ${lm[2].trim()}`, bodyLines: [] };
      } else if (cur2) {
        cur2.bodyLines.push(t);
      }
    }
    if (cur2) futures.push(cur2);
  }
  const futuresOut = futures.map((f) => ({ label: f.label, body: f.bodyLines.join('').trim() }));
  if (futuresOut.length !== 2) warn(code, `兩種未來數量=${futuresOut.length}`);

  // 當你感覺不舒服
  let discomfortIntro = '';
  const discItems = [];
  {
    const arr = dropComments(subs['2'] || []);
    // intro：第一段非清單文字
    for (const l of arr) {
      const t = l.trim();
      if (t === '') continue;
      if (t.startsWith('- [')) break;
      discomfortIntro += (discomfortIntro ? '' : '') + t;
    }
    let cur3 = null;
    for (const l of arr) {
      const t = l.trim();
      if (t === '') continue;
      const fm = t.match(/^- \[ ?\]\s*\*\*[①②③④⑤⑥]?\s*(.+?)\*\*/);
      if (fm) {
        if (cur3) discItems.push(cur3);
        cur3 = { feeling: fm[1].trim(), shift: '', saviorName: '', advice: '' };
        continue;
      }
      if (!cur3) continue;
      if (t.startsWith('轉念')) {
        cur3.shift = t.replace(/^轉念[：:]\s*/, '').trim();
      } else if (t.startsWith('想對你說')) {
        const nm = firstBold(t);
        cur3.saviorName = nm;
        const after = t.split(/：|:/).slice(1).join('：').trim();
        cur3.advice = after;
      }
    }
    if (cur3) discItems.push(cur3);
  }
  const discomfortItems = discItems.map((it) => {
    const saviorCode = NAME_TO_CODE[it.saviorName];
    if (!saviorCode) warn(code, `救贖動物名找不到代碼：「${it.saviorName}」`);
    return { feeling: it.feeling, shift: it.shift, saviorCode: saviorCode || '', saviorName: it.saviorName, advice: it.advice };
  });
  if (discomfortItems.length !== 4) warn(code, `不舒服清單數量=${discomfortItems.length}`);

  // 三個寶物
  const treasures = [];
  {
    const arr = dropComments(subs['3'] || []);
    let cur4 = null;
    for (const l of arr) {
      const t = l.trim();
      if (t === '') continue;
      const tm = t.match(/^\*\*(.+?)\*\*〔(通用|專屬)〕/);
      if (tm) {
        if (cur4) treasures.push(cur4);
        cur4 = { name: tm[1].trim(), kind: tm[2], bodyLines: [] };
      } else if (cur4) {
        cur4.bodyLines.push(t);
      }
    }
    if (cur4) treasures.push(cur4);
  }
  const treasuresOut = treasures.map((t) => ({ name: t.name, kind: t.kind, body: t.bodyLines.join('').trim() }));
  if (treasuresOut.length !== 3) warn(code, `寶物數量=${treasuresOut.length}`);

  // 道具圖：讀取 public/images/personality-props-v2/{NN}-{slug}/，依檔名前綴排序後對應寶物順序。
  const nn2 = String(n).padStart(2, '0');
  const propDir = path.join(__dirname, '..', 'public', 'images', 'personality-props-v2', `${nn2}-${slug}`);
  let propFiles = [];
  try {
    propFiles = fs.readdirSync(propDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  } catch (e) {
    warn(code, `找不到道具圖資料夾：${nn2}-${slug}`);
  }
  if (propFiles.length && propFiles.length !== treasuresOut.length) {
    warn(code, `道具圖數量(${propFiles.length})與寶物數量(${treasuresOut.length})不符`);
  }
  treasuresOut.forEach((t, i) => {
    if (propFiles[i]) t.image = `/images/personality-props-v2/${nn2}-${slug}/${propFiles[i]}`;
  });

  if (!blessing) warn(code, '找不到一句話祝福');
  if (!motto) warn(code, '找不到座右銘');
  if (tags.length === 0) warn(code, '找不到標籤');

  return {
    index: n,
    slug,
    attrs,
    motto,
    slangName,
    statusLine,
    tags,
    portrait,
    master,
    strength,
    awareness,
    improveIntro,
    futures: futuresOut,
    discomfort: { intro: discomfortIntro, items: discomfortItems },
    treasures: treasuresOut,
    blessing,
  };
}

const data = {};
for (const entry of TYPES) {
  data[entry.code] = parse(entry);
}

const header = `/** V2 圖鑑卡內容。自動由 作圖/v2/NN_*_交易人格測驗_優化版.md 產生（scripts/genEditorialV2.cjs）。
 *  手動編輯請改 Markdown 後重生。
 *
 *  V2 是重新設計的較精簡結構：01 你是這樣的人 → 02 你天生的優勢 →
 *  03 一個值得覺察的地方 → 04 讓自己更好（兩種未來／不舒服清單／三個寶物）→ 一句話祝福。
 *
 *  RoleDetail 會在某個代碼有 V2 資料時改用 RoleDetailV2 版型；尚未遷移的代碼沿用舊版
 *  personalityEditorial.ts。文字支援 **粗體** 內嵌標記（由 RoleDetailV2 解析）。 */

export interface TreasureV2 {
  name: string;
  /** 通用＝人人適用的紀律；專屬＝此型的校正招式 */
  kind: '通用' | '專屬';
  body: string;
  /** 道具圖路徑（personality-props-v2）；缺圖時為 undefined */
  image?: string;
}

export interface DiscomfortItemV2 {
  feeling: string;
  shift: string;
  /** 推薦動物的 FACE 代碼，用於連結到該型頁面 */
  saviorCode: string;
  saviorName: string;
  advice: string;
}

export interface FutureBranchV2 {
  label: string;
  body: string;
}

export interface PersonalityEditorialV2 {
  index: number;
  /** 圖片檔用的英文 slug，例如 koala-companion */
  slug: string;
  /** 四維中文描述，例如 保守／感性／短期／分散 */
  attrs: string;
  motto: string;
  /** 別人眼中的你 */
  slangName: string;
  /** 你眼中的自己 */
  statusLine: string;
  tags: string[];
  /** 01 你是這樣的人（段落） */
  portrait: string[];
  /** 跟你同款的傳奇操盤手 */
  master: { name: string; body: string };
  /** 02 你天生的優勢（段落） */
  strength: string[];
  /** 03 一個值得覺察的地方 */
  awareness: { body: string[]; note: string };
  /** 04 讓自己更好 導語 */
  improveIntro: string;
  /** 兩種未來（🅐 什麼都不調整 / 🅑 開始調整） */
  futures: FutureBranchV2[];
  /** 當你感覺「不舒服」時 */
  discomfort: { intro: string; items: DiscomfortItemV2[] };
  /** 三個專屬寶物 */
  treasures: TreasureV2[];
  /** 一句話祝福 */
  blessing: string;
}

export const PERSONALITY_EDITORIAL_V2: Partial<Record<string, PersonalityEditorialV2>> = `;

fs.writeFileSync(OUT, header + JSON.stringify(data, null, 2) + ';\n', 'utf8');

console.log(`已產生 ${OUT}（${Object.keys(data).length} 型）`);
if (warnings.length) {
  console.log('\n⚠ 警告：');
  warnings.forEach((w) => console.log('  ' + w));
} else {
  console.log('無警告，全部解析完成。');
}

// 將 constants.tsx 的 FACE_MAP 顯示欄位（name / 圖片路徑）更新為 V2。
// 只改 name 與三個圖片 URL；其餘欄位保留。用法： node scripts/patchFaceMapV2.cjs
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'constants.tsx');

// code -> { n, slug, v1, v2 }
const MAP = [
  { code: 'ARLC', n: 1, slug: 'golden-eagle-commander', v1: '殺人鯨領主', v2: '金雕大統帥' },
  { code: 'ARLD', n: 2, slug: 'polar-bear-strategist', v1: '白頭鷹建築師', v2: '北極熊謀士' },
  { code: 'ARTC', n: 3, slug: 'cheetah-sniper', v1: '雪豹狙擊手', v2: '獵豹狙擊手' },
  { code: 'ARTD', n: 4, slug: 'hound-astrologer', v1: '灰狼調度員', v2: '獵犬占星師' },
  { code: 'AILC', n: 5, slug: 'black-panther-evangelist', v1: '黑豹傳教士', v2: '黑豹傳教士' },
  { code: 'AILD', n: 6, slug: 'squirrel-collector', v1: '松鼠策劃家', v2: '松鼠收藏家' },
  { code: 'AITC', n: 7, slug: 'sabertooth-gambler', v1: '劍齒虎猛獸', v2: '劍齒虎賭俠' },
  { code: 'AITD', n: 8, slug: 'macaque-host', v1: '蜂鳥衝浪者', v2: '獼猴派對主' },
  { code: 'PRLC', n: 9, slug: 'white-deer-appraiser', v1: '高山岩羊隱士', v2: '白鹿鑑古師' },
  { code: 'PRLD', n: 10, slug: 'mole-guide', v1: '信天翁導航員', v2: '鼴鼠導引者' },
  { code: 'PRTC', n: 11, slug: 'crocodile-actuary', v1: '狐狸拾荒者', v2: '鱷魚精算師' },
  { code: 'PRTD', n: 12, slug: 'elephant-warden', v1: '大象守衛員', v2: '大象典獄長' },
  { code: 'PILC', n: 13, slug: 'rhinoceros-guard', v1: '犀牛護衛隊', v2: '犀牛親衛隊' },
  { code: 'PILD', n: 14, slug: 'sloth-thinker', v1: '深海巨龜隱者', v2: '樹懶思想家' },
  { code: 'PITC', n: 15, slug: 'night-owl-sentinel', v1: '耳廓狐警探', v2: '夜梟前哨兵' },
  { code: 'PITD', n: 16, slug: 'koala-companion', v1: '考拉隨行者', v2: '考拉隨行者' },
];

let src = fs.readFileSync(FILE, 'utf8');
let nameChanges = 0;
let imgChanges = 0;

for (const m of MAP) {
  const nn = String(m.n).padStart(2, '0');

  // 名稱
  if (m.v1 !== m.v2) {
    const from = `"name": "${m.v1}"`;
    const to = `"name": "${m.v2}"`;
    if (!src.includes(from)) throw new Error(`找不到名稱：${from}`);
    src = src.split(from).join(to);
    nameChanges++;
  }

  // 圖片：landscape（imageUrl + landscapeImageUrl 皆指向 landscape）
  const landFrom = `/images/personalities/face-${nn}-landscape.png`;
  const landTo = `/images/personalities-v2-landscape/v2-${nn}-${m.slug}-landscape.png`;
  const landCount = src.split(landFrom).length - 1;
  if (landCount === 0) throw new Error(`找不到圖片：${landFrom}`);
  src = src.split(landFrom).join(landTo);
  imgChanges += landCount;

  // 圖片：sketch → V2 方形線稿
  const skFrom = `/images/personalities/face-${nn}-sketch.png`;
  const skTo = `/images/personalities-v2-square-line/v2-${nn}-${m.slug}-square-line.png`;
  const skCount = src.split(skFrom).length - 1;
  if (skCount === 0) throw new Error(`找不到圖片：${skFrom}`);
  src = src.split(skFrom).join(skTo);
  imgChanges += skCount;
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`FACE_MAP 更新完成：名稱 ${nameChanges} 筆、圖片路徑 ${imgChanges} 筆。`);

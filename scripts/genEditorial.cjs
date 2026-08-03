// 由 16 份「交易人格測驗_優化版.md」產生 data/personalityEditorial.ts。
// 用法： node scripts/genEditorial.js
// 改內容時：先改對應的 Markdown（SRC 資料夾），再重跑本腳本。
const fs = require('fs'), path = require('path');
// 來源 Markdown 資料夾（如搬移請改這裡）
const SRC = process.env.FACE_MD_DIR || 'C:/Users/nplus chang/Desktop/作圖';
const OUT = path.join(__dirname, '..', 'data', 'personalityEditorial.ts');

const TYPES = [
  {code:'ARLC', name:'殺人鯨領主', md:'殺人鯨領主'},
  {code:'ARLD', name:'白頭鷹建築師', md:'白頭翁建築師'},
  {code:'ARTC', name:'雪豹狙擊手', md:'雪豹狙擊手'},
  {code:'ARTD', name:'灰狼調度員', md:'灰狼調度員'},
  {code:'AILC', name:'黑豹傳教士', md:'黑豹傳教士'},
  {code:'AILD', name:'松鼠策劃家', md:'松鼠策劃家'},
  {code:'AITC', name:'劍齒虎猛獸', md:'劍齒虎猛獸'},
  {code:'AITD', name:'蜂鳥衝浪者', md:'蜂鳥衝浪者'},
  {code:'PRLC', name:'高山岩羊隱士', md:'高山岩羊隱士'},
  {code:'PRLD', name:'信天翁導航員', md:'信天翁導航員'},
  {code:'PRTC', name:'狐狸拾荒者', md:'狐狸拾荒者'},
  {code:'PRTD', name:'大象守衛員', md:'大象守衛員'},
  {code:'PILC', name:'犀牛護衛隊', md:'犀牛護衛隊'},
  {code:'PILD', name:'深海巨龜隱者', md:'深海巨龜隱者'},
  {code:'PITC', name:'耳廓狐警探', md:'耳廓狐警探'},
  {code:'PITD', name:'考拉隨行者', md:'考拉隨行者'},
];
const NAMES = TYPES.map(t => t.name);

const clean = arr => arr.filter(l => l.trim() !== '' && l.trim() !== '---');

function splitSections(lines) {
  const start = lines.findIndex(l => l.startsWith('## 01'));
  const body = lines.slice(start);
  const secs = []; let cur = null;
  for (const l of body) {
    const m = l.match(/^##\s+(\d{2})\s+(.*)$/);
    if (m) { if (cur) secs.push(cur); cur = { num: m[1], title: m[2].trim(), lines: [] }; }
    else if (cur) cur.lines.push(l);
  }
  if (cur) secs.push(cur);
  return secs;
}
function splitByHeading(lines) {
  const subs = []; let cur = null;
  for (const l of lines) {
    if (l.startsWith('### ')) { if (cur) subs.push(cur); cur = { heading: l.slice(4).trim(), lines: [] }; }
    else if (cur && l.trim() !== '' && l.trim() !== '---') cur.lines.push(l.trim());
  }
  if (cur) subs.push(cur);
  return subs;
}
function quoteAfter(lines, marker) {
  const i = lines.findIndex(l => l.startsWith(marker));
  if (i < 0) return '';
  const nx = lines[i + 1] || '';
  return nx.startsWith('> ') ? nx.slice(2).trim() : '';
}
function afterBar(lines, prefix) {
  const l = lines.find(x => x.startsWith(prefix)) || '';
  return (l.split('｜')[1] || '').trim();
}

function parseType(t) {
  const raw = fs.readFileSync(path.join(SRC, t.md + '_交易人格測驗_優化版.md'), 'utf8');
  const lines = raw.split(/\r?\n/);

  const motto = quoteAfter(lines, '> 座右銘');
  const slangName = afterBar(lines, '別人眼中的你｜');
  const statusLine = afterBar(lines, '你眼中的自己｜');
  const tagLine = lines.find(l => l.includes('`#')) || '';
  const tags = [...tagLine.matchAll(/`#([^`]+)`/g)].map(m => m[1]);
  const reminder = quoteAfter(lines, '> 一句話祝福');

  const secs = splitSections(lines);
  const S = n => secs.find(x => x.num === n) || { title: '', lines: [] };

  // 01
  const sub01 = splitByHeading(S('01').lines);
  const portraitSub = sub01.find(s => s.heading === '角色描述') || { lines: [] };
  const masterSub = sub01.find(s => s.heading === '傳奇大師') || { lines: [] };
  const portrait = portraitSub.lines.join('\n\n');
  const cardLine = portraitSub.lines[0] || '';
  const master = { name: masterSub.lines[0] || '', description: masterSub.lines[1] || '', quote: masterSub.lines[2] || '' };

  // 02
  const sub02 = splitByHeading(S('02').lines);
  const decision = {
    title: sub02[0] ? sub02[0].heading : '',
    scene: sub02[0] ? sub02[0].lines.join('\n\n') : '',
    desireTitle: sub02[1] ? sub02[1].heading : '',
    desireScene: sub02[1] ? sub02[1].lines.join('\n\n') : '',
  };

  // 03
  const s03 = S('03');
  const blindSpotSummary = (s03.lines.find(l => l.startsWith('> ')) || '').replace(/^>\s*/, '').replace(/^一句話白話：/, '');
  const sub03 = splitByHeading(s03.lines);
  const pressurePoints = []; let checklist = { intro: '', items: [] };
  for (const sub of sub03) {
    if (sub.heading === '本週自我檢核') {
      checklist = {
        intro: sub.lines.find(l => !l.startsWith('- [ ]')) || '',
        items: sub.lines.filter(l => l.startsWith('- [ ] ')).map(l => l.slice(6).trim()),
      };
    } else {
      pressurePoints.push({
        title: sub.heading,
        description: sub.lines.find(l => !l.startsWith('→')) || '',
        action: (sub.lines.find(l => l.startsWith('→')) || '').replace(/^→\s*/, ''),
      });
    }
  }

  // 04
  const s04 = S('04');
  const actionsTitle = s04.title;
  const steps = clean(s04.lines).filter(l => /^\d+\.\s/.test(l)).map(l => l.replace(/^\d+\.\s/, '').trim());
  const dirs = clean(s04.lines).filter(l => l.startsWith('**')).map(l => {
    const m = l.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    return m ? { title: m[1].trim(), description: m[2].trim() } : { title: l, description: '' };
  });
  const actions = dirs.map((d, i) => ({ title: d.title, description: d.description, steps: steps[i] ? [steps[i]] : [] }));

  // 05
  const p05 = clean(S('05').lines);
  const superpower = { title: p05[0] || '', description: p05.slice(1).join('\n\n') };

  // 06
  const sub06 = splitByHeading(S('06').lines);
  const pouchText = s => (s ? s.lines.slice(1).join('\n\n') : '');
  const pouches = { safety: pouchText(sub06[0]), mindset: pouchText(sub06[1]), behavior: pouchText(sub06[2]) };
  const pouchesTitle = S('06').title;

  // 07
  const s07 = S('07');
  const p07 = clean(s07.lines);
  const ia = p07.findIndex(x => x.includes('劇本 A'));
  const ib = p07.findIndex(x => x.includes('劇本 B'));
  const future = {
    title: s07.title,
    withoutChange: ia >= 0 ? (p07[ia + 1] || '') : '',
    withChange: ib >= 0 ? (p07[ib + 1] || '') : '',
  };

  // 08
  const s08 = S('08');
  const relationshipsTitle = s08.title;
  const relationships = clean(s08.lines)
    .map(l => l.match(/^\d+\.\s*(天生戰友|需要磨合|完全鏡像)：([A-Z]{4})\s+(.+)$/))
    .filter(Boolean)
    .map(m => ({ label: m[1], code: m[2], name: m[3].trim() }));
  const sub08 = splitByHeading(s08.lines).find(x => x.heading.startsWith('當你感覺')) || { lines: [] };
  const introTG = sub08.lines.find(l => !l.startsWith('|')) || '';
  const rows = sub08.lines
    .filter(l => l.startsWith('|') && l.indexOf('當你感覺到') < 0 && !/^\|[\s\-|]+\|$/.test(l))
    .map(l => {
      const c = l.split('|').slice(1, -1).map(x => x.trim());
      const savior = c[2] || '';
      let saviorName = '', saviorQuote = savior;
      for (const nm of NAMES) { if (savior.startsWith(nm)) { saviorName = nm; saviorQuote = savior.slice(nm.length); break; } }
      return { feeling: c[0] || '', shift: c[1] || '', saviorName, saviorQuote };
    });
  const transformationGuide = { intro: introTG, rows };

  return {
    cardLine, motto, slangName, statusLine, tags, portrait, master, decision,
    pressurePoints, blindSpotSummary, checklist, actions, actionsTitle, superpower,
    pouches, pouchesTitle, future, relationshipsTitle, relationships, transformationGuide,
    reminder, shareText: t.name + '｜' + reminder,
  };
}

const map = {};
const warnings = [];
for (const t of TYPES) {
  const e = parseType(t);
  map[t.code] = e;
  // validation
  const chk = {
    slangName: e.slangName, statusLine: e.statusLine, tags: e.tags.length, portrait: e.portrait,
    masterName: e.master.name, masterQuote: e.master.quote, desireTitle: e.decision.desireTitle,
    pressure: e.pressurePoints.length, checklist: e.checklist.items.length, actions: e.actions.length,
    superTitle: e.superpower.title, safety: e.pouches.safety, mindset: e.pouches.mindset, behavior: e.pouches.behavior,
    withoutChange: e.future.withoutChange, withChange: e.future.withChange,
    rel: e.relationships.length, rows: e.transformationGuide.rows.length, reminder: e.reminder,
  };
  const bad = Object.entries(chk).filter(([k, v]) => v === '' || v === 0).map(([k]) => k);
  const actionSteps = e.actions.filter(a => a.steps.length === 0).length;
  if (actionSteps) bad.push('action-missing-step');
  const badSavior = e.transformationGuide.rows.filter(r => !r.saviorName).length;
  if (badSavior) bad.push('savior-name-unmatched:' + badSavior);
  if (bad.length) warnings.push(t.code + ' ' + t.name + ' → ' + bad.join(', '));
}

const IFACE = `/** Public-facing personality copy synchronized from the founder-reviewed Markdown profiles.
 *  自動由 作圖/*_交易人格測驗_優化版.md 產生（scripts/genEditorial.cjs）。手動編輯請改 Markdown 後重生。 */
export interface PersonalityEditorial {
  cardLine: string;
  motto: string;
  /** 別人眼中的你（流行語代稱） */
  slangName: string;
  /** 你眼中的自己（一句話狀態） */
  statusLine: string;
  tags: string[];
  portrait: string;
  master: { name: string; description: string; quote: string };
  decision: { title: string; scene: string; desireTitle: string; desireScene: string };
  pressurePoints: Array<{ title: string; description: string; action: string }>;
  blindSpotSummary: string;
  checklist: { intro: string; items: string[] };
  actions: Array<{ title: string; description: string; steps: string[] }>;
  actionsTitle: string;
  superpower: { title: string; description: string };
  pouches: { safety: string; mindset: string; behavior: string };
  pouchesTitle: string;
  future: { title: string; withoutChange: string; withChange: string };
  relationshipsTitle: string;
  relationships: Array<{ label: string; code: string; name: string }>;
  transformationGuide: {
    intro: string;
    rows: Array<{ feeling: string; shift: string; saviorName: string; saviorQuote: string }>;
  };
  reminder: string;
  shareText: string;
}
`;

const out = IFACE + '\nexport const PERSONALITY_EDITORIAL: Partial<Record<string, PersonalityEditorial>> = ' + JSON.stringify(map, null, 2) + ';\n';
fs.writeFileSync(OUT, out, 'utf8');
console.log('WROTE', OUT, Math.round(out.length / 1024), 'KB, types:', Object.keys(map).length);
if (warnings.length) { console.log('WARNINGS:'); warnings.forEach(w => console.log('  ' + w)); }
else console.log('no warnings — all fields populated for 16 types');

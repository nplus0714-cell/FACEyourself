import React from 'react';
import { ArrowDown, BookOpen, ChevronDown, Eye, EyeClosed, Lightbulb, Share2 } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { FACE_MAP } from '../constants';
import { FACE_2_PROTOTYPES, type FaceProfilePrototype } from '../data/faceProfilePrototype';
import { PERSONALITY_EDITORIAL_V2 } from '../data/personalityEditorialV2';
import { MASTER_PORTRAIT_BY_CODE } from '../data/masterPortraits';
import { FEATURE_FLAGS } from '../config/featureFlags';

const PROFILE_CODES = [
  'ARLC', 'ARLD', 'ARTC', 'ARTD',
  'AILC', 'AILD', 'AITC', 'AITD',
  'PRLC', 'PRLD', 'PRTC', 'PRTD',
  'PILC', 'PILD', 'PITC', 'PITD',
] as const;

type ProfileCode = (typeof PROFILE_CODES)[number];

const coverByCode: Record<ProfileCode, string> = {
  ARLC: '/images/personalities-v2-text/v2-01-golden-eagle-commander-text.png',
  ARLD: '/images/personalities-v2-text/v2-02-polar-bear-strategist-text.png',
  ARTC: '/images/personalities-v2-text/v2-03-cheetah-sniper-text.png',
  ARTD: '/images/personalities-v2-text/v2-04-hound-astrologer-text.png',
  AILC: '/images/personalities-v2-text/v2-05-black-panther-evangelist-text.png',
  AILD: '/images/personalities-v2-text/v2-06-squirrel-collector-text.png',
  AITC: '/images/personalities-v2-text/v2-07-sabertooth-gambler-text.png',
  AITD: '/images/personalities-v2-text/v2-08-macaque-host-text.png',
  PRLC: '/images/personalities-v2-text/v2-09-white-deer-appraiser-text.png',
  PRLD: '/images/personalities-v2-text/v2-10-mole-guide-text.png',
  PRTC: '/images/personalities-v2-text/v2-11-crocodile-actuary-text.png',
  PRTD: '/images/personalities-v2-text/v2-12-elephant-warden-text.png',
  PILC: '/images/personalities-v2-text/v2-13-rhinoceros-guard-text.png',
  PILD: '/images/personalities-v2-text/v2-14-sloth-thinker-text.png',
  PITC: '/images/personalities-v2-text/v2-15-night-owl-sentinel-text.png',
  PITD: '/images/personalities-v2-text/v2-16-koala-companion-text.png',
};

type EditorialImageSet = {
  face: string;
  mirrors: string;
  talent: string;
  triggers: readonly [string, string, string];
  layouts?: {
    face: EditorialPlacement;
    mirrors: EditorialPlacement;
    talent: EditorialPlacement;
    triggers: readonly [EditorialPlacement, EditorialPlacement, EditorialPlacement];
  };
};

type EditorialPlacement = 'adaptive-left' | 'adaptive-right' | 'banner' | 'portrait-left' | 'cinematic';

const generatedEditorialImages = (slug: string): EditorialImageSet => ({
  face: `/images/reading-prototype/${slug}/chapter-01-face-v4.webp`,
  mirrors: `/images/reading-prototype/${slug}/chapter-02-v2.webp`,
  talent: `/images/reading-prototype/${slug}/chapter-03-v2.webp`,
  triggers: [
    `/images/reading-prototype/${slug}/scene-01-v2.webp`,
    `/images/reading-prototype/${slug}/scene-02-v2.webp`,
    `/images/reading-prototype/${slug}/scene-03-v2.webp`,
  ],
  layouts: {
    face: 'portrait-left',
    mirrors: 'adaptive-left',
    talent: 'adaptive-right',
    triggers: ['banner', 'adaptive-left', 'adaptive-right'],
  },
});

const editorialImagesByCode: Record<ProfileCode, EditorialImageSet> = {
  ARLC: {
    ...generatedEditorialImages('arlc'),
    face: '/images/reading-prototype/arlc/chapter-01-face-v4.webp',
    triggers: [
      '/images/reading-prototype/arlc/scene-01-v2.webp',
      '/images/reading-prototype/arlc/scene-02-v2.webp',
      '/images/reading-prototype/arlc/scene-03-props-v3.webp',
    ],
    layouts: {
      face: 'portrait-left',
      mirrors: 'adaptive-left',
      talent: 'adaptive-right',
      triggers: ['cinematic', 'adaptive-left', 'adaptive-right'],
    },
  },
  ARLD: generatedEditorialImages('arld'),
  ARTC: {
    face: '/images/reading-prototype/cheetah/chapter-01-face-v4.webp',
    mirrors: '/images/reading-prototype/cheetah/chapter-02-mirrors-v2.webp',
    talent: '/images/reading-prototype/cheetah/chapter-03-talent-v2.webp',
    triggers: [
      '/images/reading-prototype/cheetah/scene-01-missed-entry-v2.webp',
      '/images/reading-prototype/cheetah/scene-02-stopped-out-v2.webp',
      '/images/reading-prototype/cheetah/scene-03-overconfidence-v2.webp',
    ],
    layouts: {
      face: 'portrait-left',
      mirrors: 'adaptive-left',
      talent: 'adaptive-right',
      triggers: ['banner', 'adaptive-left', 'adaptive-right'],
    },
  },
  ARTD: generatedEditorialImages('artd'),
  AILC: generatedEditorialImages('ailc'),
  AILD: generatedEditorialImages('aild'),
  AITC: generatedEditorialImages('aitc'),
  AITD: generatedEditorialImages('aitd'),
  PRLC: generatedEditorialImages('prlc'),
  PRLD: generatedEditorialImages('prld'),
  PRTC: generatedEditorialImages('prtc'),
  PRTD: generatedEditorialImages('prtd'),
  PILC: generatedEditorialImages('pilc'),
  PILD: generatedEditorialImages('pild'),
  PITC: generatedEditorialImages('pitc'),
  PITD: generatedEditorialImages('pitd'),
};

const isProfileCode = (value: string | null): value is ProfileCode => Boolean(value && PROFILE_CODES.includes(value as ProfileCode));

const getInitialProfileCode = (): ProfileCode => {
  if (typeof window === 'undefined') return 'ARTC';
  const queryCode = new URLSearchParams(window.location.search).get('type')?.toUpperCase() ?? null;
  return isProfileCode(queryCode) ? queryCode : 'ARTC';
};

const resolveProfileCode = (profileCode?: string): ProfileCode => {
  const normalizedCode = profileCode?.toUpperCase() ?? null;
  return isProfileCode(normalizedCode) ? normalizedCode : getInitialProfileCode();
};

const getProfile = (code: ProfileCode): FaceProfilePrototype => FACE_2_PROTOTYPES[code] ?? FACE_2_PROTOTYPES.ARTC!;

const sentenceParts = (text: string) => {
  const sentences = text.split('。').map((item) => item.trim()).filter(Boolean);
  if (sentences.length <= 1) return { lead: '', highlight: text };
  return {
    lead: `${sentences.slice(0, -1).join('。')}。`,
    highlight: `${sentences.at(-1)}。`,
  };
};

const firstSentence = (text: string) => `${text.split('。').map((item) => item.trim()).find(Boolean) ?? text}。`;

const renderRich = (text: string): React.ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <span key={index} className="editorial-master-highlight text-[#A05F54]">{part.slice(2, -2)}</span>
      : <React.Fragment key={index}>{part}</React.Fragment>,
  );

const renderSceneEmphasis = (text: string, focus: 'opening' | 'ending'): React.ReactNode => {
  if (focus === 'opening') {
    const sentenceEnd = text.indexOf('。');
    const splitAt = sentenceEnd >= 0 ? sentenceEnd + 1 : text.length;

    return (
      <>
        <span className="editorial-scene-emphasis">{text.slice(0, splitAt)}</span>
        {text.slice(splitAt)}
      </>
    );
  }

  const withoutTrailingStop = text.endsWith('。') ? text.slice(0, -1) : text;
  const splitAt = Math.max(
    withoutTrailingStop.lastIndexOf('。'),
    withoutTrailingStop.lastIndexOf('；'),
    withoutTrailingStop.lastIndexOf('，'),
  ) + 1;

  if (splitAt <= 0) return <span className="editorial-scene-emphasis">{text}</span>;

  return (
    <>
      {text.slice(0, splitAt)}
      <span className="editorial-scene-emphasis">{text.slice(splitAt)}</span>
    </>
  );
};

type ShadowSituationCopy = {
  feeling: string;
  reason: string;
  actionTitle: string;
  slogan: string;
  action: string;
};

type ShadowSituation = ShadowSituationCopy & {
  feeling: string;
  neighbor: {
    code: ProfileCode;
    name: string;
    shift: string;
    image: string;
  };
};

const PILD_SHADOW_SITUATIONS: readonly ShadowSituationCopy[] = [
  {
    feeling: '資產很穩，但成長已經跟不上人生目標。',
    reason: '保守讓你先避免犯錯，長期讓你願意慢慢等，分散又降低單一部位帶來的警報。三者疊在一起時，「沒有明顯出事」很容易被當成「現在不必改」。',
    actionTitle: '【啟動成長】',
    slogan: '不必推翻原本的配置，先替未來種下一顆種子。',
    action: '先選一個你願意長期理解的成長題材，只用小比例建立觀察部位。你不是突然變得冒進，而是讓等待有一個正在成長的方向。',
  },
  {
    feeling: '持股理由已經改變，我卻仍憑感覺繼續放著。',
    reason: '保守讓你不想在混亂中做錯，長期讓你願意再等，感性則容易留戀原本相信的故事。三者疊在一起時，「不動」會看起來像最安全的選擇。',
    actionTitle: '【替信任設一條線】',
    slogan: '相信可以繼續，但要先知道什麼證據會讓你改變。',
    action: '先寫下三個會讓持有理由失效的證據，以及每一種情況發生時要減碼多少。真正出現時照紙上的規則做，不必等情緒完全確定。',
  },
  {
    feeling: '市場與需求都變了，我還是遲遲不願調整。',
    reason: '長期讓你不想被短期雜訊干擾，保守讓你不願在不確定時改動。若沒有下一個檢查日期，耐心就容易變成沒有期限的延後。',
    actionTitle: '【破除完美主義】',
    slogan: '不用一次改對，先讓一小部分動起來。',
    action: '先做一個不必一次決定對錯的小調整，例如減少一部分不再符合需求的部位，並替剩下的持股設定下一次檢查日期。',
  },
  {
    feeling: '標的分散太多，連自己買了什麼都說不清。',
    reason: '分散讓你比較安心，感性則容易用產品名稱判斷差異；加上長期持有後不常拆解，重疊風險就可能慢慢累積。',
    actionTitle: '【收回注意力】',
    slogan: '先看懂最大的三個風險，再決定哪些部位值得留下。',
    action: '先把注意力集中在影響組合最大的三個風險來源，再檢查哪些產品其實承受同一種風險。功能重複的部位，不必因為買得久就全部留下。',
  },
];

const SHADOW_REASONS: Record<string, string> = {
  A: '積極讓你快速把握機會；但壓力一高，行動本身會暫時降低不確定感，容易把「我已經做了什麼」誤當成「我已經處理了風險」。',
  P: '保守讓你少犯衝動的錯；但壓力一高，等待會暫時帶來安全感，容易把「還沒決定」誤當成沒有成本。',
  R: '理性讓你的判斷有依據；但壓力一高，更多資料也可能只是延後承認原假設已經改變。',
  I: '感性讓你快速讀懂氣氛；但壓力一高，最鮮明的感受容易被放大，蓋過原本的交易條件。',
  L: '長期讓你不被短期雜訊帶走；但壓力一高，耐心也可能變成沒有期限的等待。',
  T: '短期讓你掌握市場節奏；但壓力一高，頻繁反應容易取代原本想完成的交易計畫。',
  C: '集中讓資金與注意力更有效率；但壓力一高，單一判斷也更容易牽動全部損益與自我認同。',
  D: '分散能降低單一標的的衝擊；但壓力一高，持股數量可能代替真正的風險理解。',
};

const getShadowSituations = (profile: FaceProfilePrototype): ShadowSituation[] => {
  const items = PERSONALITY_EDITORIAL_V2[profile.code]?.discomfort.items ?? [];

  return items.flatMap((item, index) => {
    if (!isProfileCode(item.saviorCode)) return [];
    const neighborEditorial = PERSONALITY_EDITORIAL_V2[item.saviorCode];
    if (!neighborEditorial) return [];

    const trait = profile.code[index] ?? profile.code[0];
    const customCopy = profile.code === 'PILD' ? PILD_SHADOW_SITUATIONS[index] : undefined;

    return [{
      feeling: customCopy?.feeling ?? item.feeling,
      reason: customCopy?.reason ?? SHADOW_REASONS[trait] ?? '原本保護你的習慣，在壓力下被使用過頭，便可能讓判斷失去彈性。',
      actionTitle: customCopy?.actionTitle ?? `【${item.shift.split('→').at(-1)?.replace(/[「」]/g, '').trim() || '換一種做法'}】`,
      slogan: customCopy?.slogan ?? item.advice,
      action: customCopy?.action ?? item.advice,
      neighbor: {
        code: item.saviorCode,
        name: item.saviorName,
        shift: item.shift,
        image: `/images/personalities-v2-square-line/v2-${String(neighborEditorial.index).padStart(2, '0')}-${neighborEditorial.slug}-square-line.png`,
      },
    }];
  });
};

const formatNeighborShift = (shift: string) => shift.replace(/^從/, '將').replace('→', '變成');

const dimensionCopy: Record<string, string> = {
  A: '你通常願意主動創造機會，在可承受風險內用行動換取上行。',
  P: '你通常先保留調整空間，確認風險可承受後才提高參與。',
  R: '你傾向用可核對的資料與條件，讓判斷能被重複檢查。',
  I: '你傾向從節奏、情境與市場氣氛中，形成整體判斷。',
  L: '你較願意讓邏輯走完較長週期，不因短期價格頻繁改變結論。',
  T: '你較重視眼前節奏與事件窗口，會依行情分段進退。',
  C: '你會把資金與注意力集中在少數高信念機會。',
  D: '你會把風險分散在多個來源，避免單一判斷決定全局。',
};

const getDecisionAction = (profile: FaceProfilePrototype) => {
  const evidence = profile.code[1] === 'R'
    ? '把進場證據與失效條件各寫成一句話'
    : '把盤感翻成一個能被觀察與否證的條件';
  const timing = profile.code[2] === 'L'
    ? '設定下一次複查時間，不在盤中反覆重寫長期假設'
    : '進場前先寫下這一段行情的離場與失效位置';
  const exposure = profile.code[3] === 'C'
    ? '確認單一判斷失效時的最大損失仍在上限內'
    : '檢查不同部位是否其實承受同一種風險';
  return `${evidence}；${timing}；${exposure}。`;
};

const getTalentPsychology = (profile: FaceProfilePrototype) => {
  const evidence = profile.code[1] === 'R'
    ? '你的優勢來自把資訊轉成可核對的條件；但資料超過決策容量後，更多分析可能降低辨識力。'
    : '你的優勢來自快速整合分散訊號；但情緒提高時，最近、最鮮明的訊號容易被不成比例地放大。';
  const exposure = profile.code[3] === 'C'
    ? '集中能提高注意力，也會讓單一判斷更容易牽動自我認同。'
    : '分散能降低單點風險，標的過多時卻可能形成分散錯覺與注意力稀釋。';
  return `${evidence}${exposure}`;
};

const getInterruptAction = (profile: FaceProfilePrototype, text: string) => {
  if (/虧損|停損|賺回|追回|回本|成本/.test(text)) return '把上一筆視為已結束；下一筆必須重新寫出進場理由、失效點與風險上限。';
  if (/錯過|踏空|追高|追進|熱門|落後|上車|噴/.test(text)) return '錯過原位置後重新計算風險報酬；不能沿用行情發動前的判斷。';
  if (/加碼|重倉|部位|集中|攤平/.test(text)) return profile.code[3] === 'C'
    ? '先換算整體部位在同一情境失效時會損失多少；超過上限就不加碼。'
    : '先檢查部位之間的相關性；若風險來源相同，就把它視為同一筆交易。';
  if (/等待|確定|研究|觀望|現金|安全|不敢|延後/.test(text)) return '設定最低資訊門檻與決策截止時間；到點只做進、減或留空，不再無限延後。';
  if (/群組|老師|大家|消息|新聞|主流|共識/.test(text)) return '把外部說法改寫成一個可驗證條件；沒有辦法改寫，就不讓它直接成為下單理由。';
  if (/規則|模型|參數|系統|完美/.test(text)) return '規則只在收盤後調整；盤中先照原版執行，避免用情緒替結果補參數。';
  if (/很久沒看|忘記|擱置|自動投入|放著不管/.test(text)) return '設定固定複查日，只檢查目標、風險與原假設是否改變，不用因此增加盯盤頻率。';
  if (/沒有問題|一切正常|太平|警覺下降|沒有異常/.test(text)) return '即使近期平穩，也照表完成一次壓力情境與風險上限檢查；制度不能等出事才恢復。';
  return profile.code[1] === 'R'
    ? '回到原先寫下的證據與失效條件，只處理真正改變判斷的新資訊。'
    : '先把當下感受寫成一句話，再補上一個能觀察、能否證的盤面條件。';
};

const PILD_TRIGGER_SUMMARIES = [
  '太久沒看持股及帳戶損益，打開後又難以下手。',
  '平常很少受短期波動影響，但市場突然大跌時，累積的帳面損失一次湧進來，原本的平靜也跟著失效。',
  '自動投入多年後，收入、家庭或用錢時間已經改變，原本穩定的配置卻仍在服務過去的需求。',
] as const;

const PILD_TRIGGER_ANALOGIES = [
  '就像每天回家洗澡時順手清潔廁所，不讓髒污因時間拖長變得難以處理。',
  '就像平時先準備好防災包，真正停電時才不必一邊害怕，一邊臨時決定要帶走什麼。',
  '就像目的地已經改變，就要重新設定導航；繼續沿著熟悉的路走，只會穩定地離新目的地更遠。',
] as const;

const PILD_TRIGGER_RESOLUTIONS = [
  '設定固定複查日，只檢查目標、風險與原假設是否改變，不用因此增加盯盤頻率。「之後再看」若沒有日期，通常不會自行發生。',
  '先把當下感受寫成一句話，再補上一個能觀察、能否證的盤面條件。平時先定義可承受的最壞情境，真正發生時才不需要臨時認識自己。',
  '重新核對現在的人生目標、用錢時間與配置比例，只調整已不再服務新需求的部分。自動化應減少重複決策，不應取消人生更新。',
] as const;

const getTriggerSummary = (
  profile: FaceProfilePrototype,
  trigger: FaceProfilePrototype['triggers'][number],
  index: number,
) => {
  if (profile.code === 'PILD') return PILD_TRIGGER_SUMMARIES[index] ?? trigger.event;
  return `${trigger.event} ${trigger.behavior} ${trigger.consequence}`.replace(/\s+/g, ' ').trim();
};

const getTriggerAnalogy = (
  profile: FaceProfilePrototype,
  trigger: FaceProfilePrototype['triggers'][number],
  index: number,
) => {
  if (profile.code === 'PILD') return PILD_TRIGGER_ANALOGIES[index] ?? PILD_TRIGGER_ANALOGIES[0];

  const text = `${trigger.title}${trigger.event}${trigger.behavior}${trigger.consequence}`;
  if (/很久沒看|忘記|擱置|自動投入|放著不管/.test(text)) return '就像每天順手整理桌面，比堆到找不到東西時再一次大掃除，更省力也更容易持續。';
  if (/目標|收入|家庭|生活|需求|用途/.test(text)) return '就像目的地改變後重新設定導航；原本的路沒有錯，只是已經不再通往現在想去的地方。';
  if (/虧損|大跌|停損|回本|反轉/.test(text)) return '就像平時先準備好防災包，真正遇到停電時，才不必在最慌亂的時候決定要帶走什麼。';
  if (/錯過|踏空|追高|熱門|上車/.test(text)) return '就像錯過一班車後先看下一班的時間，而不是沿著車道追趕已經離站的車。';
  if (/群組|老師|大家|消息|新聞|共識/.test(text)) return '就像朋友推薦餐廳仍要先看自己能不能吃；別人的喜歡可以參考，不能替你承擔結果。';
  if (/集中|重押|全倉|單一|部位/.test(text)) return '就像不把所有重要文件放在同一個袋子裡；一個意外，不該同時拿走所有選擇。';
  if (/頻繁|盯盤|短線|一直換|進出/.test(text)) return '就像一直打開烤箱查看，反而讓溫度流失；有些結果需要在設定時間後再檢查。';
  if (/規則|模型|系統|參數|數據/.test(text)) return '就像導航能提供路線，但前方道路施工時，仍要看現場而不是只盯著原本的地圖。';
  return '就像開車時固定看後照鏡，而不是等到偏離車道後才一次大幅修正。';
};

const getTriggerResolution = (
  profile: FaceProfilePrototype,
  trigger: FaceProfilePrototype['triggers'][number],
  index: number,
) => {
  if (profile.code === 'PILD') return PILD_TRIGGER_RESOLUTIONS[index] ?? PILD_TRIGGER_RESOLUTIONS[0];
  return `${getInterruptAction(profile, `${trigger.title}${trigger.event}${trigger.emotion}${trigger.behavior}`)} ${trigger.watchFor}`;
};

const chapterMeta = [
  { id: 'face-core', number: '01', title: '你的 FACE', description: '先看懂，你在市場裡習慣怎麼做決定。' },
  { id: 'two-mirrors', number: '02', title: '以銅為鏡，可以正衣冠', description: '別人看見的表現，和你心裡真正重視的東西。' },
  { id: 'talent', number: '03', title: '你的交易天賦', description: '你不必勉強，就比較容易做好的事情。' },
  { id: 'talent-shadow', number: '04', title: '以人為鏡，可以明得失', description: '優勢沒有消失，只是在壓力下被使用過頭。' },
  { id: 'triggers', number: '05', title: '你的失控觸發器', description: '市場如何從情緒開始，一步步改變你的行為。' },
  { id: 'reflection', number: '06', title: '以史為鏡，可以知興替', description: '回看走過的交易，理解自己真正被什麼推動。' },
  { id: 'daily', number: '07', title: '深度自我覺察', description: '看見情緒正在發生，才不會讓它替你下決策。' },
] as const;

const reflectionPrompts = [
  '過去的哪一筆交易令你最印象深刻？',
  '你最近一次破壞紀律時，你真正受不了的是虧損、錯過，還是承認自己判斷錯？',
  '如果你已經不缺錢，你還會用現在這種方式交易嗎？',
] as const;

const ChapterHeader: React.FC<{ chapter: (typeof chapterMeta)[number] }> = ({ chapter }) => (
  <header className="editorial-chapter-header mb-8 md:mb-11">
    <p className="editorial-kicker font-mono text-[13px] tracking-[0.14em] text-[#A36F63] md:text-sm">CHAPTER {chapter.number}</p>
    <h2 className="editorial-chapter-title serif mt-4 text-[2rem] font-normal leading-[1.45] tracking-[0.01em] text-[#2F2925] md:text-[2.4rem]">{chapter.title}</h2>
    <p className="editorial-chapter-deck serif mt-3 text-[1.18rem] font-normal leading-[1.9] text-[#8F5F56] md:text-[1.35rem]">{chapter.description}</p>
  </header>
);

const SectionShell: React.FC<{
  chapter: (typeof chapterMeta)[number];
  children: React.ReactNode;
  tinted?: boolean;
}> = ({ chapter, children, tinted = false }) => (
  <section id={chapter.id} className={`editorial-section border-x border-b border-[#D9CFC2] px-5 py-12 sm:px-8 md:px-14 md:py-20 ${tinted ? 'bg-[#F7F2EC]' : 'bg-[#FFFEFC]'}`}>
    <ChapterHeader chapter={chapter} />
    {children}
  </section>
);

const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`editorial-body editorial-body-m serif space-y-5 text-[1.05rem] font-normal leading-[2.1] tracking-[0.01em] text-[#554C45] md:text-[1.1rem] ${className}`}>{children}</div>
);

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[#A05F54]">{children}</span>
);

const Takeaway: React.FC<{
  label?: string;
  children: React.ReactNode;
  action?: string;
  link?: { href: string; label: string };
}> = ({ label = 'FACE Tips', children, action, link }) => (
  <aside className="editorial-takeaway mt-9 border border-[#CDBCAF] bg-[#F4EBE4] px-5 py-6 md:px-8 md:py-8">
    <p className="editorial-kicker text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">{label}</p>
    <p className="editorial-takeaway-text serif mt-4 text-[1.25rem] font-normal leading-[1.85] text-[#413631] md:text-[1.45rem]">{children}</p>
    {action && (
      <p className="editorial-body-s editorial-supporting serif mt-5 border-t border-[#D8C8BB] pt-5 text-[1rem] font-normal leading-8 text-[#79584D]">
        <span className="mr-2 inline-flex items-center gap-1.5 text-[1.02rem] text-[#A05F54]">
          <Lightbulb size={17} strokeWidth={1.45} aria-hidden="true" />
          試試看：
        </span>
        {action}
      </p>
    )}
    {link && <div className="mt-5 flex justify-end"><a href={link.href} className="editorial-button editorial-action text-[13px] tracking-[0.04em] text-[#79584D] underline decoration-[#A36F63]/45 underline-offset-4 transition-colors hover:text-[#A05F54]">{link.label}</a></div>}
  </aside>
);

const MinorLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="editorial-kicker text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">{children}</p>
);

const EditorialFigure: React.FC<{
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}> = ({ src, alt, className = '', imageClassName = '' }) => (
  <figure className={`overflow-hidden border border-[#D8CDBD] bg-[#F3E8D5] ${className}`}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`block w-full ${imageClassName || 'h-auto'}`}
    />
  </figure>
);

type ImageSide = 'left' | 'right';

const getEditorialGridClass = (copy: string, imageSide: ImageSide = 'left') => {
  const copyLength = copy.replace(/\s/g, '').length;

  if (copyLength >= 260) {
    return imageSide === 'left'
      ? 'md:grid-cols-[0.82fr_1.18fr]'
      : 'md:grid-cols-[1.18fr_0.82fr]';
  }

  if (copyLength <= 150) {
    return imageSide === 'left'
      ? 'md:grid-cols-[1.12fr_0.88fr]'
      : 'md:grid-cols-[0.88fr_1.12fr]';
  }

  return 'md:grid-cols-2';
};

const getEditorialLayout = (
  copy: string,
  placement: EditorialPlacement = 'adaptive-left',
) => {
  const isBanner = placement === 'banner';
  const isPortrait = placement === 'portrait-left';
  const isCinematic = placement === 'cinematic';
  const imageSide: ImageSide = placement === 'adaptive-right' ? 'right' : 'left';

  return {
    grid: isBanner || isCinematic
      ? 'grid'
      : isPortrait
        ? 'grid md:grid-cols-[0.72fr_1.28fr] md:items-stretch'
        : `grid md:items-stretch ${getEditorialGridClass(copy, imageSide)}`,
    figure: isBanner || isCinematic
      ? 'border-0 border-b border-[#D8CDBD]'
      : imageSide === 'left'
        ? 'border-0 border-b border-[#D8CDBD] md:border-b-0 md:border-r'
        : 'border-0 border-b border-[#D8CDBD] md:order-2 md:border-b-0 md:border-l',
    image: isCinematic
      ? 'aspect-[21/9] h-full object-cover object-[center_46%]'
      : isBanner
        ? 'h-auto'
        : isPortrait
          ? 'aspect-[16/10] h-full object-cover object-[center_30%] md:aspect-[4/5] md:max-h-[34rem] md:object-center'
          : 'h-auto md:h-full md:object-cover',
  };
};

interface ReadingLayerPrototypeProps {
  profileCode?: string;
  showPrototypeControls?: boolean;
  isUserType?: boolean;
  onBack?: () => void;
  onShareResult?: () => void;
  onViewGallery?: () => void;
  compact?: boolean;
  resultVisualization?: {
    pairs: ReadonlyArray<{
      label: string;
      l1Name: string;
      l2Name: string;
      v1: number;
      v2: number;
    }>;
    radarData: ReadonlyArray<{
      subject: string;
      base: number;
      current: number;
    }>;
    showCurrent?: boolean;
  };
}

export const ReadingLayerPrototype: React.FC<ReadingLayerPrototypeProps> = ({
  profileCode,
  showPrototypeControls = true,
  isUserType = false,
  onBack,
  onShareResult,
  onViewGallery,
  compact = false,
  resultVisualization,
}) => {
  const [selectedCode, setSelectedCode] = React.useState<ProfileCode>(() => resolveProfileCode(profileCode));
  const [openShadowSituation, setOpenShadowSituation] = React.useState<number | null>(null);
  const profile = getProfile(selectedCode);
  const hallProfile = FACE_MAP[selectedCode];
  const editorialProfile = PERSONALITY_EDITORIAL_V2[selectedCode];
  const profileLineArt = editorialProfile
    ? `/images/personalities-v2-square-line/v2-${String(editorialProfile.index).padStart(2, '0')}-${editorialProfile.slug}-square-line.png`
    : coverByCode[selectedCode];
  const masterPortrait = MASTER_PORTRAIT_BY_CODE[selectedCode];
  const editorialImages = editorialImagesByCode[selectedCode];
  const coreCopy = sentenceParts(profile.coreDescription);
  const faceEditorialCopy = `${profile.traits.join('')}${dimensionCopy[profile.code[0]]}${dimensionCopy[profile.code[1]]}${dimensionCopy[profile.code[2]]}${dimensionCopy[profile.code[3]]}`;
  const mirrorEditorialCopy = `${profile.outsideView}${profile.insideVoice}`;
  const talentEditorialCopy = `${profile.talent.headline}${profile.talent.body.join('')}`;
  const faceLayout = getEditorialLayout(faceEditorialCopy, editorialImages.layouts?.face);
  const mirrorLayout = getEditorialLayout(mirrorEditorialCopy, editorialImages.layouts?.mirrors);
  const talentLayout = getEditorialLayout(talentEditorialCopy, editorialImages.layouts?.talent ?? 'adaptive-right');
  const shadowSituations = getShadowSituations(profile);
  const faceSummary = selectedCode === 'ARLC'
    ? '你通常願意主動創造機會，用可核對的資料形成判斷，讓長期邏輯走完，再把資金與注意力集中在少數高信念機會。'
    : `${dimensionCopy[profile.code[0]]} ${dimensionCopy[profile.code[1]]} ${dimensionCopy[profile.code[2]]} ${dimensionCopy[profile.code[3]]}`;
  const radarVisualId = React.useId().replace(/:/g, '');
  const radarOuterMaskId = `face-radar-outer-mask-${radarVisualId}`;
  const radarOuterClipId = `face-radar-outer-clip-${radarVisualId}`;
  const radarSelectionMaskId = `face-radar-selection-mask-${radarVisualId}`;

  const handleProfileChange = (code: ProfileCode) => {
    setSelectedCode(code);
    setOpenShadowSituation(null);
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('type', code);
      window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const normalizedCode = profileCode?.toUpperCase() ?? null;
    if (!isProfileCode(normalizedCode)) return;
    setSelectedCode(normalizedCode);
    setOpenShadowSituation(null);
  }, [profileCode]);

  return (
    <>
      {showPrototypeControls && <aside className="mx-auto mb-4 max-w-4xl border border-dashed border-[#B9A992] bg-[#FBFAF7] px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">原型審稿工具</p>
          <p className="serif mt-1 text-[1rem] font-normal leading-7 text-[#5F574F]">切換 16 型，檢查封面與內容。正式結果頁不會顯示這個選單。</p>
        </div>
        <label className="mt-3 block sm:mt-0 sm:min-w-[15rem]">
          <span className="sr-only">選擇交易人格</span>
          <select
            value={selectedCode}
            onChange={(event) => handleProfileChange(event.target.value as ProfileCode)}
            className="serif w-full border border-[#CDBCAF] bg-white px-4 py-3 text-[1rem] font-normal text-[#413631] outline-none focus:border-[#9A655C]"
          >
            {PROFILE_CODES.map((code) => {
              const optionProfile = getProfile(code);
              return <option key={code} value={code}>{code} · {optionProfile.name}</option>;
            })}
          </select>
        </label>
      </aside>}

      {!showPrototypeControls && onBack && (
        <div className="mx-auto mb-4 max-w-4xl">
          <button type="button" onClick={onBack} className="editorial-button text-[#70665D] transition-colors hover:text-[#2D2D2D]">
            ← 返回 16 型交易人格圖鑑
          </button>
        </div>
      )}

      <article className={`reading-editorial reading-editorial--pilot reading-editorial--approved-body mx-auto max-w-4xl fade-in ${compact ? 'pb-12' : 'pb-28'}`} key={selectedCode}>
      {!compact && <header className="relative overflow-hidden border border-[#CFC6B8] bg-[#F4EEE7]">
        {isUserType && (
          <p className="editorial-button absolute left-4 top-4 z-10 border border-white/55 bg-[#79584D]/90 px-3 py-2 text-white shadow-sm backdrop-blur-sm md:left-6 md:top-6">
            這是你的交易人格
          </p>
        )}
        <img
          src={coverByCode[selectedCode]}
          alt={`${profile.name} ${profile.code}：${profile.traits.join('、')}。`}
          className="block h-auto w-full"
        />

        <div className="px-5 py-10 sm:px-9 md:px-14 md:py-14">
          <p className="editorial-lead serif mt-5 text-[1.4rem] font-normal leading-[1.9] tracking-[0.01em] text-[#3B312C] md:text-[1.75rem]">
            {coreCopy.lead}<Highlight>{coreCopy.highlight}</Highlight>
          </p>

          <div className="mt-8 border-l-2 border-[#A36F63] pl-5 md:mt-10 md:pl-7">
            <p className="editorial-kicker text-[13px] tracking-[0.12em] text-[#9A655C] md:text-sm">座右銘</p>
            <p className="editorial-subhead serif mt-3 text-[1.12rem] font-normal leading-[1.95] text-[#5A4740] md:text-[1.28rem]">「{hallProfile.motto}」</p>
          </div>

          {resultVisualization ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {onShareResult && (
                <button
                  type="button"
                  onClick={onShareResult}
                  className="editorial-button inline-flex min-h-12 items-center justify-center gap-2 bg-[#8C635B] px-6 py-3 text-[14px] tracking-[0.06em] text-white transition-colors hover:bg-[#754F48]"
                >
                  <Share2 size={17} strokeWidth={1.7} aria-hidden="true" />
                  分享結果
                </button>
              )}
              <button
                type="button"
                onClick={() => document.getElementById('face-core')?.scrollIntoView({ behavior: 'smooth' })}
                className="editorial-button inline-flex min-h-12 items-center justify-center gap-2 border border-[#8C635B] bg-white/45 px-6 py-3 text-[14px] tracking-[0.06em] text-[#79584D] transition-colors hover:bg-white"
              >
                繼續閱讀 <ArrowDown size={16} aria-hidden="true" />
              </button>
              {onViewGallery && (
                <button
                  type="button"
                  onClick={onViewGallery}
                  className="editorial-button inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-[14px] tracking-[0.06em] text-[#6E625A] transition-colors hover:text-[#2D2D2D]"
                >
                  <BookOpen size={17} strokeWidth={1.7} aria-hidden="true" />
                  查看圖鑑
                </button>
              )}
            </div>
          ) : (
            <button type="button" onClick={() => document.getElementById('face-core')?.scrollIntoView({ behavior: 'smooth' })} className="editorial-button editorial-action mt-8 inline-flex items-center gap-2 text-sm text-[#79584D]">
              開始閱讀 <ArrowDown size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>}

      <main className={compact ? 'mt-0' : 'mt-4'}>
        <SectionShell chapter={chapterMeta[0]}>
          <div className={`overflow-hidden border border-[#D8CDBD] bg-white ${resultVisualization ? 'md:grid md:grid-cols-[1.08fr_0.92fr]' : faceLayout.grid}`}>
            {resultVisualization ? (
                <figure className="relative aspect-[4/5] w-full overflow-hidden border-b border-[#D8CDBD] bg-[#F5EFE7] md:border-b-0 md:border-r">
                  <img
                    src={editorialImages.face}
                    alt={`${profile.name}完整彩色交易人格肖像`}
                    className="h-full w-full object-contain object-center saturate-[1.12] contrast-[0.98]"
                  />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_44%,rgba(247,242,236,0.28)_100%)]" aria-hidden="true" />
                  <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={resultVisualization.radarData.map((item) => ({ ...item, outer: 100 }))}
                        outerRadius="73%"
                        margin={{ top: 34, right: 36, bottom: 34, left: 36 }}
                      >
                        <Radar
                          dataKey="outer"
                          shape={(shapeProps: any) => {
                            const points = shapeProps.points ?? [];
                            const centerX = points.length > 0
                              ? points.reduce((sum: number, point: { x: number }) => sum + point.x, 0) / points.length
                              : 0;
                            const centerY = points.length > 0
                              ? points.reduce((sum: number, point: { y: number }) => sum + point.y, 0) / points.length
                              : 0;
                            const radius = points.length > 0
                              ? Math.hypot(points[0].x - centerX, points[0].y - centerY)
                              : 0;
                            return (
                              <g>
                                <defs>
                                  <mask id={radarOuterMaskId}>
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    <circle cx={centerX} cy={centerY} r={radius} fill="black" />
                                  </mask>
                                  <clipPath id={radarOuterClipId}>
                                    <circle cx={centerX} cy={centerY} r={radius} />
                                  </clipPath>
                                </defs>
                                <rect
                                  x="0"
                                  y="0"
                                  width="100%"
                                  height="100%"
                                  fill="#FFFEFC"
                                  fillOpacity="0.72"
                                  mask={`url(#${radarOuterMaskId})`}
                                />
                              </g>
                            );
                          }}
                        />
                        <Radar
                          dataKey="base"
                          shape={(shapeProps: any) => {
                            const points = shapeProps.points ?? [];
                            const polygonPoints = points.map((point: { x: number; y: number }) => `${point.x},${point.y}`).join(' ');
                            return (
                              <g>
                                <defs>
                                  <mask id={radarSelectionMaskId}>
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    <polygon points={polygonPoints} fill="black" />
                                  </mask>
                                </defs>
                                <rect
                                  x="0"
                                  y="0"
                                  width="100%"
                                  height="100%"
                                  fill="#FFFEFC"
                                  fillOpacity="0.42"
                                  clipPath={`url(#${radarOuterClipId})`}
                                  mask={`url(#${radarSelectionMaskId})`}
                                />
                                <polygon points={polygonPoints} fill="none" stroke="#2D2D2D" strokeWidth="1.3" />
                              </g>
                            );
                          }}
                        />
                        {resultVisualization.showCurrent && <Radar dataKey="current" stroke="#8C635B" strokeWidth={1.6} fill="#8C635B" fillOpacity={0.08} />}
                        <PolarGrid gridType="circle" stroke="#514942" strokeOpacity={0.34} strokeDasharray="4 5" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{
                            fontSize: 11,
                            fontWeight: 500,
                            fill: '#3F3833',
                            stroke: '#F7F2EC',
                            strokeWidth: 3,
                            paintOrder: 'stroke',
                            fontFamily: 'Noto Sans TC',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <figcaption className="sr-only">{profile.name}彩色肖像與 FACE 八向雷達線框</figcaption>
                </figure>
            ) : (
              <EditorialFigure
                src={editorialImages.face}
                alt={`${profile.name}觀察市場，將訊號、風險與行動連成自己的決策路徑。`}
                className={faceLayout.figure}
                imageClassName={faceLayout.image}
              />
            )}
            <div className={`flex flex-col justify-center px-5 ${resultVisualization ? 'py-6 md:px-7 md:py-7' : 'py-7 md:px-8 md:py-9'}`}>
              <MinorLabel>決策視角</MinorLabel>
              {resultVisualization ? (
                <div className="mt-4 divide-y divide-[#D9CFC2] border border-[#D9CFC2] bg-[#FBF8F4]">
                  {resultVisualization.pairs.map((pair) => (
                    <div key={pair.label} className="px-4 py-2.5 md:py-3">
                      <p className="editorial-caption text-[#9A655C]">{pair.label}</p>
                      <div className="mt-1.5 flex items-end justify-between gap-5">
                        <div className="min-w-0">
                          <p className="editorial-body-xs text-[#756A61]">{pair.l1Name}</p>
                          <p className={`serif mt-0.5 text-[1.25rem] leading-none ${pair.v1 >= pair.v2 ? 'text-[#3C332E]' : 'text-[#B7ACA2]'}`}>{pair.v1}%</p>
                        </div>
                        <div className="min-w-0 text-right">
                          <p className="editorial-body-xs text-[#756A61]">{pair.l2Name}</p>
                          <p className={`serif mt-0.5 text-[1.25rem] leading-none ${pair.v2 > pair.v1 ? 'text-[#3C332E]' : 'text-[#B7ACA2]'}`}>{pair.v2}%</p>
                        </div>
                      </div>
                      <div className="mt-2 flex h-1 overflow-hidden bg-[#E4DDD4]" aria-hidden="true">
                        <span className="h-full" style={{ width: `${pair.v1}%`, backgroundColor: pair.v1 >= pair.v2 ? '#3E3B38' : '#BDB7AE' }} />
                        <span className="h-full" style={{ width: `${pair.v2}%`, backgroundColor: pair.v2 > pair.v1 ? '#3E3B38' : '#BDB7AE' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-px border border-[#D9CFC2] bg-[#D9CFC2]">
                  {profile.traits.map((trait, index) => (
                    <div key={trait} className="flex items-center gap-3 bg-[#FBF8F4] px-3 py-3.5">
                      <span className="editorial-caption font-mono text-[12px] text-[#A36F63]">{profile.code[index]}</span>
                      <p className="serif text-[0.98rem] font-normal text-[#413934]">{trait}</p>
                    </div>
                  ))}
                </div>
              )}
              {!resultVisualization && <BodyText className="mt-6">
                <p>{faceSummary}</p>
              </BodyText>}
            </div>
          </div>
          {resultVisualization && (
            <div className="-mt-px border border-[#D8CDBD] bg-[#FFFEFC] px-5 py-6 md:px-8">
              <BodyText><p>{faceSummary}</p></BodyText>
            </div>
          )}
          <Takeaway action={getDecisionAction(profile)}>
            你的決策路徑通常是：先用<Highlight>{profile.traits[1]}</Highlight>形成判斷，以<Highlight>{profile.traits[2]}</Highlight>掌握節奏，再用<Highlight>{profile.traits[3]}</Highlight>配置風險。
          </Takeaway>

          {editorialProfile?.master && (
            <details className="editorial-master-card group mt-9 overflow-hidden border border-[#CDBCAF] bg-[#FFFEFC]">
              <summary className="flex cursor-pointer list-none flex-col items-stretch gap-4 px-5 py-5 outline-none marker:content-none focus-visible:bg-[#F7F2EC] [&::-webkit-details-marker]:hidden sm:flex-row sm:items-center sm:justify-between sm:gap-5 md:px-7">
                <div>
                  <p className="editorial-master-kicker editorial-kicker text-[13px] tracking-[0.11em] text-[#9A655C]">FACE Legend</p>
                  <p className="editorial-subhead serif mt-2 text-[1.18rem] font-normal leading-8 text-[#3C332E]">看看哪位傳奇操盤手，也有相似的思考方式</p>
                </div>
                <span className="editorial-master-action editorial-button editorial-action flex shrink-0 items-center gap-2 self-end text-[13px] tracking-[0.05em] text-[#79584D] sm:self-auto">
                  <span className="group-open:hidden">展開介紹</span>
                  <span className="hidden group-open:inline">收起介紹</span>
                  <ChevronDown size={18} strokeWidth={1.35} className="transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                </span>
              </summary>
              <div className="editorial-master-divider grid gap-0 border-t border-[#D8CDBD] sm:grid-cols-[11rem_1fr]">
                <figure className="overflow-hidden bg-[#F4EEE7]">
                  <img src={masterPortrait} alt={editorialProfile.master.name} className="aspect-[16/9] h-full w-full object-cover sm:aspect-square" />
                </figure>
                <div className="editorial-master-divider border-t border-[#D8CDBD] px-5 py-6 sm:border-l sm:border-t-0 md:px-7 md:py-7">
                  <p className="editorial-master-name editorial-subhead serif text-[1.35rem] font-normal leading-[1.6] text-[#3C332E]">{editorialProfile.master.name}</p>
                  <p className="editorial-body-m editorial-supporting serif mt-3 text-[1rem] font-normal leading-8 text-[#5F574F]">{renderRich(editorialProfile.master.body)}</p>
                </div>
              </div>
            </details>
          )}
        </SectionShell>

        <SectionShell chapter={chapterMeta[1]} tinted>
          <div className={`overflow-hidden border border-[#D8CDBD] bg-white ${mirrorLayout.grid}`}>
            <EditorialFigure
              src={editorialImages.mirrors}
              alt={`${profile.name}在鏡前，看見外在表現與內在判斷的兩種樣子。`}
              className={mirrorLayout.figure}
              imageClassName={mirrorLayout.image}
            />
            <div className="divide-y divide-[#D8CDBD]">
              <article className="bg-white p-6 md:p-8">
                <div className="flex items-center gap-3"><Eye size={18} strokeWidth={1.4} className="text-[#9A655C]" /><MinorLabel>鏡子外｜別人眼中的你</MinorLabel></div>
                <BodyText className="mt-4"><p>{profile.outsideView}</p></BodyText>
              </article>
              <article className="bg-[#4A3A33] p-6 text-white md:p-8">
                <div className="flex items-center gap-3">
                  <EyeClosed size={18} strokeWidth={1.35} className="text-white/75" aria-hidden="true" />
                  <p className="editorial-kicker editorial-kicker--inverse text-[13px] tracking-[0.1em] text-white/65 md:text-sm">鏡子裡｜你眼中的自己</p>
                </div>
                <p className="editorial-subhead editorial-dark-copy serif mt-4 text-[1.18rem] font-normal leading-[2] text-white/90">「{profile.insideVoice}」</p>
              </article>
            </div>
          </div>
          <Takeaway>
            外在表現與內在動機不是矛盾。你真正想守住的是：<Highlight>{firstSentence(profile.insideVoice)}</Highlight>
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[2]}>
          <div className={`overflow-hidden border border-[#D8CDBD] bg-white ${talentLayout.grid}`}>
            <EditorialFigure
              src={editorialImages.talent}
              alt={`${profile.name}整理市場資料，將雜訊收斂成訊號、風險與行動。`}
              className={talentLayout.figure}
              imageClassName={talentLayout.image}
            />
            <div className="flex flex-col justify-center px-5 py-7 md:px-8 md:py-9">
              <MinorLabel>投資心理視角 · 資訊處理與風險感受</MinorLabel>
              <p className="editorial-subhead serif mt-4 text-[1.35rem] font-normal leading-[1.85] text-[#A05F54] md:text-[1.55rem]">{profile.talent.headline}</p>
              <BodyText className="mt-5"><p>{getTalentPsychology(profile)}</p></BodyText>
            </div>
          </div>
          <Takeaway action={getDecisionAction(profile)}>
            當<Highlight>{profile.talent.conditions[0]}</Highlight>時，你的天賦最容易發揮；條件消失時，降低出手頻率也是能力的一部分。
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[3]} tinted>
          <div>
            <h3 className="editorial-subhead serif text-[1.45rem] font-normal leading-[1.7] text-[#3C332E] md:text-[1.65rem]">你是否曾經遇過以下狀況？</h3>
            <p className="editorial-body-s editorial-supporting serif mt-2 text-[1rem] font-normal leading-8 text-[#756A61]">點開最有感的情境，看看哪位鄰居能借你一種不同的思考方式。</p>
          </div>

          <div className="mt-7 space-y-4">
            {shadowSituations.map((situation, index) => {
              const open = openShadowSituation === index;
              const answerId = `shadow-answer-${profile.code}-${index}`;
              const imageOnRight = index % 2 === 1;
              const flipImageTowardCopy = selectedCode === 'PILD' && situation.neighbor.code === 'PRLD';

              return (
                <article
                  key={`${profile.code}-${situation.feeling}`}
                  className={`overflow-hidden border bg-white transition-colors ${open ? 'border-[#A36F63] shadow-[0_12px_36px_rgba(83,63,51,0.08)]' : 'border-[#D8CDBD]'}`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenShadowSituation((current) => current === index ? null : index)}
                    className={`editorial-situation-trigger flex w-full items-center gap-4 px-5 py-5 text-left transition-colors md:px-7 md:py-6 ${open ? 'bg-[#F4EBE4]' : 'bg-white hover:bg-[#FAF7F3]'}`}
                  >
                    <span className="editorial-kicker font-mono shrink-0 text-[12px] tracking-[0.12em] text-[#A36F63]">狀況 0{index + 1}</span>
                    <span className="editorial-situation-title editorial-subhead serif min-w-0 flex-1 text-[1.1rem] font-normal leading-[1.65] text-[#3C332E] md:text-[1.22rem]">{situation.feeling}</span>
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className={`editorial-situation-chevron shrink-0 text-[#8F5F56] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {open && (
                    <div id={answerId} className="fade-in border-t border-[#D8CDBD] bg-[#FBF7F1]" aria-live="polite">
                      <div className={`relative overflow-hidden md:grid md:min-h-[31rem] ${imageOnRight ? 'md:grid-cols-[1.14fr_0.86fr]' : 'md:grid-cols-[0.86fr_1.14fr]'}`}>
                        <figure className={`relative h-[19rem] overflow-hidden bg-[#EADAC9] md:h-full md:min-h-[31rem] ${imageOnRight ? 'md:order-2' : ''}`}>
                          <img
                            src={situation.neighbor.image}
                            alt={`${situation.neighbor.name}黑白線稿`}
                            className={`absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply ${flipImageTowardCopy ? '-scale-x-100' : ''}`}
                            loading="lazy"
                            decoding="async"
                          />
                          <span
                            aria-hidden="true"
                            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FBF7F1] ${imageOnRight ? 'md:bg-gradient-to-r md:from-[#FBF7F1] md:via-[#FBF7F1]/10 md:to-transparent' : 'md:bg-gradient-to-r md:from-transparent md:via-[#FBF7F1]/10 md:to-[#FBF7F1]'}`}
                          />
                        </figure>

                        <div className={`serif relative -mt-10 px-5 pb-7 pt-4 text-[1rem] font-normal leading-8 text-[#5B524B] md:mt-0 md:flex md:flex-col md:justify-center md:px-8 md:py-10 ${imageOnRight ? 'md:order-1 md:-mr-12 md:pl-10 md:pr-12' : 'md:-ml-12 md:pl-12 md:pr-10'}`}>
                          <h3 className="editorial-subhead font-normal leading-[1.65] text-[#342D29]">
                            <span className="block text-[1.38rem] md:text-[1.62rem]">學習{situation.neighbor.name}</span>
                            <span className="mt-1 block text-[1.08rem] leading-[1.75] text-[#9A655C] md:text-[1.18rem]">{formatNeighborShift(situation.neighbor.shift)}</span>
                          </h3>

                          <section>
                            <p className="editorial-kicker mt-6 text-[13px] tracking-[0.09em] text-[#A05F54]">你為什麼會卡住</p>
                            <p className="editorial-body-m mt-2">{situation.reason}</p>
                          </section>

                          <section className="mt-6 border-l-2 border-[#A36F63] bg-[#F8F3ED] px-4 py-4 md:px-5">
                            <p className="editorial-kicker text-[13px] tracking-[0.09em] text-[#A05F54]">{situation.actionTitle}</p>
                            <p className="editorial-body-l mt-2 text-[1.16rem] leading-8 text-[#443A35]">{situation.slogan}</p>
                            {situation.action !== situation.slogan && <p className="editorial-body-s mt-3 border-t border-[#E2D5CA] pt-3 text-[0.96rem] leading-8 text-[#6A5F57]">{situation.action}</p>}
                          </section>

                          <a
                            href={`/types/${situation.neighbor.code}`}
                            className="editorial-button editorial-action mt-6 inline-block text-[13px] tracking-[0.04em] text-[#79584D] underline decoration-[#A36F63]/45 underline-offset-4 transition-colors hover:text-[#A05F54]"
                          >
                            認識{situation.neighbor.name}的完整思考方式 →
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <Takeaway label="FACE Circle" link={{ href: `/types/compatibility?type=${selectedCode}`, label: '打開16型交易互補輪盤 →' }}>
            你不需要把自己變成另一種人格。只要在卡住時，<Highlight>向鄰居借一種現在缺少的能力。</Highlight>
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[4]}>
          <div className="space-y-7">
            {profile.triggers.map((trigger, index) => (
              <article key={trigger.title} className="overflow-hidden border border-[#D8CDBD] bg-white">
                {(() => {
                  const triggerCopy = `${trigger.title}${trigger.event}${trigger.emotion}${trigger.behavior}${trigger.consequence}${trigger.watchFor}`;
                  const triggerLayout = getEditorialLayout(triggerCopy, editorialImages.layouts?.triggers[index]);

                  return <div className={triggerLayout.grid}>
                  <EditorialFigure
                    src={editorialImages.triggers[index]}
                    alt={`${profile.name}失控情境 ${index + 1}：${trigger.title}`}
                    className={triggerLayout.figure}
                    imageClassName={triggerLayout.image}
                  />
                  <div className="bg-white">
                    <header className="border-b border-[#D8CDBD] bg-[#F7F2EC] px-5 py-6 md:px-7">
                      <p className="editorial-kicker font-mono text-[12px] tracking-[0.14em] text-[#9A655C]">情境 0{index + 1}</p>
                      <h3 className="editorial-subhead serif mt-2 text-[1.45rem] font-normal leading-[1.55] text-[#3C332E] md:text-[1.6rem]">{trigger.title}</h3>
                    </header>
                    <div className="serif px-5 py-6 text-[1rem] font-normal leading-8 text-[#554C45] md:px-7 md:py-8">
                      <p className="editorial-body-l">{renderSceneEmphasis(getTriggerSummary(profile, trigger, index), 'ending')}</p>
                      <div className="editorial-body-m mt-6 border-l-2 border-[#A36F63] bg-[#F7F2EC] px-4 py-4 leading-[1.9] text-[#5A4D46] md:px-5">
                        <p className="editorial-button mb-2 flex items-center gap-2 text-[#9A655C]">
                          <Lightbulb size={17} strokeWidth={1.45} aria-hidden="true" />
                          試試看：
                        </p>
                        <p>{renderSceneEmphasis(getTriggerResolution(profile, trigger, index), 'opening')}</p>
                      </div>
                      <p className="editorial-body-s editorial-supporting mt-6 border-t border-[#E1D7CC] pt-5 text-[0.96rem] leading-[1.9] text-[#8A6A5F]">{getTriggerAnalogy(profile, trigger, index)}</p>
                    </div>
                  </div>
                  </div>;
                })()}
              </article>
            ))}
          </div>
          <div className="mt-9 border border-[#79584D] bg-[#79584D] px-6 py-9 text-white md:px-9">
            <p className="editorial-kicker editorial-kicker--inverse text-[13px] tracking-[0.1em] text-white/65 md:text-sm">你最容易相信的理由</p>
            <blockquote className="editorial-quote serif mt-5 text-[1.8rem] font-normal leading-[1.65] md:text-[2.25rem]">{profile.selfDeception.quote}</blockquote>
            {profile.selfDeception.context && <p className="editorial-body-m serif mt-5 text-[1rem] font-normal leading-8 text-white/75">{profile.selfDeception.context}</p>}
            <p className="editorial-body-m editorial-dark-copy serif mt-6 border-t border-white/25 pt-5 text-[1rem] font-normal leading-8 text-white/90"><span className="mr-2 text-white/75">換一面鏡子：</span>{profile.selfDeception.reframe}</p>
          </div>
          <Takeaway>
            失控很少從明顯的衝動開始。它更常躲在{profile.selfDeception.quote}這類合理說法裡，<Highlight>讓感受慢慢取代原本的交易條件。</Highlight>
          </Takeaway>
        </SectionShell>

        <section id={chapterMeta[5].id} className="relative overflow-hidden border-x border-b border-[#D9CFC2] bg-[#211C19]">
          <img
            src={profileLineArt}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            style={{
              transform: 'scaleX(-1) scale(1.22)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.58) 60%, transparent 78%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0.58) 60%, transparent 78%)',
            }}
          />
          <img
            src={profileLineArt}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-20 brightness-[1.65] contrast-[1.28] invert mix-blend-screen"
            style={{
              transform: 'scale(1.2)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 38%, rgba(0,0,0,0.22) 54%, rgba(0,0,0,0.7) 70%, black 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 38%, rgba(0,0,0,0.22) 54%, rgba(0,0,0,0.7) 70%, black 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,254,252,0.96) 0%, rgba(255,254,252,0.88) 44%, rgba(248,239,231,0.79) 53%, rgba(211,191,176,0.72) 61%, rgba(115,95,84,0.84) 72%, rgba(58,48,43,0.94) 82%, rgba(33,28,25,0.98) 100%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-20 px-5 pb-6 pt-12 sm:px-8 md:px-14 md:pb-8 md:pt-20">
            <div>
              <ChapterHeader chapter={chapterMeta[5]} />
              <div className="max-w-4xl space-y-3">
                {reflectionPrompts.map((question, index) => (
                  <article key={question} className="grid grid-cols-[2.6rem_1fr] gap-4 border border-[#CDBCAF]/80 bg-white/80 px-5 py-5 sm:grid-cols-[3.25rem_1fr] sm:items-center sm:px-7 sm:py-6">
                    <p className="editorial-kicker font-mono text-[13px] tracking-[0.11em] text-[#A36F63]">0{index + 1}</p>
                    <p className="editorial-subhead serif text-[1.12rem] font-normal leading-[1.85] text-[#39312C] md:text-[1.22rem]">{question}</p>
                  </article>
                ))}
              </div>
              <aside className="mt-6 max-w-4xl border border-[#CDBCAF]/80 bg-[#F4EBE4]/80 px-5 py-6 md:px-8 md:py-8">
                <p className="editorial-kicker text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">FACE Tips</p>
                <p className="editorial-takeaway-text serif mt-4 text-[1.25rem] font-normal leading-[1.85] text-[#413631] md:text-[1.45rem]">以上三個問題你不需要立刻回答，留給你自己。當你能說出<Highlight>「當時的我真正受不了什麼」</Highlight>，覺察就已經開始。</p>
              </aside>
            </div>
          </div>

          <div id={chapterMeta[6].id} className="relative z-20 px-5 pb-16 pt-6 text-white sm:px-8 md:px-14 md:pb-24 md:pt-8">
            <svg
              className="pointer-events-none absolute bottom-10 right-4 hidden h-[56%] w-[50%] max-w-[700px] text-[#D4C1B2] opacity-[0.22] md:block"
              viewBox="0 0 720 320"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="daily-candle-fade" x1="24" y1="286" x2="690" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="currentColor" stopOpacity="0.08" />
                  <stop offset="0.42" stopColor="currentColor" stopOpacity="0.56" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0.92" />
                </linearGradient>
                <filter id="daily-candle-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>

              <path d="M30 282 C126 266 154 232 238 238 C318 244 342 185 418 190 C505 196 545 118 688 58" stroke="url(#daily-candle-fade)" strokeWidth="2" strokeDasharray="3 10" />
              <path d="M30 282 C126 266 154 232 238 238 C318 244 342 185 418 190 C505 196 545 118 688 58" stroke="currentColor" strokeOpacity="0.18" strokeWidth="12" filter="url(#daily-candle-glow)" />

              <g stroke="url(#daily-candle-fade)" strokeWidth="2">
                <line x1="62" y1="250" x2="62" y2="294" /><rect x="54" y="264" width="16" height="18" fill="currentColor" fillOpacity="0.18" />
                <line x1="101" y1="238" x2="101" y2="280" /><rect x="93" y="248" width="16" height="22" fill="currentColor" fillOpacity="0.4" />
                <line x1="140" y1="221" x2="140" y2="267" /><rect x="132" y="232" width="16" height="24" fill="currentColor" fillOpacity="0.16" />
                <line x1="179" y1="226" x2="179" y2="272" /><rect x="171" y="238" width="16" height="21" fill="currentColor" fillOpacity="0.42" />
                <line x1="218" y1="199" x2="218" y2="253" /><rect x="210" y="214" width="16" height="25" fill="currentColor" fillOpacity="0.22" />
                <line x1="257" y1="184" x2="257" y2="237" /><rect x="249" y="198" width="16" height="27" fill="currentColor" fillOpacity="0.48" />
                <line x1="296" y1="191" x2="296" y2="243" /><rect x="288" y="205" width="16" height="23" fill="currentColor" fillOpacity="0.17" />
                <line x1="335" y1="165" x2="335" y2="222" /><rect x="327" y="181" width="16" height="27" fill="currentColor" fillOpacity="0.44" />
                <line x1="374" y1="139" x2="374" y2="201" /><rect x="366" y="156" width="16" height="30" fill="currentColor" fillOpacity="0.2" />
                <line x1="413" y1="151" x2="413" y2="210" /><rect x="405" y="167" width="16" height="28" fill="currentColor" fillOpacity="0.46" />
                <line x1="452" y1="116" x2="452" y2="185" /><rect x="444" y="136" width="16" height="31" fill="currentColor" fillOpacity="0.2" />
                <line x1="491" y1="93" x2="491" y2="165" /><rect x="483" y="110" width="16" height="34" fill="currentColor" fillOpacity="0.5" />
                <line x1="530" y1="102" x2="530" y2="169" /><rect x="522" y="120" width="16" height="31" fill="currentColor" fillOpacity="0.18" />
                <line x1="569" y1="70" x2="569" y2="143" /><rect x="561" y="91" width="16" height="34" fill="currentColor" fillOpacity="0.48" />
                <line x1="608" y1="46" x2="608" y2="119" /><rect x="600" y="66" width="16" height="36" fill="currentColor" fillOpacity="0.22" />
                <line x1="647" y1="25" x2="647" y2="94" /><rect x="639" y="44" width="16" height="35" fill="currentColor" fillOpacity="0.52" />
              </g>
            </svg>

            <div className="relative z-10 max-w-2xl">
              <p className="editorial-kicker editorial-kicker--inverse text-[13px] tracking-[0.14em] text-white/65 md:text-sm">FACE Daily</p>
              <h2 className="editorial-chapter-title editorial-on-dark serif mt-3 text-[2rem] font-normal leading-[1.45] tracking-[0.01em] text-white md:text-[2.4rem]">{chapterMeta[6].title}</h2>
              <p className="editorial-lead editorial-on-dark serif mt-5 text-[1.45rem] font-normal leading-[1.75] text-white/95 md:text-[1.75rem]">看看今天盤勢，正在放大你哪一種情緒</p>
              <p className="editorial-body-m editorial-supporting editorial-dark-copy serif mt-5 max-w-xl text-[1.05rem] font-normal leading-9 text-white/75">用8題確認你在焦慮什麼、注意力被什麼帶走，以及此刻是否適合做決策。</p>
              <a href={FEATURE_FLAGS.dailyAwareness ? '/daily-awareness' : '/me'} className="editorial-button editorial-action mt-8 inline-flex min-h-14 items-center justify-center border border-white/45 bg-white/90 px-8 py-4 text-[14px] tracking-[0.08em] text-[#3B312C] transition-colors hover:bg-white">
                {FEATURE_FLAGS.dailyAwareness ? '開始今日深度覺察 →' : '覺察日記 · 尚未開放 →'}
              </a>
            </div>
          </div>
        </section>
      </main>

      </article>
    </>
  );
};

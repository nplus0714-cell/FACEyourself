import type { FaceAgreementMapping, FaceDimension, FaceQuestion, FaceQuestionOption, FaceTrait } from '../types';

export const FACE_BASELINE_40_VERSION = 'face-baseline-40q-v1';
export const FACE_BASELINE_40_QUESTION_COUNT = 40;
export const FACE_AGREEMENT_SCALE = [
  '非常同意',
  '有點同意',
  '看情況',
  '有點不同意',
  '非常不同意',
] as const;

const pair = (
  dimension: FaceDimension,
  a: string,
  aTrait: FaceTrait,
  b: string,
  bTrait: FaceTrait,
): [FaceQuestionOption, FaceQuestionOption] => [
  { id: 'a', label: a, trait: aTrait },
  { id: 'b', label: b, trait: bTrait },
];

const agreement = (agreeTrait: FaceTrait, disagreeTrait: FaceTrait): FaceAgreementMapping => ({
  agreeTrait,
  disagreeTrait,
});

const image = (assetKey: string, alt: string, prompt: string) => ({ assetKey, alt, prompt });

const IMAGE_QUESTION_ARTWORK: Record<string, {
  prompt: string;
  labels: [string, string];
  src: string;
  alt: string;
}> = {
  'image-f-01': {
    prompt: '選一張比較有感覺的畫面',
    labels: ['短期拉升', '平穩上行'],
    src: '/images/questions/face-image-01.png',
    alt: '獲利動機圖像題：短期拉升與平穩上行',
  },
  'image-f-02': {
    prompt: '選一張比較有感覺的畫面',
    labels: ['波動較大', '波動較小'],
    src: '/images/questions/face-image-02.png',
    alt: '獲利動機圖像題：波動較大與波動較小',
  },
  'image-a-01': {
    prompt: '選一張比較讓你安心的畫面',
    labels: ['先規劃', '邊看邊決定'],
    src: '/images/questions/face-image-03.png',
    alt: '決策邏輯圖像題：先規劃與邊看邊決定',
  },
  'image-a-02': {
    prompt: '哪種比較像你的選股方式',
    labels: ['條件篩選', '市場熱點'],
    src: '/images/questions/face-image-04.png',
    alt: '決策邏輯圖像題：條件篩選與市場熱點',
  },
  'image-c-01': {
    prompt: '你的持股創歷史新高了，這時你會？',
    labels: ['續抱長期', '賣出掌握節奏'],
    src: '/images/questions/face-image-05.png',
    alt: '交易週期圖像題：長期累積與盤中節奏',
  },
  'image-c-02': {
    prompt: '選一張比較像你的投資節奏',
    labels: ['每月固定買', '看變化再決定'],
    src: '/images/questions/face-image-06.png',
    alt: '交易週期圖像題：定期累積與轉折應對',
  },
  'image-e-01': {
    prompt: '選一張比較像你的資金配置',
    labels: ['集中少數標的', '分散在多個標的'],
    src: '/images/questions/face-image-07.png',
    alt: '資金暴露圖像題：少數標的與多標的',
  },
  'image-e-02': {
    prompt: '選一張比較讓你有安全感的畫面',
    labels: ['單一主軸', '多元組合'],
    src: '/images/questions/face-image-08.png',
    alt: '資金暴露圖像題：單一主軸與多元組合',
  },
};

/**
 * The user-approved FACE baseline bank. The displayed order starts with quick
 * intuition choices, then image choices, then agreement statements, and ends
 * with the deeper scenario questions. Dimensions remain interleaved inside
 * every group so the test does not feel repetitive.
 * Image questions carry stable placeholders until final artwork is supplied.
 */
const FACE_BASELINE_40_QUESTION_BANK: FaceQuestion[] = [
  {
    id: 'intuition-f-01', order: 1, type: 'intuition', dimension: 'FOCUS',
    prompt: '你看到「今年可能翻倍」這句話，第一反應是：',
    options: pair('FOCUS', '想知道機會在哪裡', 'A', '想知道風險有多大', 'P'),
  },
  {
    id: 'image-a-01', order: 2, type: 'image', dimension: 'ANALYSIS', prompt: '請選一張比較讓你安心的畫面：',
    options: pair('ANALYSIS', '一張清楚的交易計畫表，上面寫著進場、停損、停利', 'R', '一個交易員看著盤面，感覺資金正在流向某個族群', 'I'),
    images: [
      image('analysis-plan-sheet', '有進場、停損與停利欄位的交易計畫表', '交易計畫表、進場、停損、停利、清楚規則'),
      image('analysis-flow-trader', '交易員觀察盤面上的資金流向', '交易員、盤面、資金流向、市場氣氛'),
    ],
  },
  {
    id: 'scenario-c-01', order: 3, type: 'scenario', dimension: 'CYCLE', prompt: '你買進一檔股票後，三週都沒什麼動。',
    options: pair('CYCLE', '只要邏輯沒壞，我可以繼續等', 'L', '太沒效率，我會想換到更有動能的地方', 'T'),
  },
  { id: 'agreement-e-01', order: 4, type: 'agreement', dimension: 'EXPOSURE', prompt: '「真正好的機會不用太多，重點是看懂後敢不敢放大。」', agreement: agreement('C', 'D') },
  {
    id: 'scenario-f-01', order: 5, type: 'scenario', dimension: 'FOCUS', prompt: '你買進後，股價很快上漲 12%，帳面獲利已經不錯。',
    options: pair('FOCUS', '行情可能才剛開始，我會想看看能不能賺更多', 'A', '已經有不錯成果，我會先想怎麼保住獲利', 'P'),
  },
  {
    id: 'intuition-a-01', order: 6, type: 'intuition', dimension: 'ANALYSIS', prompt: '下單前，你最需要的是：',
    options: pair('ANALYSIS', '明確理由', 'R', '對盤勢的感覺', 'I'),
  },
  {
    id: 'image-c-01', order: 7, type: 'image', dimension: 'CYCLE', prompt: '請選一張比較吸引你的畫面：',
    options: pair('CYCLE', '一棵樹慢慢長大，根越扎越深', 'L', '一個衝浪者抓到浪，順著浪快速前進', 'T'),
    images: [
      image('cycle-growing-tree', '根系穩固、慢慢成長的大樹', '大樹、根系、長期成長、穩定'),
      image('cycle-surfing-wave', '衝浪者抓住浪頭快速前進', '衝浪、浪頭、速度、節奏'),
    ],
  },
  {
    id: 'scenario-e-01', order: 8, type: 'scenario', dimension: 'EXPOSURE', prompt: '你研究很久，終於找到一個很有把握的機會。',
    options: pair('EXPOSURE', '我會想讓它成為主要部位', 'C', '我還是會分散配置，避免單一判斷出錯', 'D'),
  },
  { id: 'agreement-f-01', order: 9, type: 'agreement', dimension: 'FOCUS', prompt: '「如果行情真的來了，太保守反而是一種風險。」', agreement: agreement('A', 'P') },
  {
    id: 'scenario-a-01', order: 10, type: 'scenario', dimension: 'ANALYSIS', prompt: '你看到一檔股票突然大漲，新聞和社群都很熱。',
    options: pair('ANALYSIS', '我會先查數據、籌碼、財報或技術位置', 'R', '我會先感覺市場是不是真的有資金在追', 'I'),
  },
  {
    id: 'intuition-c-01', order: 11, type: 'intuition', dimension: 'CYCLE', prompt: '你比較喜歡哪種感覺？',
    options: pair('CYCLE', '陪一個好標的慢慢長大', 'L', '抓住一段行情的節奏', 'T'),
  },
  {
    id: 'image-e-01', order: 12, type: 'image', dimension: 'EXPOSURE', prompt: '請選一張比較像你的資金配置：',
    options: pair('EXPOSURE', '一道強光集中照在少數幾個標的上', 'C', '一張安全網分散接住不同方向的風險', 'D'),
    images: [
      image('exposure-focused-light', '強光集中照向少數目標', '強光、聚焦、少數目標、集中'),
      image('exposure-safety-net', '安全網接住不同方向的風險', '安全網、不同方向、風險分散'),
    ],
  },
  {
    id: 'scenario-f-02', order: 13, type: 'scenario', dimension: 'FOCUS', prompt: '市場突然出現一個很熱門的新題材，社群、新聞、朋友都在討論。',
    options: pair('FOCUS', '我會想趕快研究，怕太慢就沒位置', 'A', '我會先觀察是不是已經太熱，避免追在高點', 'P'),
  },
  { id: 'agreement-a-01', order: 14, type: 'agreement', dimension: 'ANALYSIS', prompt: '「如果我說不出明確理由，就不應該進場。」', agreement: agreement('R', 'I') },
  {
    id: 'scenario-c-02', order: 15, type: 'scenario', dimension: 'CYCLE', prompt: '你看好的股票短期下跌 8%，但長期故事沒有改變。',
    options: pair('CYCLE', '我會把它當成正常波動', 'L', '我會重新評估節奏是不是走壞了', 'T'),
  },
  {
    id: 'intuition-e-01', order: 16, type: 'intuition', dimension: 'EXPOSURE', prompt: '你比較不喜歡哪種情況？',
    options: pair('EXPOSURE', '明明看對，卻因為買太少沒什麼感覺', 'C', '一次看錯，就讓整體帳戶受傷很深', 'D'),
  },
  {
    id: 'image-f-01', order: 17, type: 'image', dimension: 'FOCUS', prompt: '請選一張比較有感覺的畫面：',
    options: pair('FOCUS', '一支 K 線爆量突破，像火箭一樣往上衝', 'A', '一條帳戶曲線慢慢往上，波動小但很穩', 'P'),
    images: [
      image('focus-breakout-rocket', '爆量突破、向上衝刺的 K 線圖', 'K 線、爆量突破、火箭、向上'),
      image('focus-steady-curve', '緩慢上升且波動很小的帳戶曲線', '帳戶曲線、緩慢向上、穩定、低波動'),
    ],
  },
  {
    id: 'scenario-a-02', order: 18, type: 'scenario', dimension: 'ANALYSIS', prompt: '你原本的交易計畫還沒出現買點，但盤面看起來很強。',
    options: pair('ANALYSIS', '沒到條件，我會盡量不動', 'R', '如果氣氛真的很強，我可能會提前試單', 'I'),
  },
  { id: 'agreement-c-01', order: 19, type: 'agreement', dimension: 'CYCLE', prompt: '「資金被卡太久，本身就是一種成本。」', agreement: agreement('T', 'L') },
  {
    id: 'scenario-e-02', order: 20, type: 'scenario', dimension: 'EXPOSURE', prompt: '你手上有五個標的，其中一個明顯最有機會。',
    options: pair('EXPOSURE', '我會把資金往最有機會的地方集中', 'C', '我會調整比重，但不會讓它佔太大', 'D'),
  },
  {
    id: 'intuition-f-02', order: 21, type: 'intuition', dimension: 'FOCUS', prompt: '你比較怕哪件事？',
    options: pair('FOCUS', '看對但賺太少', 'A', '看錯但賠太多', 'P'),
  },
  {
    id: 'image-a-02', order: 22, type: 'image', dimension: 'ANALYSIS', prompt: '請選一張比較像你的大腦：',
    options: pair('ANALYSIS', '儀表板、數據、條件、規則全部排好', 'R', '雷達掃描市場氣氛，感覺哪裡正在發熱', 'I'),
    images: [
      image('analysis-dashboard-rules', '儀表板上排列整齊的數據與規則', '儀表板、數據、條件、規則'),
      image('analysis-market-radar', '雷達掃描市場熱度與氣氛', '雷達、市場氣氛、發熱、直覺'),
    ],
  },
  {
    id: 'scenario-c-03', order: 23, type: 'scenario', dimension: 'CYCLE', prompt: '你看到另一個族群明顯轉強，但你手上的股票還沒漲。',
    options: pair('CYCLE', '我會避免換來換去，先看原本邏輯有沒有變', 'L', '我會考慮把資金移到更有效率的地方', 'T'),
  },
  { id: 'agreement-e-02', order: 24, type: 'agreement', dimension: 'EXPOSURE', prompt: '「不要讓單一判斷決定整個帳戶的命運。」', agreement: agreement('D', 'C') },
  {
    id: 'scenario-f-03', order: 25, type: 'scenario', dimension: 'FOCUS', prompt: '你連續三次交易都做對，帳戶明顯成長。',
    options: pair('FOCUS', '我會覺得狀態不錯，可以稍微更積極一點', 'A', '我會提醒自己，越順的時候越不能膨脹', 'P'),
  },
  {
    id: 'intuition-a-02', order: 26, type: 'intuition', dimension: 'ANALYSIS', prompt: '你比較相信：',
    options: pair('ANALYSIS', '可以被驗證的方法', 'R', '長期累積出來的市場感', 'I'),
  },
  {
    id: 'image-c-02', order: 27, type: 'image', dimension: 'CYCLE', prompt: '請選一張比較像你的投資節奏：',
    options: pair('CYCLE', '日曆一頁一頁翻，時間慢慢累積成果', 'L', '秒錶、節奏、轉折點，掌握進出速度', 'T'),
    images: [
      image('cycle-calendar-compound', '日曆翻頁累積長期成果', '日曆、翻頁、時間、長期累積'),
      image('cycle-stopwatch-timing', '秒錶與轉折點代表進出節奏', '秒錶、節奏、轉折點、交易'),
    ],
  },
  {
    id: 'scenario-e-03', order: 28, type: 'scenario', dimension: 'EXPOSURE', prompt: '市場突然大跌，你最大的一檔部位跌很多。',
    options: pair('EXPOSURE', '如果邏輯還在，我可以承受集中帶來的波動', 'C', '我會覺得單一部位太大，會影響我的判斷', 'D'),
  },
  { id: 'agreement-f-02', order: 29, type: 'agreement', dimension: 'FOCUS', prompt: '「投資最重要的是先活下來，而不是每次都想贏很多。」', agreement: agreement('P', 'A') },
  {
    id: 'scenario-a-03', order: 30, type: 'scenario', dimension: 'ANALYSIS', prompt: '你買進後，股價沒有照預期走，但整體市場氣氛還不差。',
    options: pair('ANALYSIS', '我會回到原本規則，看是否該停損或調整', 'R', '我會再觀察盤感是不是真的轉弱', 'I'),
  },
  {
    id: 'intuition-c-02', order: 31, type: 'intuition', dimension: 'CYCLE', prompt: '你比較受不了哪種狀況？',
    options: pair('CYCLE', '太常進出，心很累', 'L', '一直不動，資金沒效率', 'T'),
  },
  {
    id: 'image-e-02', order: 32, type: 'image', dimension: 'EXPOSURE', prompt: '請選一張比較讓你有安全感的畫面：',
    options: pair('EXPOSURE', '弓箭瞄準一個清楚目標，力量集中', 'C', '多個籃子放著不同資產，彼此平衡', 'D'),
    images: [
      image('exposure-archery-target', '弓箭瞄準單一清楚目標', '弓箭、目標、力量集中'),
      image('exposure-balanced-baskets', '多個籃子放著不同資產', '多個籃子、不同資產、平衡、分散'),
    ],
  },
  {
    id: 'scenario-f-04', order: 33, type: 'scenario', dimension: 'FOCUS', prompt: '朋友跟你說：「這個機會可能很大，但波動也會很大。」',
    options: pair('FOCUS', '我會想深入研究，看看值不值得承擔', 'A', '我會先想這種波動我能不能睡得著', 'P'),
  },
  { id: 'agreement-a-02', order: 34, type: 'agreement', dimension: 'ANALYSIS', prompt: '「市場很多時候不是算出來的，是感覺出來的。」', agreement: agreement('I', 'R') },
  {
    id: 'scenario-c-04', order: 35, type: 'scenario', dimension: 'CYCLE', prompt: '你做對一個方向，但中間震盪很久，過程很磨人。',
    options: pair('CYCLE', '我可以接受，只要最後方向是對的', 'L', '我會覺得這段時間應該可以做得更有效率', 'T'),
  },
  {
    id: 'intuition-e-02', order: 36, type: 'intuition', dimension: 'EXPOSURE', prompt: '你比較相信：',
    options: pair('EXPOSURE', '高信念部位', 'C', '組合穩定度', 'D'),
  },
  {
    id: 'image-f-02', order: 37, type: 'image', dimension: 'FOCUS', prompt: '請選一張比較像你心中的「好機會」：',
    options: pair('FOCUS', '快艇衝浪，速度快、方向明確', 'A', '大船穩穩前進，不怕浪大', 'P'),
    images: [
      image('focus-speedboat-surf', '快艇衝浪，快速且方向明確', '快艇、衝浪、速度、方向'),
      image('focus-steady-ship', '大船在海浪中穩穩前進', '大船、海浪、穩定、前進'),
    ],
  },
  {
    id: 'scenario-a-04', order: 38, type: 'scenario', dimension: 'ANALYSIS', prompt: '朋友問你：「你為什麼買這檔？」',
    options: pair('ANALYSIS', '我希望能講出明確理由和判斷依據', 'R', '我可能會說，這檔感覺有資金進來的味道', 'I'),
  },
  { id: 'agreement-c-02', order: 39, type: 'agreement', dimension: 'CYCLE', prompt: '「我不需要每天都有動作，只要長期方向正確就好。」', agreement: agreement('L', 'T') },
  {
    id: 'scenario-e-04', order: 40, type: 'scenario', dimension: 'EXPOSURE', prompt: '你有一筆新資金可以投入。',
    options: pair('EXPOSURE', '我會優先加到最有把握的標的', 'C', '我會分成幾份，放到不同方向', 'D'),
  },
];

const FACE_BASELINE_40_DISPLAY_ORDER = [
  // 1-8: fast, intuitive choices
  'intuition-f-01', 'intuition-a-01', 'intuition-c-01', 'intuition-e-01',
  'intuition-f-02', 'intuition-a-02', 'intuition-c-02', 'intuition-e-02',
  // 9-16: visual first-impression choices
  'image-f-01', 'image-a-01', 'image-c-01', 'image-e-01',
  'image-f-02', 'image-a-02', 'image-c-02', 'image-e-02',
  // 17-24: five-level agreement statements
  'agreement-f-01', 'agreement-a-01', 'agreement-c-01', 'agreement-e-01',
  'agreement-f-02', 'agreement-a-02', 'agreement-c-02', 'agreement-e-02',
  // 25-40: deeper market scenarios
  'scenario-f-01', 'scenario-a-01', 'scenario-c-01', 'scenario-e-01',
  'scenario-f-02', 'scenario-a-02', 'scenario-c-02', 'scenario-e-02',
  'scenario-f-03', 'scenario-a-03', 'scenario-c-03', 'scenario-e-03',
  'scenario-f-04', 'scenario-a-04', 'scenario-c-04', 'scenario-e-04',
] as const;

export const FACE_BASELINE_40_QUESTIONS: FaceQuestion[] = FACE_BASELINE_40_DISPLAY_ORDER.map((id, index) => {
  const question = FACE_BASELINE_40_QUESTION_BANK.find((item) => item.id === id);
  if (!question) throw new Error(`Missing FACE question: ${id}`);
  const artwork = IMAGE_QUESTION_ARTWORK[id];
  if (!artwork || !question.options) return { ...question, order: index + 1 };

  return {
    ...question,
    order: index + 1,
    prompt: artwork.prompt,
    options: [
      { ...question.options[0], label: artwork.labels[0] },
      { ...question.options[1], label: artwork.labels[1] },
    ],
    compositeImage: {
      src: artwork.src,
      alt: artwork.alt,
    },
  };
});

export const getFaceBaselineQuestionCounts = (questions = FACE_BASELINE_40_QUESTIONS) =>
  questions.reduce<Record<FaceDimension, number>>(
    (counts, question) => ({ ...counts, [question.dimension]: counts[question.dimension] + 1 }),
    { FOCUS: 0, ANALYSIS: 0, CYCLE: 0, EXPOSURE: 0 },
  );

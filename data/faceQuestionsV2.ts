import type {
  FaceAgreementMapping,
  FaceDimension,
  FaceQuestion,
  FaceQuestionOption,
  FaceTrait,
} from '../types';

export const FACE_BASELINE_V2_VERSION = 'face-baseline-40q-v2';
export const FACE_BASELINE_V2_QUESTION_COUNT = 40;

export const FACE_V2_AGREEMENT_SCALE = [
  '非常同意',
  '有點同意',
  '中立／不一定',
  '有點不同意',
  '非常不同意',
] as const;

const pair = (
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

const compositeImage = (index: number, alt: string) => ({
  src: `/images/questions/v2/face-v2-image-${String(index).padStart(2, '0')}.webp`,
  alt,
});

const originalOptionImages = (
  index: number,
  leftAlt: string,
  rightAlt: string,
): NonNullable<FaceQuestion['images']> => ([
  {
    assetKey: `face-original-${String(index).padStart(2, '0')}-a`,
    src: `/images/questions/v2/original-split/face-original-${String(index).padStart(2, '0')}-a.webp`,
    alt: leftAlt,
    prompt: leftAlt,
  },
  {
    assetKey: `face-original-${String(index).padStart(2, '0')}-b`,
    src: `/images/questions/v2/original-split/face-original-${String(index).padStart(2, '0')}-b.webp`,
    alt: rightAlt,
    prompt: rightAlt,
  },
]);

/**
 * FACE 2.0 approved review bank.
 *
 * Intuition and image questions remain binary. Agreement and scenario
 * questions use graded responses so users can express a leaning instead of
 * pretending that either endpoint describes them exactly.
 */
export const FACE_BASELINE_V2_QUESTIONS: FaceQuestion[] = [
  {
    id: 'intuition-f-01-v2', order: 1, type: 'intuition', responseMode: 'binary', dimension: 'FOCUS',
    prompt: '一個潛在報酬很高、但資訊還不完整的機會出現時，你第一個想確認的是：',
    options: pair('上行空間可能有多大？', 'A', '最壞情況可能損失多少？', 'P'),
  },
  {
    id: 'intuition-a-01-v2', order: 2, type: 'intuition', responseMode: 'binary', dimension: 'ANALYSIS',
    prompt: '需要在有限時間內做交易決定時，你會先抓住：',
    options: pair('可以核對的條件與證據', 'R', '盤面節奏與資金反應', 'I'),
  },
  {
    id: 'intuition-c-01-v2', order: 3, type: 'intuition', responseMode: 'binary', dimension: 'CYCLE',
    prompt: '哪一種投資過程更接近你想要的感覺？',
    options: pair('陪一個看懂的標的走過完整成長週期', 'L', '把握一段明確行情，結束後尋找下一個機會', 'T'),
  },
  {
    id: 'intuition-e-01-v2', order: 4, type: 'intuition', responseMode: 'binary', dimension: 'EXPOSURE',
    prompt: '當你對某一個機會的信心明顯高於其他選項，更自然的做法是：',
    options: pair('把較多資金放在這個少數高信念機會', 'C', '把資金分配給幾個各有理由的機會', 'D'),
  },
  {
    id: 'intuition-f-02-v2', order: 5, type: 'intuition', responseMode: 'binary', dimension: 'FOCUS',
    prompt: '哪一種結果對你來說更難接受？',
    options: pair('看對大方向，卻因參與太少而幾乎沒賺到', 'A', '判斷錯誤，讓帳戶出現明顯回撤', 'P'),
  },
  {
    id: 'intuition-a-02-v2', order: 6, type: 'intuition', responseMode: 'binary', dimension: 'ANALYSIS',
    prompt: '面對沒有標準答案的市場時，你通常更信任：',
    options: pair('可以在事前寫下、事後檢驗的方法', 'R', '長期觀察後形成、能讀懂情境變化的市場感', 'I'),
  },
  {
    id: 'intuition-c-02-v2', order: 7, type: 'intuition', responseMode: 'binary', dimension: 'CYCLE',
    prompt: '哪一種狀況更容易打亂你的交易節奏？',
    options: pair('為了找短線機會頻繁進出', 'L', '資金長時間停在沒有進展的部位', 'T'),
  },
  {
    id: 'intuition-e-02-v2', order: 8, type: 'intuition', responseMode: 'binary', dimension: 'EXPOSURE',
    prompt: '配置資金時，哪一個方向對你更自然？',
    options: pair('讓資金明顯集中在最有把握的少數機會', 'C', '讓多個不同機會共同影響整體結果', 'D'),
  },
  {
    id: 'image-f-01-v2', order: 9, type: 'image', responseMode: 'binary', dimension: 'FOCUS',
    prompt: '看到兩種上漲走勢，你第一眼比較有感的是？',
    options: pair('短期拉升', 'A', '平穩上行', 'P'),
    images: originalOptionImages(1, '短期拉升：突破後沿短期均線上漲', '平穩上行：回測中期均線後持續上漲'),
  },
  {
    id: 'image-f-02-v2', order: 10, type: 'image', responseMode: 'binary', dimension: 'FOCUS',
    prompt: '如果都有獲利機會，你比較能接受哪種持有過程？',
    options: pair('波動較大', 'A', '波動較小', 'P'),
    images: originalOptionImages(2, '波動較大：每日漲跌幅較明顯', '波動較小：走勢較平穩'),
  },
  {
    id: 'image-a-01-v2', order: 11, type: 'image', responseMode: 'binary', dimension: 'ANALYSIS',
    prompt: '準備做一筆交易時，哪種方式比較像你？',
    options: pair('先規劃', 'R', '邊看邊決定', 'I'),
    images: originalOptionImages(3, '先規劃：先整理條件與交易計畫', '邊看邊決定：觀察盤面後逐步做決定'),
  },
  {
    id: 'image-a-02-v2', order: 12, type: 'image', responseMode: 'binary', dimension: 'ANALYSIS',
    prompt: '你平常比較像哪一種選股方式？',
    options: pair('條件篩選', 'R', '市場熱點', 'I'),
    images: originalOptionImages(4, '條件篩選：依數據與條件挑選標的', '市場熱點：從市場熱門題材尋找標的'),
  },
  {
    id: 'image-c-01-v2', order: 13, type: 'image', responseMode: 'binary', dimension: 'CYCLE',
    prompt: '你的持股創下新高時，你通常會怎麼做？',
    options: pair('續抱長期', 'L', '賣出掌握節奏', 'T'),
    images: originalOptionImages(5, '續抱長期：創新高後選擇繼續持有', '賣出掌握節奏：創新高後選擇賣出'),
  },
  {
    id: 'image-c-02-v2', order: 14, type: 'image', responseMode: 'binary', dimension: 'CYCLE',
    prompt: '投入資金時，哪種節奏比較像你？',
    options: pair('每月固定買', 'L', '看變化再決定', 'T'),
    images: originalOptionImages(6, '每月固定買：定期投入並累積部位', '看變化再決定：觀察行情後選擇進退'),
  },
  {
    id: 'image-e-01-v2', order: 15, type: 'image', responseMode: 'binary', dimension: 'EXPOSURE',
    prompt: '你通常會怎麼安排持股數量？',
    options: pair('集中少數標的', 'C', '分散在多個標的', 'D'),
    images: originalOptionImages(7, '集中少數標的：資金集中在少數持股', '分散在多個標的：資金分配到多個持股'),
  },
  {
    id: 'image-e-02-v2', order: 16, type: 'image', responseMode: 'binary', dimension: 'EXPOSURE',
    prompt: '哪一種資產配置方式比較像你？',
    options: pair('單一主軸', 'C', '多元組合', 'D'),
    images: originalOptionImages(8, '單一主軸：資金集中在主要資產', '多元組合：資金分配在不同資產'),
  },
  {
    id: 'agreement-f-01-v2', order: 17, type: 'agreement', responseMode: 'agreement', dimension: 'FOCUS',
    prompt: '面對上行空間與回撤風險都較大的機會，我通常願意承受較大的短期波動來換取上行。',
    agreement: agreement('A', 'P'),
  },
  {
    id: 'agreement-a-01-v2', order: 18, type: 'agreement', responseMode: 'agreement', dimension: 'ANALYSIS',
    prompt: '我比較信任能在事前寫成條件、事後回頭檢驗的買進理由。',
    agreement: agreement('R', 'I'),
  },
  {
    id: 'agreement-c-01-v2', order: 19, type: 'agreement', responseMode: 'agreement', dimension: 'CYCLE',
    prompt: '資金長時間沒有進展，對我來說本身就是一種成本。',
    agreement: agreement('T', 'L'),
  },
  {
    id: 'agreement-e-01-v2', order: 20, type: 'agreement', responseMode: 'agreement', dimension: 'EXPOSURE',
    prompt: '當我對某個機會的信心明顯高於其他選項時，我傾向讓資金比重也明顯不同。',
    agreement: agreement('C', 'D'),
  },
  {
    id: 'agreement-f-02-v2', order: 21, type: 'agreement', responseMode: 'agreement', dimension: 'FOCUS',
    prompt: '即使因此少賺一段行情，我也傾向優先降低帳戶出現大幅回撤的可能。',
    agreement: agreement('P', 'A'),
  },
  {
    id: 'agreement-a-02-v2', order: 22, type: 'agreement', responseMode: 'agreement', dimension: 'ANALYSIS',
    prompt: '有些市場訊號很難拆成單一數據，但整體節奏仍能支持我的判斷。',
    agreement: agreement('I', 'R'),
  },
  {
    id: 'agreement-c-02-v2', order: 23, type: 'agreement', responseMode: 'agreement', dimension: 'CYCLE',
    prompt: '只要原本的長期假設沒有改變，我可以接受一段時間沒有交易動作。',
    agreement: agreement('L', 'T'),
  },
  {
    id: 'agreement-e-02-v2', order: 24, type: 'agreement', responseMode: 'agreement', dimension: 'EXPOSURE',
    prompt: '即使很有把握，我仍傾向限制單一部位對整體結果的影響。',
    agreement: agreement('D', 'C'),
  },
  {
    id: 'scenario-f-01-v2', order: 25, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'FOCUS',
    prompt: '你買進後，股價很快上漲 12%。原定目標尚未到，交易邏輯也沒有失效。此時你更接近哪一種做法？',
    options: pair('維持大部分部位，接受獲利回吐以保留後續上行', 'A', '先減碼一部分，降低已獲利潤回吐的幅度', 'P'),
  },
  {
    id: 'scenario-a-01-v2', order: 26, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'ANALYSIS',
    prompt: '一檔股票突然大漲，資訊很多而且彼此矛盾。你只有有限時間決定是否繼續追蹤。你更接近哪一種做法？',
    options: pair('整理可核對的數據、事件條件與風險點，再決定', 'R', '觀察資金流、類股呼應與盤面反應，判斷行情是否成形', 'I'),
  },
  {
    id: 'scenario-c-01-v2', order: 27, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'CYCLE',
    prompt: '你買進一檔股票後，三週都沒什麼動。原本假設沒有被新資訊否定，也沒有觸發退出條件。你更接近哪一種做法？',
    options: pair('按原定持有週期等待，讓假設有時間發展', 'L', '把沒有進展視為資金效率下降，尋找更有節奏的機會', 'T'),
  },
  {
    id: 'scenario-e-01-v2', order: 28, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'EXPOSURE',
    prompt: '你研究很久，找到一個信心明顯高於其餘機會的標的。假設總風險預算固定，你更接近哪一種做法？',
    options: pair('把大部分風險預算給它，其他機會只留小部位', 'C', '讓它占比較高，但仍保留多個部位並限制單一影響', 'D'),
  },
  {
    id: 'scenario-f-02-v2', order: 29, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'FOCUS',
    prompt: '你發現一個上行潛力高、但關鍵資訊還沒確認的機會。現在可以用小部位參與；若等資訊確認，進場價格可能更高。你更接近哪一種做法？',
    options: pair('先用預設的小部位參與，保留上行可能', 'A', '等不確定性下降，接受之後可能用更高價格進場', 'P'),
  },
  {
    id: 'scenario-a-02-v2', order: 30, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'ANALYSIS',
    prompt: '原本計畫的買點還沒出現，盤面卻出現連續轉強訊號。假設兩種做法都在你的風險上限內，你更接近哪一種？',
    options: pair('等待原定條件；若要改變，就先重寫並核對計畫', 'R', '把轉強視為新資訊，用事先限制的小部位試單', 'I'),
  },
  {
    id: 'scenario-c-02-v2', order: 31, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'CYCLE',
    prompt: '你長期看好的股票短期下跌 8%。長期假設沒有新變化，但短線結構轉弱。你更接近哪一種做法？',
    options: pair('按原定持有週期繼續觀察', 'L', '因短線結構改變而重新配置，之後再評估是否回補', 'T'),
  },
  {
    id: 'scenario-e-02-v2', order: 32, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'EXPOSURE',
    prompt: '你手上有五個標的，其中一個的信心與走勢都明顯最強。假設整體風險維持不變，你更接近哪一種做法？',
    options: pair('明顯提高最強標的比重，讓各部位權重拉開', 'C', '適度提高它的比重，但仍維持單一部位上限', 'D'),
  },
  {
    id: 'scenario-f-03-v2', order: 33, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'FOCUS',
    prompt: '你提早達成今年的獲利目標，策略條件與原本風險預算都沒有改變。接下來你更接近哪一種做法？',
    options: pair('維持原有風險水位，繼續爭取額外上行', 'A', '降低後續風險水位，優先保留已達成的成果', 'P'),
  },
  {
    id: 'scenario-a-03-v2', order: 34, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'ANALYSIS',
    prompt: '你買進後，價格沒有照預期發展，但尚未觸發風控；其他市場訊號有強有弱。你更接近哪一種做法？',
    options: pair('按照事先條件逐項檢查，再決定持有、減碼或退出', 'R', '綜合價格反應、類股節奏與資金流，判斷市場狀態', 'I'),
  },
  {
    id: 'scenario-c-03-v2', order: 35, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'CYCLE',
    prompt: '另一個族群連續轉強，你原本持有的標的邏輯仍在，但價格暫時沒有進展。你更接近哪一種做法？',
    options: pair('依原定週期持有，除非原本假設改變', 'L', '移動一部分資金到節奏較強的族群，之後再評估原標的', 'T'),
  },
  {
    id: 'scenario-e-03-v2', order: 36, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'EXPOSURE',
    prompt: '市場突然下跌，你最大的持倉也跟著下跌。原本假設仍在，整體損失仍在預設風險內。你更接近哪一種做法？',
    options: pair('維持主要部位，接受它對組合造成較大的波動', 'C', '降低單一部位比重，把風險重新分配到組合中', 'D'),
  },
  {
    id: 'scenario-f-04-v2', order: 37, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'FOCUS',
    prompt: '一個機會的潛在報酬很高，但預期波動也明顯高於你平常的交易。你更接近先確認哪一側？',
    options: pair('估算上行空間與成立條件，判斷這個波動是否值得承受', 'A', '估算最壞路徑與帳戶影響，判斷風險是否足夠可控', 'P'),
  },
  {
    id: 'scenario-a-04-v2', order: 38, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'ANALYSIS',
    prompt: '朋友問你：「你為什麼買這個標的？」哪一種答案更接近你真正的決策過程？',
    options: pair('我能說出最重要的資料、條件與失效點', 'R', '我能描述價格型態、類股氣氛與資金方向如何共同形成機會', 'I'),
  },
  {
    id: 'scenario-c-04-v2', order: 39, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'CYCLE',
    prompt: '你判斷方向仍有機會成立，但接下來可能還要盤整三到六個月，市場上也有其他機會。你更接近哪一種做法？',
    options: pair('只要長期假設與預期報酬仍在，就接受等待', 'L', '把資金放到週期更清楚的機會，等它重新啟動再回來', 'T'),
  },
  {
    id: 'scenario-e-04-v2', order: 40, type: 'scenario', responseMode: 'bipolar', allowNotApplicable: true, dimension: 'EXPOSURE',
    prompt: '你有一筆新資金，手上三個部位彼此相關性不高，其中一個的信心明顯最高。假設總風險固定，你更接近哪一種做法？',
    options: pair('主要加到信心最高的部位', 'C', '依各部位的風險上限，分配到數個方向', 'D'),
  },
];

export const getFaceV2QuestionCounts = (questions = FACE_BASELINE_V2_QUESTIONS) =>
  questions.reduce<Record<FaceDimension, number>>(
    (counts, question) => ({ ...counts, [question.dimension]: counts[question.dimension] + 1 }),
    { FOCUS: 0, ANALYSIS: 0, CYCLE: 0, EXPOSURE: 0 },
  );

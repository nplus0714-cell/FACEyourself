import {
  MOCK_DIMENSIONS,
  type MockAnswer,
  type MockDimension,
  type MockQuestion,
  type MockResult,
  type MockTrait,
} from './faceSequentialMockup';

const visual = (
  id: number,
  dimension: MockDimension,
  title: string,
  prompt: string,
  shortA: string,
  shortB: string,
  optionA: string,
  optionB: string,
  traitA: MockTrait,
  traitB: MockTrait,
  source: number,
): MockQuestion => ({
  id,
  kind: 'image',
  dimension,
  title,
  prompt,
  shortA,
  shortB,
  optionA,
  optionB,
  traitA,
  traitB,
  imageA: `/images/questions/v2/original-split/face-original-${String(source).padStart(2, '0')}-a.webp`,
  imageB: `/images/questions/v2/original-split/face-original-${String(source).padStart(2, '0')}-b.webp`,
});

const scenario = (
  id: number,
  dimension: MockDimension,
  group: string,
  groupTitle: string,
  stage: 1 | 2,
  title: string,
  prompt: string,
  optionA: string,
  optionB: string,
  traitA: MockTrait,
  traitB: MockTrait,
): MockQuestion => ({
  id,
  kind: 'scenario',
  dimension,
  group,
  groupTitle,
  stage,
  title,
  prompt,
  shortA: '選項 A',
  shortB: '選項 B',
  optionA,
  optionB,
  traitA,
  traitB,
});

/**
 * FACE 24 題生活化正式題庫。
 *
 * `/test` 與 `/test-mockup` 共用這份已核准題庫，正式資料以版本號區分舊 40 題紀錄。
 * 每個 FACE 面向保留 2 題圖片直覺與 2 組兩階段情境，共 6 次判斷。
 */
export const FACE_24_REVIEW_QUESTIONS: MockQuestion[] = [
  visual(1, 'FOCUS', '走勢感覺', '如果最後都有機會賺錢，你第一眼比較喜歡哪一種走勢？', '短期衝得快', '慢慢往上走', '短期內快速上漲', '波動較小，慢慢往上走', 'A', 'P', 1),
  visual(2, 'FOCUS', '持有感受', '如果最後可能賺得差不多，哪一種過程比較能讓你抱得住？', '漲跌比較大', '漲跌比較小', '中間漲跌較大', '中間漲跌較小', 'A', 'P', 2),
  visual(3, 'ANALYSIS', '下單以前', '準備做一筆交易時，哪個畫面比較像你？', '先做好規劃', '邊看邊決定', '先把買進與賣出條件寫好', '看當時盤面，再決定怎麼做', 'R', 'I', 3),
  visual(4, 'ANALYSIS', '尋找股票', '平常找股票時，哪一種方式比較像你？', '按照條件找', '看市場焦點', '按照自己設定的條件篩選', '從市場正在關注的方向尋找', 'R', 'I', 4),
  visual(5, 'CYCLE', '股價創新高', '持股漲到新高時，你更可能怎麼做？', '繼續抱著', '先賣一部分', '繼續持有，讓行情走下去', '先賣出一部分，把握這段漲幅', 'L', 'T', 5),
  visual(6, 'CYCLE', '買進節奏', '你通常比較像哪一種買進方式？', '固定時間買', '看行情再買', '固定時間慢慢買進', '看到適合的行情再買進', 'L', 'T', 6),
  visual(7, 'EXPOSURE', '持股數量', '下面哪一種持股方式比較像你？', '集中少數幾檔', '分散多檔股票', '資金集中在少數幾檔', '資金分散到比較多檔股票', 'C', 'D', 7),
  visual(8, 'EXPOSURE', '資金分配', '如果總資金一樣，你比較習慣怎麼分？', '一個主力較大', '分給不同資產', '讓最看好的方向占比較多', '分配到幾種不同的資產', 'C', 'D', 8),

  scenario(9, 'FOCUS', 'F1', '剛買進就下跌', 1, '當天跌了 3%', '你今天剛買進，股價就跌了 3%。買進的理由沒有改變，也還沒碰到停損。你會？', '照原計畫再觀察，不急著調整', '先賣一部分，保留之後再買回的空間', 'A', 'P'),
  scenario(10, 'FOCUS', 'F1', '剛買進就下跌', 2, '一週後仍在震盪', '一週後，股價還是大幅上下震盪，已經快碰到停損，但買進的理由仍然存在。你會？', '保留主要部位，等到原本設定的停損再處理', '現在先把部位降到很小，之後再找機會', 'A', 'P'),
  scenario(11, 'FOCUS', 'F2', '還沒研究就大漲', 1, '意外賺了 8%', '你只是先買一點試試，還沒研究清楚，股價就大漲 8%。你會？', '先留著，同時趕快把研究做完', '先賣一部分，弄懂以後再決定', 'A', 'P'),
  scenario(12, 'FOCUS', 'F2', '還沒研究就大漲', 2, '漲幅吐回一半', '之後股價又把一半漲幅吐了回去。你仍然沒有研究清楚，但目前還有賺。你會？', '保留部位，看行情會不會再往上', '先把剩下的獲利收好，研究完再說', 'A', 'P'),

  scenario(13, 'ANALYSIS', 'A1', '憑感覺買進後上漲', 1, '回頭確認理由', '你原本是看盤面的感覺買進，後來股價上漲。現在要決定要不要繼續抱，你會先做什麼？', '查資料，確認這家公司值得繼續持有的理由', '看股價、成交量和同類股票是不是還很強', 'R', 'I'),
  scenario(14, 'ANALYSIS', 'A1', '憑感覺買進後上漲', 2, '壞消息出現', '後來出現一則壞消息，但股價沒有明顯下跌，同類股票也還在上漲。你會先相信？', '先判斷這則消息到底會影響公司多少', '先看市場是不是根本沒把它當成嚴重壞消息', 'R', 'I'),
  scenario(15, 'ANALYSIS', 'A2', '消息和股價打架', 1, '利空後又拉回', '公司突然發布壞消息，股價開低後又拉了回來，消息內容還不完整。你會先看？', '公告寫了什麼，以及可能造成多少影響', '股價拉回的力道和成交量反應', 'R', 'I'),
  scenario(16, 'ANALYSIS', 'A2', '消息和股價打架', 2, '數字弱、股價卻很強', '幾天後，公司數字還是偏弱，但股價沒有再跌，同類股票也開始上漲。最後你比較依靠？', '原本寫下的買進、持有與退出條件', '股價、成交量和同類股票的整體反應', 'R', 'I'),

  scenario(17, 'CYCLE', 'C1', '買進後沒有進展', 1, '隔天小跌', '你買進隔天，股價小幅下跌。買進理由沒有改變，也還沒碰到停損。你會？', '按照原本預計的時間繼續持有', '重新看短線走勢，考慮要不要換掉', 'L', 'T'),
  scenario(18, 'CYCLE', 'C1', '買進後沒有進展', 2, '兩個月都沒動', '兩個月後，這檔股票還是沒什麼變化，但其他股票已經開始上漲。你會？', '繼續等原本看好的股票', '先把部分資金移到有行情的股票', 'L', 'T'),
  scenario(19, 'CYCLE', 'C2', '連續交易虧損', 1, '連續兩筆小虧', '你照原本的方法做了兩筆交易，結果都小幅虧損，但過程沒有明顯做錯。你會？', '繼續照原方法做，累積更多次再判斷', '先減少交易，看看現在的行情是否適合', 'L', 'T'),
  scenario(20, 'CYCLE', 'C2', '連續交易虧損', 2, '做了一段時間仍沒改善', '按照原本設定的次數做完後，結果還是不太好，但你不確定只是短期不順，還是方法真的不適合現在。你會？', '用更長一段時間繼續確認', '先停用大部分資金，只用小部位觀察', 'L', 'T'),

  scenario(21, 'EXPOSURE', 'E1', '最大持股遇到下跌', 1, '最大部位跟著跌', '市場突然下跌，你最大、也最有把握的持股跟著跌。買進理由沒變，整體虧損也還能接受。你會？', '維持它原本較大的比重', '先減碼，把部分資金移到其他持股或現金', 'C', 'D'),
  scenario(22, 'EXPOSURE', 'E1', '最大持股遇到下跌', 2, '不同股票一起跌', '一週後，你原本以為不同類型的股票，開始一起上漲、一起下跌。你會？', '只留下自己最了解、最有把握的幾檔', '降低每一檔的上限，再找不同方向分散', 'C', 'D'),
  scenario(23, 'EXPOSURE', 'E2', '多個部位同時虧損', 1, '五檔裡有三檔虧損', '你有五檔持股，其中三檔正在虧損，只有一檔明顯比較強。整體虧損還能接受。你會？', '增加最強那一檔的比重，減少較弱的持股', '維持每一檔的上限，不讓資金全往一檔集中', 'C', 'D'),
  scenario(24, 'EXPOSURE', 'E2', '多個部位同時虧損', 2, '市場開始回穩', '市場開始穩定，最強的那一檔先漲回來，其他持股還沒什麼反應。你會怎麼重新投入？', '先把最強的方向當成主要部位', '分批投入幾個不同方向，不只押一檔', 'C', 'D'),
];

const answerValue: Record<Exclude<MockAnswer, 'not_applicable'>, number> = {
  very_a: 10,
  somewhat_a: 7,
  balanced: 5,
  somewhat_b: 3,
  very_b: 0,
};

export const scoreFace24Review = (answers: Record<number, MockAnswer>): MockResult => {
  const raw: Record<MockTrait, number> = { A: 0, P: 0, R: 0, I: 0, L: 0, T: 0, C: 0, D: 0 };
  let notApplicableCount = 0;

  FACE_24_REVIEW_QUESTIONS.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;
    if (answer === 'not_applicable') {
      notApplicableCount += 1;
      return;
    }
    const value = question.kind === 'image' ? (answer === 'very_a' ? 10 : 0) : answerValue[answer];
    raw[question.traitA] += value;
    raw[question.traitB] += 10 - value;
  });

  const bonuses = [...new Set(FACE_24_REVIEW_QUESTIONS.flatMap((question) => question.group ? [question.group] : []))]
    .map((group) => {
      const questions = FACE_24_REVIEW_QUESTIONS.filter((question) => question.group === group);
      const groupAnswers = questions.map((question) => answers[question.id]);
      const valid = groupAnswers.every((answer) => answer && answer !== 'balanced' && answer !== 'not_applicable');
      const sides = groupAnswers.map((answer) => answer === 'very_a' || answer === 'somewhat_a' ? 'a' : 'b');
      const trait = valid && sides.every((side) => side === sides[0])
        ? (sides[0] === 'a' ? questions[0].traitA : questions[0].traitB)
        : undefined;
      if (trait) raw[trait] += 2;
      return { group, title: questions[0].groupTitle ?? group, trait };
    });

  const scores = { ...raw };
  MOCK_DIMENSIONS.forEach(({ left, right }) => {
    const total = raw[left] + raw[right] || 1;
    scores[left] = Math.round((raw[left] / total) * 100);
    scores[right] = 100 - scores[left];
  });

  const code = MOCK_DIMENSIONS.map(({ left, right }) => scores[left] >= scores[right] ? left : right).join('');
  return { scores, code, bonuses, notApplicableCount };
};

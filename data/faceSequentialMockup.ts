export type MockTrait = 'A' | 'P' | 'R' | 'I' | 'L' | 'T' | 'C' | 'D';
export type MockDimension = 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
export type MockAnswer = 'very_a' | 'somewhat_a' | 'balanced' | 'somewhat_b' | 'very_b' | 'not_applicable';
export type MockQuestionKind = 'intuition' | 'image' | 'agreement' | 'scenario';

export interface MockQuestion {
  id: number;
  kind: MockQuestionKind;
  dimension: MockDimension;
  title: string;
  prompt: string;
  optionA: string;
  optionB: string;
  shortA: string;
  shortB: string;
  traitA: MockTrait;
  traitB: MockTrait;
  imageA?: string;
  imageB?: string;
  group?: string;
  groupTitle?: string;
  stage?: 1 | 2;
}

const visual = (id: number, kind: 'intuition' | 'image', dimension: MockDimension, title: string, prompt: string, shortA: string, shortB: string, optionA: string, optionB: string, traitA: MockTrait, traitB: MockTrait, source: number): MockQuestion => {
  const folder = kind === 'intuition' ? 'intuition' : 'original-split';
  const prefix = kind === 'intuition' ? 'face-intuition' : 'face-original';
  return {
    id, kind, dimension, title, prompt, shortA, shortB, optionA, optionB, traitA, traitB,
    imageA: `/images/questions/v2/${folder}/${prefix}-${String(source).padStart(2, '0')}-a.webp`,
    imageB: `/images/questions/v2/${folder}/${prefix}-${String(source).padStart(2, '0')}-b.webp`,
  };
};

const agreement = (id: number, dimension: MockDimension, title: string, prompt: string, traitA: MockTrait, traitB: MockTrait): MockQuestion => ({
  id, kind: 'agreement', dimension, title, prompt, shortA: '同意', shortB: '不同意', optionA: '同意這句描述', optionB: '不同意這句描述', traitA, traitB,
});

const scenario = (id: number, dimension: MockDimension, group: string, groupTitle: string, stage: 1 | 2, title: string, prompt: string, optionA: string, optionB: string, traitA: MockTrait, traitB: MockTrait): MockQuestion => ({
  id, kind: 'scenario', dimension, group, groupTitle, stage, title, prompt, shortA: '選項 A', shortB: '選項 B', optionA, optionB, traitA, traitB,
});

export const FACE_SEQUENTIAL_MOCKUP_QUESTIONS: MockQuestion[] = [
  visual(1, 'intuition', 'FOCUS', '高報酬機會', '一個潛在報酬很高、但資訊還不完整的機會出現時，你第一個想確認的是：', '潛在上行', '最壞損失', '上行空間可能有多大？', '最壞情況可能損失多少？', 'A', 'P', 1),
  visual(2, 'intuition', 'ANALYSIS', '有限時間決策', '需要在有限時間內做交易決定時，你會先抓住：', '條件證據', '盤面反應', '可以核對的條件與證據', '盤面節奏與資金反應', 'R', 'I', 2),
  visual(3, 'intuition', 'CYCLE', '投資過程', '哪一種投資過程更接近你想要的感覺？', '長期成長', '分段行情', '陪一個看懂的標的走過完整成長週期', '把握一段明確行情，結束後尋找下一個機會', 'L', 'T', 3),
  visual(4, 'intuition', 'EXPOSURE', '高信念機會', '當你對某一個機會的信心明顯高於其他選項，更自然的做法是：', '集中高信念', '分散多機會', '把較多資金放在這個少數高信念機會', '把資金分配給幾個各有理由的機會', 'C', 'D', 4),
  visual(5, 'intuition', 'FOCUS', '更難接受的結果', '哪一種結果對你來說更難接受？', '錯失獲利', '帳戶回撤', '看對大方向，卻因參與太少而幾乎沒賺到', '判斷錯誤，讓帳戶出現明顯回撤', 'A', 'P', 5),
  visual(6, 'intuition', 'ANALYSIS', '市場判斷', '面對沒有標準答案的市場時，你通常更信任：', '規則驗證', '市場感應', '可以在事前寫下、事後檢驗的方法', '長期觀察後形成、能讀懂情境變化的市場感', 'R', 'I', 6),
  visual(7, 'intuition', 'CYCLE', '交易節奏', '哪一種狀況更容易打亂你的交易節奏？', '頻繁進出', '資金停滯', '為了找短線機會頻繁進出', '資金長時間停在沒有進展的部位', 'L', 'T', 7),
  visual(8, 'intuition', 'EXPOSURE', '資金配置', '配置資金時，哪一個方向對你更自然？', '少數集中', '多元分散', '讓資金明顯集中在最有把握的少數機會', '讓多個不同機會共同影響整體結果', 'C', 'D', 8),

  visual(9, 'image', 'FOCUS', '上漲路徑', '看到兩種上漲走勢，你第一眼比較有感的是？', '短期拉升', '平穩上行', '短期拉升', '平穩上行', 'A', 'P', 1),
  visual(10, 'image', 'FOCUS', '持有過程', '如果都有獲利機會，你比較能接受哪種持有過程？', '波動較大', '波動較小', '波動較大', '波動較小', 'A', 'P', 2),
  visual(11, 'image', 'ANALYSIS', '準備交易', '準備做一筆交易時，哪種方式比較像你？', '先規劃', '邊看邊決定', '先規劃', '邊看邊決定', 'R', 'I', 3),
  visual(12, 'image', 'ANALYSIS', '選股方式', '你平常比較像哪一種選股方式？', '條件篩選', '市場熱點', '條件篩選', '市場熱點', 'R', 'I', 4),
  visual(13, 'image', 'CYCLE', '創下新高', '你的持股創下新高時，你通常會怎麼做？', '續抱長期', '掌握節奏', '續抱長期', '賣出掌握節奏', 'L', 'T', 5),
  visual(14, 'image', 'CYCLE', '投入節奏', '投入資金時，哪種節奏比較像你？', '每月固定買', '看變化決定', '每月固定買', '看變化再決定', 'L', 'T', 6),
  visual(15, 'image', 'EXPOSURE', '持股數量', '你通常會怎麼安排持股數量？', '集中少數', '分散多標的', '集中少數標的', '分散在多個標的', 'C', 'D', 7),
  visual(16, 'image', 'EXPOSURE', '資產配置', '哪一種資產配置方式比較像你？', '單一主軸', '多元組合', '單一主軸', '多元組合', 'C', 'D', 8),

  agreement(17, 'FOCUS', '承受波動', '面對上行空間與回撤風險都較大的機會，我通常願意承受較大的短期波動來換取上行。', 'A', 'P'),
  agreement(18, 'ANALYSIS', '可檢驗的方法', '我比較信任能在事前寫成條件、事後回頭檢驗的買進理由。', 'R', 'I'),
  agreement(19, 'CYCLE', '資金時間成本', '資金長時間沒有進展，對我來說本身就是一種成本。', 'T', 'L'),
  agreement(20, 'EXPOSURE', '信心與比重', '當我對某個機會的信心明顯高於其他選項時，我傾向讓資金比重也明顯不同。', 'C', 'D'),
  agreement(21, 'FOCUS', '優先控制回撤', '即使因此少賺一段行情，我也傾向優先降低帳戶出現大幅回撤的可能。', 'P', 'A'),
  agreement(22, 'ANALYSIS', '整體市場節奏', '有些市場訊號很難拆成單一數據，但整體節奏仍能支持我的判斷。', 'I', 'R'),
  agreement(23, 'CYCLE', '接受等待', '只要原本的長期假設沒有改變，我可以接受一段時間沒有交易動作。', 'L', 'T'),
  agreement(24, 'EXPOSURE', '限制單一影響', '即使很有把握，我仍傾向限制單一部位對整體結果的影響。', 'D', 'C'),

  scenario(25, 'FOCUS', 'F1', '才剛買就遇到風險', 1, '當天突然下跌', '你今天才剛買進，市場隨即出現急跌，這個部位下跌約 3%。原本交易理由沒有失效，損失仍在預設範圍內。你比較可能怎麼做？', '維持原定部位，先讓交易按照原本計畫發展', '先降低一部分部位，等風險輪廓更清楚再決定', 'A', 'P'),
  scenario(26, 'FOCUS', 'F1', '才剛買就遇到風險', 2, '風險持續放大', '一週後價格仍劇烈波動，損失已接近、但尚未觸發原本設定的風險上限，交易理由仍可能成立。你比較可能怎麼做？', '保留剩餘核心部位，接受可能觸及原定上限以換取反轉空間', '把部位降到很小，先保留重新進場的選擇權', 'A', 'P'),
  scenario(27, 'FOCUS', 'F2', '沒研究清楚卻突然大漲', 1, '意外浮盈', '你憑初步感覺用小部位買進，還沒研究完整，股價就快速上漲 8%。你比較可能怎麼做？', '先保留部位，同時加快研究，避免太早放掉可能的上行', '先收回一部分部位，等自己真正理解後再決定是否加回', 'A', 'P'),
  scenario(28, 'FOCUS', 'F2', '沒研究清楚卻突然大漲', 2, '高點回吐', '之後股價一度大漲又回吐約一半漲幅，但仍高於成本；研究仍不足以形成高信念判斷。你比較可能怎麼做？', '重新設定可承受的回吐範圍，保留部位等待上行延續', '先保住剩餘成果，等研究完成後再重新評估', 'A', 'P'),
  scenario(29, 'ANALYSIS', 'A1', '憑感覺買進後大漲', 1, '回頭整理理由', '你原本因盤面感覺買進，股價隨後上漲。現在要決定是否續抱，你比較可能先做什麼？', '補齊可核對的資料、成立條件與失效點', '回看當時的價格反應、資金流與類股呼應是否仍存在', 'R', 'I'),
  scenario(30, 'ANALYSIS', 'A1', '憑感覺買進後大漲', 2, '消息偏空但價格強', '後來出現一項偏空消息，價格卻沒有明顯轉弱，類股資金也仍在。你比較可能怎麼判斷？', '依消息的實際影響與原定失效條件，決定是否改變交易', '把價格韌性與資金反應視為重要訊號，綜合判斷市場狀態', 'R', 'I'),
  scenario(31, 'ANALYSIS', 'A2', '突發風險與訊息衝突', 1, '利空後快速收回', '公司突然發布一項負面消息，價格開低後又快速收回大部分跌幅，細節還不完整。你比較可能先看什麼？', '先確認公告內容與可能造成的量化影響', '先觀察價格收回的力道、成交節奏與承接反應', 'R', 'I'),
  scenario(32, 'ANALYSIS', 'A2', '突發風險與訊息衝突', 2, '數據與盤面不同步', '幾天後，數據仍偏弱，但股價持續抗跌、同類股票也同步轉強。你比較可能依什麼做最後決定？', '依明確的證據權重與退出條件，決定持有、減碼或離場', '依價格、類股與資金訊號的整體一致性，判斷行情是否仍成立', 'R', 'I'),
  scenario(33, 'CYCLE', 'C1', '買進後沒有進展', 1, '短期逆向', '你買進隔天，價格小幅下跌。原本假設沒有改變，也沒有觸發退出條件。你比較可能怎麼做？', '先按原定持有週期觀察，不因一天的變化改變計畫', '立即重看短期結構，確認這筆交易是否失去原本節奏', 'L', 'T'),
  scenario(34, 'CYCLE', 'C1', '買進後沒有進展', 2, '長時間未啟動', '兩個月後，價格依然沒有明顯進展；長期假設仍在，但市場上已有其他較清楚的行情。你比較可能怎麼做？', '只要長期期望沒有改變，就接受等待並維持主要部位', '把大部分資金轉向週期較清楚的機會，等原標的啟動再回來', 'L', 'T'),
  scenario(35, 'CYCLE', 'C2', '連續虧損', 1, '連續兩筆虧損', '你依照原本規則完成兩筆交易，兩筆都小幅虧損，執行過程沒有明顯失誤。你比較可能怎麼做？', '維持原本策略，先累積足夠樣本再判斷是否失效', '先降低交易頻率，確認目前市場節奏是否仍適合這套做法', 'L', 'T'),
  scenario(36, 'CYCLE', 'C2', '連續虧損', 2, '完整樣本仍低迷', '完成一個原先設定的觀察樣本後，策略表現仍偏弱，但還無法確定是正常低潮或市場環境已改變。你比較可能怎麼做？', '保留核心策略，用更長週期資料確認是否真的失去優勢', '先把主要資金移到目前較有效的節奏，原策略只保留小規模追蹤', 'L', 'T'),
  scenario(37, 'EXPOSURE', 'E1', '最大持倉遭遇風險', 1, '最大持倉下跌', '市場突然下跌，你最大、也最有信心的持倉跟著下跌。原本假設仍在，組合損失也在預設範圍內。你比較可能怎麼做？', '維持主要部位，接受它對組合造成較大的波動', '降低最大部位比重，把風險重新分配到其他部位或現金', 'C', 'D'),
  scenario(38, 'EXPOSURE', 'E1', '最大持倉遭遇風險', 2, '分散效果降低', '一週後，原本不同的部位開始同步波動，組合相關性明顯升高。你比較可能怎麼做？', '把資金收斂到少數最理解、最有信念的部位，減少管理雜訊', '降低各部位上限，重新配置到相關性較低的方向', 'C', 'D'),
  scenario(39, 'EXPOSURE', 'E2', '多個部位連續虧損', 1, '三個部位同時虧損', '你有五個部位，其中三個開始虧損，只有一個方向仍相對強勢。整體風險仍在預算內。你比較可能怎麼做？', '把更多風險預算集中到證據最強的方向，縮減較弱部位', '維持單一部位上限，避免短期強勢部位成為新的集中風險', 'C', 'D'),
  scenario(40, 'EXPOSURE', 'E2', '多個部位連續虧損', 2, '市場開始穩定', '市場逐漸穩定，最強的方向率先回升，其他方向仍沒有明顯反應。你比較可能怎麼重新投入？', '以最強方向作為核心，等證據改變後再調整集中程度', '分批配置到幾個低相關方向，避免復甦判斷依賴單一標的', 'C', 'D'),
];

export const MOCK_TRAIT_LABELS: Record<MockTrait, string> = { A: '積極', P: '保護', R: '規則', I: '感應', L: '長週期', T: '波段', C: '集中', D: '分散' };
export const MOCK_DIMENSIONS: Array<{ key: MockDimension; label: string; left: MockTrait; right: MockTrait }> = [
  { key: 'FOCUS', label: '風險焦點', left: 'A', right: 'P' }, { key: 'ANALYSIS', label: '分析方式', left: 'R', right: 'I' },
  { key: 'CYCLE', label: '持有週期', left: 'L', right: 'T' }, { key: 'EXPOSURE', label: '配置方式', left: 'C', right: 'D' },
];
export interface MockBonus { group: string; title: string; trait?: MockTrait; }
export interface MockResult { scores: Record<MockTrait, number>; code: string; bonuses: MockBonus[]; notApplicableCount: number; }
const answerValue: Record<Exclude<MockAnswer, 'not_applicable'>, number> = { very_a: 10, somewhat_a: 7, balanced: 5, somewhat_b: 3, very_b: 0 };

export const scoreSequentialMockup = (answers: Record<number, MockAnswer>): MockResult => {
  const raw: Record<MockTrait, number> = { A: 0, P: 0, R: 0, I: 0, L: 0, T: 0, C: 0, D: 0 };
  let notApplicableCount = 0;
  FACE_SEQUENTIAL_MOCKUP_QUESTIONS.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;
    if (answer === 'not_applicable') { notApplicableCount += 1; return; }
    const value = question.imageA ? (answer === 'very_a' ? 10 : 0) : answerValue[answer];
    raw[question.traitA] += value; raw[question.traitB] += 10 - value;
  });
  const bonuses: MockBonus[] = [];
  [...new Set(FACE_SEQUENTIAL_MOCKUP_QUESTIONS.flatMap((q) => q.group ? [q.group] : []))].forEach((group) => {
    const questions = FACE_SEQUENTIAL_MOCKUP_QUESTIONS.filter((q) => q.group === group);
    const groupAnswers = questions.map((q) => answers[q.id]);
    const valid = groupAnswers.every((answer) => answer && answer !== 'balanced' && answer !== 'not_applicable');
    const sides = groupAnswers.map((answer) => answer === 'very_a' || answer === 'somewhat_a' ? 'a' : 'b');
    const trait = valid && sides.every((side) => side === sides[0]) ? (sides[0] === 'a' ? questions[0].traitA : questions[0].traitB) : undefined;
    if (trait) raw[trait] += 2;
    bonuses.push({ group, title: questions[0].groupTitle ?? group, trait });
  });
  const scores = { ...raw };
  MOCK_DIMENSIONS.forEach(({ left, right }) => { const total = raw[left] + raw[right] || 1; scores[left] = Math.round((raw[left] / total) * 100); scores[right] = 100 - scores[left]; });
  const code = MOCK_DIMENSIONS.map(({ left, right }) => scores[left] >= scores[right] ? left : right).join('');
  return { scores, code, bonuses, notApplicableCount };
};

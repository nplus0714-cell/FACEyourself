import { AGGRESSIVE_FACE_2_PROTOTYPES } from './faceProfilePrototypeAggressive';
import { CONSERVATIVE_FACE_2_PROTOTYPES } from './faceProfilePrototypeConservative';

export interface FaceTalentTurn {
  talent: string;
  overuse: string;
  marketCondition: string;
  trap: string;
}

export interface FaceTriggerChain {
  title: string;
  event: string;
  emotion: string;
  behavior: string;
  consequence: string;
  watchFor: string;
}

export interface FaceComfortItem {
  label: string;
  fit: string;
  friction: string;
}

export interface FaceSurvivalRule {
  title: string;
  when: string;
  action: string;
  check: string;
}

export interface FaceReflectionQuestion {
  phase: '過去' | '現在' | '未來';
  title: string;
  question: string;
  nudge: string;
}

export interface FaceProfilePrototype {
  code: string;
  name: string;
  animal: string;
  traits: string[];
  coreDescription: string;
  outsideView: string;
  insideVoice: string;
  talent: {
    headline: string;
    body: string[];
    conditions: string[];
  };
  talentTurns: FaceTalentTurn[];
  triggers: FaceTriggerChain[];
  selfDeception: {
    quote: string;
    context: string;
    reframe: string;
  };
  comfortZone: {
    intro: string;
    items: FaceComfortItem[];
  };
  survivalRules: FaceSurvivalRule[];
  reflectionQuestions: FaceReflectionQuestion[];
  closing: {
    headline: string;
    body: string;
  };
}

export const ARTC_FACE_2_PROTOTYPE: FaceProfilePrototype = {
  code: 'ARTC',
  name: '獵豹狙擊手',
  animal: '獵豹',
  traits: ['積極', '理性', '短期', '集中'],
  coreDescription: '你擅長等待條件成形，並在窗口出現時快速集中注意力。真正的考驗，往往不是你敢不敢出手，而是市場不給完美答案時，你能不能守住原本的標準。',
  outsideView: '別人可能覺得你出手不多，但每次按下單鍵前，腦中早已跑過進場、失效與離場的路徑。盤面一旦進入你的射程，你的反應通常比討論還快。',
  insideVoice: '我不是想賭一把，我只是不能接受沒有條件的交易。我要的不是每一筆都贏，而是出手時知道自己為什麼進、什麼情況該退。',
  talent: {
    headline: '把混亂的盤面，收斂成可以執行的條件。',
    body: [
      '你可能比其他交易者更自然地把雜訊排除，盯住少數關鍵訊號，並在條件成立時迅速行動。這種「先定義、再執行」的能力，讓你在需要速度的決策裡不容易拖泥帶水。',
      '你真正的優勢不只是快，而是願意在出手前先想清楚什麼會證明這筆交易失效。當規則清楚、節奏明確時，你的專注與執行力會同時上線。',
    ],
    conditions: [
      '價格與量能出現可辨識的結構',
      '進場、失效與離場條件能事先寫清楚',
      '同時追蹤的標的不多，注意力可以集中',
      '市場有節奏可跟，而不是毫無方向地來回震盪',
    ],
  },
  talentTurns: [
    {
      talent: '追求精準',
      overuse: '等到所有訊號都同意才肯行動',
      marketCondition: '行情快速發動、訊號不會一次到齊',
      trap: '錯過原本的好位置後，反而在更差的位置追進。',
    },
    {
      talent: '快速執行',
      overuse: '把每一次盤中變化都當成必須回應的訊號',
      marketCondition: '盤整、假突破或雜訊很多',
      trap: '頻繁進出，被來回洗掉，交易成本與挫折一起累積。',
    },
    {
      talent: '集中火力',
      overuse: '因為看懂了，就不自覺把部位放得比計畫更大',
      marketCondition: '突發消息、跳空或流動性快速改變',
      trap: '原本可管理的判斷錯誤，變成足以干擾下一筆決策的損失。',
    },
  ],
  triggers: [
    {
      title: '看對方向，卻錯過第一個買點',
      event: '行情在你等最後一個確認時直接發動。',
      emotion: '可能先是懊悔，接著變成「不能再錯過」的急迫感。',
      behavior: '降低原本的進場標準，在延伸過遠的位置追進。',
      consequence: '一個原本不錯的判斷，最後變成風險報酬不合理的交易。',
      watchFor: '當腦中出現「再不買就來不及」時，先確認你是不是正在替踏空買單。',
    },
    {
      title: '連續幾筆都被停損',
      event: '同一套條件短時間內連續失效，甚至停損後價格立刻反彈。',
      emotion: '可能開始懷疑準星，也想趕快證明方法仍然有效。',
      behavior: '增加看盤與出手頻率，或在條件不足時提早進場。',
      consequence: '問題從幾筆正常的小損失，擴大成紀律鬆動與決策疲勞。',
      watchFor: '如果下一筆交易的主要理由是「把剛才的賺回來」，它就不是原本的交易計畫。',
    },
    {
      title: '連續做對，開始覺得盤面很好讀',
      event: '幾筆交易接連順利，帳戶與信心一起上升。',
      emotion: '可能感到自己已經抓到市場節奏，警戒自然下降。',
      behavior: '放大部位、縮短檢查流程，或把例外當成新的常態。',
      consequence: '下一筆普通的錯誤，可能吃掉前面好幾筆累積的成果。',
      watchFor: '當你想臨時放大部位時，觀察理由來自新資訊，還是只來自最近很順。',
    },
  ],
  selfDeception: {
    quote: '「這不是追價，是訊號剛確認。」',
    context: '這句話最可能出現在你錯過原本規劃的位置，卻又不想承認這筆交易的風險報酬已經改變時。',
    reframe: '訊號確認不等於任何價格都值得進場。先問：如果我沒有看到前面那段上漲，現在這個位置仍符合原計畫嗎？',
  },
  comfortZone: {
    intro: '這不是要你只做某一種商品，而是讓決策環境配合你的天然優勢。當環境不合，降低出手頻率通常比逼自己更用力有效。',
    items: [
      { label: '市場節奏', fit: '方向與結構相對清楚，訊號出現後有延續性。', friction: '無方向盤整、假突破密集、消息反覆。' },
      { label: '決策頻率', fit: '等待少數符合條件的窗口，再集中處理。', friction: '為了維持手感而整天尋找下一筆。' },
      { label: '研究方式', fit: '價格、量能、事件與交易計畫能形成一張簡短清單。', friction: '同時追太多指標，直到訊號彼此矛盾。' },
      { label: '部位管理', fit: '注意力可以集中，但每筆風險與失效點事先固定。', friction: '用信念取代部位上限，盤中才決定要不要停損。' },
      { label: '交易週期', fit: '有明確驗證窗口，時間到了就重新評估。', friction: '短線失效後，臨時把它改稱長期投資。' },
      { label: '資訊環境', fit: '只保留會改變交易條件的資訊來源。', friction: '一邊執行計畫，一邊被社群即時情緒改寫。' },
    ],
  },
  survivalRules: [
    {
      title: '錯過第一段，不降低第二次進場標準',
      when: '當行情已離開原本規劃的位置，你開始擔心再不上車就沒機會。',
      action: '重新寫一次進場、失效與預期空間；三項無法同時成立，就把這筆記為「看對但沒做」，不追。',
      check: '檢查點：你的停損距離與預期空間，是否仍和起漲前一樣合理？',
    },
    {
      title: '被停損後，重新進場必須重新取得資格',
      when: '停損後價格反彈，你很想立刻追回原部位。',
      action: '把上一筆視為已結束；重新進場必須再次滿足完整條件，不能只用「它彈回來了」當理由。',
      check: '檢查點：如果這是今天第一次看到它，你現在仍會下單嗎？',
    },
    {
      title: '連勝後的下一筆，不臨時放大部位',
      when: '最近幾筆很順，你想把握狀態加大下注。',
      action: '下一筆仍使用原先設定的單筆風險上限；任何調高上限的決定，留到收盤後重新檢查，而不是盤中改。',
      check: '檢查點：放大的依據是交易樣本與計畫，還是只是最近贏得很舒服？',
    },
  ],
  reflectionQuestions: [
    {
      phase: '過去',
      title: '回看一筆改變你的交易',
      question: '哪一次「看對卻沒賺到」，最明顯地改變了你後來的進場方式？',
      nudge: '那次經驗讓你變得更有紀律，還是更害怕錯過？',
    },
    {
      phase: '現在',
      title: '辨認你正在保護什麼',
      question: '最近一次偏離計畫時，你真正受不了的是虧損、踏空，還是原本的判斷被市場否定？',
      nudge: '先描述當時發生的事，不急著替自己找原因。',
    },
    {
      phase: '未來',
      title: '想像不必證明自己的交易',
      question: '如果你不需要靠交易績效向任何人證明能力，你還會維持現在的出手頻率與部位大小嗎？',
      nudge: '答案沒有好壞，它只是在描出你真正想要的交易生活。',
    },
  ],
  closing: {
    headline: '人格只能告訴你，你習慣怎麼交易。',
    body: '真正值得理解的是：當市場不照劇本走時，什麼在推動你的下一個決定？FACE Deep Dive 會從交易的過去、現在與未來，陪你整理成自己的交易使用說明書。',
  },
};

export const PITD_FACE_2_PROTOTYPE: FaceProfilePrototype = {
  code: 'PITD',
  name: '考拉隨行者',
  animal: '考拉',
  traits: ['保守', '感性', '短期', '分散'],
  coreDescription: '你擅長從市場氣氛、可信任的人與群體行動中收集線索，不急著證明自己是最早看見機會的人。真正的課題，不是停止聽別人，而是借用資訊時，不把最後的決定也一起借出去。',
  outsideView: '別人可能覺得你很好交換想法，也願意隨新資訊調整，不會為了面子死守原本的看法。但當持股與消息來源愈來愈多，他們有時也會好奇：這些選擇裡，哪些真正是你自己的判斷？',
  insideVoice: '我不是沒有主見，我只是知道一個人看市場很容易漏東西。聽別人的經驗可以少走彎路，但最後我也想知道，沒有任何人替我背書時，我還能不能說清楚自己為什麼做。',
  talent: {
    headline: '聽得進不同聲音，也感覺得到市場正在往哪裡聚集。',
    body: [
      '你可能比其他交易者更自然地觀察「大家開始在意什麼」。你不執著一定要做最早、最孤獨的先行者，而是願意等待市場、產業與群體提供更多線索，再決定是否跟上。',
      '你的另一項天賦是開放。新資訊出現時，你比較願意修正看法，也懂得借用別人的專業縮短學習時間。當來源可靠、趨勢可驗證，而且你保留最後一層自己的檢查，跟隨可以是一種很有效率的判斷方式。',
    ],
    conditions: [
      '市場方向與群體行動能被價格或資料驗證',
      '資訊來源透明，能說明理由而不只給結論',
      '參考別人之後，仍有一層自己的進出條件',
      '持有標的數量有限，每一個都說得出留下的原因',
    ],
  },
  talentTurns: [
    {
      talent: '願意聽不同意見',
      overuse: '每一個看起來有道理的說法都留一點位置',
      marketCondition: '題材很多、專家觀點頻繁切換',
      trap: '帳戶愈來愈分散，卻沒有一個部位真正理解得夠深。',
    },
    {
      talent: '善於跟隨趨勢',
      overuse: '等到所有人都在談，才把熱度當成安全感',
      marketCondition: '消息已廣泛擴散、價格快速延伸',
      trap: '在共識最擁擠時進場，趨勢一轉就不知道該相信誰。',
    },
    {
      talent: '不固執、願意調整',
      overuse: '每聽到一個新觀點，就改寫一次原本的計畫',
      marketCondition: '行情震盪、消息彼此矛盾',
      trap: '決策跟著最後聽見的人移動，最後只剩情緒，沒有一致標準。',
    },
  ],
  triggers: [
    {
      title: '信任的人說：「這次機會真的很大」',
      event: '熟悉的老師、朋友或群組給出明確方向，而且語氣非常有把握。',
      emotion: '可能先感到安心，接著出現「有人看過了，我不要太慢」的急迫感。',
      behavior: '還沒自己確認買進理由、失效條件，就先跟上一部分。',
      consequence: '消息一旦失效或來源沉默，你手上有部位，卻沒有自己的退出依據。',
      watchFor: '當你最強的買進理由是「他很準」時，先問自己：如果他明天不再更新，我知道怎麼處理嗎？',
    },
    {
      title: '身邊的人都在賺，只有自己還沒跟上',
      event: '社群不斷出現獲利截圖，熱門標的每天都有人討論。',
      emotion: '可能不是貪心，而是開始懷疑自己是不是落後、太保守或錯過共同答案。',
      behavior: '一次跟進好幾個熱門方向，用分散來降低「選錯一個」的不安。',
      consequence: '看似分散風險，實際上可能同時暴露在同一股市場情緒裡。',
      watchFor: '如果買進是為了停止旁觀的不舒服，而不是因為條件成立，先把它留在觀察清單。',
    },
    {
      title: '部位下跌，原本的意見開始分裂',
      event: '有人喊加碼、有人喊快逃，原本一致的群體突然沒有共同答案。',
      emotion: '可能感到無助，擔心自己選錯人，也不想獨自承擔決定。',
      behavior: '繼續問更多人、讀更多消息，希望找到一個能讓自己安心的結論。',
      consequence: '資訊愈多，判斷反而愈晚；最後可能在情緒最大時才被迫做決定。',
      watchFor: '當你不是在找新事實，而是在找一個同意你的人，資訊已經不再幫助決策。',
    },
  ],
  selfDeception: {
    quote: '「這麼多人都在買，應該不會只有我看錯吧。」',
    context: '這句話最可能出現在你說不清楚自己的理由，卻因為市場共識很強而暫時感到安心時。',
    reframe: '很多人可能只是看見同一則消息。人氣可以是線索，但不能替代退出計畫。先問：如果討論熱度明天消失，我還知道自己在等什麼嗎？',
  },
  comfortZone: {
    intro: '你不需要把自己訓練成完全不聽別人的獨行者。更適合你的方式，是建立一套「可以參考，但必須親自驗證」的資訊環境。',
    items: [
      { label: '市場節奏', fit: '方向逐漸形成，價格、量能與群體行動彼此呼應。', friction: '只靠單一傳聞突然爆熱，隔天又換題材。' },
      { label: '決策頻率', fit: '收到新想法後保留冷靜期，再決定是否加入。', friction: '為了跟上每一次風向，頻繁新增與更換部位。' },
      { label: '研究方式', fit: '先記錄來源，再用自己的話寫出理由與失效條件。', friction: '收藏很多文章與群組訊息，卻沒有形成自己的結論。' },
      { label: '部位管理', fit: '可以分散，但設定持股數上限與每一檔的角色。', friction: '誰說好就買一點，最後不知道哪些部位最重要。' },
      { label: '交易週期', fit: '每筆都有明確檢視日，不隨盤中留言反覆改變。', friction: '買進理由來自短期熱度，套牢後才臨時改成長期。' },
      { label: '資訊環境', fit: '少數能說明邏輯、願意更新錯誤的來源。', friction: '只給代號、報酬截圖與「快上車」的即時群組。' },
    ],
  },
  survivalRules: [
    {
      title: '任何明牌，先經過一個完整冷靜期',
      when: '聽到「一定會漲」「最後上車」或熟悉的人強力推薦時。',
      action: '先只記錄代號、來源與理由，至少隔一個完整交易日再決定；期間補上自己的失效條件。',
      check: '檢查點：隔天沒有群組提醒，你是否仍能用自己的話說明為什麼值得做？',
    },
    {
      title: '講不出自己的退出理由，就先不建立部位',
      when: '你知道是誰推薦的，卻說不清什麼變化代表這個想法已經失效。',
      action: '用一句話完成「我參與是因為＿＿；如果＿＿發生，我會重新評估」。寫不出來就留在觀察清單。',
      check: '檢查點：你的答案描述的是市場條件，還是只描述推薦者的名氣？',
    },
    {
      title: '部位下跌時，不用更多意見延後原本的決定',
      when: '不同來源開始互相矛盾，你想繼續問到有人給出安心答案。',
      action: '停止新增評論，只回看買進時寫下的理由、失效條件與檢視日；新的事實可以更新計畫，新的情緒不能。',
      check: '檢查點：你現在找的是會改變判斷的資訊，還是想找一個同意你的人？',
    },
  ],
  reflectionQuestions: [
    {
      phase: '過去',
      title: '回看一次真正影響你的跟隨',
      question: '哪一次別人的建議最明顯地改變了你的交易方式？你最後學會的是一套方法，還是記住了那個人？',
      nudge: '把當時相信他的理由，和後來驗證到的事實分開寫。',
    },
    {
      phase: '現在',
      title: '辨認你想從別人那裡得到什麼',
      question: '最近一次主動問別人「這檔還能不能買」時，你真正需要的是資訊、安心，還是有人替你允許這個決定？',
      nudge: '需求不同，需要的解法也不同；先不要急著評價自己。',
    },
    {
      phase: '未來',
      title: '想像沒有群組的一個月',
      question: '如果一個月內沒有任何老師、朋友或社群可以參考，你手上的哪些部位仍願意留下？理由是什麼？',
      nudge: '留下來的理由，可能就是你自己的交易語言開始成形的地方。',
    },
  ],
  closing: {
    headline: '人格只能告訴你，你習慣怎麼交易。',
    body: '真正值得理解的是：你在聽別人意見時，借用的是資訊、信心，還是做決定的責任？FACE Deep Dive 會從交易的過去、現在與未來，陪你整理成自己的交易使用說明書。',
  },
};

export const FACE_2_PROTOTYPES: Partial<Record<string, FaceProfilePrototype>> = {
  ARTC: ARTC_FACE_2_PROTOTYPE,
  PITD: PITD_FACE_2_PROTOTYPE,
  ...AGGRESSIVE_FACE_2_PROTOTYPES,
  ...CONSERVATIVE_FACE_2_PROTOTYPES,
};

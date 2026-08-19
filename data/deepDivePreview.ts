export interface DeepDivePreview {
  code: string;
  name: string;
  animal: string;
  eyebrow: string;
  title: string;
  introduction: string;
  scene: {
    title: string;
    body: string;
    marketNote: string;
  };
  pressureSwitch: {
    title: string;
    body: string;
  };
  instinct: {
    label: string;
    thought: string;
    body: string;
  };
  chain: Array<{ label: string; body: string }>;
  choice: {
    prompt: string;
    options: Array<{ label: string; reflection: string }>;
  };
  resetCard: {
    title: string;
    duration: string;
    questions: string[];
    rule: string;
  };
  unresolvedQuestion: string;
}

export const DEEP_DIVE_PREVIEWS: Partial<Record<string, DeepDivePreview>> = {
  ARTC: {
    code: 'ARTC',
    name: '獵豹狙擊手',
    animal: '獵豹',
    eyebrow: '免費深度預覽 · 一條壓力路徑',
    title: '當一筆「條件都對」的交易，進場後立刻失效',
    introduction: '你真正難受的，可能不只是價格往反方向走，而是市場在最短時間內否定了你剛完成的判斷。這份預覽不替你預測下一步，只陪你看清那一刻，什麼正在接管決策。',
    scene: {
      title: '剛進場，就被市場打回來',
      body: '你等待許久的價格結構終於出現，量能、位置與風險報酬都在原本設定的範圍內。你依計畫進場，但接下來兩根價格快速跌回突破區，原本清楚的失效線開始逼近。',
      marketNote: '重點不在猜它會不會再漲，而在觀察：當市場否定你的速度比預期更快時，你會如何處理「我可能判斷錯了」這件事。',
    },
    pressureSwitch: {
      title: '你的壓力開關：判斷被快速否定',
      body: 'ARTC 通常能接受事先定義的風險，卻可能特別難接受「完整研究後仍然立刻失效」。壓力會把問題從「條件還成立嗎？」悄悄換成「我怎麼可能看錯？」。',
    },
    instinct: {
      label: '第一本能',
      thought: '再確認一下，也許只是洗盤。',
      body: '你可能立刻補找資訊、放大短週期訊號，或重新解釋原本的失效條件。這不是因為你沒有規則，而是專注力開始替原本的判斷辯護。',
    },
    chain: [
      { label: '條件成立', body: '等待完成，快速進場。' },
      { label: '立即失效', body: '市場比預期更快跌回關鍵區。' },
      { label: '自我質疑', body: '不只懷疑交易，也開始懷疑自己的判斷能力。' },
      { label: '重新解釋', body: '尋找支持原看法的細節，失效線開始變得有彈性。' },
      { label: '證明衝動', body: '想延後退出、重新進場或增加曝險，把交易變成一次自我證明。' },
    ],
    choice: {
      prompt: '如果是你，最容易先做哪一件事？',
      options: [
        { label: '立刻重看訊號', reflection: '你在尋找新證據，但也要確認：你有沒有只挑支持原判斷的資訊。' },
        { label: '先照規則退出', reflection: '你守住了邊界；接下來要觀察的，是退出後是否急著重新證明自己。' },
        { label: '多等一下確認', reflection: '等待本身不是問題。真正要核對的是：這段等待在原計畫裡，還是虧損後才新增的。' },
      ],
    },
    resetCard: {
      title: '90 秒失效重啟卡',
      duration: '暫停 90 秒，不加碼、不改單、不重新進場',
      questions: [
        '原本寫下的失效條件，現在是否已經發生？',
        '我找到的是新證據，還是讓自己舒服一點的解釋？',
        '如果現在沒有持倉，我會在同一個位置重新建立這筆交易嗎？',
      ],
      rule: '三題沒有回答完以前，不做下一個動作。',
    },
    unresolvedQuestion: '當你的規則與你的自尊同時受到挑戰，你真正想保住的是資金、判斷，還是「我是一個有方法的人」這個自我形象？',
  },
};

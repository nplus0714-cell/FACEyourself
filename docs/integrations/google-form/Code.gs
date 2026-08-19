const WEBHOOK_URL = 'https://uudmqsvdtiizamsbevih.supabase.co/functions/v1/research-form-webhook';
const SURVEY_RELEASE = 'google-form-v2.5-24q';
const ASSESSMENT_VERSION = 'face-baseline-24q-v3.0-two-stage';
const BIPOLAR = ['非常接近 A', '比較接近 A', '兩者都有可能', '比較接近 B', '非常接近 B', '這個情境不適用於我'];

const CALIBRATION = {
  focus: { title: '[校準01] 你認為自己的交易風格比較接近哪一側？', choices: ['非常偏積極', '比較偏積極', '介於兩者之間', '比較偏保守', '非常偏保守'] },
  analysis: { title: '[校準02] 做交易決策時，你通常比較依賴哪一側？', choices: ['非常依賴數據與規則', '比較依賴數據與規則', '兩種方式並用', '比較依賴盤面感受', '非常依賴盤面感受'] },
  cycle: { title: '[校準03] 你通常比較偏好哪一種持有方式？', choices: ['非常偏向長期持有', '比較偏向長期持有', '兩種方式並用', '比較偏向掌握波段', '非常偏向掌握波段'] },
  exposure: { title: '[校準04] 你通常比較偏好哪一種資金配置？', choices: ['非常偏向集中配置', '比較偏向集中配置', '介於兩者之間', '比較偏向分散配置', '非常偏向分散配置'] },
  difficult: '[回饋01] 這份問卷中，有哪些題目讓你特別難以選擇？為什麼？',
  repetitive: '[回饋02] 你覺得哪些題目的內容或情境較為重複？',
  neither: '[回饋03] 是否有題目的兩個選項都不像你？請寫下題號或簡單描述。',
  realism: { title: '[回饋04] 整體而言，這份問卷呈現的交易情境是否貼近你的實際經驗？', choices: ['非常貼近', '大致貼近', '一半貼近', '不太貼近', '完全不貼近'] },
};

const MARKET_RESEARCH = {
  experience: { title: '[背景01] 你接觸投資或交易大約多久？', choices: ['尚未開始／不到 1 年', '1～3 年', '3～5 年', '5～10 年', '10 年以上'] },
  frequency: { title: '[背景02] 你目前大約多久會做一次買進、賣出或調整部位？', choices: ['幾乎每天', '每週數次', '每月數次', '每季數次', '很少交易／目前沒有交易'] },
  challenge: {
    title: '[需求01] 交易時，哪些事情最容易讓你卡住？（可複選）',
    choices: ['不知道何時進場', '不知道何時賣出或停損', '容易追高或害怕錯過', '虧損時容易改變原本計畫', '資訊太多，難以形成自己的判斷', '部位與風險不知道怎麼安排', '方法很多，但很難持續執行', '目前沒有明顯困擾'],
  },
  interest: {
    title: '[需求02] 如果日後收到更完整的個人分析，你最想先看到什麼？（可複選）',
    choices: ['我的交易優勢與盲點', '壓力下最容易出現的反應', '適合我的進出場與風險提醒', '可以每天記錄情緒與決策的工具', '交易計畫與風險報酬工具', '實際交易情境與案例', '目前只想看測驗結果'],
  },
  price: {
    title: '[需求03] 如果未來有一份完整個人說明書、交易指南與實用工具，你目前比較接近哪一種想法？',
    choices: ['目前不會考慮付費', '需要先看內容再決定', '可接受 NT$199 以下', '可接受 NT$200～399', '可接受 NT$400～699', '可接受 NT$700～999', '可接受 NT$1,000 以上'],
  },
};

// [題號, 類型, 題目, A, B]
// 題目與網站 face-baseline-24q-v3.0-two-stage 完全同源；Google Form 只移除圖片呈現。
const QUESTIONS = [
  [1,'binary','如果最後都有機會賺錢，你第一眼比較喜歡哪一種走勢？','短期內快速上漲','波動較小，慢慢往上走'],
  [2,'binary','如果最後可能賺得差不多，哪一種過程比較能讓你抱得住？','中間漲跌較大','中間漲跌較小'],
  [3,'binary','準備做一筆交易時，哪個畫面比較像你？','先把買進與賣出條件寫好','看當時盤面，再決定怎麼做'],
  [4,'binary','平常找股票時，哪一種方式比較像你？','按照自己設定的條件篩選','從市場正在關注的方向尋找'],
  [5,'binary','持股漲到新高時，你更可能怎麼做？','繼續持有，讓行情走下去','先賣出一部分，把握這段漲幅'],
  [6,'binary','你通常比較像哪一種買進方式？','固定時間慢慢買進','看到適合的行情再買進'],
  [7,'binary','下面哪一種持股方式比較像你？','資金集中在少數幾檔','資金分散到比較多檔股票'],
  [8,'binary','如果總資金一樣，你比較習慣怎麼分？','讓最看好的方向占比較多','分配到幾種不同的資產'],
  [9,'bipolar','你今天剛買進，股價就跌了 3%。買進的理由沒有改變，也還沒碰到停損。你會？','照原計畫再觀察，不急著調整','先賣一部分，保留之後再買回的空間'],
  [10,'bipolar','一週後，股價還是大幅上下震盪，已經快碰到停損，但買進的理由仍然存在。你會？','保留主要部位，等到原本設定的停損再處理','現在先把部位降到很小，之後再找機會'],
  [11,'bipolar','你只是先買一點試試，還沒研究清楚，股價就大漲 8%。你會？','先留著，同時趕快把研究做完','先賣一部分，弄懂以後再決定'],
  [12,'bipolar','之後股價又把一半漲幅吐了回去。你仍然沒有研究清楚，但目前還有賺。你會？','保留部位，看行情會不會再往上','先把剩下的獲利收好，研究完再說'],
  [13,'bipolar','你原本是看盤面的感覺買進，後來股價上漲。現在要決定要不要繼續抱，你會先做什麼？','查資料，確認這家公司值得繼續持有的理由','看股價、成交量和同類股票是不是還很強'],
  [14,'bipolar','後來出現一則壞消息，但股價沒有明顯下跌，同類股票也還在上漲。你會先相信？','先判斷這則消息到底會影響公司多少','先看市場是不是根本沒把它當成嚴重壞消息'],
  [15,'bipolar','公司突然發布壞消息，股價開低後又拉了回來，消息內容還不完整。你會先看？','公告寫了什麼，以及可能造成多少影響','股價拉回的力道和成交量反應'],
  [16,'bipolar','幾天後，公司數字還是偏弱，但股價沒有再跌，同類股票也開始上漲。最後你比較依靠？','原本寫下的買進、持有與退出條件','股價、成交量和同類股票的整體反應'],
  [17,'bipolar','你買進隔天，股價小幅下跌。買進理由沒有改變，也還沒碰到停損。你會？','按照原本預計的時間繼續持有','重新看短線走勢，考慮要不要換掉'],
  [18,'bipolar','兩個月後，這檔股票還是沒什麼變化，但其他股票已經開始上漲。你會？','繼續等原本看好的股票','先把部分資金移到有行情的股票'],
  [19,'bipolar','你照原本的方法做了兩筆交易，結果都小幅虧損，但過程沒有明顯做錯。你會？','繼續照原方法做，累積更多次再判斷','先減少交易，看看現在的行情是否適合'],
  [20,'bipolar','按照原本設定的次數做完後，結果還是不太好，但你不確定只是短期不順，還是方法真的不適合現在。你會？','用更長一段時間繼續確認','先停用大部分資金，只用小部位觀察'],
  [21,'bipolar','市場突然下跌，你最大、也最有把握的持股跟著跌。買進理由沒變，整體虧損也還能接受。你會？','維持它原本較大的比重','先減碼，把部分資金移到其他持股或現金'],
  [22,'bipolar','一週後，你原本以為不同類型的股票，開始一起上漲、一起下跌。你會？','只留下自己最了解、最有把握的幾檔','降低每一檔的上限，再找不同方向分散'],
  [23,'bipolar','你有五檔持股，其中三檔正在虧損，只有一檔明顯比較強。整體虧損還能接受。你會？','增加最強那一檔的比重，減少較弱的持股','維持每一檔的上限，不讓資金全往一檔集中'],
  [24,'bipolar','市場開始穩定，最強的那一檔先漲回來，其他持股還沒什麼反應。你會怎麼重新投入？','先把最強的方向當成主要部位','分批投入幾個不同方向，不只押一檔'],
];

function setupResearchForm() {
  return setupResearchFormV25();
}

function setupResearchFormV25() {
  const properties = PropertiesService.getScriptProperties();
  const webhookSecret = properties.getProperty('WEBHOOK_SECRET');
  if (!webhookSecret) throw new Error('請先在專案設定的指令碼屬性加入 WEBHOOK_SECRET');

  const previousFormId = properties.getProperty('FORM_ID');
  if (previousFormId) {
    try {
      const previousForm = FormApp.openById(previousFormId);
      if (previousForm.getTitle().indexOf('已封存') < 0) previousForm.setTitle(`${previousForm.getTitle()}（已封存）`);
      previousForm.setAcceptingResponses(false);
    } catch (error) {
      console.warn(`無法封存先前表單：${error}`);
    }
  }

  const form = FormApp.create('交易決策與行為模式前期研究問卷');
  form.setDescription('本問卷旨在研究投資者面對不同市場情境時的決策反應。共 24 題及研究回饋，約需 8～12 分鐘。沒有標準答案，請依照最自然的反應作答。為避免影響作答，本階段不揭露完整研究假設與分類方式。原始回覆僅限研究管理使用，分析時將以代碼進行去識別化處理，不會公開可直接識別個人身分的資料。你可以自由決定是否參與，也可以隨時停止填答。');
  form.setConfirmationMessage('感謝完成本次前期研究問卷。為避免影響研究結果，本階段不會立即顯示分析分類。待資料檢核與研究階段完成後，我們會依你的通知意願寄送個人結果。');
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.addCheckboxItem().setTitle('研究參與同意').setHelpText('我已閱讀上述說明，並同意參與本次研究及使用去識別化資料進行分析。').setChoiceValues(['我同意']).setRequired(true);
  form.addTextItem().setTitle('Email（選填）').setHelpText('只有想收到個人分析結果或後續通知時才需要填寫。原始回覆將限制研究管理者存取，分析時不使用 Email 作為研究變項。').setRequired(false);
  form.addMultipleChoiceItem().setTitle('是否同意日後收到本次研究的個人分析結果？').setChoiceValues(['同意（請確認已填 Email）','不同意']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('是否願意收到相關網站上線、活動及內容通知？').setChoiceValues(['願意（請確認已填 Email）','不願意']).setRequired(true);

  QUESTIONS.forEach((question) => {
    const [number, kind, prompt, optionA, optionB] = question;
    if (number === 1 || number === 9) {
      const section = number === 1 ? '第一部分｜直覺選擇' : '第二部分｜交易情境';
      form.addPageBreakItem().setTitle(section);
    }
    const item = form.addMultipleChoiceItem().setTitle(`[Q${String(number).padStart(2,'0')}] ${prompt}`).setRequired(true);
    if (kind === 'bipolar') {
      item.setHelpText(`A｜${optionA}\n\nB｜${optionB}\n\n請選擇比較接近你當下反應的程度；如果兩種都可能，可選「兩者都有可能」。`);
      item.setChoiceValues(BIPOLAR);
    } else {
      item.setHelpText('請選擇第一眼比較接近你的選項，不需要把自己想成理想狀態。');
      item.setChoiceValues([`A｜${optionA}`, `B｜${optionB}`]);
    }
  });

  addCalibrationSection(form);
  addMarketResearchSection(form);

  const sheet = SpreadsheetApp.create('交易決策與行為模式前期研究｜v2.5 原始回覆');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  const info = sheet.insertSheet('研究設定');
  info.getRange('A1:B9').setValues([
    ['項目','內容'],
    ['研究版本', SURVEY_RELEASE],
    ['計分版本', ASSESSMENT_VERSION],
    ['表單編輯網址', form.getEditUrl()],
    ['表單填寫網址', form.getPublishedUrl()],
    ['Supabase Webhook', WEBHOOK_URL],
    ['建立時間', new Date()],
    ['資料提醒', 'Email 與答案會先存在受限的原始回覆；研究分析請使用 Supabase 去識別化資料'],
    ['安全提醒', '請勿在試算表中保存 WEBHOOK_SECRET，亦不要公開或轉寄受測者 Email'],
  ]);
  info.autoResizeColumns(1, 2);
  ScriptApp.newTrigger('onResearchFormSubmit').forForm(form).onFormSubmit().create();
  properties.setProperties({ FORM_ID: form.getId(), SHEET_ID: sheet.getId(), FORM_VERSION: SURVEY_RELEASE });
  console.log(JSON.stringify({ formId: form.getId(), editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl(), sheetUrl: sheet.getUrl(), surveyRelease: SURVEY_RELEASE }));
}

function addCalibrationSection(form) {
  form.addPageBreakItem().setTitle('第三部分｜自我評估與問卷回饋').setHelpText('以下題目只用於檢驗問卷是否準確、清楚，不會影響你的交易行為分類結果。');
  ['focus', 'analysis', 'cycle', 'exposure'].forEach((key) => {
    const question = CALIBRATION[key];
    form.addMultipleChoiceItem().setTitle(question.title).setChoiceValues(question.choices).setRequired(true);
  });
  form.addParagraphTextItem().setTitle(CALIBRATION.difficult).setHelpText('選填；可填題號與原因。').setRequired(false);
  form.addParagraphTextItem().setTitle(CALIBRATION.repetitive).setHelpText('選填；可填題號或相似情境。').setRequired(false);
  form.addParagraphTextItem().setTitle(CALIBRATION.neither).setHelpText('選填；可填題號與比較接近你的做法。').setRequired(false);
  form.addMultipleChoiceItem().setTitle(CALIBRATION.realism.title).setChoiceValues(CALIBRATION.realism.choices).setRequired(true);
}

function addMarketResearchSection(form) {
  form.addPageBreakItem().setTitle('第四部分｜使用經驗與後續需求').setHelpText('以下題目只用於了解受測者背景與後續需求，不會影響分類結果。');
  form.addMultipleChoiceItem().setTitle(MARKET_RESEARCH.experience.title).setChoiceValues(MARKET_RESEARCH.experience.choices).setRequired(true);
  form.addMultipleChoiceItem().setTitle(MARKET_RESEARCH.frequency.title).setChoiceValues(MARKET_RESEARCH.frequency.choices).setRequired(true);
  form.addCheckboxItem().setTitle(MARKET_RESEARCH.challenge.title).setChoiceValues(MARKET_RESEARCH.challenge.choices).setRequired(true);
  form.addCheckboxItem().setTitle(MARKET_RESEARCH.interest.title).setChoiceValues(MARKET_RESEARCH.interest.choices).setRequired(true);
  form.addMultipleChoiceItem().setTitle(MARKET_RESEARCH.price.title).setChoiceValues(MARKET_RESEARCH.price.choices).setRequired(true);
}

function onResearchFormSubmit(event) {
  const properties = PropertiesService.getScriptProperties();
  const responses = {};
  event.response.getItemResponses().forEach((itemResponse) => responses[itemResponse.getItem().getTitle()] = itemResponse.getResponse());
  const answers = {};
  Object.keys(responses).forEach((title) => {
    const match = title.match(/^\[Q(\d{2})\]/);
    if (!match) return;
    const number = Number(match[1]);
    const code = `face-v2-${match[1]}`;
    const value = responses[title];
    if (number <= 8) {
      answers[code] = String(value).startsWith('A｜') ? 'A' : 'B';
      return;
    }
    answers[code] = ({'非常接近 A':'very_a','比較接近 A':'somewhat_a','兩者都有可能':'balanced','比較接近 B':'somewhat_b','非常接近 B':'very_b','這個情境不適用於我':'not_applicable'})[value];
  });

  const resultConsent = String(responses['是否同意日後收到本次研究的個人分析結果？'] || '').startsWith('同意');
  const marketingConsent = String(responses['是否願意收到相關網站上線、活動及內容通知？'] || '').startsWith('願意');
  const payload = {
    responseId: event.response.getId(),
    formId: event.source.getId(),
    submittedAt: event.response.getTimestamp().toISOString(),
    surveyRelease: SURVEY_RELEASE,
    assessmentVersion: ASSESSMENT_VERSION,
    instrumentMode: 'google-form-text-only',
    consentResearch: Array.isArray(responses['研究參與同意']) ? responses['研究參與同意'].indexOf('我同意') >= 0 : String(responses['研究參與同意']).includes('我同意'),
    email: responses['Email（選填）'] || '',
    consentResultEmail: resultConsent,
    consentMarketing: marketingConsent,
    answers,
    calibration: {
      focus: responses[CALIBRATION.focus.title],
      analysis: responses[CALIBRATION.analysis.title],
      cycle: responses[CALIBRATION.cycle.title],
      exposure: responses[CALIBRATION.exposure.title],
      realism: responses[CALIBRATION.realism.title],
    },
    feedback: {
      difficult: responses[CALIBRATION.difficult] || '',
      repetitive: responses[CALIBRATION.repetitive] || '',
      neither: responses[CALIBRATION.neither] || '',
    },
    market: {
      experience: responses[MARKET_RESEARCH.experience.title],
      frequency: responses[MARKET_RESEARCH.frequency.title],
      challenge: responses[MARKET_RESEARCH.challenge.title] || [],
      interest: responses[MARKET_RESEARCH.interest.title] || [],
      price: responses[MARKET_RESEARCH.price.title],
    },
  };

  const response = UrlFetchApp.fetch(WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    headers: { 'x-research-secret': properties.getProperty('WEBHOOK_SECRET') },
  });
  if (response.getResponseCode() >= 300) throw new Error(`Supabase webhook ${response.getResponseCode()}: ${response.getContentText()}`);
}

function showSetupResult() {
  const properties = PropertiesService.getScriptProperties();
  const form = FormApp.openById(properties.getProperty('FORM_ID'));
  const sheet = SpreadsheetApp.openById(properties.getProperty('SHEET_ID'));
  console.log(JSON.stringify({ editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl(), sheetUrl: sheet.getUrl(), surveyRelease: properties.getProperty('FORM_VERSION') }));
}

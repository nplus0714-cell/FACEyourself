const WEBHOOK_URL = 'https://uudmqsvdtiizamsbevih.supabase.co/functions/v1/research-form-webhook';
const AGREEMENT = ['非常同意', '有些同意', '中立／不一定', '有些不同意', '非常不同意'];
const BIPOLAR = ['非常接近 A', '比較接近 A', '兩者都有可能', '比較接近 B', '非常接近 B', '這個情境不適用於我'];

const QUESTIONS = [
  [1,'intuition','一個潛在報酬很高、但資訊還不完整的機會出現時，你第一個想確認的是：','上行空間可能有多大？','最壞情況可能損失多少？'],
  [2,'intuition','需要在有限時間內做交易決定時，你會先抓住：','可以核對的條件與證據','盤面節奏與資金反應'],
  [3,'intuition','哪一種投資過程更接近你想要的感覺？','陪一個看懂的標的走過完整成長週期','把握一段明確行情，結束後尋找下一個機會'],
  [4,'intuition','當你對某一個機會的信心明顯高於其他選項，更自然的做法是：','把較多資金放在這個少數高信念機會','把資金分配給幾個各有理由的機會'],
  [5,'intuition','哪一種結果對你來說更難接受？','看對大方向，卻因參與太少而幾乎沒賺到','判斷錯誤，讓帳戶出現明顯回撤'],
  [6,'intuition','面對沒有標準答案的市場時，你通常更信任：','可以在事前寫下、事後檢驗的方法','長期觀察後形成、能讀懂情境變化的市場感'],
  [7,'intuition','哪一種狀況更容易打亂你的交易節奏？','為了找短線機會頻繁進出','資金長時間停在沒有進展的部位'],
  [8,'intuition','配置資金時，哪一個方向對你更自然？','讓資金明顯集中在最有把握的少數機會','讓多個不同機會共同影響整體結果'],
  [9,'preference','如果兩種走勢都有獲利機會，你比較偏好哪一種持有體驗？','短期快速拉升，過程波動可能較明顯','較平穩地逐步上行，等待時間可能較長'],
  [10,'preference','如果長期期望報酬相近，你比較能接受哪一種價格路徑？','價格波動較大，但可能較早出現明顯漲幅','價格波動較小，以較穩定的節奏逐步累積'],
  [11,'preference','準備做一筆交易時，哪種方式比較像你？','交易前先寫好條件與計畫','先觀察盤面，再依變化決定'],
  [12,'preference','你平常比較像哪一種選股方式？','依數據與條件篩選標的','從市場熱門題材與強勢股尋找機會'],
  [13,'preference','你的持股創下新高時，你通常比較想怎麼做？','只要長期理由仍在，就繼續持有','依短期行情節奏分批賣出'],
  [14,'preference','投入資金時，哪種節奏比較像你？','固定時間投入，不特別判斷進場時點','觀察行情變化後，再決定何時投入'],
  [15,'preference','你通常會怎麼安排持股數量？','集中持有少數較有把握的標的','分散持有多個不同標的'],
  [16,'preference','哪一種資產配置方式比較像你？','以一項主要資產或策略為核心','配置多種資產與不同策略'],
  [17,'agreement','面對上行空間與回撤風險都較大的機會，我通常願意承受較大的短期波動來換取上行。','',''],
  [18,'agreement','我比較信任能在事前寫成條件、事後回頭檢驗的買進理由。','',''],
  [19,'agreement','資金長時間沒有進展，對我來說本身就是一種成本。','',''],
  [20,'agreement','當我對某個機會的信心明顯高於其他選項時，我傾向讓資金比重也明顯不同。','',''],
  [21,'agreement','即使因此少賺一段行情，我也傾向優先降低帳戶出現大幅回撤的可能。','',''],
  [22,'agreement','有些市場訊號很難拆成單一數據，但整體節奏仍能支持我的判斷。','',''],
  [23,'agreement','只要原本的長期假設沒有改變，我可以接受一段時間沒有交易動作。','',''],
  [24,'agreement','即使很有把握，我仍傾向限制單一部位對整體結果的影響。','',''],
  [25,'scenario','你今天才剛買進，市場隨即出現急跌，這個部位下跌約 3%。原本交易理由沒有失效，損失仍在預設範圍內。你比較可能怎麼做？','維持原定部位，先讓交易按照原本計畫發展','先降低一部分部位，等風險輪廓更清楚再決定'],
  [26,'scenario','一週後價格仍劇烈波動，損失已接近、但尚未觸發原本設定的風險上限，交易理由仍可能成立。你比較可能怎麼做？','保留剩餘核心部位，接受可能觸及原定上限以換取反轉空間','把部位降到很小，先保留重新進場的選擇權'],
  [27,'scenario','你憑初步感覺用小部位買進，還沒研究完整，股價就快速上漲 8%。你比較可能怎麼做？','先保留部位，同時加快研究，避免太早放掉可能的上行','先收回一部分部位，等自己真正理解後再決定是否加回'],
  [28,'scenario','之後股價一度大漲又回吐約一半漲幅，但仍高於成本；研究仍不足以形成高信念判斷。你比較可能怎麼做？','重新設定可承受的回吐範圍，保留部位等待上行延續','先保住剩餘成果，等研究完成後再重新評估'],
  [29,'scenario','你原本因盤面感覺買進，股價隨後上漲。現在要決定是否續抱，你比較可能先做什麼？','補齊可核對的資料、成立條件與失效點','回看當時的價格反應、資金流與類股呼應是否仍存在'],
  [30,'scenario','後來出現一項偏空消息，價格卻沒有明顯轉弱，類股資金也仍在。你比較可能怎麼判斷？','依消息的實際影響與原定失效條件，決定是否改變交易','把價格韌性與資金反應視為重要訊號，綜合判斷市場狀態'],
  [31,'scenario','公司突然發布一項負面消息，價格開低後又快速收回大部分跌幅，細節還不完整。你比較可能先看什麼？','先確認公告內容與可能造成的量化影響','先觀察價格收回的力道、成交節奏與承接反應'],
  [32,'scenario','幾天後，數據仍偏弱，但股價持續抗跌、同類股票也同步轉強。你比較可能依什麼做最後決定？','依明確的證據權重與退出條件，決定持有、減碼或離場','依價格、類股與資金訊號的整體一致性，判斷行情是否仍成立'],
  [33,'scenario','你買進隔天，價格小幅下跌。原本假設沒有改變，也沒有觸發退出條件。你比較可能怎麼做？','先按原定持有週期觀察，不因一天的變化改變計畫','立即重看短期結構，確認這筆交易是否失去原本節奏'],
  [34,'scenario','兩個月後，價格依然沒有明顯進展；長期假設仍在，但市場上已有其他較清楚的行情。你比較可能怎麼做？','只要長期期望沒有改變，就接受等待並維持主要部位','把大部分資金轉向週期較清楚的機會，等原標的啟動再回來'],
  [35,'scenario','你依照原本規則完成兩筆交易，兩筆都小幅虧損，執行過程沒有明顯失誤。你比較可能怎麼做？','維持原本策略，先累積足夠樣本再判斷是否失效','先降低交易頻率，確認目前市場節奏是否仍適合這套做法'],
  [36,'scenario','完成一個原先設定的觀察樣本後，策略表現仍偏弱，但還無法確定是正常低潮或市場環境已改變。你比較可能怎麼做？','保留核心策略，用更長週期資料確認是否真的失去優勢','先把主要資金移到目前較有效的節奏，原策略只保留小規模追蹤'],
  [37,'scenario','市場突然下跌，你最大、也最有信心的持倉跟著下跌。原本假設仍在，組合損失也在預設範圍內。你比較可能怎麼做？','維持主要部位，接受它對組合造成較大的波動','降低最大部位比重，把風險重新分配到其他部位或現金'],
  [38,'scenario','一週後，原本不同的部位開始同步波動，組合相關性明顯升高。你比較可能怎麼做？','把資金收斂到少數最理解、最有信念的部位，減少管理雜訊','降低各部位上限，重新配置到相關性較低的方向'],
  [39,'scenario','你有五個部位，其中三個開始虧損，只有一個方向仍相對強勢。整體風險仍在預算內。你比較可能怎麼做？','把更多風險預算集中到證據最強的方向，縮減較弱部位','維持單一部位上限，避免短期強勢部位成為新的集中風險'],
  [40,'scenario','市場逐漸穩定，最強的方向率先回升，其他方向仍沒有明顯反應。你比較可能怎麼重新投入？','以最強方向作為核心，等證據改變後再調整集中程度','分批配置到幾個低相關方向，避免復甦判斷依賴單一標的']
];

function setupResearchForm() {
  const properties = PropertiesService.getScriptProperties();
  const webhookSecret = properties.getProperty('WEBHOOK_SECRET');
  if (!webhookSecret) throw new Error('請先在專案設定的指令碼屬性加入 WEBHOOK_SECRET');

  const previousFormId = properties.getProperty('FORM_ID');
  if (previousFormId) {
    try {
      const previousForm = FormApp.openById(previousFormId);
      if (previousForm.getTitle().indexOf('技術草稿') < 0) previousForm.setTitle(`${previousForm.getTitle()}（技術草稿，請勿發布）`);
      previousForm.setAcceptingResponses(false);
    } catch (error) {
      console.warn(`無法標記先前表單：${error}`);
    }
  }

  const form = FormApp.create('交易決策與行為模式前期研究問卷');
  form.setDescription('本問卷旨在研究投資者面對不同市場情境時的決策反應。共40題，約需8～12分鐘，沒有標準答案，請依照最自然的反應作答。為避免影響作答，本階段不揭露完整研究假設與分類方式；研究完成後將提供補充說明。回答將以代碼保存並用於統計分析，不會公開可直接識別個人身分的資料。你可以自由決定是否參與，也可以隨時停止填答。');
  form.setConfirmationMessage('感謝完成本次前期研究問卷。為避免影響研究結果，本階段不會立即顯示分析分類。待資料檢核與研究階段完成後，我們會依你的通知意願寄送個人結果。');
  form.setProgressBar(true);
  form.setCollectEmail(false);
  form.addCheckboxItem().setTitle('研究參與同意').setHelpText('我已閱讀上述說明，並同意參與本次研究及使用匿名化資料進行分析。').setChoiceValues(['我同意']).setRequired(true);
  form.addTextItem().setTitle('Email').setHelpText('僅用於日後寄送本次研究的個人分析結果；Email 將與答案分開保存。').setRequired(true);
  form.addMultipleChoiceItem().setTitle('是否同意日後收到本次研究的個人分析結果？').setChoiceValues(['同意','不同意']).setRequired(true);
  form.addMultipleChoiceItem().setTitle('是否願意收到相關網站上線、活動及內容通知？').setChoiceValues(['願意','不願意']).setRequired(true);

  QUESTIONS.forEach((question, index) => {
    const [number, kind, prompt, optionA, optionB] = question;
    if (number === 1 || number === 9 || number === 17 || number === 25) {
      const section = number === 1 ? '第一部分｜直覺選擇' : number === 9 ? '第二部分｜交易偏好選擇' : number === 17 ? '第三部分｜同意程度' : '第四部分｜市場情境';
      form.addPageBreakItem().setTitle(section);
    }
    const item = form.addMultipleChoiceItem().setTitle(`[Q${String(number).padStart(2,'0')}] ${prompt}`).setRequired(true);
    if (kind === 'agreement') item.setHelpText('請選擇你對這句描述的同意程度。');
    if (kind === 'scenario') item.setHelpText(`A｜${optionA}\n\nB｜${optionB}\n\n請依你當下比較可能採取的做法選擇；若兩者都可能，請選「兩者都有可能」。`);
    item.setChoiceValues(kind === 'agreement' ? AGREEMENT : kind === 'scenario' ? BIPOLAR : [`A｜${optionA}`, `B｜${optionB}`]);
  });

  const sheet = SpreadsheetApp.create('交易決策與行為模式前期研究｜原始回覆');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  const info = sheet.insertSheet('研究設定');
  info.getRange('A1:B6').setValues([
    ['項目','內容'], ['表單編輯網址', form.getEditUrl()], ['表單填寫網址', form.getPublishedUrl()],
    ['Supabase Webhook', WEBHOOK_URL], ['建立時間', new Date()], ['注意', '請勿在試算表中直接公開或轉寄受測者 Email'],
  ]);
  info.autoResizeColumns(1, 2);
  ScriptApp.newTrigger('onResearchFormSubmit').forForm(form).onFormSubmit().create();
  properties.setProperties({ FORM_ID: form.getId(), SHEET_ID: sheet.getId() });
  console.log(JSON.stringify({ formId: form.getId(), editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl(), sheetUrl: sheet.getUrl() }));
}

function convertCurrentFormToTextOnly() {
  const properties = PropertiesService.getScriptProperties();
  const form = FormApp.openById(properties.getProperty('FORM_ID'));
  let removedImages = 0;

  for (let index = form.getItems().length - 1; index >= 0; index -= 1) {
    if (form.getItems()[index].getType() === FormApp.ItemType.IMAGE) {
      form.deleteItem(index);
      removedImages += 1;
    }
  }

  form.getItems().forEach((formItem) => {
    if (formItem.getType() === FormApp.ItemType.PAGE_BREAK) {
      const page = formItem.asPageBreakItem();
      if (page.getTitle() === '第二部分｜圖片選擇') page.setTitle('第二部分｜交易偏好選擇');
      return;
    }
    if (formItem.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) return;

    const item = formItem.asMultipleChoiceItem();
    const match = item.getTitle().match(/^\[Q(\d{2})\]/);
    if (!match) return;
    const question = QUESTIONS.find((entry) => entry[0] === Number(match[1]));
    if (!question) return;

    const [number, kind, prompt, optionA, optionB] = question;
    item.setTitle(`[Q${String(number).padStart(2,'0')}] ${prompt}`);
    item.setHelpText(kind === 'agreement'
      ? '請選擇你對這句描述的同意程度。'
      : kind === 'scenario'
        ? `A｜${optionA}\n\nB｜${optionB}\n\n請依你當下比較可能採取的做法選擇；若兩者都可能，請選「兩者都有可能」。`
        : '');
    item.setChoiceValues(kind === 'agreement' ? AGREEMENT : kind === 'scenario' ? BIPOLAR : [`A｜${optionA}`, `B｜${optionB}`]);
  });

  form.setAcceptingResponses(true);
  console.log(JSON.stringify({ removedImages, editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl() }));
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
    if (number <= 16) answers[code] = String(value).startsWith('A｜') ? 'A' : 'B';
    else if (number <= 24) answers[code] = ({'非常同意':'very_agree','有些同意':'somewhat_agree','中立／不一定':'neutral','有些不同意':'somewhat_disagree','非常不同意':'very_disagree'})[value];
    else answers[code] = ({'非常接近 A':'very_a','比較接近 A':'somewhat_a','兩者都有可能':'balanced','比較接近 B':'somewhat_b','非常接近 B':'very_b','這個情境不適用於我':'not_applicable'})[value];
  });
  const resultConsent = responses['是否同意日後收到本次研究的個人分析結果？'] === '同意';
  const marketingConsent = responses['是否願意收到相關網站上線、活動及內容通知？'] === '願意';
  const payload = {
    responseId: event.response.getId(), formId: event.source.getId(), submittedAt: event.response.getTimestamp().toISOString(),
    consentResearch: Array.isArray(responses['研究參與同意']) ? responses['研究參與同意'].indexOf('我同意') >= 0 : String(responses['研究參與同意']).includes('我同意'),
    email: responses['Email'], consentResultEmail: resultConsent, consentMarketing: marketingConsent, answers,
  };
  const response = UrlFetchApp.fetch(WEBHOOK_URL, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true,
    headers: { 'x-research-secret': properties.getProperty('WEBHOOK_SECRET') },
  });
  if (response.getResponseCode() >= 300) throw new Error(`Supabase webhook ${response.getResponseCode()}: ${response.getContentText()}`);
}

function showSetupResult() {
  const properties = PropertiesService.getScriptProperties();
  const form = FormApp.openById(properties.getProperty('FORM_ID'));
  const sheet = SpreadsheetApp.openById(properties.getProperty('SHEET_ID'));
  console.log(JSON.stringify({ editUrl: form.getEditUrl(), publishedUrl: form.getPublishedUrl(), sheetUrl: sheet.getUrl() }));
}

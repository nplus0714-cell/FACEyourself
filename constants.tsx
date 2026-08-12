import { PersonalityProfile } from './types';

export const FACE_MAP: Record<string, PersonalityProfile> = {
  'ARLC': {
    "id": "01",
    "code": "ARLC",
    "name": "金雕大統帥",
    "attributes": "A 積極 / R 理性 / L 長期 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-01-golden-eagle-commander-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-01-golden-eagle-commander-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-01-golden-eagle-commander-landscape.png",
    "portrait": "海中智商最高的頂級掠食者，擁有冷酷的邏輯與極致的耐心。懂得利用複利洋流節省體力，狩獵風格是「三年不開張，開張吃三年」，目標是鎖定擁有護城河的超級獵物並重倉咬住。是巴菲特與蒙格的忠實信徒。",
    "motto": "最好的操作就是什麼都不做；我看準了，我重壓，然後我去睡覺。",
    "psychology": {
      "mechanism": "智力傲慢與孤獨感。深受確認偏誤與過度自信影響，容易愛上自己的判斷，當市場與分析背道而馳時會感到「智力羞辱感」。",
      "scene": "最難受的時刻是「垃圾股狂飆」。看著鄰居買迷因股賺錢而績效股不動時，會因相對剝奪感而在黎明前放棄價值。"
    },
    "blindSpots": [
      { "title": "價值陷阱", "description": "誤把「夕陽產業」當成「被低估的價值股」，在股價腰斬時不檢討基本面，反而興奮加碼攤平。", "behavior": "股價越跌越買，堅信模型告訴你的「現在更便宜了」，結果抱著沉船入海。" },
      { "title": "流動性風險", "description": "持倉過度集中（僅 3 到 5 檔且相關性高），遇到人急需用錢或黑天鵝事件時，資產面臨毀滅性打擊。", "behavior": "當特定產業遭遇逆風，淨值回撤比大盤劇烈得多。" }
    ],
    "exercises": [
      { "title": "集中 → 分散：承認無知", "technique": "單一持股上限鐵律：無論多滿意，單一持股絕對不准超過總資產的 30%。", "effect": "確保在黑天鵝事件發生時，還有一張留在牌桌上的入場券。" },
      { "title": "理性 → 彈性：反向思考", "technique": "事前驗屍法：在重壓前先寫「祭文」，列出三年後導致此投資歸零的 3 個原因。", "effect": "打破確認偏誤，客觀評估潛在致命風險。" }
    ],
    "pouches": {
      "safety": "永遠保留 10% 的現金或短債作為「機會子彈」，用於崩盤時的加碼。",
      "mindset": "無聊是投資的最高境界。告訴自己：「刺激是留給賭徒的，無聊是留給贏家的。」",
      "behavior": "遠離噪音。取消關注喊多空的網紅，不看短線波動，時間刻度以「年」為單位。"
    },
    "antidote": "願你擁有看穿雜訊的智慧，也擁有承認錯誤的勇氣；只有耐得住寂寞的人，才能守得住繁華。"
  },
  'ARLD': {
    "id": "02",
    "code": "ARLD",
    "name": "北極熊謀士",
    "attributes": "A 積極 / R 理性 / L 長期 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-02-polar-bear-strategist-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-02-polar-bear-strategist-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-02-polar-bear-strategist-landscape.png",
    "portrait": "擁有宏觀經濟視野與精密藍圖。選擇用「系統化」方式佈局全球，透過資產配置建立獲利帝國，不追求單一馬匹，而是買下整個賽馬場。",
    "motto": "我不需要預測哪一匹馬會贏，我直接買下整個賽馬場；只要時代在前進，我的資產就會起飛。",
    "psychology": {
      "mechanism": "理性囚籠與相對剝奪感。因數據組合穩健卻慢如烏龜，看著憑感覺賺錢的人會感到「智商受辱」。",
      "scene": "邏輯失效時最易崩潰。看著本益比高得離譜的股票狂漲，會因孤獨感而破壞紀律衝動交易。"
    },
    "blindSpots": [
      { "title": "過度優化 (Over-fitting)", "description": "過度挖掘回測數據，將資產切得太細，導致管理成本增加且績效互相抵銷。", "behavior": "持有過多不同產業 ETF，以為精準卻造成「無效分散」。" },
      { "title": "對情緒的輕視", "description": "過度依賴硬數據，忽略「情緒」是最大基本面，表格算不出價值導致錯過飆股主升段。", "behavior": "當市場情緒高昂時過早做空或減碼，堅持均值回歸卻被非理性市場輾壓。" }
    ],
    "exercises": [
      { "title": "複雜 → 簡單：建築師的減法", "technique": "核心衛星策略：將 80% 資金簡化為全市場 ETF，刪除看盤軟體，每季檢視一次。", "effect": "確保地基穩固，不因過度分析與每日雜訊受傷。" },
      { "title": "理性 → 感性：白頭鷹的加法", "technique": "擁抱強勢股與夢想基金：用 20% 衛星部位買入夢想題材，理由只寫願景不寫數據。", "effect": "滿足飛行野心，若破滅亦不傷及 80% 的核心地基。" }
    ],
    "pouches": {
      "safety": "核心絕對防禦。80% 核心部位設定自動駕駛，不得因夢想部位成敗動搖地基。",
      "mindset": "泡沫是啤酒的一部分。沒有泡沫的股市賺不到大錢，試著接受並欣賞它。",
      "behavior": "少看財報多看生活。觀察年輕人在排隊買什麼，生活觀察比落後財報更能預示趨勢。"
    },
    "antidote": "理性能讓你走得穩，但感性能讓你飛得高；偶爾脫下西裝去感受風的流動。"
  },
  'ARTC': {
    "id": "03",
    "code": "ARTC",
    "name": "獵豹狙擊手",
    "attributes": "A 積極 / R 理性 / T 交易 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-03-cheetah-sniper-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-03-cheetah-sniper-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-03-cheetah-sniper-landscape.png",
    "portrait": "擅長等待條件成形，並在窗口出現時快速集中注意力。真正的考驗不是敢不敢出手，而是市場不給完美答案時，能不能守住原本的標準。",
    "motto": "先定義，再出手；錯過可以，失去標準不行。",
    "psychology": {
      "mechanism": "你可能習慣先把交易條件定義清楚，再迅速執行；當訊號不完整時，可以觀察自己是否會在等待與急著補上機會之間擺盪。",
      "scene": "如果錯過原本規劃的進場點，值得留意踏空的懊悔是否正在降低你下一次出手的標準。"
    },
    "blindSpots": [
      { "title": "等待完美確認", "description": "條件列得太多時，訊號可能彼此矛盾，讓你在行情發動時仍然等待。", "behavior": "錯過原本的位置後，反而可能在風險報酬較差的地方追進。" },
      { "title": "把信念放進部位", "description": "看懂一個機會時，集中注意力可能不知不覺變成放大部位。", "behavior": "突發行情下，原本可管理的錯誤可能干擾後續決策。" }
    ],
    "exercises": [
      { "title": "完美 → 足夠清楚", "technique": "把進場條件收斂成三項；條件成立後依原計畫執行，不臨時加入第四個確認。", "effect": "保留精準度，也避免因訊號過多而錯過原本的決策窗口。" },
      { "title": "踏空 → 重新評估", "technique": "錯過第一個進場點後，重新計算失效位置與預期空間；不符合原標準就跳過。", "effect": "不讓懊悔替你決定第二次進場的位置。" }
    ],
    "pouches": {
      "safety": "進場前先寫下單筆風險上限與失效條件，盤中不因信心增加而放大。",
      "mindset": "錯過一筆行情不等於判斷失敗；維持標準，本身就是交易成果。",
      "behavior": "被停損後若想重新進場，必須重新跑完整條件，不能只因價格反彈。"
    },
    "antidote": "精準是你的武器，但彈性是你的防彈衣；模糊的正確勝過精確的錯誤。"
  },
  'ARTD': {
    "id": "04",
    "code": "ARTD",
    "name": "獵犬占星師",
    "attributes": "A 積極 / R 理性 / T 交易 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-04-hound-astrologer-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-04-hound-astrologer-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-04-hound-astrologer-landscape.png",
    "portrait": "狼群首領與塔台調度員。依靠「大數法則」與「期望值」，在市場中進行高頻率、多目標的戰術圍捕。相信系統性的機率優勢。",
    "motto": "我不是在賭博，我是在經營賭場；我不依賴單一運氣，我依靠系統性的機率優勢。",
    "psychology": {
      "mechanism": "資訊過載與系統焦慮。大腦處於多工高壓，害怕模型參數失靈導致狼群集體迷失方向。",
      "scene": "最痛苦的是「賺了指數賠了價差」的瞎忙時刻。高努力低回報的效率感失落引發自我懷疑。"
    },
    "blindSpots": [
      { "title": "交易摩擦成本", "description": "低估手續費、證交稅與滑價，在盤整盤時利潤被成本吃光。", "behavior": "勝率看起來不錯，但帳面上結算發現淨值沒成長，利潤都繳給了券商。" },
      { "title": "相關性陷阱", "description": "以為分散但系統性崩盤時所有強勢股相關係數趨近於 1，狼群會集體變成受驚綿羊。", "behavior": "股災時所有標的一起跌，反應速度跟不上，導致全面崩潰。" }
    ],
    "exercises": [
      { "title": "複雜 → 簡單：收斂戰線", "technique": "神奇數字 7 原則：強制規定短線交易部位同時持倉不得超過 7 檔。", "effect": "強迫進行優等生篩選，提升決策品質與反應速度。" },
      { "title": "主動 → 自動：打造機械化邊界", "technique": "全面應用條件單：進場同時設好停損與移動停利，不准手動干預。", "effect": "從高壓盯盤解脫，降低心智耗竭並避免因疲勞犯錯。" }
    ],
    "pouches": {
      "safety": "設定總曝險限制，現金水位永遠保持在 20% 以上作為休養資金。",
      "mindset": "關注「期望值」的累積而非單筆成敗。接受大部分波動只是雜訊。",
      "behavior": "盤中不過度操作，精力放盤後分析。首領在夜晚思考而非白天亂跑。"
    },
    "antidote": "不要讓追求效率變成焦慮；真正的系統化，是懂得在混亂中建立秩序。"
  },
  'AILC': {
    "id": "05",
    "code": "AILC",
    "name": "黑豹傳教士",
    "attributes": "A 積極 / I 感性 / L 長期 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-05-black-panther-evangelist-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-05-black-panther-evangelist-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-05-black-panther-evangelist-landscape.png",
    "portrait": "投資的是「未來」而非股票。\n\n對破壞式創新有宗教般的熱忱，能無視嘲笑與暴跌，用「鑽石手」死抱直到未來實現或歸零。別人在崩盤群組裡發哭哭表情，你在發你剛讀完的第 47 篇技術白皮書。",
    "motto": "別人笑我太瘋癲，我笑他人看不穿；我買的不是代碼，而是人類的下一個紀元。",
    "psychology": {
      "mechanism": "信仰綁架與身分認同。將標的與價值觀綁定，只聽利多訊息，有著「孤獨先知感」。",
      "scene": "最難受的是「漫長的死寂」。股價盤整多年而傳產股創新高時，會產生信仰無法變現的無力感。你渴望的不是財富，而是「在別人都看不懂的時候，我看懂了」的先知感；越渴望被證明是對的，就越害怕面對自己可能錯了的證據。"
    },
    "blindSpots": [
      { "title": "估值盲區", "description": "只看市場規模與成長率卻忽略價格，易在題材最熱、本益比最高時進場。", "behavior": "在歷史最高點 All in，導致需要消化長達十年的泡沫。" },
      { "title": "倖存者偏差", "description": "將「高風險」誤認為「高報酬」，忽略同類型公司失敗倒閉的機率。", "behavior": "對財報中的現金流警訊視而不見，容易踩到下市地雷。" }
    ],
    "exercises": [
      { "title": "信仰 → 證據：魔鬼代言人練習", "technique": "閱讀做空報告：強迫自己回答空頭提出的最尖銳問題，答不出來不准加碼。", "effect": "刺破同溫層泡泡，用理性檢視信仰是否經得起考驗。" },
      { "title": "狂熱 → 耐心：好公司不追高", "technique": "分批建倉藝術：將資金分 5 到 10 份，只在股價回調或無人問津時買入。", "effect": "避免高點梭哈被震碎心態，確保留在場上走完全程。" }
    ],
    "pouches": {
      "safety": "嚴禁槓桿信仰。絕對不准使用融資，槓桿會倒在黎明前的最後下殺。",
      "mindset": "愛產品不要愛股票。公司是賺錢工具不是孩子，基本面改變時要斬斷情絲。",
      "behavior": "遠離邪教。退出攻擊異己或造神運動的討論區，傳教士需要的是冷靜的教堂。"
    },
    "antidote": "夢想很貴要用閒錢買；信仰很重不要揹著槓桿去扛。"
  },
  'AILD': {
    "id": "06",
    "code": "AILD",
    "name": "松鼠收藏家",
    "attributes": "A 積極 / I 感性 / L 長期 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-06-squirrel-collector-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-06-squirrel-collector-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-06-squirrel-collector-landscape.png",
    "portrait": "依靠敏銳直覺尋找爆發趨勢，將資金分散在各種激動人心的題材。投資組合像「未來博物館」，收藏各種創新種子。",
    "motto": "這個看起來會漲，那個故事也很棒！小朋友才做選擇，我全都要！",
    "psychology": {
      "mechanism": "錯失恐懼 (FOMO) 與囤積症。怕錯過下一個特斯拉，導致持股數量膨脹到照顧不來。",
      "scene": "最感挫折的是「賺了熱鬧沒賺到錢」。因買太散，個別飆股對總資產貢獻微乎其微。"
    },
    "blindSpots": [
      { "title": "寶可夢症候群", "description": "缺乏嚴格篩選，買入一堆同質性高但品質參差不齊的公司，形成「無效分散」。", "behavior": "股災時無法檢視基本面，往往砍掉會漲的留下雜草。" },
      { "title": "遺忘與腐爛", "description": "買進後遺忘果實埋在哪。有些依靠題材炒作的公司，時間是其敵人。", "behavior": "發現股票腰斬甚至下市才驚覺。長期投資變成長期套牢。" }
    ],
    "exercises": [
      { "title": "加法 → 減法：投資斷捨離", "technique": "一進一出原則：嚴格限制持股數量固定在 10 檔左右，買新必賣舊。", "effect": "強迫比較與淘汰，提升投資組合的濃度與品質。" },
      { "title": "長期 → 期限：罐頭保鮮期管理", "technique": "便利貼投資法：買進時寫明看好理由與檢查期限，時間到理由消失即丟棄。", "effect": "防止交易標的腐爛而不知，主動清理倉庫。" }
    ],
    "pouches": {
      "safety": "核心衛星戰略：60% 資金買全市場 ETF。剩下的 40% 才是亂藏果實的遊戲區。",
      "mindset": "博物館價值在於稀有度而非數量。集中才能創造財富，而非收破爛。",
      "behavior": "定期除草日。每季砍掉績效最差、理由不再成立的後 20% 持股。"
    },
    "antidote": "別讓投資組合成了雜草叢生的荒園；學會修剪，陽光才能照進來。"
  },
  'AITC': {
    "id": "07",
    "code": "AITC",
    "name": "劍齒虎賭徒",
    "attributes": "A 積極 / I 感性 / T 交易 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-07-sabertooth-gambler-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-07-sabertooth-gambler-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-07-sabertooth-gambler-landscape.png",
    "portrait": "依靠本能與直覺生存，字典裡只有「進攻」。在轉折點全倉出擊，追求「獵殺」或是「飢餓」的極端感。",
    "motto": "聽見市場的脈搏，在那一秒全倉出擊；要嘛贏得世界，要嘛回家吃土。",
    "psychology": {
      "mechanism": "控制幻覺與多巴胺成癮。獲利是巨大成就感，連續虧損時會感到「自我價值」崩塌。",
      "scene": "最恐懼失去「盤感」。失利後會演變成「報復性交易」，為了贏回尊嚴而加倍下注。"
    },
    "blindSpots": [
      { "title": "賭徒謬誤", "description": "在高點套牢時，感性腦會認為一定會反彈，導致越跌越買加碼攤平。", "behavior": "在單邊殺盤趨勢中試圖一次翻本，是破產的直接原因。" },
      { "title": "情緒失控", "description": "虧損超過心理防線時，原始腦接管，開始瘋狂頻繁交易。", "behavior": "試圖在收盤前贏回來，結果從「小賠」變成「畢業」。" }
    ],
    "exercises": [
      { "title": "感性 → 理性：強制冷卻", "technique": "交易熔斷機制：單日虧損超 5% 即關機離開，24 小時不准看盤並去運動。", "effect": "防止情緒化暴走帶走本金，等待大腦皮質醇代謝完畢。" },
      { "title": "集中 → 分散：獲利出金法", "technique": "鎖住獲利：帳戶獲利達 20% 時，強迫提領一半轉入難變現的資產。", "effect": "確保即便爆倉，現實生活不崩潰，保留東山再起資本。" }
    ],
    "pouches": {
      "safety": "嚴禁槓桿滿倉。槓桿是用來放大勝率，不是加速死亡。永遠留一口氣。",
      "mindset": "認輸是獵人的智慧。認賠是因為市場今天不想給錢，明天還會開門。",
      "behavior": "憤怒時不按滑鼠按「伏地挺身」。用運動代謝壓力荷爾蒙。"
    },
    "antidote": "贏一次靠運氣，活得久靠克制；活著，永遠比贏一次重要。"
  },
  'AITD': {
    "id": "08",
    "code": "AITD",
    "name": "獼猴派對主",
    "attributes": "A 積極 / I 感性 / T 交易 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-08-macaque-host-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-08-macaque-host-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-08-macaque-host-landscape.png",
    "portrait": "頻率最高反應最快，在熱門股間快速切換。不愛持有愛波動，相信積少成多維持高速飛行。",
    "motto": "天下武功，唯快不破，我玩的不是股票，是心跳！",
    "psychology": {
      "mechanism": "多巴胺成癮與注意力耗竭。注意被切細碎，感到心智耗竭，月底結算常原地踏步。",
      "scene": "最崩潰是「顧此失彼」。盤勢劇烈波動時來不及處理 10 檔短線股，陷入失控感。"
    },
    "blindSpots": [
      { "title": "交易成本隱形殺手", "description": "高周轉率導致利潤被手續費與稅吃掉，是為券商打工的典型。", "behavior": "勝率不錯但帳戶水位上不去，忽視摩擦成本對複利的負值影響。" },
      { "title": "淺層注意力詛咒", "description": "對標的了解淺薄，遇洗盤時因缺乏信仰而「賣在起漲點」。", "behavior": "抱不住熱門股，賺的都是便當錢，賠的往往是醫藥費。" }
    ],
    "exercises": [
      { "title": "分散 → 集中：限制狩獵範圍", "technique": "3 檔極限法則：強制短線持倉不超過 3 檔，買新必賣舊。", "effect": "強迫去蕪存菁，大幅提升專注度與勝率。" },
      { "title": "投機 → 投資：移動停利", "technique": "讓利潤奔跑：設定從最高點回檔 10% 才出場，沒破線就抱著。", "effect": "治癒「賣飛」特效藥，讓短單有機會進化成長期獲利。" }
    ],
    "pouches": {
      "safety": "當沖客不留倉。當日虧損絕對不准凹單留倉。今日事今日畢。",
      "mindset": "按滑鼠次數不代表獲利。享受空手的寧靜也是一種持倉。",
      "behavior": "計算隱形成本。月底算出總手續費貼在螢幕，下單前先看看它。"
    },
    "antidote": "慢下來，你不會錯過世界；專注在一道浪上，遠比在十道浪裡掙扎富足。"
  },
  'PRLC': {
    "id": "09",
    "code": "PRLC",
    "name": "白鹿鑑古師",
    "attributes": "P 保守 / R 理性 / L 長期 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-09-white-deer-appraiser-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-09-white-deer-appraiser-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-09-white-deer-appraiser-landscape.png",
    "portrait": "棲息在險峻峭壁，遠離市場雜訊。專注研究財報數據尋找低估價值。確認岩石穩固才將全重壓上。",
    "motto": "眾人皆醉我獨醒；我不看價格，我只看價值。只要公司沒壞，股價腰斬正如我意。",
    "psychology": {
      "mechanism": "認知失調與孤獨感。最大痛苦是「市場不認同邏輯」，導致智商被羞辱的挫折感。",
      "scene": "最崩潰是「價值陷阱」。發現守護的是正在腐爛的石頭，損失的是判斷力信仰。"
    },
    "blindSpots": [
      { "title": "沈沒成本黑洞", "description": "保守防衛機制：「只要不賣，就只是帳面虧損」。這在個股是致命幻覺。", "behavior": "個股護城河破損時仍拒絕承認，讓資產陪著公司歸零。" },
      { "title": "配息糖衣陷阱", "description": "挑選高殖利率股卻無視股價腰斬，領的股息其實是割自己的肉。", "behavior": "以為在累積資產，其實是見證資產慢性死亡並輸掉機會成本。" }
    ],
    "exercises": [
      { "title": "信仰 → 驗證：斷扣練習", "technique": "3 燈號停扣法：營收連 6 月衰退、配息大降或產業有對手即停扣。", "effect": "防止資金投入無底洞，確保資金流向有生命力的地方。" },
      { "title": "無限 → 邊界：水位上限", "technique": "20% 強制平衡法：單一個股市值佔總資產 20% 時即停止定期定額。", "effect": "強迫分散風險，確保公司倒閉仍能東山再起。" }
    ],
    "pouches": {
      "safety": "閱讀空頭報告。無法用邏輯反駁空方觀點就不准下單，避開確認偏誤。",
      "mindset": "便宜不是買進理由。垃圾場東西也很便宜。唯有成長才是動力。",
      "behavior": "每季除草日。問自己「若今日空手，會以此價買嗎？」，若不會即停扣。"
    },
    "antidote": "別讓長期投資變成遮羞布；領股息是為了生活，不是為了安慰自己沒賠錢。"
  },
  'PRLD': {
    "id": "10",
    "code": "PRLD",
    "name": "鼴鼠導引者",
    "attributes": "P 保守 / R 理性 / L 長期 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-10-mole-guide-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-10-mole-guide-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-10-mole-guide-landscape.png",
    "portrait": "在惡劣海象中長時間滑翔而不費力。極度厭惡風險，追求萬無一失的「平安抵達」。",
    "motto": "飛得快不一定飛得遠；我不求暴利，只求軟著陸。活著，就是最大的勝利。",
    "psychology": {
      "mechanism": "損失趨避與遺憾恐懼。內心對虧損與犯錯有生理性排斥，常感「守規矩卻是輸家」。",
      "scene": "最崩潰是「通膨的嘲笑」。穩健成長 3% 卻敵不過房價便當大漲，堡壘正被腐蝕。"
    },
    "blindSpots": [
      { "title": "無效防禦", "description": "買幾十檔高相關性資產。以為分散其實是為了避險犧牲所有成長性。", "behavior": "標的報酬僅比定存好一點，付出巨大管理心力卻無效防禦。" },
      { "title": "分析癱瘓", "description": "在做決定前需要 100% 確定性，數據變成枷鎖導致錯過多頭。", "behavior": "永遠在「完美分析」中錯失行情，大跌時不敢買，反彈時說是死貓跳。" }
    ],
    "exercises": [
      { "title": "保守 → 成長：風險預算", "technique": "90/10 槓鈴策略：90% 防禦，10% 預算買入高波動成長型 ETF 當作丟了。", "effect": "顯著拉高整體報酬率抵禦通膨，心理安穩。" },
      { "title": "分散 → 簡化：相關性檢查", "technique": "精選持股：持股重疊率超 50% 即賣掉一支。持股控制在 10 檔內。", "effect": "減少管理成本，讓資金集中在真正有效的工具，避免瞎忙。" }
    ],
    "pouches": {
      "safety": "組合中必須包含「抗通膨資產」如 REITs、黃金或具漲價能力龍頭股。",
      "mindset": "不冒險是最大的風險。通膨時代任何低於 3% 報酬都是保證虧損。",
      "behavior": "定期定額大盤。放棄分析癱瘓，讓紀律取代猶豫，忘掉帳戶密碼。"
    },
    "antidote": "真正的安全感來自擁有駕馭風浪的船，別讓謹慎成為自由的腳鐐。"
  },
  'PRTC': {
    "id": "11",
    "code": "PRTC",
    "name": "鱷魚精算師",
    "attributes": "P 保守 / R 理性 / T 交易 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-11-crocodile-actuary-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-11-crocodile-actuary-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-11-crocodile-actuary-landscape.png",
    "portrait": "多疑且機警，尋找極低風險的套利機會。勝率超 90% 才重倉咬下一口即逃。哲學是絕對不賠。",
    "motto": "我從不賭博，我只在看見底牌時才下注；與其在大海中冒險，我寧願撿拾岸邊確定的貝殼。",
    "psychology": {
      "mechanism": "完美主義與錯失焦慮的矛盾。最痛苦是「看對不敢做」，陷入無限等待迴圈。",
      "scene": "最崩潰是「被軋空手」。精算隨時崩盤卻看著無視基本面狂漲，受不了衝動進場即反轉。"
    },
    "blindSpots": [
      { "title": "負偏態風險", "description": "贏 99 次撿硬幣，第 100 次遇極端黑天鵝即吐回過去三年獲利。", "behavior": "習慣在確定性高時重倉，在鐵軌上撿硬幣，代價是性命。" },
      { "title": "後視鏡開車", "description": "過度擬合過去數據，濾網設太精細過濾掉雜訊也過濾了機會。", "behavior": "變成了理論上的巨人，行動上的侏儒。" }
    ],
    "exercises": [
      { "title": "完美 → 模糊：偵查兵策略", "technique": "試單機制：訊號 70% 確認即強制打入 10% 觀察倉位當作入門費。", "effect": "賠了不痛，賺了有底氣加碼，有效治癒分析癱瘓。" },
      { "title": "短視 → 遠見：免費票策略", "technique": "零成本留倉：獲利達標時賣一半收本金。剩下部位停損設成本並忘掉它。", "effect": "消除風險厭惡感，讓狐狸也能享受到長線飆股的利潤。" }
    ],
    "pouches": {
      "safety": "黑天鵝保險。撥獲利 5 到 10% 買深價外賣權或反向 ETF，崩盤時救命。",
      "mindset": "精準是種傲慢。市場不需要被預測只需被跟隨. 模糊的正確勝過精確的錯誤。",
      "behavior": "刪除指標。圖表最多留 3 個指標。看價格本體而非看雜訊指標。"
    },
    "antidote": "別為了撿地上的六便士錯過月亮；傻勁才是讓你賺大錢的智慧。"
  },
  'PRTD': {
    "id": "12",
    "code": "PRTD",
    "name": "大象典獄長",
    "attributes": "P 保守 / R 理性 / T 交易 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-12-elephant-warden-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-12-elephant-warden-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-12-elephant-warden-landscape.png",
    "portrait": "謹慎的象群守護者，試圖用笨重身軀跳輕靈舞步。習慣分散且時刻警戒頻繁調度。",
    "motto": "我每天檢查一百道鎖，調度一千次衛兵；雖然很累且沒賺多少，但至少今晚我很安全。",
    "psychology": {
      "mechanism": "控制強迫症與無效忙碌。最痛苦是「高努力低回報」，渴望掌控一切卻被細節拖垮。",
      "scene": "最崩潰是「小幅震盪頻繁停損」。嚴格 1% 停損導致在波動中不斷被洗掉。"
    },
    "blindSpots": [
      { "title": "摩擦成本地獄", "description": "低波動資產不足以覆蓋交易成本。頻繁進出結果獲利全貢獻給券商。", "behavior": "在平靜湖面衝浪。變成了券商最愛的 VIP 與自己的打工仔。" },
      { "title": "調度陷阱", "description": "持股過多忙於處理停損卻沒看見買點。投資組合變散沙，崩盤來不及跑。", "behavior": "每天忙著「補破網」，見樹不見林，反應力被繁瑣細節消耗。" }
    ],
    "exercises": [
      { "title": "交易 → 持有：登入限制法", "technique": "強制每週只能登入一次帳戶（如週五）。平時刪除手機看盤軟體。", "effect": "過濾 80% 市場雜訊，降低摩擦成本與心理壓力。" },
      { "title": "複雜 → 簡單：ETF 替代療法", "technique": "核心 ETF 替換術：除 3 檔熟悉股外，其餘全換成全市場 ETF。", "effect": "讓 90% 資產自動化，確保績效跟上大盤並從繁瑣調度解脫。" }
    ],
    "pouches": {
      "safety": "大區間停損。改設週線級別防守點（如 20 週均線），給大象轉身空間。",
      "mindset": "無聊是賺錢特徵。好公司股價大半無聊。坐穩了就是贏家。",
      "behavior": "計算時薪。用獲利除以研究時數，算出比工讀生低的回報會讓你清醒。"
    },
    "antidote": "別讓頻繁修剪殺死了發芽的苗；大象威力在於噸位而非速度。"
  },
  'PILC': {
    "id": "13",
    "code": "PILC",
    "name": "犀牛親衛隊",
    "attributes": "P 保守 / I 感性 / L 長期 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-13-rhinoceros-guard-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-13-rhinoceros-guard-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-13-rhinoceros-guard-landscape.png",
    "portrait": "溫和但固執。依靠直覺、信任與人情決策。認定公司便誓死守護持有到天荒地老。",
    "motto": "我不懂財報，但我相信這家公司；只要它還在，我就不會離開。",
    "psychology": {
      "mechanism": "月暈效應與情感稟賦。把好公司當好股票，盲目信任產生「背叛」恐懼與責任感。",
      "scene": "最心碎是「偶像崩塌」。形象良善企業爆醜聞，不甘心導致無法賣出跟著沈船。"
    },
    "blindSpots": [
      { "title": "單點崩潰", "description": "集中且感性是危險組合。遇到產業典範轉移時資產會永久性毀滅。", "behavior": "退休金全部買一檔「大家說穩」的股，一次看錯就是歸零。" },
      { "title": "與股票談戀愛", "description": "把股票當家人。基本面轉壞卻想「陪它度過難關」。這是市場最昂貴奢侈品。", "behavior": "將情感投射在代碼上，無視賣出訊號，是慢性自殺行為。" }
    ],
    "exercises": [
      { "title": "感性 → 客觀：陌生人測試", "technique": "現金重置測試：想像持股已變現。明天醒來還會以此價買回嗎？不會即賣。", "effect": "打破沈沒成本綁架，用第三人稱視角審視愛股。" },
      { "title": "集中 → 界線：信仰停損點", "technique": "股息紅線：連續兩年股息下降或暫停發放，即無條件出清。", "effect": "不帶感情的簡單指標，幫你在爛戲拖棚前強制離場。" }
    ],
    "pouches": {
      "safety": "單一持股上限不超過總資產 20%，剩下買 ETF。為了活著見證未來。",
      "mindset": "股東不是家人。公司無感情。忠誠留給親友，對股票只需利用。",
      "behavior": "閱讀反對意見。找看空報告讀，若背脊發涼代表信仰不堪一擊。"
    },
    "antidote": "愛上股票是危險的；真正的護衛隊守護的是退休金而非股價。"
  },
  'PILD': {
    "id": "14",
    "code": "PILD",
    "name": "樹懶思想家",
    "attributes": "P 保守 / I 感性 / L 長期 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-14-sloth-thinker-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-14-sloth-thinker-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-14-sloth-thinker-landscape.png",
    "portrait": "擁有「防禦性忽略」超能力，不看就不會虧。買得散以求心安，擅長的事情是遺忘。",
    "motto": "不看就不會虧，只要我心如止水，股市波動就與我無關。",
    "psychology": {
      "mechanism": "鴕鳥心態與習得性無助。放棄掌控感以自我保護，怕發現逃避現實且無能為力。",
      "scene": "最尷尬是「被動得知壞消息」。公司掏空下市直到新聞報導才知道，有強烈羞愧感。"
    },
    "blindSpots": [
      { "title": "慢性腐爛", "description": "忽略房漏雨假裝危險不存在。錯過調整時機直到病入膏肓無法止損。", "behavior": "假裝危險不存在，對公司競爭力衰退完全無視，資產慢性腐爛。" },
      { "title": "通膨隱形殺手", "description": "持有大量現鈔或儲蓄險認為最安全。忽略購買力下降，十年後變窮。", "behavior": "看帳戶數字沒變少就安心，實則被溫水煮青蛙，損失真實購買力。" }
    ],
    "exercises": [
      { "title": "逃避 → 面對：喚醒儀式", "technique": "每季開箱法：在行事曆設盤點日，抄下現值不決策，僅「看見」它們。", "effect": "將鴕鳥心態轉化為有意識的守護，因了解而安穩。" },
      { "title": "感性 → 客觀：汰弱留強", "technique": "斷捨離清單：清除連三年沒配息或股價腰斬股，若回現金不買即賣。", "effect": "清除腐爛部位，避免資產庫變成垃圾場。" }
    ],
    "pouches": {
      "safety": "設定警報系統。總資產變動超 20% 時系統跳通知，強迫睜眼看一眼。",
      "mindset": "不動如山的前提是確定你坐的不是活火山。長期平靜來自正確選擇。",
      "behavior": "與積極者共餐。每半年聽聽外面的世界變化，確認防空洞外沒改朝換代。"
    },
    "antidote": "偶爾抬頭看看天氣，是為了確保留下的果實沒有淋濕腐爛。"
  },
  'PITC': {
    "id": "15",
    "code": "PITC",
    "name": "夜梟前哨兵",
    "attributes": "P 保守 / I 感性 / T 交易 / C 集中",
    "imageUrl": "/images/personalities-v2-landscape/v2-15-night-owl-sentinel-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-15-night-owl-sentinel-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-15-night-owl-sentinel-landscape.png",
    "portrait": "對風聲最敏感。生存哲學是極致防禦性掠奪，趨勢反轉瞬間離場。拆彈專家般的獨行俠。",
    "motto": "看見的不只是獲利，而是獲利背後那 100 種可能讓我受傷的方式。",
    "psychology": {
      "mechanism": "過度警覺與損失趨避。杏仁核常態過熱，難享受獲利，每筆單都覺攸關生死。",
      "scene": "看著 K 線跳動都覺是定時炸彈。為了安全感犧牲利潤，導致績效停滯。"
    },
    "blindSpots": [
      { "title": "賺便當錢賠醫藥費", "description": "勝率高但小賺就跑，遇跳空大跌會僵住導致大賠吃掉小利。", "behavior": "勝率高但盈虧比差，長期期望值為負。" },
      { "title": "驚弓之鳥效應", "description": "市場正常呼吸被誤判為斷氣。太早離場後回頭報復性追高變最後老鼠。", "behavior": "獲利回吐 2% 即急賣，看著噴出後受 FOMO 誘發在最高點進場。" }
    ],
    "exercises": [
      { "title": "感性 → 理性：影子停利法", "technique": "移動停損：設定以收盤最高價回檔 10% 為離場點，不破鐵律禁賣。", "effect": "無視心中恐懼吃到肥美魚身。權利交給規則而非交給心。" },
      { "title": "集中 → 分散：物理降壓法", "technique": "分離帳戶：強制 50% 資金買大盤 ETF 並封印，剩餘才玩交易。", "effect": "降低籌碼降低心跳。有了後盾更能冷靜判斷抱住獲利。" }
    ],
    "pouches": {
      "safety": "嚴禁單筆重壓。單一檔虧損不可超總本金 2%，物理切斷恐懼根源。",
      "mindset": "賣飛是必要成本。回吐利潤是繳給市場的保險費。口袋空空是因為太貪。",
      "behavior": "遮住損益欄。貼住金額顯示，只看 K 線百分比。不讓金錢跳動刺激感性。"
    },
    "antidote": "學會用規則取代恐懼，你將是沙漠中最長壽的贏家。"
  },
  'PITD': {
    "id": "16",
    "code": "PITD",
    "name": "考拉隨行者",
    "attributes": "P 保守 / I 感性 / T 交易 / D 分散",
    "imageUrl": "/images/personalities-v2-landscape/v2-16-koala-companion-landscape.png",
    "sketchImageUrl": "/images/personalities-v2-square-line/v2-16-koala-companion-square-line.png",
    "landscapeImageUrl": "/images/personalities-v2-landscape/v2-16-koala-companion-landscape.png",
    "portrait": "擅長從市場氣氛、可信任的人與群體行動中收集線索。真正的課題不是停止聽別人，而是借用資訊時，不把最後的決定也一起借出去。",
    "motto": "可以參考別人的地圖，但最後一段路，要知道自己為什麼走。",
    "psychology": {
      "mechanism": "你可能習慣先聽市場與可信任來源怎麼看，再決定是否跟上；可以觀察參考別人何時開始取代自己的驗證。",
      "scene": "當原本一致的意見突然分裂，值得留意自己是否會繼續尋找更多聲音，只為延後必須親自做的決定。"
    },
    "blindSpots": [
      { "title": "把熱度當成安全感", "description": "等到很多人都在談才跟上，可能代表共識已經相當擁擠。", "behavior": "進場後若熱度快速消失，容易因缺少自己的理由而無法判斷。" },
      { "title": "參考愈多，部位愈多", "description": "每個有道理的建議都買一點，可能讓組合看似分散、實際難以管理。", "behavior": "行情變化時，不容易說清楚每一個部位為何留下或退出。" }
    ],
    "exercises": [
      { "title": "即時跟隨 → 完整冷靜期", "technique": "收到強力推薦時先記錄來源與理由，至少隔一個完整交易日，再用自己的條件重新檢查。", "effect": "讓人氣成為線索，而不是讓急迫感直接變成部位。" },
      { "title": "別人的結論 → 自己的退出依據", "technique": "下單前完成一句話：我參與是因為＿＿；如果＿＿發生，我會重新評估。", "effect": "即使原本的資訊來源沉默，你仍知道下一步怎麼決定。" }
    ],
    "pouches": {
      "safety": "設定持股數上限；新增一個部位前，先說明它在組合裡扮演的角色。",
      "mindset": "願意參考不是沒有主見；真正的主見，是聽完之後仍能承擔最後的判斷。",
      "behavior": "每次參考外部建議都記錄來源、自己的理由與結果，分清楚你學到的是方法還是只記住某個人。"
    },
    "antidote": "可以借用別人的視野，但不要借出自己的方向盤。"
  }
};

export const getFaceCode = (scores: any): string => {
  const f = scores.A >= scores.P ? 'A' : 'P';
  const a = scores.R >= scores.I ? 'R' : 'I';
  const c = scores.L >= scores.T ? 'L' : 'T'; 
  const e = scores.C >= scores.D ? 'C' : 'D';
  return `${f}${a}${c}${e}`;
};

export const INITIAL_QUESTIONS = [
  { id: 'f1', pair: ['A', 'P'], category: 'FOCUS 動機', text: '看到極具潛力但未知的科技概念，你的本能反應是？', labels: ['尋找暴利機會，思考如何參與', '不想為未知冒險，保持觀望'] },
  { id: 'f2', pair: ['A', 'P'], category: 'FOCUS 動機', text: '投資能讓資產翻倍但有 50% 歸零風險，你會？', labels: ['願意在可控下博一次', '追求安全，完全不考慮'] },
  { id: 'f3', pair: ['A', 'P'], category: 'FOCUS 動機', text: '在聚會聽到朋友報酬率是你的一倍時，你的感受是？', labels: ['感到焦慮 (FOMO)，想試圖追上', '沒感覺，每個人有自己的節奏'] },
  { id: 'f4', pair: ['A', 'P'], category: 'FOCUS 動機', text: '你對「槓桿工具」(融資/期貨) 的看法是？', labels: ['是加速獲利的必要工具', '是危險的誘惑，應量力而為'] },
  { id: 'f5', pair: ['A', 'P'], category: 'FOCUS 動機', text: '大盤暴跌 20% 但持倉基本面沒變，你的反應是？', labels: ['相當興奮，這是大舉加碼時機', '感到擔憂，保持觀望防止災情'] },
  { id: 'a1', pair: ['R', 'I'], category: 'ANALYSIS 邏輯', text: '買入前你通常花最多時間在？', labels: ['研讀財報與計算估值', '感受趨勢與聽取專家見解'] },
  { id: 'a2', pair: ['R', 'I'], category: 'ANALYSIS 邏輯', text: '當兩者衝突，你比較相信？', labels: ['數據報表呈現的客觀事實', '累積的「盤感」與直覺'] },
  { id: 'a3', pair: ['R', 'I'], category: 'ANALYSIS 邏輯', text: '看好的數據轉差但直覺認為是短期雜訊時？', labels: ['尊重數據，立即依照規則減碼', '相信感覺，再觀察幾天'] },
  { id: 'a4', pair: ['R', 'I'], category: 'ANALYSIS 邏輯', text: '關於 AI 預測股價的看法？', labels: ['模型精準則未來可推算', '機器無法算透人性與靈感'] },
  { id: 'a5', pair: ['R', 'I'], category: 'ANALYSIS 邏輯', text: '遇到虧損時，你第一步會做什麼？', labels: ['打開報表找尋邏輯漏洞', '去社群看情緒尋求心理支持'] },
  { id: 'c1', pair: ['L', 'T'], category: 'CYCLE 頻率', text: '買進新標定時，預計持有期限是？', labels: ['三到五年以上甚至更久', '視情況賺到預期價差就走'] },
  { id: 'c2', pair: ['L', 'T'], category: 'CYCLE 頻率', text: '面對部位被「套牢」，心理建設是？', labels: ['價值還在，時間換取空間', '資金效率第一，應儘早抽身'] },
  { id: 'c3', pair: ['L', 'T'], category: 'CYCLE 頻率', text: '查看帳戶與股價的頻率是？', labels: ['頻率很低，不關心短期跳動', '隨時掌握進出場轉折點'] },
  { id: 'c4', pair: ['L', 'T'], category: 'CYCLE 頻率', text: '對「複利」兩字的實際感受？', labels: ['漫長累積後爆發的滾雪球', '太慢，應頻繁換手加速翻倍'] },
  { id: 'c5', pair: ['L', 'T'], category: 'CYCLE 頻率', text: '你認為成功的核心特質在於？', labels: ['買對資產並具備極大耐心', '具備嗅覺並果斷進出轉折'] },
  { id: 'e1', pair: ['C', 'D'], category: 'EXPOSURE 行為', text: '單一標的佔總資產的比例通常？', labels: ['超過 30%，看好就重壓', '低於 10%，傾向廣泛分散'] },
  { id: 'e2', pair: ['C', 'D'], category: 'EXPOSURE 行為', text: '關於指數型 ETF (如 0050) 的想法？', labels: ['太慢無趣，寧願精選個股', '配置重心，分散風險最有效'] },
  { id: 'e3', pair: ['C', 'D'], category: 'EXPOSURE 行為', text: '持股數量通常維持在？', labels: ['1-3 檔，專注最有把握的', '10 檔以上，追求平衡感'] },
  { id: 'e4', pair: ['C', 'D'], category: 'EXPOSURE 行為', text: '你認為「分散投資」是？', labels: ['浪費效率，平庸者的避風港', '唯一的免費午餐，降低風險'] },
  { id: 'e5', pair: ['C', 'D'], category: 'EXPOSURE 行為', text: '關於致富的路徑，你更相信？', labels: ['靠少數幾次精準重倉出擊', '靠長期穩定多樣化配置'] },
];

export const DAILY_QUESTIONS = [
  { id: 'd_f1', pair: ['A', 'P'], category: 'FOCUS 動機', text: '面對今日盤勢，你的內心更渴求？', labels: ['主動出擊，捕捉波動獲利', '退後一步，守護現有資產'] },
  { id: 'd_f2', pair: ['A', 'P'], category: 'FOCUS 動機', text: '若盤中出現急拉/急殺，你的第一反應是？', labels: ['尋找機會，試圖參與波動', '冷靜觀察，避免情緒化操作'] },
  { id: 'd_a', pair: ['R', 'I'], category: 'ANALYSIS 邏輯', text: '今日的決策主導權，你交給了？', labels: ['冷靜的邏輯與數據清單', '微妙的直覺與市場氣氛'] },
  { id: 'd_c', pair: ['L', 'T'], category: 'CYCLE 頻率', text: '今日的持倉耐心程度，你感到？', labels: ['視若無睹，堅守長期計畫', '坐立難安，想尋找轉折點'] },
  { id: 'd_e', pair: ['C', 'D'], category: 'EXPOSURE 行為', text: '今日若要調整配置，你的直覺是？', labels: ['集中籌碼，重壓最強標的', '分散風險，維持組合平衡'] },
];

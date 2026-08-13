import React from 'react';
import { ArrowDown, Eye, ShieldCheck } from 'lucide-react';
import { FACE_2_PROTOTYPES, type FaceProfilePrototype } from '../data/faceProfilePrototype';

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

const isProfileCode = (value: string | null): value is ProfileCode => Boolean(value && PROFILE_CODES.includes(value as ProfileCode));

const getInitialProfileCode = (): ProfileCode => {
  if (typeof window === 'undefined') return 'ARTC';
  const queryCode = new URLSearchParams(window.location.search).get('type')?.toUpperCase() ?? null;
  return isProfileCode(queryCode) ? queryCode : 'ARTC';
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

const getPsychologyMechanism = (text: string) => {
  if (/錯過|踏空|追高|追進|熱門|落後|上車|噴/.test(text)) return { title: 'FOMO 與後悔規避', description: '害怕再次錯過，會讓立即參與暫時比價格與條件是否合理更重要。' };
  if (/虧損|停損|賺回|追回|回本|成本|下跌/.test(text)) return { title: '損失規避與沉沒成本', description: '你想追回的可能不只金額，也包括證明上一個判斷並沒有完全錯。' };
  if (/連勝|順利|成功|獲利|信心|熟悉|擅長|相信/.test(text)) return { title: '近期偏誤與過度自信', description: '最近的順利容易被誤認為環境更可預測，讓風險上限悄悄放寬。' };
  if (/證明|看錯|認同|固執|背叛|面子|責任|挑戰|膽量|激將/.test(text)) return { title: '認知失調與自我一致性', description: '當交易結果碰到自我認同，人會傾向保護原本的故事，而不是更新判斷。' };
  if (/很久沒看|忘記|擱置|自動投入|放著不管/.test(text)) return { title: '現狀偏誤與注意力撤離', description: '不處理能暫時維持平靜，但環境、目標與風險可能已在沒有被看見時改變。' };
  if (/沒有問題|一切正常|太平|警覺下降|沒有異常/.test(text)) return { title: '正常化偏誤與警覺遞減', description: '長時間沒有事故，容易被誤認為制度已經不再重要，讓原本的防線逐步鬆開。' };
  if (/等待|確定|研究|觀望|現金|安全|不敢|延後/.test(text)) return { title: '模糊規避與不作為偏誤', description: '等待更多確定感能暫時降低焦慮，卻也可能把「還沒決定」誤當成沒有風險。' };
  if (/群組|老師|大家|消息|新聞|市場都|主流|共識/.test(text)) return { title: '社會認同與權威偏誤', description: '外部聲音能提供資訊，也可能在不知不覺中替你承擔做決定的不安。' };
  if (/規則|模型|參數|系統|數據|完美/.test(text)) return { title: '控制錯覺與過度最佳化', description: '規則帶來可控感；壓力升高時，人容易為了保住確定感而忽略環境已經改變。' };
  if (/分散|標的|部位|相關|配置|攤平/.test(text)) return { title: '分散錯覺與注意力稀釋', description: '部位數量增加不一定代表風險來源真的不同，也可能讓重要變化更難被看見。' };
  if (/故事|願景|敘事|題材|未來|想像/.test(text)) return { title: '敘事偏誤與確認偏誤', description: '一個完整的故事會提高信念感，也會讓反例看起來比較不重要。' };
  if (/波動|盯盤|焦慮|不舒服|震盪|價格/.test(text)) return { title: '短視損失厭惡', description: '檢視頻率愈高，短期波動愈容易被感覺成需要立即處理的威脅。' };
  return { title: '情緒替代', description: '當不確定感升高，情緒可能在不知不覺中取代原本用來判斷的證據。' };
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

const getDailyPrompt = (profile: FaceProfilePrototype) => {
  const action = profile.code[0] === 'A' ? '立刻做點什麼' : '先退一步保留安全感';
  const evidence = profile.code[1] === 'R' ? '尋找更多證據' : '相信當下的整體感覺';
  const timing = profile.code[2] === 'L' ? '守住原本的長期判斷' : '抓住眼前這一段波動';
  const exposure = profile.code[3] === 'C' ? '把注意力壓在一個高信念機會' : '用更多部位分散不安';
  return `今天的市場，是否讓你更想${action}、${evidence}、${timing}，或${exposure}？先記下最強的一個反應，再決定要不要行動。`;
};

const chapterMeta = [
  { id: 'face-core', number: '01', title: '你的 FACE', description: '先看懂，你在市場裡習慣怎麼做決定。' },
  { id: 'two-mirrors', number: '02', title: '兩面鏡子', description: '別人看見的表現，和你心裡真正重視的東西。' },
  { id: 'talent', number: '03', title: '你的交易天賦', description: '你不必勉強，就比較容易做好的事情。' },
  { id: 'talent-shadow', number: '04', title: '天賦的另一面', description: '優勢沒有消失，只是在壓力下被使用過頭。' },
  { id: 'triggers', number: '05', title: '你的失控觸發器', description: '市場如何從情緒開始，一步步改變你的行為。' },
  { id: 'comfort-zone', number: '06', title: '你的交易舒適圈', description: '不是限制你能做什麼，而是看懂什麼環境最消耗你。' },
  { id: 'survival-rules', number: '07', title: '你的三條生存規則', description: '把理解變成下一次能直接執行的動作。' },
  { id: 'reflection', number: '08', title: 'FACE 給你的兩個問題', description: '不急著修正自己，先看見交易背後真正保護的東西。' },
  { id: 'daily', number: '09', title: '把理解帶回今天', description: '人格是長期習慣，今天的狀態仍值得每天看見。' },
] as const;

const ChapterHeader: React.FC<{ chapter: (typeof chapterMeta)[number] }> = ({ chapter }) => (
  <header className="mb-8 md:mb-11">
    <p className="font-mono text-[13px] tracking-[0.14em] text-[#A36F63] md:text-sm">CHAPTER {chapter.number}</p>
    <h2 className="serif mt-4 text-[2rem] font-normal leading-[1.45] tracking-[0.01em] text-[#2F2925] md:text-[2.4rem]">{chapter.title}</h2>
    <p className="serif mt-3 text-[1.18rem] font-normal leading-[1.9] text-[#8F5F56] md:text-[1.35rem]">{chapter.description}</p>
  </header>
);

const SectionShell: React.FC<{
  chapter: (typeof chapterMeta)[number];
  children: React.ReactNode;
  tinted?: boolean;
}> = ({ chapter, children, tinted = false }) => (
  <section id={chapter.id} className={`border-x border-b border-[#D9CFC2] px-5 py-12 sm:px-8 md:px-14 md:py-20 ${tinted ? 'bg-[#F7F2EC]' : 'bg-[#FFFEFC]'}`}>
    <ChapterHeader chapter={chapter} />
    {children}
  </section>
);

const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`serif space-y-5 text-[1.05rem] font-normal leading-[2.1] tracking-[0.01em] text-[#554C45] md:text-[1.1rem] ${className}`}>{children}</div>
);

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[#A05F54]">{children}</span>
);

const Takeaway: React.FC<{
  label?: string;
  children: React.ReactNode;
  action?: string;
}> = ({ label = '讀到這裡，可以記住', children, action }) => (
  <aside className="mt-9 border border-[#CDBCAF] bg-[#F4EBE4] px-5 py-6 md:px-8 md:py-8">
    <p className="text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">{label}</p>
    <p className="serif mt-4 text-[1.25rem] font-normal leading-[1.85] text-[#413631] md:text-[1.45rem]">{children}</p>
    {action && <p className="serif mt-5 border-t border-[#D8C8BB] pt-5 text-[1rem] font-normal leading-8 text-[#79584D]"><span className="mr-2 text-[1.02rem] text-[#A05F54]">可以這樣做：</span>{action}</p>}
  </aside>
);

const MinorLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">{children}</p>
);

const PsychologyNote: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <aside className="mt-7 border-l-2 border-[#A36F63] bg-[#FAF6F1] px-5 py-5 md:px-7">
    <p className="text-[13px] tracking-[0.09em] text-[#9A655C] md:text-sm">投資心理視角 · {title}</p>
    <p className="serif mt-3 text-[1rem] font-normal leading-8 text-[#554C45]">{children}</p>
  </aside>
);

export const ReadingLayerPrototype: React.FC = () => {
  const [selectedCode, setSelectedCode] = React.useState<ProfileCode>(getInitialProfileCode);
  const profile = getProfile(selectedCode);
  const coreCopy = sentenceParts(profile.coreDescription);
  const comfortItems = profile.comfortZone.items.filter((item) => ['市場節奏', '決策頻率', '部位管理', '交易週期'].includes(item.label));

  const handleProfileChange = (code: ProfileCode) => {
    setSelectedCode(code);
    if (typeof window !== 'undefined') {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('type', code);
      window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <aside className="mx-auto mb-4 max-w-4xl border border-dashed border-[#B9A992] bg-[#FBFAF7] px-5 py-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
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
      </aside>

      <article className="mx-auto max-w-4xl pb-28 fade-in" key={selectedCode}>
      <header className="overflow-hidden border border-[#CFC6B8] bg-[#F4EEE7]">
        <img
          src={coverByCode[selectedCode]}
          alt={`${profile.name} ${profile.code}：${profile.traits.join('、')}。`}
          className="block h-auto w-full"
        />

        <div className="px-5 py-10 sm:px-9 md:px-14 md:py-14">
          <p className="text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">你的交易人格，一句話看懂</p>
          <p className="serif mt-5 text-[1.4rem] font-normal leading-[1.9] tracking-[0.01em] text-[#3B312C] md:text-[1.75rem]">
            {coreCopy.lead}<Highlight>{coreCopy.highlight}</Highlight>
          </p>
          <button type="button" onClick={() => document.getElementById('face-core')?.scrollIntoView({ behavior: 'smooth' })} className="mt-8 inline-flex items-center gap-2 text-sm text-[#79584D]">
            開始閱讀 <ArrowDown size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="mt-4">
        <SectionShell chapter={chapterMeta[0]}>
          <BodyText>
            <p>{dimensionCopy[profile.code[0]]} {dimensionCopy[profile.code[1]]}</p>
            <p>{dimensionCopy[profile.code[2]]} <Highlight>{dimensionCopy[profile.code[3]]}</Highlight></p>
          </BodyText>
          <div className="mt-8 grid grid-cols-2 gap-px border border-[#D9CFC2] bg-[#D9CFC2] sm:grid-cols-4">
            {profile.traits.map((trait, index) => (
              <div key={trait} className="bg-[#FBF8F4] px-4 py-5 text-center">
                <span className="font-mono text-[13px] text-[#A36F63]">{profile.code[index]}</span>
                <p className="serif mt-2 text-[1.05rem] font-normal text-[#413934]">{trait}</p>
              </div>
            ))}
          </div>
          <Takeaway action={getDecisionAction(profile)}>
            你的決策路徑通常是：先用<Highlight>{profile.traits[1]}</Highlight>形成判斷，以<Highlight>{profile.traits[2]}</Highlight>掌握節奏，再用<Highlight>{profile.traits[3]}</Highlight>配置風險。
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[1]} tinted>
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <article className="border border-[#D8CDBD] bg-white p-6 md:p-8">
              <div className="flex items-center gap-3"><Eye size={18} strokeWidth={1.4} className="text-[#9A655C]" /><MinorLabel>別人眼中的你</MinorLabel></div>
              <BodyText className="mt-5"><p>{profile.outsideView}</p></BodyText>
            </article>
            <article className="border border-[#C6B4A7] bg-[#4A3A33] p-6 text-white md:p-8">
              <p className="text-[13px] tracking-[0.1em] text-white/65 md:text-sm">你眼中的自己</p>
              <p className="serif mt-5 text-[1.18rem] font-normal leading-[2] text-white/90">「{profile.insideVoice}」</p>
            </article>
          </div>
          <Takeaway>
            外在表現與內在動機不是矛盾。你真正想守住的是：<Highlight>{firstSentence(profile.insideVoice)}</Highlight>
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[2]}>
          <p className="serif text-[1.35rem] font-normal leading-[1.85] text-[#A05F54] md:text-[1.55rem]">{profile.talent.headline}</p>
          <BodyText className="mt-7">
            {profile.talent.body.map((paragraph, index) => (
              <p key={paragraph}>{index === profile.talent.body.length - 1 ? <Highlight>{paragraph}</Highlight> : paragraph}</p>
            ))}
          </BodyText>
          <PsychologyNote title="資訊處理與風險感受">
            {getTalentPsychology(profile)}
          </PsychologyNote>
          <Takeaway action={getDecisionAction(profile)}>
            當<Highlight>{profile.talent.conditions[0]}</Highlight>時，你的天賦最容易發揮；條件消失時，降低出手頻率也是能力的一部分。
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[3]} tinted>
          <BodyText><p>同一個特質，在不同市場環境下可能是武器，也可能是陷阱。重點不是消除天賦，而是看見它什麼時候開始用過頭。</p></BodyText>
          <div className="mt-8 space-y-5">
            {profile.talentTurns.map((turn, index) => (
              <article key={turn.talent} className="border border-[#D8CDBD] bg-white px-5 py-6 md:px-8 md:py-8">
                <p className="font-mono text-[13px] tracking-[0.12em] text-[#A36F63]">0{index + 1}</p>
                <h3 className="serif mt-3 text-[1.35rem] font-normal leading-[1.7] text-[#3C332E]">{turn.talent}</h3>
                <div className="serif mt-5 space-y-4 text-[1rem] font-normal leading-8 text-[#5B524B]">
                  <p><span className="text-[#A05F54]">使用過頭：</span>{turn.overuse}</p>
                  <p><span className="text-[#887970]">常見情境：</span>{turn.marketCondition}</p>
                  <p className="border-l-2 border-[#A36F63] bg-[#F7F2EC] px-4 py-3 text-[#443A35]">{turn.trap}</p>
                </div>
                <PsychologyNote title={getPsychologyMechanism(`${turn.overuse}${turn.trap}`).title}>{getPsychologyMechanism(`${turn.overuse}${turn.trap}`).description}</PsychologyNote>
                <p className="serif mt-5 text-[1rem] font-normal leading-8 text-[#79584D]"><span className="mr-2 text-[#A05F54]">中斷動作：</span>{getInterruptAction(profile, `${turn.overuse}${turn.marketCondition}${turn.trap}`)}</p>
              </article>
            ))}
          </div>
          <Takeaway>
            你不需要消除<Highlight>{profile.talentTurns.map((turn) => turn.talent).join('、')}</Highlight>。你只需要辨認：現在是天賦在服務計畫，還是計畫正在服務情緒。
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[4]}>
          <div className="space-y-7">
            {profile.triggers.map((trigger, index) => (
              <article key={trigger.title} className="overflow-hidden border border-[#D8CDBD] bg-white">
                <header className="bg-[#4A3A33] px-5 py-6 text-white md:px-8">
                  <p className="font-mono text-[13px] tracking-[0.12em] text-white/60">SCENE 0{index + 1}</p>
                  <h3 className="serif mt-3 text-[1.35rem] font-normal leading-[1.65]">{trigger.title}</h3>
                </header>
                <div className="serif divide-y divide-[#E5DDD2] text-[1rem] font-normal leading-8 text-[#554C45]">
                  <p className="px-5 py-5 md:px-8"><span className="mr-3 text-[#A05F54]">情境</span>{trigger.event}</p>
                  <p className="px-5 py-5 md:px-8"><span className="mr-3 text-[#A05F54]">心理機制</span>{getPsychologyMechanism(`${trigger.title}${trigger.event}${trigger.emotion}${trigger.behavior}`).title}：{getPsychologyMechanism(`${trigger.title}${trigger.event}${trigger.emotion}${trigger.behavior}`).description}</p>
                  <p className="px-5 py-5 md:px-8"><span className="mr-3 text-[#A05F54]">行為偏移</span>{trigger.behavior} {trigger.consequence}</p>
                </div>
                <p className="serif border-t border-[#D8CDBD] bg-[#F4EBE4] px-5 py-5 text-[1.02rem] font-normal leading-8 text-[#443A35] md:px-8"><span className="mr-2 text-[#A05F54]">中斷動作：</span>{getInterruptAction(profile, `${trigger.title}${trigger.event}${trigger.emotion}${trigger.behavior}`)} {trigger.watchFor}</p>
              </article>
            ))}
          </div>
          <div className="mt-9 border border-[#79584D] bg-[#79584D] px-6 py-9 text-white md:px-9">
            <p className="text-[13px] tracking-[0.1em] text-white/65 md:text-sm">你最容易相信的理由</p>
            <blockquote className="serif mt-5 text-[1.8rem] font-normal leading-[1.65] md:text-[2.25rem]">{profile.selfDeception.quote}</blockquote>
            <p className="serif mt-5 text-[1rem] font-normal leading-8 text-white/75">{profile.selfDeception.context}</p>
            <p className="serif mt-6 border-t border-white/25 pt-5 text-[1rem] font-normal leading-8 text-white/90"><span className="mr-2 text-white/55">換一面鏡子：</span>{profile.selfDeception.reframe}</p>
          </div>
          <Takeaway>
            失控很少從明顯的衝動開始。它更常躲在「{profile.selfDeception.quote}」這類合理說法裡，<Highlight>讓感受慢慢取代原本的交易條件。</Highlight>
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[5]}>
          <BodyText><p>{profile.comfortZone.intro}</p></BodyText>
          <div className="mt-8 space-y-4">
            {comfortItems.map((item) => (
              <article key={item.label} className="border border-[#D8CDBD] bg-white p-5 md:grid md:grid-cols-[7rem_1fr_1fr] md:gap-7 md:p-7">
                <h3 className="serif text-[1.18rem] font-normal text-[#8F5F56]">{item.label}</h3>
                <div className="mt-5 md:mt-0"><MinorLabel>容易發揮</MinorLabel><p className="serif mt-2 text-[1rem] font-normal leading-8 text-[#554C45]">{item.fit}</p></div>
                <div className="mt-5 border-t border-[#E5DDD2] pt-5 md:mt-0 md:border-l md:border-t-0 md:pl-7 md:pt-0"><MinorLabel>較容易磨損</MinorLabel><p className="serif mt-2 text-[1rem] font-normal leading-8 text-[#554C45]">{item.friction}</p></div>
              </article>
            ))}
          </div>
          <Takeaway>
            當環境從「{comfortItems[0]?.fit}」轉向「{comfortItems[0]?.friction}」，降低頻率或部位不是退縮。<Highlight>那是在保護你的判斷品質。</Highlight>
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[6]} tinted>
          <div className="space-y-5">
            {profile.survivalRules.map((rule, index) => (
              <article key={rule.title} className="border border-[#D8CDBD] bg-white px-5 py-7 md:px-8 md:py-9">
                <p className="font-mono text-[13px] tracking-[0.12em] text-[#A36F63]">RULE 0{index + 1}</p>
                <h3 className="serif mt-3 text-[1.35rem] font-normal leading-[1.7] text-[#3C332E]">{rule.title}</h3>
                <dl className="serif mt-6 space-y-5 text-[1rem] font-normal leading-8 text-[#554C45] md:grid md:grid-cols-3 md:gap-7 md:space-y-0">
                  <div><dt className="text-[#A05F54]">何時啟動</dt><dd className="mt-2">{rule.when}</dd></div>
                  <div><dt className="text-[#A05F54]">具體動作</dt><dd className="mt-2">{rule.action}</dd></div>
                  <div><dt className="text-[#A05F54]">完成前檢查</dt><dd className="mt-2">{rule.check}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <Takeaway label="落地執行的關鍵">
            生存規則不是提醒你「更有紀律」，而是讓你在情緒出現以前，<Highlight>已經知道下一個動作是什麼。</Highlight>
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[7]}>
          <div className="space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
            {profile.reflectionQuestions.slice(0, 2).map((item, index) => (
              <article key={item.phase} className="flex min-h-[21rem] flex-col border border-[#D8CDBD] bg-white p-6">
                <p className="font-mono text-[13px] tracking-[0.11em] text-[#A36F63]">0{index + 1} · {item.phase}</p>
                <h3 className="serif mt-4 text-[1.05rem] font-normal leading-8 text-[#8F5F56]">{item.title}</h3>
                <p className="serif mt-6 text-[1.18rem] font-normal leading-[1.9] text-[#39312C]">{item.question}</p>
                <p className="serif mt-auto border-t border-[#E5DDD2] pt-5 text-[0.92rem] font-normal leading-7 text-[#7A7067]">{item.nudge}</p>
              </article>
            ))}
          </div>
          <Takeaway>
            你不需要立刻得到漂亮的答案。只要能說出<Highlight>「當時的我真正受不了什麼」</Highlight>，覺察就已經開始。
          </Takeaway>
        </SectionShell>

        <SectionShell chapter={chapterMeta[8]} tinted>
          <div className="text-center">
            <ShieldCheck size={32} strokeWidth={1.25} className="mx-auto text-[#9A655C]" aria-hidden="true" />
            <h3 className="serif mx-auto mt-6 max-w-2xl text-[1.7rem] font-normal leading-[1.75] text-[#3B312C] md:text-[2.1rem]">{profile.animal}的習慣是長期的，今天的狀態仍需要每天看見。</h3>
            <p className="serif mx-auto mt-6 max-w-2xl text-[1.05rem] font-normal leading-9 text-[#5F574F]">用八題整理今天面對盤勢時的情緒、注意力與行動傾向。完成後，結果會直接存入你的自我覺察日記。</p>
            <div className="mx-auto mt-8 max-w-2xl border border-[#CDBCAF] bg-white px-5 py-6 text-left md:px-8">
              <MinorLabel>今天可以從這裡開始</MinorLabel>
              <p className="serif mt-4 text-[1.2rem] font-normal leading-9 text-[#413631]">{getDailyPrompt(profile)}</p>
            </div>
          </div>
        </SectionShell>
      </main>

      <aside className="mt-5 border border-dashed border-[#B9A992] bg-[#FBFAF7] p-5 md:p-7">
        <p className="text-[13px] tracking-[0.1em] text-[#9A655C] md:text-sm">精簡後的內容原則</p>
        <p className="serif mt-4 text-[1rem] font-normal leading-8 text-[#5F574F]">不重複解釋人格標籤；只保留能幫助讀者辨認心理機制、看見行為偏移，或在下一次交易中中斷慣性反應的內容。</p>
      </aside>
      </article>
    </>
  );
};

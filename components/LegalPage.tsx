import React from 'react';
import { SITE_IDENTITY } from '../data/siteIdentity';

export type LegalPageKind = 'privacy' | 'terms' | 'refund' | 'data-deletion';

interface LegalPageProps {
  kind: LegalPageKind;
}

const updatedAt = '2026 年 8 月 21 日';

const ProviderCard = () => (
  <aside className="border border-[#CFC6B8] bg-[#F4EEE7] p-6 text-sm leading-7 text-[#5F574F] sm:p-8">
    <p className="text-xs font-medium tracking-[0.2em] text-[#8C635B]">SERVICE PROVIDER</p>
    <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-[7rem_1fr]">
      <dt className="text-[#847970]">品牌</dt><dd>{SITE_IDENTITY.brand}</dd>
      <dt className="text-[#847970]">服務提供者</dt><dd>{SITE_IDENTITY.provider}</dd>
      <dt className="text-[#847970]">聯絡信箱</dt><dd><a className="underline underline-offset-4" href={`mailto:${SITE_IDENTITY.email}`}>{SITE_IDENTITY.email}</a></dd>
      <dt className="text-[#847970]">聯絡地址</dt><dd>{SITE_IDENTITY.address}</dd>
    </dl>
  </aside>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-t border-[#D8D0C5] py-8 sm:py-10">
    <h2 className="serif text-2xl leading-[1.5] text-[#2D2D2D] sm:text-3xl">{title}</h2>
    <div className="mt-5 space-y-4 text-[16px] leading-[1.95] text-[#5F574F]">{children}</div>
  </section>
);

const PrivacyPolicy = () => (
  <>
    <Section title="我們會收集哪些資料">
      <p>依您使用的功能，可能包含帳號 Email、登入狀態、FACE 測驗結果、每日覺察答案與日記、內容閱讀紀錄、付款與權益狀態、客服往來，以及瀏覽器產生的基本技術資訊。</p>
      <p>未登入的公開文章閱讀紀錄，可能以匿名工作階段或裝置端識別碼記錄；我們不會把匿名瀏覽紀錄直接當成您的真實身分。</p>
    </Section>
    <Section title="資料使用目的">
      <ul className="list-disc space-y-2 pl-6">
        <li>提供登入、保存測驗結果、會員權益與內容存取。</li>
        <li>產生交易人格與自我覺察結果，改善題目與使用體驗。</li>
        <li>處理付款、訂單、退款、客服與安全事件。</li>
        <li>在取得您同意後，寄送研究結果、產品開放與行銷通知。</li>
      </ul>
    </Section>
    <Section title="使用的第三方服務">
      <p>為提供網站功能，我們可能使用：Supabase（資料庫、登入與檔案服務）、Google Forms／Google Sheets（前期研究問卷與資料整理）、Google／Gmail 或其他 Email 服務（通知與客服）、綠界科技 ECPay（付款處理）、Vercel（網站託管與基礎技術紀錄）。</p>
      <p>付款資料由付款服務商依其規範處理；本站不保存完整信用卡卡號。第三方服務可能依其隱私政策在境外處理資料。</p>
    </Section>
    <Section title="保存、安全與您的權利">
      <p>我們只在提供服務、處理交易、遵守法令或處理爭議所需期間保存資料，並採取合理的存取控制與安全措施。您可來信要求查詢、更正、停止利用或刪除個人資料；依法必須保留的交易、會計或爭議紀錄不在此限。</p>
      <p>網站可能使用登入必要的 Cookie、localStorage 或匿名 session id。若未來導入非必要的第三方行銷分析工具，將先更新告知與同意機制。</p>
    </Section>
  </>
);

const Terms = () => (
  <>
    <Section title="服務內容與適用範圍">
      <p>FACE 如鏡／交易解憂 Bar 提供交易人格測驗、交易教育、自我覺察、文章與數位工具。內容用於協助您整理決策與風險意識，不構成投資顧問服務、個別標的推薦、買賣指示或報酬保證。</p>
      <p>您仍須自行判斷交易是否適合，並承擔投資可能造成的損失。</p>
    </Section>
    <Section title="帳號與合理使用">
      <p>您應提供可使用的聯絡資料並妥善保管登入方式。付費存取權限限本人使用，不得未經同意轉售、公開散布、擷取大量內容或規避權限控制。</p>
    </Section>
    <Section title="付費內容與交付">
      <p>實際購買內容、價格、存取期間、完成狀態與交付方式，以結帳前頁面及訂單確認信所載為準。尚未完成或未列入結帳清單的工具，不視為本次交易標的。</p>
      <p>目前網站中的產品照與介面均為示意；付費產品不包含圖中實體商品，也不保證與示意的數位產品畫面完全相同。</p>
    </Section>
    <Section title="智慧財產與服務調整">
      <p>本站文字、圖像、測驗、版面與工具受相關智慧財產權保護。為維護服務品質、安全與法令遵循，我們可能調整功能與內容；若重大變更影響已購買權益，將以合理方式通知並提供處理方案。</p>
    </Section>
  </>
);

const RefundPolicy = () => (
  <>
    <Section title="正式收款前">
      <p>目前早鳥方案僅接受候補登記，尚未開放正式收款。候補登記不成立買賣契約，也不會產生付款義務。</p>
    </Section>
    <Section title="數位內容開始提供前">
      <p>正式開賣後，如尚未開通或提供數位內容，您可來信提出取消申請；我們將確認訂單狀態後辦理。</p>
    </Section>
    <Section title="數位內容開始提供後">
      <p>依台灣通訊交易規定，非以有形媒介提供的數位內容或一經提供即完成的線上服務，只有在結帳前清楚告知，並經消費者事先同意立即提供時，才可能不適用七日解除權。正式結帳頁將另行呈現此項同意，未取得同意時仍依法處理。</p>
      <p>即使不適用無條件解除權，如遇重複扣款、付款後未交付、內容與結帳說明有重大不符，或服務有無法排除的重大瑕疵，仍可來信申請查核、補交付或退款。</p>
    </Section>
    <Section title="申請與處理時間">
      <p>請以購買 Email 寄信至 <a className="underline underline-offset-4" href={`mailto:${SITE_IDENTITY.email}?subject=${encodeURIComponent('FACE 退款／取消申請')}`}>{SITE_IDENTITY.email}</a>，主旨註明「FACE 退款／取消申請」，並附訂單編號、購買 Email 與申請原因。我們原則上於 3 個工作天內確認收到，並於資料齊全後 14 個工作天內完成審查；退款入帳時間仍依付款機構與發卡銀行為準。</p>
    </Section>
  </>
);

const DataDeletion = () => (
  <>
    <Section title="如何提出申請">
      <p>請使用帳號註冊 Email 寄信至 <a className="underline underline-offset-4" href={`mailto:${SITE_IDENTITY.email}?subject=${encodeURIComponent('FACE 帳號與個人資料刪除申請')}`}>{SITE_IDENTITY.email}</a>，主旨填寫「FACE 帳號與個人資料刪除申請」，並說明要刪除帳號、測驗結果、覺察日記或其他資料。</p>
    </Section>
    <Section title="身分確認與處理時間">
      <p>為避免他人冒名刪除，我們可能要求您以原註冊信箱回覆或提供必要的帳號資訊。原則上 3 個工作天內確認收到，並於完成身分確認後 30 天內完成刪除或說明無法刪除的法定理由。</p>
    </Section>
    <Section title="刪除後的影響與例外">
      <p>刪除後，帳號、保存的測驗結果、覺察紀錄與相關個人化功能可能無法復原。依法令、付款對帳、會計、資安或爭議處理必須保存的最低限度紀錄，可能在必要期間內限制存取後保留，且不再用於一般行銷。</p>
      <p>若您只想停止行銷通知，不必刪除帳號；來信註明「停止行銷通知」即可。</p>
    </Section>
  </>
);

const pageCopy: Record<LegalPageKind, { eyebrow: string; title: string; description: string }> = {
  privacy: { eyebrow: 'PRIVACY', title: '隱私權政策', description: '說明我們如何收集、使用、保存與保護您的資料。' },
  terms: { eyebrow: 'TERMS', title: '使用條款', description: '使用 FACE 內容、帳號與付費服務前，請先閱讀以下約定。' },
  refund: { eyebrow: 'REFUND', title: '退款與取消政策', description: '清楚說明候補登記、數位內容交付與退款申請方式。' },
  'data-deletion': { eyebrow: 'DATA RIGHTS', title: '帳號與資料刪除說明', description: '您可以要求刪除帳號與個人資料，以下是申請方式與處理時間。' },
};

export const LegalPage: React.FC<LegalPageProps> = ({ kind }) => {
  const copy = pageCopy[kind];
  return (
    <article className="mx-auto max-w-4xl pb-20">
      <header className="border-y border-[#D1D1C7] py-12 sm:py-16">
        <p className="text-xs font-medium tracking-[0.25em] text-[#8C635B]">{copy.eyebrow}</p>
        <h1 className="mt-5 serif text-4xl leading-[1.4] text-[#2D2D2D] sm:text-6xl">{copy.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#70665D] sm:text-lg">{copy.description}</p>
        <p className="mt-5 text-xs text-[#8A8179]">最後更新：{updatedAt}</p>
      </header>
      <div className="mt-10"><ProviderCard /></div>
      <div className="mt-10">
        {kind === 'privacy' && <PrivacyPolicy />}
        {kind === 'terms' && <Terms />}
        {kind === 'refund' && <RefundPolicy />}
        {kind === 'data-deletion' && <DataDeletion />}
      </div>
      <nav className="mt-8 flex flex-wrap gap-4 border-t border-[#D1D1C7] pt-8 text-sm" aria-label="其他法律資訊">
        <a href="/privacy" className="border-b border-[#8C635B] pb-1">隱私權政策</a>
        <a href="/terms" className="border-b border-[#8C635B] pb-1">使用條款</a>
        <a href="/refund-policy" className="border-b border-[#8C635B] pb-1">退款與取消政策</a>
        <a href="/data-deletion" className="border-b border-[#8C635B] pb-1">資料刪除說明</a>
      </nav>
    </article>
  );
};

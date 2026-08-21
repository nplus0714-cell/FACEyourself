export const SITE_IDENTITY = {
  publicName: 'FACE 如鏡／交易解憂 Bar',
  brand: 'FACE 如鏡／交易解憂 Bar',
  provider: '張恩嘉（個人經營）',
  email: 'tradingpost234@gmail.com',
  address: '台北市大安區富陽街151巷5號四樓',
} as const;

export const PRODUCT_PREVIEW_DISCLAIMER = '目前產品照僅為示意，付費產品將不含圖中實體商品及數位產品畫面。';

const earlyAccessSubject = 'FACE 如鏡早鳥候補名單';
const earlyAccessBody = [
  '您好，我想加入 FACE 如鏡／交易解憂 Bar 的早鳥候補名單。',
  '',
  '我的 Email：',
  '暱稱（選填）：',
  '最想使用的內容（選填）：',
  '',
  '寄出此信表示我同意接收產品開放、早鳥方案與服務相關通知；我知道可隨時以 Email 要求停止通知。',
].join('\n');

export const EARLY_ACCESS_MAILTO = `mailto:${SITE_IDENTITY.email}?subject=${encodeURIComponent(earlyAccessSubject)}&body=${encodeURIComponent(earlyAccessBody)}`;

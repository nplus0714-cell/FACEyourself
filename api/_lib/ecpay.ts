import { createHash, timingSafeEqual } from 'node:crypto';

export const ECPAY_PRODUCT = {
  code: 'face-survival-kit',
  name: 'FACE 交易生存指南',
  amount: 590,
} as const;

const STAGE_CONFIG = {
  merchantId: '3002607',
  hashKey: 'pwFHCqoQZGmho4w6',
  hashIv: 'EkRm7iFT261dpevs',
  checkoutUrl: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
} as const;

export const getEcpayConfig = () => {
  const isProduction = process.env.ECPAY_ENV === 'production';
  if (!isProduction) return { ...STAGE_CONFIG, isProduction: false };

  const merchantId = process.env.ECPAY_MERCHANT_ID?.trim();
  const hashKey = process.env.ECPAY_HASH_KEY?.trim();
  const hashIv = process.env.ECPAY_HASH_IV?.trim();
  if (!merchantId || !hashKey || !hashIv) {
    throw new Error('ECPay production credentials are incomplete');
  }

  return {
    merchantId,
    hashKey,
    hashIv,
    checkoutUrl: 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
    isProduction: true,
  };
};

const ecpayUrlEncode = (value: string): string => encodeURIComponent(value)
  .replace(/%20/g, '+')
  .replace(/%2D/gi, '-')
  .replace(/%5F/gi, '_')
  .replace(/%2E/gi, '.')
  .replace(/%21/gi, '!')
  .replace(/%2A/gi, '*')
  .replace(/%28/gi, '(')
  .replace(/%29/gi, ')')
  .toLowerCase();

export const createCheckMacValue = (
  parameters: Record<string, string>,
  hashKey: string,
  hashIv: string,
): string => {
  const serialized = Object.entries(parameters)
    .filter(([key]) => key.toLowerCase() !== 'checkmacvalue')
    .sort(([left], [right]) => left.toLowerCase().localeCompare(right.toLowerCase(), 'en'))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const encoded = ecpayUrlEncode(`HashKey=${hashKey}&${serialized}&HashIV=${hashIv}`);
  return createHash('sha256').update(encoded).digest('hex').toUpperCase();
};

export const verifyCheckMacValue = (
  parameters: Record<string, string>,
  hashKey: string,
  hashIv: string,
): boolean => {
  const received = parameters.CheckMacValue?.toUpperCase();
  if (!received) return false;
  const expected = createCheckMacValue(parameters, hashKey, hashIv);
  const receivedBuffer = Buffer.from(received, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return receivedBuffer.length === expectedBuffer.length
    && timingSafeEqual(receivedBuffer, expectedBuffer);
};

export const createMerchantTradeNo = (): string => {
  const now = Date.now().toString(36).toUpperCase();
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `FC${now}${random}`.slice(0, 20);
};

export const formatEcpayTradeDate = (date = new Date()): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}/${get('month')}/${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
};

export const formDataToRecord = async (request: Request): Promise<Record<string, string>> => {
  const formData = await request.formData();
  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, typeof value === 'string' ? value : value.name]),
  );
};

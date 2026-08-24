import { getSupabaseClient } from '../lib/supabase';
import { SURVIVAL_KIT_PRODUCT_CODE } from './memberEntitlements';

interface EcpayCheckoutResponse {
  action?: string;
  fields?: Record<string, string>;
  error?: {
    code?: string;
    message?: string;
  };
}

const TRUSTED_ECPAY_CHECKOUT_ORIGINS = new Set([
  'https://payment-stage.ecpay.com.tw',
  'https://payment.ecpay.com.tw',
]);

export class CheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutError';
  }
}

export const startEcpayCheckout = async (): Promise<void> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new CheckoutError('目前無法確認登入狀態，請重新登入後再試。');

  const accessToken = data.session?.access_token;
  if (!accessToken) throw new CheckoutError('請先登入後再繼續。');

  const response = await fetch('/api/payments/ecpay/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productCode: SURVIVAL_KIT_PRODUCT_CODE }),
  });
  const payload = await response.json().catch(() => ({})) as EcpayCheckoutResponse;

  if (!response.ok) {
    throw new CheckoutError(payload.error?.message ?? '目前無法建立付款訂單，請稍後再試。');
  }
  if (!payload.action || !payload.fields) {
    throw new CheckoutError('付款資料不完整，請重新整理後再試。');
  }

  const checkoutUrl = new URL(payload.action);
  if (!TRUSTED_ECPAY_CHECKOUT_ORIGINS.has(checkoutUrl.origin)) {
    throw new CheckoutError('付款網址驗證失敗，請聯絡客服確認。');
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = checkoutUrl.toString();
  form.acceptCharset = 'UTF-8';
  form.hidden = true;

  Object.entries(payload.fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

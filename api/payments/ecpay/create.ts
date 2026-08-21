import {
  createCheckMacValue,
  createMerchantTradeNo,
  ECPAY_PRODUCT,
  formatEcpayTradeDate,
  getEcpayConfig,
} from '../../_lib/ecpay';
import { ApiError, assertSameOrigin, jsonResponse, readJsonBody } from '../../_lib/http';
import { createPaymentOrder, getLatestFaceCodeForUser } from '../../_lib/paymentOrders';
import { enforceRateLimit } from '../../_lib/rateLimit';
import { requireAuthenticatedUser } from '../../_lib/supabaseAdmin';
import { createLegacyPostHandler } from '../../_lib/vercelAdapter';

export async function POST(request: Request): Promise<Response> {
  try {
    if (process.env.PAYMENTS_ENABLED !== 'true') {
      throw new ApiError(503, 'PAYMENTS_PAUSED', '方案仍在完成交付驗證，目前暫不收款。');
    }
    assertSameOrigin(request);
    enforceRateLimit(request, 'ecpay-create', 8, 60_000);
    const body = await readJsonBody<{ productCode?: string }>(request);
    if (body.productCode !== ECPAY_PRODUCT.code) {
      throw new ApiError(400, 'INVALID_PRODUCT', '商品資料不正確，請重新整理後再試。');
    }
    const user = await requireAuthenticatedUser(request);
    const faceCode = await getLatestFaceCodeForUser(user.id);

    const config = getEcpayConfig();
    const merchantTradeNo = createMerchantTradeNo();
    const origin = new URL(request.url).origin;
    const publicOrigin = (process.env.ECPAY_PUBLIC_ORIGIN ?? origin).replace(/\/$/, '');

    await createPaymentOrder({
      merchantTradeNo,
      amount: ECPAY_PRODUCT.amount,
      environment: config.isProduction ? 'production' : 'stage',
      userId: user.id,
      customerEmail: user.email ?? null,
      faceCode,
    });

    const fields: Record<string, string> = {
      MerchantID: config.merchantId,
      MerchantTradeNo: merchantTradeNo,
      MerchantTradeDate: formatEcpayTradeDate(),
      PaymentType: 'aio',
      TotalAmount: String(ECPAY_PRODUCT.amount),
      TradeDesc: 'FACE trading survival kit',
      ItemName: `${ECPAY_PRODUCT.name} NT$${ECPAY_PRODUCT.amount}`,
      ReturnURL: `${publicOrigin}/api/payments/ecpay/notify`,
      OrderResultURL: `${publicOrigin}/api/payments/ecpay/return`,
      ClientBackURL: `${publicOrigin}/?payment=cancelled`,
      ChoosePayment: 'Credit',
      EncryptType: '1',
      NeedExtraPaidInfo: 'N',
    };
    fields.CheckMacValue = createCheckMacValue(fields, config.hashKey, config.hashIv);

    return jsonResponse({ action: config.checkoutUrl, fields });
  } catch (error) {
    console.error('ECPay order creation failed', error instanceof Error ? error.message : error);
    if (error instanceof ApiError) {
      return jsonResponse({ error: { code: error.code, message: error.message } }, error.status);
    }
    return jsonResponse({
      error: {
        code: 'PAYMENT_UNAVAILABLE',
        message: '目前無法建立付款訂單，請稍後再試。',
      },
    }, 503);
  }
}

export default createLegacyPostHandler(POST);

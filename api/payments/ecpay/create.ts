import {
  createCheckMacValue,
  createMerchantTradeNo,
  ECPAY_PRODUCT,
  formatEcpayTradeDate,
  getEcpayConfig,
} from '../../_lib/ecpay';
import { assertSameOrigin, jsonResponse } from '../../_lib/http';
import { createPaymentOrder } from '../../_lib/paymentOrders';
import { enforceRateLimit } from '../../_lib/rateLimit';

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'ecpay-create', 8, 60_000);

    const config = getEcpayConfig();
    const merchantTradeNo = createMerchantTradeNo();
    const origin = new URL(request.url).origin;
    const publicOrigin = (process.env.ECPAY_PUBLIC_ORIGIN ?? origin).replace(/\/$/, '');

    await createPaymentOrder({
      merchantTradeNo,
      amount: ECPAY_PRODUCT.amount,
      environment: config.isProduction ? 'production' : 'stage',
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
    return jsonResponse({
      error: {
        code: 'PAYMENT_UNAVAILABLE',
        message: '目前無法建立付款訂單，請稍後再試。',
      },
    }, 503);
  }
}

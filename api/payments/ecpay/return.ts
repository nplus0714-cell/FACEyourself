import { formDataToRecord, getEcpayConfig, verifyCheckMacValue } from '../../_lib/ecpay.js';
import { getPaymentOrder } from '../../_lib/paymentOrders.js';

export async function POST(request: Request): Promise<Response> {
  const origin = (process.env.ECPAY_PUBLIC_ORIGIN ?? new URL(request.url).origin).replace(/\/$/, '');
  try {
    const parameters = await formDataToRecord(request);
    const config = getEcpayConfig();
    const signatureValid = verifyCheckMacValue(parameters, config.hashKey, config.hashIv);
    const order = signatureValid ? await getPaymentOrder(parameters.MerchantTradeNo ?? '') : null;
    const successful = signatureValid
      && order?.amount === Number(parameters.TradeAmt)
      && parameters.MerchantID === config.merchantId
      && parameters.RtnCode === '1';
    const status = successful ? 'success' : 'failed';
    const orderReference = encodeURIComponent(parameters.MerchantTradeNo ?? '');
    return Response.redirect(`${origin}/?payment=${status}&order=${orderReference}`, 303);
  } catch (error) {
    console.error('ECPay browser return failed', error instanceof Error ? error.message : error);
    return Response.redirect(`${origin}/?payment=failed`, 303);
  }
}

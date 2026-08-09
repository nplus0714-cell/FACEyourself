import { formDataToRecord, getEcpayConfig, verifyCheckMacValue } from '../../_lib/ecpay';
import { getPaymentOrder, updatePaymentOrderFromCallback } from '../../_lib/paymentOrders';

export async function POST(request: Request): Promise<Response> {
  try {
    const parameters = await formDataToRecord(request);
    const config = getEcpayConfig();
    if (!verifyCheckMacValue(parameters, config.hashKey, config.hashIv)) {
      return new Response('0|Invalid CheckMacValue', { status: 400 });
    }

    const order = await getPaymentOrder(parameters.MerchantTradeNo ?? '');
    const amountMatches = order && order.amount === Number(parameters.TradeAmt);
    const merchantMatches = parameters.MerchantID === config.merchantId;
    if (!order || !amountMatches || !merchantMatches) {
      return new Response('0|Order verification failed', { status: 400 });
    }

    const simulated = parameters.SimulatePaid === '1';
    const paid = parameters.RtnCode === '1' && !simulated;
    if (order.status === 'paid' && !paid) {
      return new Response('1|OK', { status: 200 });
    }
    await updatePaymentOrderFromCallback({
      orderId: order.id,
      status: paid ? 'paid' : 'failed',
      tradeNo: parameters.TradeNo,
      paymentType: parameters.PaymentType,
      paymentDate: parameters.PaymentDate,
      callback: parameters,
    });
    return new Response('1|OK', { status: 200 });
  } catch (error) {
    console.error('ECPay notification failed', error instanceof Error ? error.message : error);
    return new Response('0|Server error', { status: 500 });
  }
}

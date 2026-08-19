import { getAdminClient } from './supabaseAdmin';

export type PaymentOrder = {
  id: string;
  merchant_trade_no: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  product_code: string;
  user_id: string | null;
  customer_email: string | null;
  face_code: string | null;
};

export const createPaymentOrder = async (input: {
  merchantTradeNo: string;
  amount: number;
  environment: 'stage' | 'production';
  userId: string;
  customerEmail: string | null;
  faceCode: string | null;
}): Promise<void> => {
  const { error } = await getAdminClient().from('payment_orders').insert({
    merchant_trade_no: input.merchantTradeNo,
    product_code: 'face-survival-kit',
    amount: input.amount,
    currency: 'TWD',
    status: 'pending',
    payment_provider: 'ecpay',
    payment_environment: input.environment,
    user_id: input.userId,
    customer_email: input.customerEmail,
    face_code: input.faceCode,
  });
  if (error) throw new Error(`Unable to create payment order: ${error.message}`);
};

export const getPaymentOrder = async (merchantTradeNo: string): Promise<PaymentOrder | null> => {
  const { data, error } = await getAdminClient()
    .from('payment_orders')
    .select('id, merchant_trade_no, amount, status, product_code, user_id, customer_email, face_code')
    .eq('merchant_trade_no', merchantTradeNo)
    .maybeSingle();
  if (error) throw new Error(`Unable to read payment order: ${error.message}`);
  return data as PaymentOrder | null;
};

export const getLatestFaceCodeForUser = async (userId: string): Promise<string | null> => {
  const { data, error } = await getAdminClient()
    .from('assessment_runs')
    .select('face_code')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .not('face_code', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Unable to read member FACE result: ${error.message}`);
  return typeof data?.face_code === 'string' ? data.face_code : null;
};

export const updatePaymentOrderFromCallback = async (input: {
  orderId: string;
  status: 'paid' | 'failed';
  tradeNo?: string;
  paymentType?: string;
  paymentDate?: string;
  callback: Record<string, string>;
}): Promise<void> => {
  const { error } = await getAdminClient()
    .from('payment_orders')
    .update({
      status: input.status,
      ecpay_trade_no: input.tradeNo || null,
      payment_type: input.paymentType || null,
      paid_at: input.status === 'paid' ? new Date().toISOString() : null,
      provider_payment_date: input.paymentDate || null,
      callback_payload: input.callback,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.orderId);
  if (error) throw new Error(`Unable to update payment order: ${error.message}`);
};

export const grantEntitlementForOrder = async (order: PaymentOrder): Promise<void> => {
  if (!order.user_id) {
    throw new Error(`Payment order ${order.merchant_trade_no} is not linked to a member`);
  }

  const now = new Date().toISOString();
  const { error } = await getAdminClient().from('member_entitlements').upsert({
    user_id: order.user_id,
    product_code: order.product_code,
    status: 'active',
    payment_order_id: order.id,
    starts_at: now,
    expires_at: null,
    metadata: {
      merchant_trade_no: order.merchant_trade_no,
      face_code_at_purchase: order.face_code,
      app_version: '2.5.0',
    },
    updated_at: now,
  }, { onConflict: 'user_id,product_code' });

  if (error) throw new Error(`Unable to grant member entitlement: ${error.message}`);
};

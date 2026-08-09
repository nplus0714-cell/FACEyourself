import { createClient } from '@supabase/supabase-js';

type PaymentOrder = {
  id: string;
  merchant_trade_no: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
};

const getAdminClient = () => {
  const url = (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL)?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) throw new Error('Supabase payment storage is not configured');
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export const createPaymentOrder = async (input: {
  merchantTradeNo: string;
  amount: number;
  environment: 'stage' | 'production';
}): Promise<void> => {
  const { error } = await getAdminClient().from('payment_orders').insert({
    merchant_trade_no: input.merchantTradeNo,
    product_code: 'face-survival-kit',
    amount: input.amount,
    currency: 'TWD',
    status: 'pending',
    payment_provider: 'ecpay',
    payment_environment: input.environment,
  });
  if (error) throw new Error(`Unable to create payment order: ${error.message}`);
};

export const getPaymentOrder = async (merchantTradeNo: string): Promise<PaymentOrder | null> => {
  const { data, error } = await getAdminClient()
    .from('payment_orders')
    .select('id, merchant_trade_no, amount, status')
    .eq('merchant_trade_no', merchantTradeNo)
    .maybeSingle();
  if (error) throw new Error(`Unable to read payment order: ${error.message}`);
  return data as PaymentOrder | null;
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

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  merchant_trade_no varchar(20) not null unique,
  product_code text not null,
  amount integer not null check (amount > 0),
  currency char(3) not null default 'TWD',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  payment_provider text not null default 'ecpay',
  payment_environment text not null check (payment_environment in ('stage', 'production')),
  ecpay_trade_no text,
  payment_type text,
  provider_payment_date text,
  paid_at timestamptz,
  callback_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_status_created_idx
  on public.payment_orders (status, created_at desc);

alter table public.payment_orders enable row level security;

comment on table public.payment_orders is
  'Server-managed payment orders. Browser clients have no direct access policy.';

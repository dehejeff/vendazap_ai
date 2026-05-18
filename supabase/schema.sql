create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  email text not null unique,
  name text not null,
  niche text,
  onboarding_completed boolean not null default false,
  password_hash text not null,
  phone text,
  store_name text not null,
  whatsapp_access_token_hint text,
  whatsapp_business_phone_id text unique,
  whatsapp_connected boolean not null default false,
  whatsapp_display_number text,
  whatsapp_webhook_ready boolean not null default false,
  whatsapp_number text
);

create index if not exists users_whatsapp_business_phone_id_idx
  on public.users (whatsapp_business_phone_id);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  active boolean not null default true,
  category text not null,
  compatibility text,
  created_at timestamptz not null default timezone('utc', now()),
  description text not null,
  name text not null,
  price numeric(12,2) not null,
  sku text,
  stock_quantity integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_user_id_idx on public.products (user_id);
create index if not exists products_user_updated_at_idx
  on public.products (user_id, updated_at desc);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  deal_stage text,
  priority_label text not null,
  reserved_pickup_name text,
  reserved_pickup_window text,
  reserved_product text,
  status text not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists conversations_user_id_idx
  on public.conversations (user_id);
create index if not exists conversations_user_phone_idx
  on public.conversations (user_id, client_phone);
create index if not exists conversations_user_updated_at_idx
  on public.conversations (user_id, updated_at desc);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  author text not null,
  content text not null,
  input_type text,
  timestamp timestamptz not null default timezone('utc', now())
);

create index if not exists conversation_messages_conversation_timestamp_idx
  on public.conversation_messages (conversation_id, timestamp asc);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  email text,
  name text not null,
  niche text,
  phone text,
  source text,
  store_name text not null
);

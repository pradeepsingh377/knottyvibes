-- Run this in your Supabase SQL editor

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  category text not null,
  images text[] default '{}',
  stock integer not null default 0,
  is_featured boolean default false,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  amount numeric(10,2) not null,
  currency text not null default 'INR',
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table products enable row level security;
alter table orders enable row level security;

-- Products: public read
create policy "Products are publicly readable"
  on products for select using (true);

-- Orders: insert by anyone, read only by service role
create policy "Anyone can create orders"
  on orders for insert with check (true);

-- Storage bucket for product images
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "Product images are public"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Service role can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'products');

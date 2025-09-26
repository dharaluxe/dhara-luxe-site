-- Supabase schema for Dhara Luxe
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  price numeric(10,2) not null,
  description text,
  images text[] default '{}',
  stock integer not null default 0,
  category text,
  featured boolean default false,
  sku text,
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  wishlist text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  address jsonb not null,
  items jsonb not null,
  status text check (status in ('pending','paid','shipped','delivered')) default 'pending',
  razorpay_payment_id text,
  stripe_payment_intent_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists waitlist (
  email text primary key,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_orders_user on orders(user_id);

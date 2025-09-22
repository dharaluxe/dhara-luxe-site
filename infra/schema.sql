-- Supabase / Postgres schema for Dhara Luxe

-- Users (if not using Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE NOT NULL,
  hashed_password text,
  wishlist jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric NOT NULL,
  description text,
  images jsonb DEFAULT '[]'::jsonb,
  stock integer DEFAULT 0,
  category text,
  featured boolean DEFAULT FALSE,
  sku text,
  created_at timestamptz DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  items jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL,
  razorpay_payment_id text,
  created_at timestamptz DEFAULT NOW()
);

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamptz DEFAULT NOW()
);

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category: string;
  featured?: boolean;
  sku?: string;
  created_at?: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  user_id?: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  total_amount: number;
  razorpay_payment_id?: string;
  created_at?: string;
};

export type User = {
  id: string;
  name?: string;
  email: string;
  hashed_password?: string;
  wishlist?: string[]; // product ids
  created_at?: string;
};

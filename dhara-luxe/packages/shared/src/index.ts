export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category: string;
  featured: boolean;
  sku: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  user_id: string;
  address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
  items: OrderItem[];
  status: "pending" | "paid" | "shipped" | "delivered";
  razorpay_payment_id?: string;
  stripe_payment_intent_id?: string;
  created_at?: string;
  updated_at?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  wishlist: string[];
};

export type Waitlist = {
  email: string;
  created_at?: string;
};

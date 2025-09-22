# Dhara Luxe — Monorepo (starter)

Monorepo scaffold for Dhara Luxe — a vegan luxury handbag brand.

Apps
- /apps/web — Next.js storefront (React 18, app router)
- /apps/admin — Next.js admin dashboard (mini dashboard for products/orders)
- /packages/shared — Shared types and utilities
- /infra — SQL migrations / Supabase schema

Tech stack (starter)
- Frontend: Next.js (app router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion
- Backend: Supabase (recommended)
- Payments: Razorpay (India) + Stripe (International)
- Email: Nodemailer (contact form)
- Hosting: Vercel (frontend), Supabase (DB/Auth/Storage)

What this scaffold includes
- Basic page layout, SEO metadata, OG tags
- Hero + Featured products sample page
- Product model types
- API routes for checkout (Razorpay + Stripe) and contact form (Nodemailer)
- Supabase schema for products, users, orders, waitlist
- .env.example with required keys

Getting started (local)
1. Install dependencies (pnpm recommended)
   - pnpm install
2. Create .env files from .env.example for apps/web and apps/admin
3. Run dev (two terminals):
   - cd apps/web && pnpm dev
   - cd apps/admin && pnpm dev

Deploy
- Frontend: Vercel recommended (apps/web and apps/admin as separate projects)
- Backend: Supabase (DB, Auth, Storage). Use the SQL in /infra to create tables.

Next steps
- Admin product CRUD & image upload to Supabase Storage
- Auth flows with Supabase Auth
- Webhooks for Stripe & Razorpay to finalize orders and send receipts
- Replace placeholder images and wire shadcn/ui components & fonts


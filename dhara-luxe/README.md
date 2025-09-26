# Dhara Luxe Monorepo

A luxury vegan handbag e-commerce platform.

## Structure

- apps/web – Customer-facing Next.js site
- apps/admin – Admin dashboard
- packages/shared – Shared TypeScript types and utilities
- infra – Supabase schema and infra notes

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

1. Install root tools:

   npm install

2. Install app deps (cna already installed):

   cd apps/web && npm install

   cd apps/admin && npm install

3. Environment variables

   Copy .env.example to each app and fill keys.

   cp .env.example apps/web/.env.local

   cp .env.example apps/admin/.env.local

4. Run dev servers

   At repo root:

   npm run dev:web

   npm run dev:admin

## Deployment

- Frontend: Vercel/Netlify (apps/web, apps/admin)
- Backend: Supabase (Auth, DB, Storage)

## Notes

- shadcn/ui setup will be added post-initialization.
- Payments: Razorpay (IN) and Stripe (INTL) planned.

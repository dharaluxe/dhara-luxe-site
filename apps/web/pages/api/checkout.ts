import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import Stripe from 'stripe';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-08-01' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items, currency, buyer, region } = req.body;

  // Calculate amount server-side — placeholder logic
  const amount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  try {
    if (region === 'IN') {
      // Razorpay order
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1
      });
      return res.status(200).json({ provider: 'razorpay', order });
    } else {
      // Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency || 'usd',
        metadata: { integration_check: 'accept_a_payment' }
      });
      return res.status(200).json({ provider: 'stripe', clientSecret: paymentIntent.client_secret });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
}

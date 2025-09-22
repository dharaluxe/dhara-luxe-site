import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Use Service Role key on the server to allow inserts into the waitlist table.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid email' });
  }

  try {
    const { data, error } = await supabase.from('waitlist').insert([{ email }]).select();
    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to subscribe to waitlist' });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('Waitlist handler error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
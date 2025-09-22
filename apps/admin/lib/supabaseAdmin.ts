import { createClient } from '@supabase/supabase-js';

// Server-side admin client using the Service Role key. Ensure SUPABASE_SERVICE_ROLE_KEY is set in the deployment env only.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
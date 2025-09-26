"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AccountGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (!session) {
        window.location.href = `/login?next=${encodeURIComponent(pathname || "/account")}`;
        return;
      }
      setReady(true);
    })();
  }, [pathname]);

  if (!ready) return null; // or a skeleton
  return <>{children}</>;
}

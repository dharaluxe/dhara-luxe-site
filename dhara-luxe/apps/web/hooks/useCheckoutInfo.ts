"use client";

import { useEffect, useState } from "react";

export type CheckoutInfo = {
  giftWrap: boolean;
  fullName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes: string;
};

const DEFAULT_INFO: CheckoutInfo = {
  giftWrap: false,
  fullName: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  notes: "",
};

const KEY = "dhara_checkout_info_v1";

export function useCheckoutInfo() {
  const [info, setInfo] = useState<CheckoutInfo>(DEFAULT_INFO);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setInfo({ ...DEFAULT_INFO, ...JSON.parse(raw) });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(info));
      } catch {}
    }, 200);
    return () => clearTimeout(t);
  }, [info]);

  return { info, setInfo };
}

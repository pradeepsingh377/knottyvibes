import { supabase } from "@/lib/supabase";

export type ShippingSettings = {
  shipping_fee: number;
  free_shipping_threshold: number;
};

export async function getShippingSettings(): Promise<ShippingSettings> {
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["shipping_fee", "free_shipping_threshold"]);

  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));

  return {
    shipping_fee: Number(map.shipping_fee ?? 99),
    free_shipping_threshold: Number(map.free_shipping_threshold ?? 999),
  };
}

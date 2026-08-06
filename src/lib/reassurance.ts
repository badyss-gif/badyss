import { RefreshCw, Banknote, MessageCircle, Truck, HandCoins, type LucideIcon } from "lucide-react";

export interface ReassuranceItem {
  key: "exchange" | "refund" | "support" | "delivery" | "cod";
  icon: LucideIcon;
}

// Client-confirmed reassurance facts, in display order. Labels live under
// the `reassurance` message namespace so every placement (homepage,
// footer, contact, checkout) shares one translated source.
export const REASSURANCE_ITEMS: ReassuranceItem[] = [
  { key: "exchange", icon: RefreshCw },
  { key: "refund", icon: Banknote },
  { key: "support", icon: MessageCircle },
  { key: "delivery", icon: Truck },
  { key: "cod", icon: HandCoins },
];

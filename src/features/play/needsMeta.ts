import {
  Droplets,
  PartyPopper,
  Toilet,
  Users,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { NeedId } from "@/features/play/game"

export interface NeedMeta {
  icon: LucideIcon
  color: string
}

export const NEED_META: Record<NeedId, NeedMeta> = {
  hunger: { icon: Utensils, color: "#f97316" },
  energy: { icon: Zap, color: "#eab308" },
  hygiene: { icon: Droplets, color: "#06b6d4" },
  bladder: { icon: Toilet, color: "#a855f7" },
  fun: { icon: PartyPopper, color: "#ec4899" },
  social: { icon: Users, color: "#10b981" },
}

export function needBarColor(value: number, color: string): string {
  if (value <= 20) return "#dc2626"
  if (value <= 40) return "#f59e0b"
  return color
}

import {
  Banknote,
  BedDouble,
  Beef,
  Church,
  Dumbbell,
  GraduationCap,
  Hospital,
  Landmark,
  Plane,
  ShoppingBasket,
  TreePalm,
  Trees,
  Utensils,
  Wine,
  type LucideIcon,
} from "lucide-react"

export type VenueCategory =
  | "maquis"
  | "restaurant"
  | "nightlife"
  | "plage"
  | "marche"
  | "hotel"
  | "culture"
  | "sport"
  | "transport"
  | "sante"
  | "nature"
  | "culte"
  | "education"
  | "finance"

export interface CategoryMeta {
  id: VenueCategory
  icon: LucideIcon
  color: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "maquis", icon: Utensils, color: "#f97316" },
  { id: "restaurant", icon: Beef, color: "#ef4444" },
  { id: "nightlife", icon: Wine, color: "#a855f7" },
  { id: "plage", icon: TreePalm, color: "#06b6d4" },
  { id: "marche", icon: ShoppingBasket, color: "#10b981" },
  { id: "hotel", icon: BedDouble, color: "#6366f1" },
  { id: "culture", icon: Landmark, color: "#f43f5e" },
  { id: "sport", icon: Dumbbell, color: "#84cc16" },
  { id: "transport", icon: Plane, color: "#64748b" },
  { id: "sante", icon: Hospital, color: "#dc2626" },
  { id: "nature", icon: Trees, color: "#22c55e" },
  { id: "culte", icon: Church, color: "#d946ef" },
  { id: "education", icon: GraduationCap, color: "#0ea5e9" },
  { id: "finance", icon: Banknote, color: "#eab308" },
]

export const CATEGORY_MAP: Record<VenueCategory, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<VenueCategory, CategoryMeta>

export function getCategory(id: VenueCategory): CategoryMeta {
  return CATEGORY_MAP[id]
}

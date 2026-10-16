import { useTranslation } from "react-i18next"
import { CATEGORIES } from "@/config/categories"
import { QUARTIERS } from "@/config/venues"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

export function CategoryFilter() {
  const { t } = useTranslation()
  const categories = useAppStore((s) => s.categories)
  const quartiers = useAppStore((s) => s.quartiers)
  const toggleCategory = useAppStore((s) => s.toggleCategory)
  const toggleQuartier = useAppStore((s) => s.toggleQuartier)
  const resetFilters = useAppStore((s) => s.resetFilters)

  const hasFilters = categories.length > 0 || quartiers.length > 0

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((category) => {
          const active = categories.includes(category.id)
          const Icon = category.icon
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                active
                  ? "border-transparent text-white shadow-sm"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
              style={active ? { backgroundColor: category.color } : undefined}
            >
              <Icon className="size-4" />
              {t(`categories.${category.id}`)}
            </button>
          )
        })}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUARTIERS.map((quartier) => {
          const active = quartiers.includes(quartier)
          return (
            <button
              key={quartier}
              type="button"
              onClick={() => toggleQuartier(quartier)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
            >
              {t(`quartiers.${quartier}`)}
            </button>
          )
        })}
        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="shrink-0 rounded-full border border-dashed px-3 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10"
          >
            {t("filters.reset")}
          </button>
        )}
      </div>
    </div>
  )
}

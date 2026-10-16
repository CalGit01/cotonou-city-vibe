import { List, Map as MapIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { useAppStore, type ViewMode } from "@/store/useAppStore"

export function ViewToggle() {
  const { t } = useTranslation()
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)

  const options: { id: ViewMode; label: string; icon: typeof List }[] = [
    { id: "map", label: t("nav.map"), icon: MapIcon },
    { id: "list", label: t("nav.list"), icon: List },
  ]

  return (
    <div className="flex rounded-lg border bg-muted p-0.5">
      {options.map((option) => {
        const Icon = option.icon
        const active = viewMode === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setViewMode(option.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

import { useTranslation } from "react-i18next"
import { NEED_IDS, type Needs } from "@/features/play/game"
import { NEED_META, needBarColor } from "@/features/play/needsMeta"
import { cn } from "@/lib/utils"

export function NeedsPanel({ needs }: { needs: Needs }) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {NEED_IDS.map((id) => {
        const meta = NEED_META[id]
        const Icon = meta.icon
        const value = Math.round(needs[id])
        return (
          <div
            key={id}
            className="flex items-center gap-2 rounded-lg border bg-background p-2.5"
          >
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{t(`play.need.${id}`)}</span>
                <span
                  className={cn(
                    "tabular-nums",
                    value <= 20 && "font-semibold text-destructive",
                  )}
                >
                  {value}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${value}%`,
                    backgroundColor: needBarColor(value, meta.color),
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

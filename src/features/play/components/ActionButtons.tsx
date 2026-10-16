import {
  BedDouble,
  Droplet,
  PartyPopper,
  ShowerHead,
  Utensils,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { ACTIONS, type GameState } from "@/features/play/game"
import { useGameStore } from "@/features/play/store/useGameStore"
import { cn } from "@/lib/utils"

const ACTION_ICONS: Record<string, LucideIcon> = {
  eat: Utensils,
  sleep: BedDouble,
  shower: ShowerHead,
  toilet: Droplet,
  fun: PartyPopper,
  social: Users,
}

export function ActionButtons({ player }: { player: GameState }) {
  const { t } = useTranslation()
  const doAction = useGameStore((s) => s.doAction)

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {ACTIONS.map((action) => {
        const Icon = ACTION_ICONS[action.id] ?? Utensils
        const tooPoor = player.money + action.money < 0
        return (
          <button
            key={action.id}
            type="button"
            disabled={tooPoor}
            onClick={() => doAction(action.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border bg-background p-3 text-center transition hover:border-primary hover:bg-accent",
              tooPoor && "cursor-not-allowed opacity-40 hover:border-border hover:bg-background",
            )}
          >
            <Icon className="size-5 text-primary" />
            <span className="text-xs font-medium">
              {t(`play.action.${action.id}`)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {action.money === 0
                ? `${action.minutes} min`
                : `${action.money.toLocaleString("fr-FR")} FCFA`}
            </span>
          </button>
        )
      })}
    </div>
  )
}

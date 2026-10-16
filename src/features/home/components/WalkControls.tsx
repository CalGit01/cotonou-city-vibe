import { Footprints, X } from "lucide-react"
import { useTranslation } from "react-i18next"

interface WalkControlsProps {
  explore: boolean
  onToggle: () => void
}

export function WalkControls({ explore, onToggle }: WalkControlsProps) {
  const { t } = useTranslation()
  const Icon = explore ? X : Footprints

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex flex-col items-center gap-2 px-4">
      {explore && (
        <span className="rounded-full bg-night/75 px-3.5 py-1.5 text-center text-[11px] font-semibold text-white/90 backdrop-blur sm:text-xs">
          {t("walk.hint")}
        </span>
      )}
      <button
        type="button"
        onClick={onToggle}
        className="btn-press pointer-events-auto flex items-center gap-2 rounded-full bg-night/85 px-4 py-2.5 font-display text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(10,26,36,0.9)] backdrop-blur transition-colors hover:bg-night"
      >
        <Icon className="size-4" />
        {explore ? t("walk.exit") : t("walk.enter")}
      </button>
    </div>
  )
}

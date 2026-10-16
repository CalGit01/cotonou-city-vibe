import { BadgeCheck, Briefcase } from "lucide-react"
import { useTranslation } from "react-i18next"
import { JOBS } from "@/features/play/game"
import { useGameStore } from "@/features/play/store/useGameStore"
import { cn } from "@/lib/utils"

export function JobsPanel() {
  const { t } = useTranslation()
  const player = useGameStore((s) => s.player)
  const setJob = useGameStore((s) => s.setJob)

  if (!player) return null

  return (
    <div className="space-y-2">
      {JOBS.map((job) => {
        const locked = player.skill < job.minSkill
        const current = player.jobId === job.id
        return (
          <div
            key={job.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-background p-2.5",
              current && "border-primary bg-primary/5",
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Briefcase className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {t(`play.job.${job.id}`)}
              </p>
              <p className="text-xs text-muted-foreground">
                {job.pay.toLocaleString("fr-FR")} FCFA · {t("play.skillReq", { n: job.minSkill })}
              </p>
            </div>
            {current ? (
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                <BadgeCheck className="size-4" />
                {t("play.current")}
              </span>
            ) : (
              <button
                type="button"
                disabled={locked}
                onClick={() => setJob(job.id)}
                className={cn(
                  "rounded-lg border px-3 py-1 text-xs font-medium transition hover:bg-accent",
                  locked && "cursor-not-allowed opacity-40 hover:bg-background",
                )}
              >
                {t("play.hire")}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

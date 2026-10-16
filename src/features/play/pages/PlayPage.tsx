import {
  Banknote,
  Calendar,
  Coins,
  MapPinned,
  RotateCcw,
  TrendingUp,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import {
  formatClock,
  getJob,
  RENT_AMOUNT,
  RENT_INTERVAL_DAYS,
} from "@/features/play/game"
import { ActionButtons } from "../components/ActionButtons"
import { GameLog } from "../components/GameLog"
import { JobsPanel } from "../components/JobsPanel"
import { NeedsPanel } from "../components/NeedsPanel"
import { PlayerSetup } from "../components/PlayerSetup"
import { useGameStore } from "../store/useGameStore"

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Banknote
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
      <Icon className="size-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}

export function PlayPage() {
  const { t } = useTranslation()
  const player = useGameStore((s) => s.player)
  const message = useGameStore((s) => s.message)
  const work = useGameStore((s) => s.work)
  const reset = useGameStore((s) => s.reset)

  if (!player) {
    return <PlayerSetup />
  }

  const job = getJob(player.jobId)
  const daysToRent = RENT_INTERVAL_DAYS - (player.day % RENT_INTERVAL_DAYS)

  const messageText = message ? t(`play.msg.${message}`) : null

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold">{player.name}</h1>
            <p className="text-xs text-muted-foreground">
              {t("play.day", { n: player.day })} · {formatClock(player.time)} ·{" "}
              {job ? t(`play.job.${job.id}`) : t("play.noJobYet")}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-accent"
          >
            <RotateCcw className="size-3.5" />
            {t("play.newGame")}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            icon={Banknote}
            label={t("play.money")}
            value={`${player.money.toLocaleString("fr-FR")} FCFA`}
          />
          <StatCard
            icon={TrendingUp}
            label={t("play.skill")}
            value={String(player.skill)}
          />
          <StatCard
            icon={Calendar}
            label={t("play.rent")}
            value={t("play.rentIn", { n: Math.max(daysToRent, 0) })}
          />
          <StatCard
            icon={Coins}
            label={t("play.currentJob")}
            value={job ? t(`play.job.${job.id}`) : t("play.noJobYet")}
          />
        </div>

        {messageText && player.bankrupt && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {messageText}
          </p>
        )}
        {messageText && !player.bankrupt && (
          <p className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800">
            {messageText}
          </p>
        )}
      </div>

      {player.bankrupt ? (
        <div className="rounded-xl border border-destructive/40 bg-background p-6 text-center">
          <h2 className="text-base font-bold text-destructive">
            {t("play.gameOver")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("play.gameOverText")}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <RotateCcw className="size-4" />
            {t("play.newGame")}
          </button>
        </div>
      ) : (
        <>
          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              {t("play.needs")}
            </h2>
            <NeedsPanel needs={player.needs} />
          </section>

          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              {t("play.actions")}
            </h2>
            <ActionButtons player={player} />
            <button
              type="button"
              onClick={work}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              {t("play.work")}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              {t("play.rentInfo", { amount: RENT_AMOUNT.toLocaleString("fr-FR") })}
            </p>
          </section>

          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {t("play.jobs")}
              </h2>
              <Link
                to="/explorer"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <MapPinned className="size-3.5" />
                {t("play.explore")}
              </Link>
            </div>
            <JobsPanel />
          </section>

          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              {t("play.log")}
            </h2>
            <GameLog log={player.log} />
          </section>
        </>
      )}
    </div>
  )
}

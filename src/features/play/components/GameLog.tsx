import { useTranslation } from "react-i18next"
import { formatClock, type LogEntry } from "@/features/play/game"

function useEntryText(entry: LogEntry): string {
  const { t } = useTranslation()
  if (entry.text.startsWith("action:")) {
    return t(`play.action.${entry.text.slice("action:".length)}`)
  }
  if (entry.text.startsWith("work:")) {
    const amount = Number(entry.text.slice("work:".length))
    return t("play.worked", { amount: amount.toLocaleString("fr-FR") })
  }
  if (entry.text === "loyer:fail") {
    return t("play.rentFail")
  }
  if (entry.text.startsWith("loyer:")) {
    const amount = Number(entry.text.slice("loyer:".length))
    return t("play.rentPaidLog", { amount: amount.toLocaleString("fr-FR") })
  }
  return entry.text
}

function LogRow({ entry }: { entry: LogEntry }) {
  const text = useEntryText(entry)
  return (
    <li className="flex items-center gap-2 text-xs">
      <span className="shrink-0 tabular-nums text-muted-foreground">
        J{entry.day} · {formatClock(entry.time)}
      </span>
      <span>{text}</span>
    </li>
  )
}

export function GameLog({ log }: { log: LogEntry[] }) {
  const { t } = useTranslation()

  return (
    <div>
      {log.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("play.logEmpty")}</p>
      ) : (
        <ul className="space-y-1.5">
          {log.map((entry) => (
            <LogRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  )
}

import { useState } from "react"
import { Play } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useGameStore } from "@/features/play/store/useGameStore"

export function PlayerSetup() {
  const { t } = useTranslation()
  const create = useGameStore((s) => s.create)
  const [name, setName] = useState("")

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-bold">{t("play.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("play.intro")}</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            create(name)
          }}
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              {t("play.nameLabel")}
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("play.namePlaceholder")}
              className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </label>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Play className="size-4" />
            {t("play.start")}
          </button>
        </form>
      </div>
    </div>
  )
}

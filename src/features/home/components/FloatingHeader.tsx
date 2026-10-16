import { Globe, UserRound } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { CotonouLogo } from "@/components/CotonouLogo"
import { LANGUAGES } from "@/lib/i18n"
import { VENUES } from "@/config/venues"
import { formatShort, useCountUp } from "../useCountUp"
import { useAppStore, type Language } from "@/store/useAppStore"
import { useAuthStore, useUsername } from "@/store/useAuthStore"

export function FloatingHeader() {
  const { t } = useTranslation()
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const username = useUsername()
  const online = useCountUp(1240, 2600, 0.6)
  const visits = useCountUp(48900, 3000, 12)

  const pills = [
    { emoji: "🗺️", label: t("home.ctaExploreShort"), to: "/explorer" },
    { emoji: "🏛️", label: t("home.pillGov") },
    { emoji: "🌊", label: t("home.pillSea") },
    { emoji: "🏠", label: t("home.pillHomes", { n: VENUES.length }) },
  ]

  return (
    <div className="safe-top pointer-events-none absolute inset-x-0 top-0 z-30 px-3">
      <div className="panel pointer-events-auto mx-auto flex h-12 max-w-3xl items-center gap-2 rounded-full py-1 pr-1 pl-3 md:h-13">
        <CotonouLogo className="h-6 w-7 shrink-0" />
        <span className="min-w-0 truncate font-display text-lg font-semibold whitespace-nowrap">
          {t("app.name")}
        </span>

        <span className="ml-1 hidden items-center gap-3 text-[13px] font-semibold text-ink-soft tabular-nums sm:flex">
          <span className="flex items-center gap-1.5 text-leaf-deep">
            <span className="size-2 animate-pulse rounded-full bg-leaf" />
            {formatShort(online)} {t("home.online")}
          </span>
          <span className="flex items-center gap-1.5">
            👀 {formatShort(visits)} {t("home.visits")}
          </span>
        </span>

        <span className="ml-auto flex items-center gap-1.5">
          <label className="hidden items-center gap-1 rounded-full bg-mist px-2.5 py-1.5 text-ink-soft sm:flex">
            <Globe className="size-3.5" />
            <select
              aria-label={t("common.language")}
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="cursor-pointer appearance-none bg-transparent text-[13px] font-semibold text-ink outline-none"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              title={t("auth.logout")}
              aria-label={t("auth.logout")}
              className="btn-press flex h-full items-center gap-1.5 rounded-full bg-mist px-4 text-[13px] font-semibold text-ink"
            >
              <UserRound className="size-3.5" />
              <span className="max-w-[90px] truncate">{username}</span>
            </button>
          ) : (
            <Link
              to="/connexion"
              className="btn-press flex h-full items-center rounded-full bg-mist px-4 text-[13px] font-semibold text-ink"
            >
              {t("auth.login")}
            </Link>
          )}
          <Link
            to="/jouer"
            className="btn-press flex h-full items-center rounded-full bg-leaf px-4 text-[13px] font-semibold text-white"
          >
            {t("home.ctaPlayShort")}
          </Link>
        </span>
      </div>

      <div className="mt-1.5 flex justify-center gap-2 text-[11px] font-semibold tabular-nums sm:hidden">
        <span className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-leaf-deep backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-leaf" />
          {formatShort(online)} {t("home.online")}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-ink-soft backdrop-blur">
          👀 {formatShort(visits)} {t("home.visits")}
        </span>
      </div>

      <div className="scrollbar-none pointer-events-auto mx-auto mt-2 max-w-3xl overflow-x-auto text-[11px] font-semibold whitespace-nowrap sm:text-xs">
        <div className="mx-auto flex w-max gap-1.5 px-0.5 py-0.5">
          {pills.map((pill) =>
            pill.to ? (
              <Link
                key={pill.label}
                to={pill.to}
                className="panel max-w-[46vw] truncate rounded-full px-2.5 py-1.5 sm:max-w-none sm:px-3"
              >
                {pill.emoji} {pill.label}
              </Link>
            ) : (
              <span
                key={pill.label}
                className="panel max-w-[46vw] truncate rounded-full px-2.5 py-1.5 sm:max-w-none sm:px-3"
              >
                {pill.emoji} {pill.label}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="mt-2 flex justify-center px-1">
        <span className="panel pointer-events-auto max-w-[92%] truncate rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-ink-soft sm:text-xs">
          👋 {t("home.banner")}
        </span>
      </div>
    </div>
  )
}

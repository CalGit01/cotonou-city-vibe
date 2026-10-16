import { Gamepad2, Globe, Heart, Map, MapPin, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"
import { LANGUAGES } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useAppStore, type Language } from "@/store/useAppStore"
import { useAuthStore, useUsername } from "@/store/useAuthStore"

export function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const username = useUsername()
  const favoritesCount = useAppStore((s) => s.favorites.length)
  const onFavorites = location.pathname === "/favoris"
  const onPlay = location.pathname === "/jouer"
  const onExplorer = location.pathname === "/explorer"

  return (
    <header className="sticky top-0 z-[1000] border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="size-4" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold">{t("app.name")}</span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {t("app.tagline")}
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/explorer"
            aria-label={t("nav.explorer")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition hover:bg-accent",
              onExplorer && "border-primary bg-primary/5 text-primary",
            )}
          >
            <Map className="size-4" />
            <span className="hidden sm:inline">{t("nav.explorer")}</span>
          </Link>

          <Link
            to="/jouer"
            aria-label={t("nav.play")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition hover:bg-accent",
              onPlay && "border-primary bg-primary/5 text-primary",
            )}
          >
            <Gamepad2 className="size-4" />
            <span className="hidden sm:inline">{t("nav.play")}</span>
          </Link>

          <Link
            to="/favoris"
            aria-label={t("nav.favorites")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition hover:bg-accent",
              onFavorites && "border-rose-200 bg-rose-50 text-rose-600",
            )}
          >
            <Heart
              className={cn("size-4", onFavorites && "fill-rose-500 text-rose-500")}
            />
            {favoritesCount > 0 && (
              <span className="text-xs">{favoritesCount}</span>
            )}
          </Link>

          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              title={t("auth.logout")}
              className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition hover:bg-accent"
            >
              <User className="size-4" />
              <span className="hidden max-w-[120px] truncate sm:inline">
                {username}
              </span>
            </button>
          ) : (
            <Link
              to="/connexion"
              aria-label={t("auth.login")}
              className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition hover:bg-accent"
            >
              <User className="size-4" />
              <span className="hidden sm:inline">{t("auth.login")}</span>
            </Link>
          )}

          <label className="relative flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition hover:bg-accent">
            <Globe className="size-4 text-muted-foreground" />
            <select
              aria-label={t("common.language")}
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="cursor-pointer appearance-none bg-transparent pr-1 text-sm font-medium outline-none"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  )
}

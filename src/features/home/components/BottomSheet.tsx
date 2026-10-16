import { ArrowRight, Gamepad2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { getCategory } from "@/config/categories"
import type { Venue } from "@/config/venues"

export function BottomSheet({ venue }: { venue?: Venue }) {
  const { t } = useTranslation()

  const meta = venue ? getCategory(venue.category) : undefined
  const Icon = meta?.icon ?? Gamepad2
  const accent = meta?.color ?? "#1fa268"

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5 pt-[14vh]">
      <aside className="sheet-pop pointer-events-auto w-full max-w-md overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-6 text-center shadow-[0_24px_70px_-18px_rgba(10,26,36,0.55)] backdrop-blur-2xl">
        <span
          className="mx-auto flex size-16 items-center justify-center rounded-[22px]"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          <Icon className="size-8" />
        </span>

        <h2 className="mt-4 font-display text-2xl font-bold text-night">
          {venue ? t("home.goTo", { name: venue.name }) : t("home.sheetCreate")}
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-muted-foreground">
          {venue
            ? t("home.sheetText", { name: venue.name })
            : t("home.sheetDefaultText")}
        </p>

        <Link
          to="/jouer"
          className="btn-press mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-leaf font-display text-base font-bold text-white shadow-[0_14px_30px_-10px_rgba(31,162,104,0.9)] transition-colors hover:bg-leaf-deep"
        >
          {t("home.sheetPrimary")}
          <ArrowRight className="size-5" />
        </Link>

        <Link
          to={venue ? `/lieu/${venue.id}` : "/explorer"}
          className="btn-press mt-2.5 flex h-12 w-full items-center justify-center rounded-2xl bg-mist font-display text-sm font-bold text-ink transition-colors hover:bg-night/5"
        >
          {venue ? t("home.sheetViewVenue") : t("home.sheetSecondary")}
        </Link>
      </aside>
    </div>
  )
}

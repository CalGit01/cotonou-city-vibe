import { Heart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { VENUES } from "@/config/venues"
import { useAppStore } from "@/store/useAppStore"
import { VenueCard } from "../components/VenueCard"

export function FavoritesPage() {
  const { t } = useTranslation()
  const favorites = useAppStore((s) => s.favorites)
  const venues = VENUES.filter((venue) => favorites.includes(venue.id))

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <h1 className="mb-3 flex items-center gap-2 text-lg font-bold">
        <Heart className="size-5 fill-rose-500 text-rose-500" />
        {t("nav.favorites")}
        <span className="text-sm font-normal text-muted-foreground">
          ({venues.length})
        </span>
      </h1>

      {venues.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-background p-10 text-center">
          <Heart className="mx-auto mb-2 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("common.empty")}</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            {t("common.back")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  )
}

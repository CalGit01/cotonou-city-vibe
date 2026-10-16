import { Clock, Heart, MapPin, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { getCategory } from "@/config/categories"
import type { Venue } from "@/config/venues"
import { hoursLabel, isOpenNow } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

interface VenueCardProps {
  venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
  const { t } = useTranslation()
  const favorite = useAppStore((s) => s.favorites.includes(venue.id))
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const category = getCategory(venue.category)
  const Icon = category.icon
  const open = isOpenNow(venue)

  return (
    <div className="group relative flex gap-3 rounded-xl border bg-card p-3 shadow-sm transition hover:shadow-md">
      <Link
        to={`/lieu/${venue.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${category.color}1a`, color: category.color }}
        >
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-semibold">{venue.name}</span>
            <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {venue.rating.toFixed(1)}
            </span>
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="font-medium" style={{ color: category.color }}>
              {t(`categories.${venue.category}`)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {t(`quartiers.${venue.quartier}`)}
            </span>
            <span
              className={cn(
                "flex items-center gap-1",
                open ? "text-emerald-600" : "text-destructive",
              )}
            >
              <Clock className="size-3" />
              {open ? t("venue.openNow") : t("venue.closedNow")}
            </span>
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {hoursLabel(venue, t("venue.everyday"))} · {t(`price.${venue.priceLevel}`)}
          </span>
        </span>
      </Link>
      <button
        type="button"
        aria-label={favorite ? t("venue.unfavorite") : t("venue.favorite")}
        onClick={() => toggleFavorite(venue.id)}
        className="flex size-9 shrink-0 items-center justify-center self-start rounded-full transition hover:bg-accent"
      >
        <Heart
          className={cn(
            "size-4",
            favorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground",
          )}
        />
      </button>
    </div>
  )
}

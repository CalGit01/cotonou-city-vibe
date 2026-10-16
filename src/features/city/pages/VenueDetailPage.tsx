import { lazy, Suspense } from "react"
import {
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Star,
  Wallet,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "react-router"
import { getCategory } from "@/config/categories"
import { getVenue } from "@/config/venues"
import { hoursLabel, isOpenNow } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

const CityMap = lazy(() =>
  import("../components/CityMap").then((module) => ({
    default: module.CityMap,
  })),
)

export function VenueDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const language = useAppStore((s) => s.language)
  const favoriteIds = useAppStore((s) => s.favorites)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)

  const venue = id ? getVenue(id) : undefined

  if (!venue) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-sm text-muted-foreground">{t("common.empty")}</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          {t("common.back")}
        </Link>
      </div>
    )
  }

  const category = getCategory(venue.category)
  const Icon = category.icon
  const favorite = favoriteIds.includes(venue.id)
  const open = isOpenNow(venue)
  const description =
    language === "fon" ? venue.description.fon : venue.description.fr

  const rows = [
    {
      icon: MapPin,
      label: t("venue.quartier"),
      value: t(`quartiers.${venue.quartier}`),
    },
    {
      icon: Clock,
      label: t("venue.hours"),
      value: hoursLabel(venue, t("venue.everyday")),
      highlight: open ? t("venue.openNow") : t("venue.closedNow"),
      highlightColor: open ? "text-emerald-600" : "text-destructive",
    },
    {
      icon: Wallet,
      label: t("venue.price"),
      value: t(`price.${venue.priceLevel}`),
    },
    ...(venue.phone
      ? [
          {
            icon: Phone,
            label: t("venue.call"),
            value: venue.phone,
            href: `tel:${venue.phone.replace(/\s/g, "")}`,
          },
        ]
      : []),
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("common.back")}
      </button>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div
          className="flex items-center gap-3 p-5"
          style={{ backgroundColor: `${category.color}12` }}
        >
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${category.color}22`, color: category.color }}
          >
            <Icon className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight">{venue.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-medium" style={{ color: category.color }}>
                {t(`categories.${venue.category}`)}
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {venue.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {t(`quartiers.${venue.quartier}`)}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label={favorite ? t("venue.unfavorite") : t("venue.favorite")}
            onClick={() => toggleFavorite(venue.id)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background/70 transition hover:bg-background"
          >
            <Heart
              className={cn(
                "size-5",
                favorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground",
              )}
            />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <section>
            <h2 className="mb-1 text-sm font-semibold text-muted-foreground">
              {t("venue.about")}
            </h2>
            <p className="text-sm leading-relaxed">{description}</p>
          </section>

          <section className="grid gap-2 sm:grid-cols-2">
            {rows.map((row) => {
              const RowIcon = row.icon
              const content = (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                  <RowIcon className="size-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{row.label}</p>
                    <p className="truncate text-sm font-medium">
                      {row.value}
                      {"highlight" in row && row.highlight && (
                        <span className={cn("ml-2 text-xs", row.highlightColor)}>
                          {row.highlight}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
              return "href" in row && row.href ? (
                <a key={row.label} href={row.href}>
                  {content}
                </a>
              ) : (
                <div key={row.label}>{content}</div>
              )
            })}
          </section>

          <section>
            <h2 className="mb-1.5 text-sm font-semibold text-muted-foreground">
              {t("venue.tags")}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {venue.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <div className="h-56 overflow-hidden rounded-lg border">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {t("common.loading")}
                </div>
              }
            >
              <CityMap venues={[venue]} />
            </Suspense>
          </div>

          <a
            href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=;${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Navigation className="size-4" />
            {t("venue.directions")}
          </a>
        </div>
      </div>
    </div>
  )
}

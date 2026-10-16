import { lazy, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { CategoryFilter } from "../components/CategoryFilter"
import { SearchBar } from "../components/SearchBar"
import { VenueCard } from "../components/VenueCard"
import { ViewToggle } from "../components/ViewToggle"
import { useFilteredVenues } from "../hooks/useFilteredVenues"
import { useAppStore } from "@/store/useAppStore"

const CityMap = lazy(() =>
  import("../components/CityMap").then((module) => ({
    default: module.CityMap,
  })),
)

export function HomePage() {
  const { t } = useTranslation()
  const venues = useFilteredVenues()
  const viewMode = useAppStore((s) => s.viewMode)

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div className="space-y-3">
        <SearchBar />
        <CategoryFilter />
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {t("filters.results", { count: venues.length })}
          </p>
          <ViewToggle />
        </div>
      </div>

      <div className="mt-3">
        {viewMode === "map" ? (
          <div className="h-[calc(100dvh-19rem)] min-h-80 overflow-hidden rounded-xl border shadow-sm">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {t("common.loading")}
                </div>
              }
            >
              <CityMap venues={venues} />
            </Suspense>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
            {venues.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
                {t("common.empty")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

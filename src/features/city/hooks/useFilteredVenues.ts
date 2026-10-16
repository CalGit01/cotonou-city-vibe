import { useMemo } from "react"
import { VENUES, type Venue } from "@/config/venues"
import { useAppStore } from "@/store/useAppStore"

export function useFilteredVenues(): Venue[] {
  const search = useAppStore((s) => s.search)
  const categories = useAppStore((s) => s.categories)
  const quartiers = useAppStore((s) => s.quartiers)

  return useMemo(() => {
    const query = search.trim().toLowerCase()
    return VENUES.filter((venue) => {
      if (categories.length > 0 && !categories.includes(venue.category)) {
        return false
      }
      if (quartiers.length > 0 && !quartiers.includes(venue.quartier)) {
        return false
      }
      if (query.length > 0) {
        const haystack = [
          venue.name,
          venue.quartier,
          venue.category,
          ...venue.tags,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
  }, [search, categories, quartiers])
}

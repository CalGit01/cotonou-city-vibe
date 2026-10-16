import { Html } from "@react-three/drei"
import type { RefObject } from "react"
import { useTranslation } from "react-i18next"
import { getCategory } from "@/config/categories"
import { getVenue } from "@/config/venues"
import { cn } from "@/lib/utils"
import { LANDMARKS } from "../data/markers"

interface MarkerPinsProps {
  selectedId: string | null
  onSelect: (id: string) => void
  portal: RefObject<HTMLElement | null>
}

export function MarkerPins({ selectedId, onSelect, portal }: MarkerPinsProps) {
  const { t } = useTranslation()

  return (
    <>
      {LANDMARKS.map((landmark) => {
        const venue = getVenue(landmark.venueId)
        if (!venue) return null
        const meta = getCategory(venue.category)
        const Icon = meta.icon
        const selected = selectedId === landmark.id

        return (
          <Html
            key={landmark.id}
            portal={portal as RefObject<HTMLElement>}
            position={[landmark.x, landmark.top, landmark.z]}
            center
            zIndexRange={[15, 0]}
            style={{ pointerEvents: "none" }}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onSelect(landmark.id)
              }}
              aria-label={venue.name}
              className="pin-drop pointer-events-auto group"
            >
              <span className="relative flex flex-col items-center">
                <span
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-full border-2 border-white bg-white shadow-[0_8px_16px_rgba(10,26,36,0.3)] transition group-hover:scale-110",
                    selected && "scale-110 ring-4 ring-white/70",
                  )}
                >
                  {selected ? (
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
                  ) : null}
                  <Icon className="size-5" style={{ color: meta.color }} />
                </span>
                <span className="-mt-0.5 size-0 border-x-[9px] border-t-[11px] border-x-transparent border-t-white" />
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-night px-2.5 py-1 text-[11px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                  {venue.name}
                </span>
              </span>
              <span className="sr-only">{t("home.markerHint")}</span>
            </button>
          </Html>
        )
      })}
    </>
  )
}

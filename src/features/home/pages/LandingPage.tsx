import { lazy, Suspense, useState } from "react"
import { getVenue } from "@/config/venues"
import { BottomSheet } from "../components/BottomSheet"
import { Compass } from "../components/Compass"
import { FloatingHeader } from "../components/FloatingHeader"
import { WalkControls } from "../components/WalkControls"
import { LANDMARKS } from "../data/markers"

const CityCanvas = lazy(() =>
  import("../three/CityCanvas").then((module) => ({ default: module.CityCanvas })),
)

export function LandingPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [explore, setExplore] = useState(false)
  const landmark = LANDMARKS.find((item) => item.id === selectedId)
  const venue = landmark ? getVenue(landmark.venueId) : undefined

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#5fb6e6]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,#bfe6fb_0%,#86ccef_45%,#5fb6e6_100%)]"
      />
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="size-full" />}>
          <CityCanvas
            selectedId={selectedId}
            onSelect={setSelectedId}
            explore={explore}
            onExit={() => setExplore(false)}
          />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <FloatingHeader />
        {!explore && <Compass />}
        {!explore && <BottomSheet venue={venue} />}
        <WalkControls explore={explore} onToggle={() => setExplore((value) => !value)} />
      </div>
    </div>
  )
}

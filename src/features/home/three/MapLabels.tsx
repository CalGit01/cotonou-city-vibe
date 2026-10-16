import { Html } from "@react-three/drei"
import type { RefObject } from "react"

interface StreetLabel {
  name: string
  x: number
  z: number
  vertical?: boolean
}

interface QuarterLabel {
  name: string
  x: number
  z: number
}

const STREETS: StreetLabel[] = [
  { name: "Boulevard de la Marina", x: -20, z: 144 },
  { name: "Boulevard Saint-Michel", x: -40, z: -104 },
  { name: "Route de Ouidah", x: 100, z: -90, vertical: true },
  { name: "Avenue Steinmetz", x: 60, z: -34 },
  { name: "Boulevard du Canada", x: -60, z: 64 },
  { name: "Boulevard de France", x: -120, z: 32 },
  { name: "Avenue Clozel", x: 20, z: 48, vertical: true },
  { name: "Avenue Jean-Paul II", x: 40, z: -12 },
  { name: "Rue des Cheminots", x: -92, z: 60, vertical: true },
  { name: "Boulevard de la Côtière", x: 120, z: 10, vertical: true },
]

const QUARTERS: QuarterLabel[] = [
  { name: "Ganhi", x: -8, z: 10 },
  { name: "Cadjèhoun", x: -74, z: 44 },
  { name: "Zongo", x: -60, z: 18 },
  { name: "Akpakpa", x: 150, z: 62 },
  { name: "Fidjrossè", x: 110, z: 122 },
  { name: "Sainte-Rita", x: -44, z: -122 },
  { name: "Kouhounou", x: -150, z: 62 },
  { name: "Agla", x: 158, z: -62 },
  { name: "Sègbéya", x: -8, z: -96 },
  { name: "Gbégamey", x: 44, z: -58 },
  { name: "Aïbatin", x: 202, z: 0 },
  { name: "Ladji", x: 62, z: 128 },
]

export function MapLabels({ portal }: { portal: RefObject<HTMLElement | null> }) {
  return (
    <>
      {STREETS.map((street) => (
        <Html
          key={street.name}
          portal={portal as RefObject<HTMLElement>}
          position={[street.x, 2.6, street.z]}
          center
          zIndexRange={[8, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span
            className="whitespace-nowrap rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-night shadow-[0_2px_8px_rgba(10,26,36,0.25)] backdrop-blur-sm"
            style={street.vertical ? { writingMode: "vertical-rl" } : undefined}
          >
            {street.name}
          </span>
        </Html>
      ))}

      {QUARTERS.map((quarter) => (
        <Html
          key={quarter.name}
          portal={portal as RefObject<HTMLElement>}
          position={[quarter.x, 30, quarter.z]}
          center
          zIndexRange={[6, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span className="whitespace-nowrap rounded-md border border-white/40 bg-night/70 px-3 py-1 text-[13px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_rgba(10,26,36,0.35)] backdrop-blur-sm">
            {quarter.name}
          </span>
        </Html>
      ))}
    </>
  )
}

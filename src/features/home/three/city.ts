import { LANDMARKS } from "../data/markers"
import { mulberry32, pick, range, type Rng } from "./rng"

export const LAND = { x0: -240, x1: 240, z0: -150, z1: 150 }
export const CANAL = { x0: 38, x1: 56 }
export const BEACH = { z0: 150, z1: 168 }
export const ROAD_W = 7
export const SIDEWALK = 5

export const ROAD_Z = [
  -144, -124, -104, -84, -64, -34, -12, 10, 32, 64, 84, 104, 124, 144,
]
export const ROAD_X = [
  -228, -208, -188, -168, -148, -92, -64, -36, -8, 20, 72, 100, 148, 168, 188,
  208, 228,
]

const CORE = { x0: -135, x1: 135, z0: -70, z1: 70 }

export interface BuildingDef {
  x: number
  z: number
  w: number
  d: number
  h: number
  color: string
  roof: string
  rot: number
}

export interface TreeDef {
  x: number
  z: number
  s: number
  kind: "round" | "palm"
}

export interface RoadDef {
  axis: "x" | "z"
  pos: number
  from: number
  to: number
  width: number
}

const WALLS = [
  "#e8894a",
  "#efc94c",
  "#5fbfa0",
  "#e2653b",
  "#7fb3d5",
  "#f2a1a1",
  "#c9e265",
  "#d9a066",
  "#8fd3c7",
  "#f0b7c9",
  "#f5f0e6",
] as const

const ROOFS = ["#b5462a", "#8c3d20", "#a0522d", "#7a3b2e", "#c2451e", "#4a5560"] as const
const COMMERCIAL = ["#dcdcd4", "#cfd6da", "#e6e0d4", "#c7d0d6", "#dfe6e9"] as const
const GLASS = ["#8fb8cc", "#9cc3d5", "#7fa9c0", "#a9cddb"] as const

function toBands(values: number[], from: number, to: number): [number, number][] {
  const xs = [from, ...values, to].sort((a, b) => a - b)
  const out: [number, number][] = []
  for (let i = 0; i < xs.length - 1; i += 1) out.push([xs[i], xs[i + 1]])
  return out
}

const X_BANDS = toBands([...ROAD_X, CANAL.x0, CANAL.x1], LAND.x0, LAND.x1)
const Z_BANDS = toBands(ROAD_Z, LAND.z0, LAND.z1)

export interface KeepOut {
  x0: number
  x1: number
  z0: number
  z1: number
}

export const KEEP_OUT: KeepOut[] = [
  { x0: -130, x1: -58, z0: -52, z1: -18 },
  { x0: -130, x1: -58, z0: 18, z1: 52 },
  { x0: 74, x1: 98, z0: 8, z1: 34 },
  { x0: 76, x1: 96, z0: -32, z1: -14 },
  { x0: 10, x1: 30, z0: -34, z1: -16 },
  { x0: -30, x1: -14, z0: 8, z1: 34 },
  { x0: -20, x1: 4, z0: -24, z1: 0 },
  { x0: 54, x1: 80, z0: 28, z1: 52 },
  { x0: 82, x1: 130, z0: 34, z1: 62 },
  { x0: -128, x1: -112, z0: -20, z1: 38 },
  { x0: 112, x1: 128, z0: -20, z1: 38 },
  { x0: -142, x1: -128, z0: -36, z1: -22 },
  { x0: 128, x1: 142, z0: -36, z1: -22 },
  { x0: 22, x1: 40, z0: -54, z1: -40 },
  { x0: 144, x1: 164, z0: 62, z1: 80 },
  { x0: CANAL.x0, x1: CANAL.x1, z0: LAND.z0, z1: LAND.z1 },
]

function insideKeepOut(x: number, z: number, pad = 0) {
  return KEEP_OUT.some(
    (zone) =>
      x > zone.x0 - pad && x < zone.x1 + pad && z > zone.z0 - pad && z < zone.z1 + pad,
  )
}

function tooClose(x: number, z: number, pad = 0) {
  return (
    insideKeepOut(x, z, pad) ||
    LANDMARKS.some((l) => Math.hypot(l.x - x, l.z - z) < l.clearance + pad)
  )
}

function isOuterBand(x0: number, x1: number, z0: number, z1: number) {
  return x1 <= CORE.x0 || x0 >= CORE.x1 || z1 <= CORE.z0 || z0 >= CORE.z1
}

function buildBuildings(): BuildingDef[] {
  const rng = mulberry32(20260115)
  const out: BuildingDef[] = []

  const fill = (
    rng: Rng,
    x0: number,
    x1: number,
    z0: number,
    z1: number,
    outer: boolean,
  ) => {
    const step = outer ? 26 : 13
    const cols = Math.max(1, Math.round((x1 - x0) / step))
    const rows = Math.max(1, Math.round((z1 - z0) / step))
    const cw = (x1 - x0) / cols
    const cd = (z1 - z0) / rows

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cx = x0 + cw * c + cw / 2 + range(rng, -cw * 0.09, cw * 0.09)
        const cz = z0 + cd * r + cd / 2 + range(rng, -cd * 0.09, cd * 0.09)
        if (tooClose(cx, cz, outer ? 8 : 6)) continue

        const roll = rng()
        if (outer) {
          if (roll < 0.24) {
            const bw = range(rng, 8, 12)
            out.push({
              x: cx,
              z: cz,
              w: bw,
              d: range(rng, 8, 12),
              h: range(rng, 5, 8),
              color: pick(rng, WALLS),
              roof: pick(rng, ROOFS),
              rot: range(rng, -0.12, 0.12),
            })
          } else if (roll < 0.64) {
            const bw = range(rng, 14, 20)
            out.push({
              x: cx,
              z: cz,
              w: bw,
              d: range(rng, 14, 20),
              h: range(rng, 12, 26),
              color: pick(rng, COMMERCIAL),
              roof: pick(rng, ROOFS),
              rot: range(rng, -0.18, 0.18),
            })
          } else {
            const bw = range(rng, 16, 24)
            out.push({
              x: cx,
              z: cz,
              w: bw,
              d: range(rng, 16, 24),
              h: range(rng, 30, 56),
              color: pick(rng, GLASS),
              roof: pick(rng, GLASS),
              rot: range(rng, -0.26, 0.26),
            })
          }
        } else if (roll < 0.5) {
          out.push({
            x: cx,
            z: cz,
            w: range(rng, 6, 9.5),
            d: range(rng, 6, 9.5),
            h: range(rng, 4.5, 7.5),
            color: pick(rng, WALLS),
            roof: pick(rng, ROOFS),
            rot: range(rng, -0.12, 0.12),
          })
        } else if (roll < 0.86) {
          out.push({
            x: cx,
            z: cz,
            w: range(rng, 10, 15),
            d: range(rng, 10, 15),
            h: range(rng, 10, 22),
            color: pick(rng, COMMERCIAL),
            roof: pick(rng, ROOFS),
            rot: range(rng, -0.2, 0.2),
          })
        } else {
          const bw = range(rng, 12, 17)
          out.push({
            x: cx,
            z: cz,
            w: bw,
            d: range(rng, 12, 17),
            h: range(rng, 26, 46),
            color: pick(rng, GLASS),
            roof: pick(rng, GLASS),
            rot: range(rng, -0.3, 0.3),
          })
        }

        const last = out[out.length - 1]
        last.w = Math.min(last.w, cw * 0.85)
        last.d = Math.min(last.d, cd * 0.85)
      }
    }
  }

  for (const [x0, x1] of X_BANDS) {
    for (const [z0, z1] of Z_BANDS) {
      const outer = isOuterBand(x0, x1, z0, z1)
      const pad = 4
      const ix0 = x0 + pad
      const ix1 = x1 - pad
      const iz0 = z0 + pad
      const iz1 = z1 - pad
      if (ix1 - ix0 < 10 || iz1 - iz0 < 10) continue
      fill(rng, ix0, ix1, iz0, iz1, outer)
    }
  }

  return out
}

function buildTrees(): TreeDef[] {
  const rng = mulberry32(4242)
  const out: TreeDef[] = []
  const push = (x: number, z: number, kind: TreeDef["kind"] = "round") => {
    if (x > CANAL.x0 - 2 && x < CANAL.x1 + 2) return
    if (x < LAND.x0 + 3 || x > LAND.x1 - 3) return
    if (z < LAND.z0 + 3 || z > LAND.z1 - 3) return
    if (tooClose(x, z, -4)) return
    out.push({ x, z, s: range(rng, 0.8, 1.3), kind })
  }

  for (const z of ROAD_Z) {
    for (let x = LAND.x0 + 8; x <= LAND.x1 - 8; x += 22) {
      push(x, z - (ROAD_W / 2 + SIDEWALK + 1.5))
      push(x + 11, z + (ROAD_W / 2 + SIDEWALK + 1.5))
    }
  }
  for (const x of ROAD_X) {
    for (let z = LAND.z0 + 8; z <= LAND.z1 - 8; z += 22) {
      push(x - (ROAD_W / 2 + SIDEWALK + 1.5), z)
      push(x + (ROAD_W / 2 + SIDEWALK + 1.5), z + 11)
    }
  }
  for (let x = 60; x <= 126; x += 11) {
    push(x, 52, "palm")
    push(x + 5, 57, "palm")
  }

  return out
}

function buildRoads(): RoadDef[] {
  const roads: RoadDef[] = []
  for (const z of ROAD_Z) {
    roads.push({ axis: "x", pos: z, from: LAND.x0, to: LAND.x1, width: ROAD_W })
  }
  for (const x of ROAD_X) {
    roads.push({ axis: "z", pos: x, from: LAND.z0, to: LAND.z1, width: ROAD_W - 1 })
  }
  return roads
}

export const BUILDINGS = buildBuildings()
export const TREES = buildTrees()
export const ROADS = buildRoads()

const RINGS: [number, number][][] = [
  [
    [-208, -124],
    [208, -124],
    [208, 124],
    [-208, 124],
  ],
  [
    [-168, -104],
    [168, -104],
    [168, 104],
    [-168, 104],
  ],
  [
    [-148, -64],
    [100, -64],
    [100, 10],
    [-148, 10],
  ],
  [
    [-64, -34],
    [-36, -34],
    [-36, -12],
    [-64, -12],
  ],
]

const WALK_RECTS: [number, number][][] = [
  [
    [-148, -12],
    [-92, -12],
    [-92, 32],
    [-148, 32],
  ],
  [
    [20, -12],
    [100, -12],
    [100, 64],
    [20, 64],
  ],
  [
    [-64, -64],
    [-8, -64],
    [-8, -12],
    [-64, -12],
  ],
  [
    [72, 10],
    [148, 10],
    [148, 104],
    [72, 104],
  ],
  [
    [-168, 64],
    [-92, 64],
    [-92, 124],
    [-168, 124],
  ],
  [
    [100, -104],
    [168, -104],
    [168, -12],
    [100, -12],
  ],
  [
    [-36, 10],
    [20, 10],
    [20, 32],
    [-36, 32],
  ],
  [
    [-148, 84],
    [-64, 84],
    [-64, 104],
    [-148, 104],
  ],
]

export const CAR_ROUTES: [number, number][][] = RINGS
export const WALK_ROUTES: [number, number][][] = [...RINGS, ...WALK_RECTS]

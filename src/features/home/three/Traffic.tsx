import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import type { Group, MeshStandardMaterial } from "three"
import { CAR_ROUTES } from "./city"
import { Bus, Car, Moto } from "./Car"
import { routeLength, sampleRoute } from "./route"
import { setVehiclePose } from "./trafficState"

const VEHICLE_RADIUS: Record<Vehicle["kind"], number> = { car: 2.2, bus: 3.4, moto: 0.7 }

const CAR_COLORS = [
  "#e8493a",
  "#e8e4da",
  "#3d7dc4",
  "#2f9e6b",
  "#8e44ad",
  "#ef8b2c",
  "#2c3e50",
  "#f5f0e6",
]
const BUS_COLORS = ["#f2c230", "#4a90c2", "#e8493a", "#2f9e6b"]
const MOTO_COLORS = ["#f2c230", "#c2451e", "#16a085", "#e84393"]

const ROUTE_COUNT = [5, 4, 4, 2]
const ROUTE_LANES = [
  [2.3, -2.3, 0],
  [2.3, -2.3, 0],
  [2.3, -2.3, 0],
  [0],
]
const ROUTE_LANE_SPEED = [
  [7.8, 6.2, 10.4],
  [7.8, 6.2, 10.4],
  [7.4, 6.2, 10.2],
  [6.8],
]

const CYCLE = 14
const GREEN = 6
const ACCEL = 10
const DECEL = 20
const STOP_GAP = 5
const CAR_GAP = 8
const LOOKAHEAD = 38

interface Stop {
  dist: number
  phase: number
}

interface Vehicle {
  route: number
  kind: "car" | "moto" | "bus"
  color: string
  baseSpeed: number
  points: [number, number][]
  total: number
  laneIndex: number
  lateral: number
  u: number
  speed: number
  stops: Stop[]
}

function nodePhase(x: number, z: number) {
  return (Math.round(Math.abs(x) / 10) + Math.round(Math.abs(z) / 10)) % 2
}

function cumDist(points: [number, number][]) {
  const arr = [0]
  let t = 0
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    t += Math.hypot(b[0] - a[0], b[1] - a[1])
    arr.push(t)
  }
  return arr
}

function buildVehicles(): Vehicle[] {
  const out: Vehicle[] = []
  CAR_ROUTES.forEach((points, route) => {
    const total = routeLength(points)
    const cum = cumDist(points)
    const count = ROUTE_COUNT[route] ?? 3
    const lanes = ROUTE_LANES[route] ?? [0]
    const speeds = ROUTE_LANE_SPEED[route] ?? [5.8]

    const stops: Stop[] = []
    for (let i = 1; i < points.length; i += 1) {
      stops.push({ dist: cum[i], phase: nodePhase(points[i][0], points[i][1]) })
    }
    stops.push({ dist: total, phase: nodePhase(points[0][0], points[0][1]) })

    for (let k = 0; k < count; k += 1) {
      const laneIndex = k % lanes.length
      const isMoto = lanes.length > 1 && laneIndex === lanes.length - 1
      const kind: Vehicle["kind"] = isMoto ? "moto" : k % 2 === 0 ? "bus" : "car"
      const palette =
        kind === "bus" ? BUS_COLORS : kind === "moto" ? MOTO_COLORS : CAR_COLORS
      const speed = speeds[laneIndex] ?? 5.8
      out.push({
        route,
        kind,
        color: palette[(route + k) % palette.length],
        baseSpeed: speed,
        points,
        total,
        laneIndex,
        lateral: lanes[laneIndex],
        u: (k / count) * total,
        speed,
        stops,
      })
    }
  })
  return out
}

const SIGNAL_NODES = (() => {
  const seen = new Map<string, { x: number; z: number; phase: number }>()
  for (const points of CAR_ROUTES) {
    for (const p of points) {
      const key = `${Math.round(p[0])},${Math.round(p[1])}`
      if (!seen.has(key)) seen.set(key, { x: p[0], z: p[1], phase: nodePhase(p[0], p[1]) })
    }
  }
  return [...seen.values()]
})()

function isRed(phase: number, t: number) {
  const p = t % CYCLE
  if (phase === 0) return p >= GREEN
  return p < GREEN + 1 || p >= GREEN + 1 + GREEN
}

function lightColor(phase: number, t: number) {
  const p = t % CYCLE
  if (phase === 0) {
    if (p < GREEN) return "#2ecc71"
    if (p < GREEN + 1) return "#f1c40f"
    return "#e74c3c"
  }
  if (p < GREEN + 1) return "#e74c3c"
  if (p < GREEN + 1 + GREEN) return "#2ecc71"
  return "#f1c40f"
}

function stepSimulation(vehicles: Vehicle[], t: number, dt: number) {
  const groups = new Map<string, Vehicle[]>()
  for (const v of vehicles) {
    const key = `${v.route}:${v.laneIndex}`
    const list = groups.get(key)
    if (list) list.push(v)
    else groups.set(key, [v])
  }

  const gapAhead = new Map<Vehicle, number>()
  groups.forEach((list) => {
    if (list.length < 2) return
    const sorted = [...list].sort((a, b) => a.u - b.u)
    for (let i = 0; i < sorted.length; i += 1) {
      const cur = sorted[i]
      const next = sorted[(i + 1) % sorted.length]
      let gap = (next.u - cur.u + cur.total) % cur.total
      if (gap <= 0) gap = cur.total
      gapAhead.set(cur, gap)
    }
  })

  for (const v of vehicles) {
    let desired = v.baseSpeed

    let nearest: Stop | null = null
    for (const s of v.stops) {
      if (s.dist > v.u + 0.01) {
        nearest = s
        break
      }
    }
    if (!nearest) nearest = v.stops[v.stops.length - 1]

    if (nearest && isRed(nearest.phase, t)) {
      const rem = nearest.dist - v.u
      if (rem < LOOKAHEAD) {
        const free = rem - STOP_GAP
        desired = Math.min(desired, free <= 0 ? 0 : free * 1.3)
      }
    }

    const gap = gapAhead.get(v)
    if (gap !== undefined) {
      desired = Math.min(desired, Math.max(0, (gap - CAR_GAP) * 1.4))
    }

    if (desired > v.speed) v.speed = Math.min(desired, v.speed + ACCEL * dt)
    else v.speed = Math.max(desired, v.speed - DECEL * dt)

    v.u = (v.u + v.speed * dt) % v.total
  }
}

export function Traffic() {
  const vehicles = useMemo(() => buildVehicles(), [])
  const bodyRefs = useRef<(Group | null)[]>([])
  const lightRefs = useRef<(MeshStandardMaterial | null)[]>([])
  const simTime = useRef(0)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    simTime.current += dt
    const t = simTime.current
    stepSimulation(vehicles, t, dt)

    for (let i = 0; i < vehicles.length; i += 1) {
      const g = bodyRefs.current[i]
      if (!g) continue
      const v = vehicles[i]
      const sample = sampleRoute(v.points, v.u, v.total)
      const vx = sample.x + Math.sin(sample.angle) * v.lateral
      const vz = sample.z + Math.cos(sample.angle) * v.lateral
      g.position.set(vx, 0.06, vz)
      g.rotation.y = sample.angle
      setVehiclePose(i, vx, vz, VEHICLE_RADIUS[v.kind])
    }

    for (let i = 0; i < SIGNAL_NODES.length; i += 1) {
      const mat = lightRefs.current[i]
      if (!mat) continue
      const color = lightColor(SIGNAL_NODES[i].phase, t)
      mat.color.set(color)
      mat.emissive.set(color)
    }
  })

  return (
    <group>
      {vehicles.map((v, index) => (
        <group
          key={index}
          ref={(el) => {
            bodyRefs.current[index] = el
          }}
        >
          {v.kind === "bus" ? (
            <Bus color={v.color} />
          ) : v.kind === "moto" ? (
            <Moto color={v.color} />
          ) : (
            <Car color={v.color} />
          )}
        </group>
      ))}

      {SIGNAL_NODES.map((node, index) => (
        <group key={`signal-${index}`} position={[node.x, 0, node.z]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.17, 3, 8]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          <mesh position={[0, 3.25, 0]}>
            <boxGeometry args={[0.5, 1.1, 0.42]} />
            <meshStandardMaterial color="#16181d" />
          </mesh>
          <mesh position={[0, 3.25, 0.23]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial
              ref={(el) => {
                lightRefs.current[index] = el
              }}
              color="#2ecc71"
              emissive="#2ecc71"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

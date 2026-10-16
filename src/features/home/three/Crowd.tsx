import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import type { Group } from "three"
import { WALK_ROUTES } from "./city"
import { PersonModel } from "./PersonModel"
import { PEOPLE } from "./people"
import type { PersonKey } from "./people"
import { routeLength, sampleRoute } from "./route"

interface Plan {
  route: number
  speed: number
  offset: number
  lateral: number
  model: string
  phase: number
  height: number
  tint: string
}

const MODEL_KEYS = Object.keys(PEOPLE) as PersonKey[]
const WALK_LANES = [4.8, -4.8, 6.4, -6.4, 5.6, -5.6]
const COUNT = 48
const TINTS = ["#f0e3d0", "#e6caa3", "#f5e7d0", "#d7b98d", "#f2e2c8", "#e2c08d", "#f7f0e2", "#e9d5b3"]

const PLANS: Plan[] = Array.from({ length: COUNT }, (_, index) => {
  const route = index % WALK_ROUTES.length
  const laneIndex = Math.floor(index / WALK_ROUTES.length) % WALK_LANES.length
  const speed = 0.8 + ((index * 37) % 100) / 200
  return {
    route,
    speed,
    offset: (index * 53) % 360,
    lateral: WALK_LANES[laneIndex],
    model: PEOPLE[MODEL_KEYS[(index * 3) % MODEL_KEYS.length]],
    phase: (index * 0.37) % 1.6,
    height: 1.62 + ((index * 17) % 22) / 100,
    tint: TINTS[(index * 5) % TINTS.length],
  }
})

function Walker({ plan }: { plan: Plan }) {
  const ref = useRef<Group>(null)
  const route = useMemo(() => {
    const points = WALK_ROUTES[plan.route]
    return { points, total: routeLength(points) }
  }, [plan.route])

  useFrame((state) => {
    const group = ref.current
    if (!group) return
    const sample = sampleRoute(
      route.points,
      plan.offset + state.clock.elapsedTime * plan.speed * 1.7,
      route.total,
    )
    group.position.set(
      sample.x + Math.sin(sample.angle) * plan.lateral,
      0,
      sample.z + Math.cos(sample.angle) * plan.lateral,
    )
    group.rotation.y = sample.angle
  })

  return (
    <group ref={ref}>
      <PersonModel url={plan.model} phase={plan.phase} speed={plan.speed} height={plan.height} tint={plan.tint} />
    </group>
  )
}

export function Crowd() {
  return (
    <group>
      {PLANS.map((plan, index) => (
        <Walker key={index} plan={plan} />
      ))}
    </group>
  )
}

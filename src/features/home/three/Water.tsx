import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import type { Group } from "three"
import { CANAL, LAND } from "./city"

const CANAL_X = (CANAL.x0 + CANAL.x1) / 2

function Pirogue({ color = "#8a5a32" }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.1, 0.55, 5.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.3, 2.9]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 1.2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.3, -2.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.55, 1.2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.5, 0.4]}>
        <boxGeometry args={[0.85, 0.16, 1.6]} />
        <meshStandardMaterial color="#c9a06a" />
      </mesh>
      <mesh position={[0, 1.05, -1.1]}>
        <boxGeometry args={[0.36, 0.9, 0.36]} />
        <meshStandardMaterial color="#3d7dc4" />
      </mesh>
      <mesh position={[0, 1.6, -1.1]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#5c3f2b" />
      </mesh>
    </group>
  )
}

interface BoatPlan {
  x: number
  z0: number
  length: number
  speed: number
  phase: number
  color: string
}

function Boat({ plan }: { plan: BoatPlan }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const group = ref.current
    if (!group) return
    const travel = (state.clock.elapsedTime * plan.speed + plan.phase) % (plan.length * 2)
    const t = travel > plan.length ? plan.length * 2 - travel : travel
    group.position.set(plan.x, -0.2, plan.z0 + t)
    group.rotation.y = travel > plan.length ? Math.PI : 0
    group.rotation.z = Math.sin(state.clock.elapsedTime * 1.4 + plan.phase) * 0.05
  })
  return (
    <group ref={ref}>
      <Pirogue color={plan.color} />
    </group>
  )
}

const BOATS: BoatPlan[] = [
  { x: CANAL_X - 4, z0: -140, length: 280, speed: 3.4, phase: 0, color: "#8a5a32" },
  { x: CANAL_X + 4, z0: -110, length: 280, speed: 2.8, phase: 120, color: "#b5462a" },
  { x: CANAL_X, z0: -150, length: 300, speed: 3.1, phase: 210, color: "#7a5c3a" },
  { x: CANAL_X - 2.5, z0: 60, length: 240, speed: 2.6, phase: 40, color: "#2f7d4a" },
]

interface Hut {
  x: number
  z: number
  wall: string
  roof: string
  r: number
}

function StiltVillage() {
  const huts = useMemo<Hut[]>(() => {
    const walls = ["#d9a066", "#c9a06a", "#e0b483", "#b5834f"]
    const roofs = ["#b5462a", "#8c3d20", "#a0522d"]
    const out: Hut[] = []
    let i = 0
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        if ((row + col) % 5 === 4) continue
        out.push({
          x: CANAL_X - 5 + col * 3.4 + (row % 2) * 0.8,
          z: -150 + row * 7,
          wall: walls[i % walls.length],
          roof: roofs[i % roofs.length],
          r: (i % 4) * 0.08 - 0.12,
        })
        i += 1
      }
    }
    return out
  }, [])

  return (
    <group>
      {huts.map((hut, index) => (
        <group key={index} position={[hut.x, -0.1, hut.z]} rotation={[0, hut.r, 0]}>
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sz], k) => (
            <mesh key={k} position={[sx * 1.1, 0.7, sz * 1.1]}>
              <cylinderGeometry args={[0.1, 0.1, 1.4, 6]} />
              <meshStandardMaterial color="#6b4a2f" />
            </mesh>
          ))}
          <mesh position={[0, 1.9, 0]}>
            <boxGeometry args={[3, 1.8, 3]} />
            <meshStandardMaterial color={hut.wall} />
          </mesh>
          <mesh position={[0, 3.15, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[2.6, 1.2, 4]} />
            <meshStandardMaterial color={hut.roof} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Water() {
  return (
    <group>
      <StiltVillage />
      {BOATS.map((plan, index) => (
        <Boat key={index} plan={plan} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[LAND.x0 - 60, -0.1, 40]}>
        <planeGeometry args={[90, 60]} />
        <meshStandardMaterial color="#4f9fd4" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

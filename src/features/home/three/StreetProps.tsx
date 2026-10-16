import { Instances, Instance } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import type { MeshStandardMaterial } from "three"
import { Car } from "./Car"
import { CANAL, LAND, ROAD_X, ROAD_Z, ROAD_W, SIDEWALK } from "./city"
import { DN, sampleDay } from "./daynight"

const LAMP_INTENSITY = 2.2

function Dumpster({ position, color = "#6f7d86" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.1, 0.9, 1.9]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.05, 0.5, 1.85]} />
        <meshStandardMaterial color="#2c3238" />
      </mesh>
    </group>
  )
}

function BusShelter({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-1.6, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#7a5c3a" />
      </mesh>
      <mesh position={[1.6, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#7a5c3a" />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[4.4, 0.25, 3.8]} />
        <meshStandardMaterial color="#b5462a" />
      </mesh>
      <mesh position={[0, 2.4, -0.1]}>
        <boxGeometry args={[4.4, 0.25, 4.0]} />
        <meshStandardMaterial color="#8c3d20" roughness={0.9} />
      </mesh>
      <mesh position={[-1.5, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 2.4, 6]} />
        <meshStandardMaterial color="#7a5c3a" />
      </mesh>
      <mesh position={[1.5, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 2.4, 6]} />
        <meshStandardMaterial color="#7a5c3a" />
      </mesh>
      <mesh position={[0, 1.2, 1.5]}>
        <cylinderGeometry args={[0.08, 0.1, 2.4, 6]} />
        <meshStandardMaterial color="#7a5c3a" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[3.4, 0.5, 2.8]} />
        <meshStandardMaterial color="#d9a066" />
      </mesh>
    </group>
  )
}

export function StreetProps() {
  const headMat = useRef<MeshStandardMaterial>(null)

  const [lampPosts, lampHeads] = useMemo(() => {
    const posts: { x: number; y: number; z: number }[] = []
    const heads: { x: number; y: number; z: number }[] = []
    const zxw = ROAD_W / 2
    const zwv = ROAD_W - 1
    const side = zxw + SIDEWALK * 0.5 + 0.4
    const sideZ = zwv / 2 + SIDEWALK * 0.5 + 0.4

    for (const zr of ROAD_Z) {
      if (Math.abs(zr) > 160) continue
      for (let x = LAND.x0 + 20; x <= LAND.x1 - 20; x += 64) {
        const x2 = x + 32
        const inCanal = (x: number) => x > CANAL.x0 - 6 && x < CANAL.x1 + 6
        if (!inCanal(x)) {
          posts.push({ x, y: 0, z: zr - side })
          heads.push({ x, y: 0, z: zr - side })
        }
        if (!inCanal(x2)) {
          posts.push({ x: x2, y: 0, z: zr + side })
          heads.push({ x: x2, y: 0, z: zr + side })
        }
      }
    }
    for (const xr of ROAD_X) {
      if (Math.abs(xr) > 230) continue
      for (let z = LAND.z0 + 20; z <= LAND.z1 - 20; z += 64) {
        const z2 = z + 32
        const inCanal = (z: number) => z > -155 && z < 155 && xr > CANAL.x0 - 6 && xr < CANAL.x1 + 6
        if (!inCanal(z)) {
          posts.push({ x: xr - sideZ, y: 0, z })
          heads.push({ x: xr - sideZ, y: 0, z })
        }
        if (!inCanal(z2)) {
          posts.push({ x: xr + sideZ, y: 0, z: z2 })
          heads.push({ x: xr + sideZ, y: 0, z: z2 })
        }
      }
    }
    return [posts, heads]
  }, [])

  useFrame(() => {
    const sample = sampleDay(DN.t)
    if (headMat.current) {
      const glow = sample.night * LAMP_INTENSITY
      headMat.current.emissiveIntensity = glow
      const c = sample.sun
      headMat.current.emissive.set(c)
      headMat.current.color.set(c)
    }
  })

  const parkColor = ["#e8493a", "#3d7dc4", "#2f9e6b", "#8e44ad", "#ef8b2c", "#2c3e50"]

  return (
    <group>
      <Instances limit={lampPosts.length} frustumCulled={false}>
        <cylinderGeometry args={[0.11, 0.14, 4.6, 8]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
        {lampPosts.map((p, i) => (
          <Instance key={i} position={[p.x, 2.3, p.z]} />
        ))}
      </Instances>
      <Instances limit={lampHeads.length} frustumCulled={false}>
        <boxGeometry args={[0.7, 0.18, 0.4]} />
        <meshStandardMaterial
          ref={headMat}
          color="#ffcb86"
          emissive="#ffcb86"
          emissiveIntensity={0}
          toneMapped={false}
          roughness={0.2}
        />
        {lampHeads.map((p, i) => (
          <Instance key={i} position={[p.x, 4.7, p.z]} />
        ))}
      </Instances>

      <group>
        {[-22, -16, -28].map((_, i) => (
          <Car key={`p1-${i}`} color={parkColor[i % parkColor.length]} />
        ))}
      </group>
      <group position={[-8, 0.06, -6]} rotation={[0, 0, 0]}>
        <group position={[-30, 0, -60]} rotation={[0, Math.PI / 2, 0]}>
          <Car color={parkColor[0]} />
        </group>
        <group position={[120, 0, -58]} rotation={[0, -Math.PI / 2, 0]}>
          <Car color={parkColor[1]} />
        </group>
        <group position={[90, 0, 8]} rotation={[0, Math.PI, 0]}>
          <Car color={parkColor[2]} />
        </group>
        <group position={[-80, 0, 8]} rotation={[0, 0, 0]}>
          <Car color={parkColor[3]} />
        </group>
        <group position={[-48, 0, 44]} rotation={[0, Math.PI, 0]}>
          <Car color={parkColor[4]} />
        </group>
        <group position={[62, 0, 44]} rotation={[0, 0, 0]}>
          <Car color={parkColor[5]} />
        </group>
        <group position={[62, 0, -44]} rotation={[0, Math.PI, 0]}>
          <Car color={parkColor[0]} />
        </group>
        <group position={[-40, 0, -30]} rotation={[0, -Math.PI / 2, 0]}>
          <Car color={parkColor[1]} />
        </group>
        <group position={[40, 0, 70]} rotation={[0, Math.PI / 2, 0]}>
          <Car color={parkColor[2]} />
        </group>
      </group>

      <BusShelter position={[-16, 0, 10]} rotation={0} />
      <BusShelter position={[90, 0, -34]} rotation={Math.PI / 2} />
      <BusShelter position={[-70, 0, -20]} rotation={-Math.PI / 2} />

      <Dumpster position={[-20, 0, 24]} />
      <Dumpster position={[100, 0, 0]} />
      <Dumpster position={[60, 0, -48]} />
      <Dumpster position={[-100, 0, 40]} />
    </group>
  )
}

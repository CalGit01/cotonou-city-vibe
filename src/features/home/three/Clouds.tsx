import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { PlaneGeometry, type Mesh } from "three"
import { DN, sampleDay } from "./daynight"

const CLOUDS = 10

function Cloud({ index }: { index: number }) {
  const ref = useRef<Mesh>(null)
  const pos = useMemo(() => {
    return {
      x: -180 + ((index * 37) % 360),
      y: 160 + ((index * 23) % 40),
      z: -140 + ((index * 61) % 320),
      s: 1.2 + ((index * 13) % 80) / 80,
    }
  }, [index])

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.position.x += dt * 0.8
      if (ref.current.position.x > 220) ref.current.position.x = -220
    }
  })

  const geom = useMemo(() => {
    const g = new PlaneGeometry(24 * pos.s, 10 * pos.s)
    g.rotateX(-Math.PI / 2)
    return g
  }, [pos.s])

  return (
    <mesh
      ref={ref}
      geometry={geom}
      position={[pos.x, pos.y, pos.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      frustumCulled={false}
    >
      <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
    </mesh>
  )
}

export function Clouds() {
  const matRef = useRef<any>(null)
  const clouds = useMemo(() => Array.from({ length: CLOUDS }, (_, i) => i), [])

  useFrame(() => {
    const sample = sampleDay(DN.t)
    if (matRef.current) {
      matRef.current.opacity = 0.18 - sample.night * 0.12
      matRef.current.color.set(sample.top)
    }
  })

  return (
    <group>
      {clouds.map((i) => (
        <Cloud key={i} index={i} />
      ))}
      <mesh position={[0, 200, 0]} rotation={[Math.PI / 2, 0, 0]} frustumCulled={false}>
        <planeGeometry args={[400, 320]} />
        <meshBasicMaterial ref={matRef} color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

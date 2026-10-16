import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Group } from "three"

export interface PedestrianLook {
  shirt: string
  pants: string
  skin: string
  load: string | null
}

interface PedestrianProps extends PedestrianLook {
  phase: number
  speed?: number
}

const HAIR = "#1b1712"
const SHOE = "#2a2622"

export function Pedestrian({ shirt, pants, skin, load, phase, speed = 1 }: PedestrianProps) {
  const armL = useRef<Group>(null)
  const armR = useRef<Group>(null)
  const legL = useRef<Group>(null)
  const legR = useRef<Group>(null)
  const body = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime * 4.4 * speed + phase
    const swing = Math.sin(t)
    if (armL.current) armL.current.rotation.x = swing * 0.6
    if (armR.current) armR.current.rotation.x = -swing * 0.6
    if (legL.current) legL.current.rotation.x = -swing * 0.62
    if (legR.current) legR.current.rotation.x = swing * 0.62
    if (body.current) body.current.position.y = Math.abs(Math.cos(t)) * 0.045
  })

  return (
    <group ref={body}>
      <mesh position={[0, 1.06, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.48, 8, 16]} />
        <meshStandardMaterial color={shirt} roughness={0.82} />
      </mesh>

      <mesh position={[0, 1.56, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.23, 20, 20]} />
        <meshStandardMaterial color={skin} roughness={0.68} />
      </mesh>
      <mesh position={[0, 1.77, -0.01]}>
        <sphereGeometry args={[0.245, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>

      <group ref={armL} position={[0.3, 1.3, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.48, 6, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.82} />
        </mesh>
      </group>
      <group ref={armR} position={[-0.3, 1.3, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.48, 6, 10]} />
          <meshStandardMaterial color={shirt} roughness={0.82} />
        </mesh>
      </group>

      <group ref={legL} position={[0.12, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <capsuleGeometry args={[0.095, 0.5, 6, 10]} />
          <meshStandardMaterial color={pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.67, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.08, 0.1, 4, 8]} />
          <meshStandardMaterial color={SHOE} roughness={0.7} />
        </mesh>
      </group>
      <group ref={legR} position={[-0.12, 0.72, 0]}>
        <mesh position={[0, -0.36, 0]} castShadow>
          <capsuleGeometry args={[0.095, 0.5, 6, 10]} />
          <meshStandardMaterial color={pants} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.67, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.08, 0.1, 4, 8]} />
          <meshStandardMaterial color={SHOE} roughness={0.7} />
        </mesh>
      </group>

      {load ? (
        <mesh position={[0, 2.1, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.26, 0.42, 12]} />
          <meshStandardMaterial color={load} roughness={0.85} />
        </mesh>
      ) : null}
    </group>
  )
}

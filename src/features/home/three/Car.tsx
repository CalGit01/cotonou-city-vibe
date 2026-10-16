import { RoundedBox } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Group } from "three"

interface CarProps {
  color?: string
  speed?: number
}

function Wheel({ position }: { position: [number, number, number] }) {
  const spin = useRef<Group>(null)
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y -= delta * 14
  })
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <group ref={spin}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.34, 14]} />
          <meshStandardMaterial color="#1c2126" />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <boxGeometry args={[0.16, 0.36, 0.16]} />
          <meshStandardMaterial color="#c8ccd0" />
        </mesh>
      </group>
    </group>
  )
}

export function Car({ color = "#e8493a" }: CarProps) {
  return (
    <group>
      <RoundedBox
        args={[4.3, 0.86, 1.95]}
        radius={0.3}
        smoothness={4}
        position={[0, 0.72, 0]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </RoundedBox>
      <RoundedBox
        args={[2.3, 0.86, 1.78]}
        radius={0.28}
        smoothness={4}
        position={[-0.15, 1.5, 0]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.15} />
      </RoundedBox>
      <mesh position={[-0.15, 1.52, 0]}>
        <boxGeometry args={[2.36, 0.5, 1.84]} />
        <meshStandardMaterial
          color="#1b2a33"
          emissive="#2a4a5c"
          emissiveIntensity={0.35}
        />
      </mesh>

      <mesh position={[2.12, 0.74, 0.62]}>
        <boxGeometry args={[0.14, 0.28, 0.42]} />
        <meshStandardMaterial color="#fff6cf" emissive="#fff2b0" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[2.12, 0.74, -0.62]}>
        <boxGeometry args={[0.14, 0.28, 0.42]} />
        <meshStandardMaterial color="#fff6cf" emissive="#fff2b0" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-2.14, 0.78, 0.62]}>
        <boxGeometry args={[0.12, 0.26, 0.4]} />
        <meshStandardMaterial color="#ff5a45" emissive="#ff2d16" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-2.14, 0.78, -0.62]}>
        <boxGeometry args={[0.12, 0.26, 0.4]} />
        <meshStandardMaterial color="#ff5a45" emissive="#ff2d16" emissiveIntensity={0.8} />
      </mesh>

      <Wheel position={[1.35, 0.42, 0.95]} />
      <Wheel position={[1.35, 0.42, -0.95]} />
      <Wheel position={[-1.35, 0.42, 0.95]} />
      <Wheel position={[-1.35, 0.42, -0.95]} />
    </group>
  )
}

export function Bus({ color = "#f2c230" }: CarProps) {
  return (
    <group>
      <RoundedBox
        args={[6.2, 2.3, 2.35]}
        radius={0.32}
        smoothness={4}
        position={[0, 1.55, 0]}
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[6.24, 0.4, 2.39]} />
        <meshStandardMaterial color="#20242b" />
      </mesh>
      <mesh position={[-0.2, 2.05, 0]}>
        <boxGeometry args={[5.4, 0.85, 2.42]} />
        <meshStandardMaterial
          color="#20303a"
          emissive="#2a4a5c"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 2.78, 0]}>
        <boxGeometry args={[6.0, 0.22, 2.2]} />
        <meshStandardMaterial color="#c9a52a" />
      </mesh>

      <mesh position={[3.06, 0.95, 0.7]}>
        <boxGeometry args={[0.14, 0.34, 0.5]} />
        <meshStandardMaterial color="#fff6cf" emissive="#fff2b0" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[3.06, 0.95, -0.7]}>
        <boxGeometry args={[0.14, 0.34, 0.5]} />
        <meshStandardMaterial color="#fff6cf" emissive="#fff2b0" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-3.08, 0.95, 0.75]}>
        <boxGeometry args={[0.12, 0.3, 0.44]} />
        <meshStandardMaterial color="#ff5a45" emissive="#ff2d16" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-3.08, 0.95, -0.75]}>
        <boxGeometry args={[0.12, 0.3, 0.44]} />
        <meshStandardMaterial color="#ff5a45" emissive="#ff2d16" emissiveIntensity={0.8} />
      </mesh>

      <Wheel position={[2.1, 0.46, 1.15]} />
      <Wheel position={[2.1, 0.46, -1.15]} />
      <Wheel position={[-2.1, 0.46, 1.15]} />
      <Wheel position={[-2.1, 0.46, -1.15]} />
    </group>
  )
}

export function Moto({ color = "#f2c230" }: CarProps) {
  const wheels = useRef<Group[]>([])
  useFrame((_, delta) => {
    for (const wheel of wheels.current) {
      if (wheel) wheel.rotation.y -= delta * 18
    }
  })
  return (
    <group>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.9, 0.42, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.55, 1.05, 0]}>
        <boxGeometry args={[0.7, 0.55, 0.46]} />
        <meshStandardMaterial color="#2c3238" />
      </mesh>
      <mesh position={[0.95, 1.5, 0]}>
        <boxGeometry args={[0.16, 0.16, 1.0]} />
        <meshStandardMaterial color="#2c3238" />
      </mesh>
      <mesh position={[-0.35, 1.35, 0]}>
        <boxGeometry args={[0.42, 0.7, 0.44]} />
        <meshStandardMaterial color="#3d7dc4" />
      </mesh>
      <mesh position={[-0.35, 1.85, 0]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color="#3a2a22" />
      </mesh>
      <mesh position={[-0.35, 1.9, 0]}>
        <sphereGeometry args={[0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e8b02a" />
      </mesh>
      <mesh position={[2.05, 0.75, 0]}>
        <boxGeometry args={[0.12, 0.24, 0.36]} />
        <meshStandardMaterial color="#fff6cf" emissive="#fff2b0" emissiveIntensity={0.9} />
      </mesh>

      <group position={[0.75, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <group ref={(node) => { if (node) wheels.current[0] = node }}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.2, 12]} />
            <meshStandardMaterial color="#1c2126" />
          </mesh>
        </group>
      </group>
      <group position={[-0.75, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <group ref={(node) => { if (node) wheels.current[1] = node }}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.2, 12]} />
            <meshStandardMaterial color="#1c2126" />
          </mesh>
        </group>
      </group>
    </group>
  )
}

import { useMemo } from "react"
import { ExtrudeGeometry, Shape } from "three"
import { LANDMARKS, type LandmarkDef } from "../data/markers"
import { facadeTexture } from "./facade"
import { signTexture } from "./sign"

function Civic({ x, z, accent = "#3d7dc4", title = "Bâtiment" }: { x: number; z: number; accent?: string; title?: string }) {
  const map = useMemo(() => {
    const tex = facadeTexture().clone()
    tex.needsUpdate = true
    tex.repeat.set(3, 2)
    return tex
  }, [])

  const sign = useMemo(() => signTexture(title, accent), [title, accent])

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 7, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 14, 12]} />
        <meshStandardMaterial map={map} color="#e6eaee" roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0, 14.2, 0]} castShadow>
        <boxGeometry args={[14.6, 0.4, 12.6]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 8.5, 6.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 3]} />
        <meshStandardMaterial map={sign} />
      </mesh>
    </group>
  )
}

function Airport({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[72, 0.14, 11]} />
        <meshStandardMaterial color="#4a5560" />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-30 + i * 8.5, 0.16, 0]}>
          <boxGeometry args={[3.4, 0.06, 0.5]} />
          <meshStandardMaterial color="#f0f0e8" />
        </mesh>
      ))}

      <mesh position={[40, 2.6, 20]}>
        <boxGeometry args={[18, 5.2, 13]} />
        <meshStandardMaterial color="#dfe2e0" />
      </mesh>
      <mesh position={[40, 5.5, 20]}>
        <boxGeometry args={[18.6, 0.6, 13.6]} />
        <meshStandardMaterial color="#c2c8cc" />
      </mesh>

      <mesh position={[34, 8, 22]}>
        <cylinderGeometry args={[1.4, 1.4, 16, 12]} />
        <meshStandardMaterial color="#c9ced1" />
      </mesh>
      <mesh position={[34, 16.6, 22]}>
        <boxGeometry args={[6, 2.4, 6]} />
        <meshStandardMaterial color="#8fb8cc" emissive="#ffd98a" emissiveIntensity={0.4} />
      </mesh>

      <group position={[2, 7, 2]} rotation={[0, 0.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.1, 1.1, 11, 12]} />
          <meshStandardMaterial color="#f2f2ee" />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[3, 0.3, 15]} />
          <meshStandardMaterial color="#e6e6e0" />
        </mesh>
        <mesh position={[-5, 0.9, 0]}>
          <boxGeometry args={[2.4, 0.3, 5]} />
          <meshStandardMaterial color="#e6e6e0" />
        </mesh>
        <mesh position={[5.2, 0, 0]}>
          <sphereGeometry args={[0.9, 12, 12]} />
          <meshStandardMaterial color="#dcdcd4" />
        </mesh>
      </group>
    </group>
  )
}

function Stadium({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[8.5, 8.5, 6, 32]} />
        <meshStandardMaterial color="#dcdcd4" />
      </mesh>
      <mesh position={[0, 6.15, 0]}>
        <cylinderGeometry args={[6.4, 6.4, 0.4, 32]} />
        <meshStandardMaterial color="#3f9e5e" />
      </mesh>
      <mesh position={[0, 6.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6.3, 0.2, 8, 32]} />
        <meshStandardMaterial color="#f5f5f0" />
      </mesh>
      <mesh position={[0, 6.42, 0]}>
        <boxGeometry args={[0.3, 0.1, 7.5]} />
        <meshStandardMaterial color="#f5f5f0" />
      </mesh>
    </group>
  )
}

function Market({ x, z }: { x: number; z: number }) {
  const stalls = useMemo(() => {
    const out: { x: number; z: number; wall: string; awn: string; rot: number }[] = []
    const walls = ["#e8894a", "#efc94c", "#5fbfa0", "#e2653b", "#f2a1a1", "#f5f0e6"]
    const awns = ["#c2451e", "#2f9e6b", "#3d7dc4", "#e84393", "#ef8b2c"]
    let i = 0
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        out.push({
          x: -6 + c * 6 + (r % 2) * 0.8,
          z: -6 + r * 6,
          wall: walls[i % walls.length],
          awn: awns[i % awns.length],
          rot: (i % 5) * 0.05 - 0.1,
        })
        i += 1
      }
    }
    return out
  }, [])

  return (
    <group position={[x, 0, z]}>
      {stalls.map((stall, index) => (
        <group key={index} position={[stall.x, 0, stall.z]} rotation={[0, stall.rot, 0]}>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[3.2, 2.2, 3.2]} />
            <meshStandardMaterial color={stall.wall} />
          </mesh>
          <mesh position={[0, 2.35, 0]}>
            <boxGeometry args={[4, 0.28, 4]} />
            <meshStandardMaterial color={stall.awn} />
          </mesh>
          <mesh position={[0, 0.55, 1.75]}>
            <boxGeometry args={[3, 0.5, 1]} />
            <meshStandardMaterial color="#8a6b45" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Port({ x, z }: { x: number; z: number }) {
  const containers = useMemo(() => {
    const colors = ["#c2451e", "#2f9e6b", "#3d7dc4", "#ef8b2c", "#8e44ad"]
    const out: { x: number; z: number; y: number; color: string }[] = []
    for (let i = 0; i < 12; i += 1) {
      const col = i % 4
      const row = Math.floor(i / 4)
      out.push({ x: -6 + col * 5, z: -6 + row * 5, y: 0.9 + (i % 2) * 1.6, color: colors[i % colors.length] })
    }
    return out
  }, [])

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[24, 1.2, 22]} />
        <meshStandardMaterial color="#b0aaa1" />
      </mesh>
      {containers.map((box, index) => (
        <mesh key={index} position={[box.x, box.y, box.z]}>
          <boxGeometry args={[4.6, 1.5, 2.4]} />
          <meshStandardMaterial color={box.color} />
        </mesh>
      ))}

      {[0, 1].map((i) => (
        <group key={i} position={[-8 + i * 15, 0, -6]}>
          <mesh position={[0, 9, 0]}>
            <boxGeometry args={[1.4, 18, 1.4]} />
            <meshStandardMaterial color="#e0a52a" />
          </mesh>
          <mesh position={[5, 17.5, 0]}>
            <boxGeometry args={[12, 1, 1.2]} />
            <meshStandardMaterial color="#e0a52a" />
          </mesh>
          <mesh position={[10.5, 15, 0]}>
            <boxGeometry args={[1, 5, 1]} />
            <meshStandardMaterial color="#c2451e" />
          </mesh>
        </group>
      ))}

      <group position={[-19, 0, -2]}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[8, 2.8, 24]} />
          <meshStandardMaterial color="#7a3b2e" />
        </mesh>
        <mesh position={[-2, 3.6, -8]}>
          <boxGeometry args={[2.6, 3, 5]} />
          <meshStandardMaterial color="#e6e6e0" />
        </mesh>
        <mesh position={[0, 3, 6]}>
          <boxGeometry args={[5, 1.6, 6]} />
          <meshStandardMaterial color="#c2451e" />
        </mesh>
      </group>
    </group>
  )
}

function Cathedral({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[14, 9, 12]} />
        <meshStandardMaterial color="#f0ebe1" />
      </mesh>
      <mesh position={[0, 11, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[9.6, 5, 4]} />
        <meshStandardMaterial color="#c2451e" />
      </mesh>
      <mesh position={[0, 12, 6]}>
        <boxGeometry args={[5.5, 24, 5.5]} />
        <meshStandardMaterial color="#eae3d6" />
      </mesh>
      <mesh position={[0, 25.5, 6]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#c2451e" />
      </mesh>
      <mesh position={[0, 28.5, 6]}>
        <boxGeometry args={[0.4, 3, 0.4]} />
        <meshStandardMaterial color="#e8c65a" />
      </mesh>
      <mesh position={[0, 29, 6]}>
        <boxGeometry args={[1.8, 0.4, 0.4]} />
        <meshStandardMaterial color="#e8c65a" />
      </mesh>
    </group>
  )
}

function Clinic({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[18, 7, 12]} />
        <meshStandardMaterial color="#f4f6f5" />
      </mesh>
      <mesh position={[0, 7.4, 0]}>
        <boxGeometry args={[18.6, 0.6, 12.6]} />
        <meshStandardMaterial color="#d5dad8" />
      </mesh>
      <mesh position={[0, 4, 6.1]}>
        <boxGeometry args={[6, 1.4, 0.3]} />
        <meshStandardMaterial color="#d1392b" />
      </mesh>
      <mesh position={[0, 4, 6.1]}>
        <boxGeometry args={[1.6, 5, 0.3]} />
        <meshStandardMaterial color="#d1392b" />
      </mesh>
    </group>
  )
}

function Monument({ x, z }: { x: number; z: number }) {
  const star = useMemo(() => {
    const shape = new Shape()
    const spikes = 5
    const outer = 2.4
    const inner = 1.05
    for (let i = 0; i < spikes * 2; i += 1) {
      const radius = i % 2 === 0 ? outer : inner
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
      const px = Math.cos(angle) * radius
      const py = Math.sin(angle) * radius
      if (i === 0) shape.moveTo(px, py)
      else shape.lineTo(px, py)
    }
    shape.closePath()
    return new ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false })
  }, [])

  return (
    <group position={[x, 0.6, z]}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 3.2, 16]} />
        <meshStandardMaterial color="#cfd3d6" />
      </mesh>
      <mesh position={[0, 4, 0]} geometry={star} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#d1392b" />
      </mesh>
    </group>
  )
}

function Beach({ x, z }: { x: number; z: number }) {
  const props = useMemo(
    () => [
      { x: -10, z: 0 },
      { x: -2, z: 4 },
      { x: 8, z: 1 },
      { x: 16, z: 5 },
    ],
    [],
  )
  const colors = ["#e8483a", "#f2c230", "#2f9e6b", "#3d7dc4"]

  return (
    <group position={[x, -0.14, z]}>
      {props.map((p, index) => (
        <group key={index} position={[p.x, 0, p.z]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 2.6, 8]} />
            <meshStandardMaterial color="#8a6b45" />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <coneGeometry args={[1.9, 0.9, 10]} />
            <meshStandardMaterial color={colors[index % colors.length]} />
          </mesh>
        </group>
      ))}
      <mesh position={[-4, 0.9, 6]}>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#e8d5a6" />
      </mesh>
      <mesh position={[-4, 3.2, 6]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4.2, 2.2, 4]} />
        <meshStandardMaterial color="#b5642a" />
      </mesh>
      <mesh position={[10, 1.55, 6]}>
        <boxGeometry args={[1.6, 0.3, 1.6]} />
        <meshStandardMaterial color="#3d7dc4" />
      </mesh>
    </group>
  )
}

function Gateway() {
  return (
    <group position={[126, 0, 40]} rotation={[0, -0.5, 0]}>
      <mesh position={[-5, 7, 0]}>
        <boxGeometry args={[2.4, 14, 2.4]} />
        <meshStandardMaterial color="#2f2620" />
      </mesh>
      <mesh position={[5, 7, 0]}>
        <boxGeometry args={[2.4, 14, 2.4]} />
        <meshStandardMaterial color="#2f2620" />
      </mesh>
      <mesh position={[0, 15.5, 0]}>
        <boxGeometry args={[13, 3, 2.8]} />
        <meshStandardMaterial color="#3a2f26" />
      </mesh>
      <mesh position={[0, 18.4, 0]}>
        <boxGeometry args={[14, 1.2, 3.2]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <mesh position={[0, 6, 0]}>
        <torusGeometry args={[5, 0.7, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#2f2620" />
      </mesh>
      <mesh position={[0, 0.2, 2]}>
        <boxGeometry args={[16, 0.4, 10]} />
        <meshStandardMaterial color="#c9b48d" />
      </mesh>
    </group>
  )
}

function Industry() {
  const warehouses = [
    { x: -118, z: 24 },
    { x: -96, z: 24 },
    { x: -118, z: 42 },
    { x: -96, z: 42 },
  ]
  const containers = useMemo(() => {
    const colors = ["#c2451e", "#2f9e6b", "#3d7dc4", "#ef8b2c", "#8e44ad"]
    const out: { x: number; z: number; y: number; color: string }[] = []
    for (let i = 0; i < 12; i += 1) {
      out.push({ x: -78 + (i % 2) * 5.4, z: 22 + Math.floor(i / 2) * 3.4, y: 0.9 + (i % 3 === 0 ? 1.6 : 0), color: colors[i % colors.length] })
    }
    return out
  }, [])

  return (
    <group>
      {warehouses.map((w, index) => (
        <group key={index} position={[w.x, 0, w.z]}>
          <mesh position={[0, 3.5, 0]}>
            <boxGeometry args={[16, 7, 12]} />
            <meshStandardMaterial color="#c9ccce" />
          </mesh>
          <mesh position={[0, 7.2, 0]}>
            <boxGeometry args={[16.6, 0.5, 12.6]} />
            <meshStandardMaterial color="#9aa0a4" />
          </mesh>
        </group>
      ))}
      {containers.map((box, index) => (
        <mesh key={index} position={[box.x, box.y + 0.9, box.z]}>
          <boxGeometry args={[5, 1.5, 2.6]} />
          <meshStandardMaterial color={box.color} />
        </mesh>
      ))}
      <group position={[-70, 0, 46]}>
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[1.3, 16, 1.3]} />
          <meshStandardMaterial color="#e0a52a" />
        </mesh>
        <mesh position={[4.5, 15.5, 0]}>
          <boxGeometry args={[11, 1, 1.1]} />
          <meshStandardMaterial color="#e0a52a" />
        </mesh>
      </group>
    </group>
  )
}

function render(landmark: LandmarkDef) {
  const { x, z } = landmark
  switch (landmark.kind) {
    case "airport":
      return <Airport x={x} z={z} />
    case "stadium":
      return <Stadium x={x} z={z} />
    case "market":
      return <Market x={x} z={z} />
    case "port":
      return <Port x={x} z={z} />
    case "cathedral":
      return <Cathedral x={x} z={z} />
    case "clinic":
      return <Clinic x={x} z={z} />
    case "monument":
      return <Monument x={x} z={z} />
    case "beach":
      return <Beach x={x} z={z} />
    case "civic":
      return <Civic x={x} z={z} accent={landmark.accent} title={landmark.title} />
    default:
      return null
  }
}

export function Landmarks() {
  return (
    <group>
      <Gateway />
      <Industry />
      {LANDMARKS.map((landmark) => (
        <group key={landmark.id}>{render(landmark)}</group>
      ))}
    </group>
  )
}

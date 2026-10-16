import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import { DoubleSide, type Group } from "three"
import { BUILDINGS, KEEP_OUT, LAND, TREES } from "./city"
import { PersonModel } from "./PersonModel"
import { PEOPLE } from "./people"
import { hitsVehicle } from "./trafficState"

const RADIUS = 0.9
const TREE_R = 0.85
const WALK_SPEED = 9
const RUN_SPEED = 17
const TURN_RATE = 11
const CAM_Y = 12
const CAM_Z = 20
const CAM_LOOK_Y = 2.3
const CAM_POS_K = 6
const CAM_LOOK_K = 9

const FORWARD = new Set(["KeyW", "KeyZ", "ArrowUp"])
const BACK = new Set(["KeyS", "ArrowDown"])
const LEFT = new Set(["KeyA", "KeyQ", "ArrowLeft"])
const RIGHT = new Set(["KeyD", "ArrowRight"])

function inKeepOut(x: number, z: number) {
  return KEEP_OUT.some(
    (zone) =>
      x > zone.x0 - RADIUS &&
      x < zone.x1 + RADIUS &&
      z > zone.z0 - RADIUS &&
      z < zone.z1 + RADIUS,
  )
}

function inBuilding(x: number, z: number) {
  for (const b of BUILDINGS) {
    const dx = x - b.x
    const dz = z - b.z
    const cos = Math.cos(b.rot)
    const sin = Math.sin(b.rot)
    const lx = cos * dx - sin * dz
    const lz = sin * dx + cos * dz
    if (Math.abs(lx) < b.w / 2 + RADIUS + 0.02 && Math.abs(lz) < b.d / 2 + RADIUS + 0.02) {
      return true
    }
  }
  return false
}

function inTree(x: number, z: number) {
  for (const t of TREES) {
    const dx = x - t.x
    const dz = z - t.z
    if (dx * dx + dz * dz < TREE_R * TREE_R * t.s * t.s) {
      return true
    }
  }
  return false
}

function blocked(x: number, z: number) {
  if (
    x < LAND.x0 + RADIUS ||
    x > LAND.x1 - RADIUS ||
    z < LAND.z0 + RADIUS ||
    z > LAND.z1 - RADIUS
  ) {
    return true
  }
  return inKeepOut(x, z) || inBuilding(x, z) || inTree(x, z) || hitsVehicle(x, z, RADIUS)
}

function angleLerp(from: number, to: number, t: number) {
  let diff = (to - from) % (Math.PI * 2)
  if (diff > Math.PI) diff -= Math.PI * 2
  if (diff < -Math.PI) diff += Math.PI * 2
  return from + diff * t
}

export function Hero({ onExit }: { onExit?: () => void }) {
  const hero = useRef<Group>(null)
  const keys = useRef<Record<string, boolean>>({})
  const pos = useRef({ x: 0, z: 32 })
  const yaw = useRef(Math.PI / 2)
  const look = useMemo(() => ({ x: 0, y: CAM_LOOK_Y, z: 32 }), [])
  const [clip, setClip] = useState("Idle")

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        FORWARD.has(event.code) ||
        BACK.has(event.code) ||
        LEFT.has(event.code) ||
        RIGHT.has(event.code) ||
        event.code === "Space"
      ) {
        event.preventDefault()
      }
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        keys.current.Shift = true
        return
      }
      if (event.code === "Escape") {
        onExit?.()
        return
      }
      keys.current[event.code] = true
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        keys.current.Shift = false
        return
      }
      keys.current[event.code] = false
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [onExit])

  const camera = useThree((state) => state.camera)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const held = keys.current
    let dx = 0
    let dz = 0
    for (const code in held) {
      if (!held[code]) continue
      if (FORWARD.has(code)) dz -= 1
      else if (BACK.has(code)) dz += 1
      else if (LEFT.has(code)) dx -= 1
      else if (RIGHT.has(code)) dx += 1
    }

    const moving = dx !== 0 || dz !== 0
    const running = moving && Boolean(held.Shift)
    const speed = running ? RUN_SPEED : WALK_SPEED

    if (moving) {
      const len = Math.hypot(dx, dz)
      const ux = dx / len
      const uz = dz / len
      const nx = pos.current.x + ux * speed * dt
      const nz = pos.current.z + uz * speed * dt
      if (!blocked(nx, pos.current.z)) pos.current.x = nx
      if (!blocked(pos.current.x, nz)) pos.current.z = nz
      yaw.current = angleLerp(yaw.current, Math.atan2(-uz, ux), 1 - Math.exp(-TURN_RATE * dt))
    }

    const nextClip = moving ? (running ? "Run" : "Walk") : "Idle"
    setClip((prev) => (prev === nextClip ? prev : nextClip))

    const node = hero.current
    if (node) {
      node.position.set(pos.current.x, 0, pos.current.z)
      node.rotation.y = yaw.current
    }

    const posK = 1 - Math.exp(-CAM_POS_K * dt)
    camera.position.x += (pos.current.x - camera.position.x) * posK
    camera.position.y += (CAM_Y - camera.position.y) * posK
    camera.position.z += (pos.current.z + CAM_Z - camera.position.z) * posK
    const lookK = 1 - Math.exp(-CAM_LOOK_K * dt)
    look.x += (pos.current.x - look.x) * lookK
    look.y += (CAM_LOOK_Y - look.y) * lookK
    look.z += (pos.current.z - look.z) * lookK
    camera.lookAt(look.x, look.y, look.z)
  })

  const ring = useMemo(
    () => (
      <group position={[0, 0.05, 0]}>
        <mesh rotation-x={-Math.PI / 2} renderOrder={2}>
          <ringGeometry args={[0.95, 1.28, 48]} />
          <meshBasicMaterial color="#12303f" transparent opacity={0.32} depthWrite={false} side={DoubleSide} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} renderOrder={2}>
          <ringGeometry args={[1.28, 1.5, 48]} />
          <meshBasicMaterial color="#1fa268" transparent opacity={0.5} depthWrite={false} side={DoubleSide} />
        </mesh>
      </group>
    ),
    [],
  )

  return (
    <group ref={hero} position={[0, 0, 32]}>
      {ring}
      <PersonModel
        url={PEOPLE.businessMaleA}
        clip={clip}
        speed={clip === "Run" ? 1.5 : 1}
        height={1.8}
      />
    </group>
  )
}

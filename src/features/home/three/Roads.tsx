import { Plane } from "@react-three/drei"
import { useMemo } from "react"
import { CANAL, ROAD_X, ROAD_Z, ROAD_W, ROADS, SIDEWALK } from "./city"
import { crosswalkTexture, roadTexture } from "./markings"

export function Roads() {
  const texX = useMemo(() => roadTexture("x"), [])
  const texZ = useMemo(() => roadTexture("z"), [])
  const cwx = useMemo(() => crosswalkTexture("x"), [])
  const cwz = useMemo(() => crosswalkTexture("z"), [])

  const cwX: [number, number][] = useMemo(() => {
    const out: [number, number][] = []
    const zw = ROAD_W - 1
    const offset = zw / 2 + 1.4
    for (const zr of ROAD_Z) {
      for (const xr of ROAD_X) {
        const bx = xr > CANAL.x1 || xr < CANAL.x0
        if (Math.abs(zr) > 160) continue
        if (!bx) continue
        out.push([xr - offset, zr])
        out.push([xr + offset, zr])
      }
    }
    return out
  }, [])

  const cwZ: [number, number][] = useMemo(() => {
    const out: [number, number][] = []
    const zxw = ROAD_W / 2 + 1.4
    for (const zr of ROAD_Z) {
      for (const xr of ROAD_X) {
        if (xr > CANAL.x0 - 4 && xr < CANAL.x1 + 4) continue
        if (Math.abs(zr) > 160) continue
        out.push([xr, zr - zxw])
        out.push([xr, zr + zxw])
      }
    }
    return out
  }, [])

  return (
    <group>
      {ROADS.map((road, index) => {
        const length = road.to - road.from
        const center = (road.from + road.to) / 2
        const across = road.width + SIDEWALK * 2
        const isX = road.axis === "x"
        const t = isX ? texX.clone() : texZ.clone()
        t.repeat.set(isX ? length / 12 : 1, isX ? 1 : length / 12)

        return (
          <group key={index}>
            {isX ? (
              <>
            <mesh position={[center, 0.07, road.pos - (road.width / 2 + SIDEWALK / 2)]}>
              <boxGeometry args={[length, 0.15, SIDEWALK]} />
              <meshStandardMaterial color="#d7dadc" />
            </mesh>
            <mesh position={[center, 0.07, road.pos + (road.width / 2 + SIDEWALK / 2)]}>
              <boxGeometry args={[length, 0.15, SIDEWALK]} />
              <meshStandardMaterial color="#d7dadc" />
            </mesh>
              </>
            ) : (
              <>
            <mesh position={[road.pos - (road.width / 2 + SIDEWALK / 2), 0.07, center]}>
              <boxGeometry args={[SIDEWALK, 0.15, length]} />
              <meshStandardMaterial color="#d7dadc" />
            </mesh>
            <mesh position={[road.pos + (road.width / 2 + SIDEWALK / 2), 0.07, center]}>
              <boxGeometry args={[SIDEWALK, 0.15, length]} />
              <meshStandardMaterial color="#d7dadc" />
            </mesh>
              </>
            )}

            <mesh position={isX ? [center, 0.02, road.pos] : [road.pos, 0.02, center]}>
              <boxGeometry args={isX ? [length, 0.1, road.width] : [road.width, 0.1, length]} />
              <meshStandardMaterial color="#6f7d86" map={t} roughness={0.9} />
            </mesh>

            {isX ? (
              <mesh position={[(CANAL.x0 + CANAL.x1) / 2, -0.25, road.pos]}>
                <boxGeometry args={[CANAL.x1 - CANAL.x0 + 2, 0.5, across]} />
                <meshStandardMaterial color="#a8a094" />
              </mesh>
            ) : null}
          </group>
        )
      })}

      {cwX.map(([x, z], idx) => (
        <Plane
          key={`cwz-${idx}`}
          position={[x, 0.08, z]}
          args={[2.4, 7]}
          rotation={[-Math.PI / 2, 0, 0]}
          material-color="#b3b8bc"
          material-map={cwz}
          material-opacity={1}
          material-transparent
          material-repeat={[2.4 / 0.9, 7 / 0.9]}
        />
      ))}

      {cwZ.map(([x, z], idx) => (
        <Plane
          key={`cwx-${idx}`}
          position={[x, 0.08, z]}
          args={[7, 2.4]}
          rotation={[-Math.PI / 2, 0, 0]}
          material-color="#b3b8bc"
          material-map={cwx}
          material-opacity={1}
          material-transparent
          material-repeat={[7 / 0.9, 2.4 / 0.9]}
        />
      ))}

      <mesh position={[-8, 0.05, -12]}>
        <cylinderGeometry args={[11, 11, 0.22, 28]} />
        <meshStandardMaterial color="#6f7d86" />
      </mesh>
      <mesh position={[-8, 0.3, -12]}>
        <cylinderGeometry args={[5, 5, 0.65, 24]} />
        <meshStandardMaterial color="#9dc08b" />
      </mesh>
    </group>
  )
}

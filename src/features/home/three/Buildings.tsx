import { useMemo } from "react"
import { BUILDINGS, type BuildingDef } from "./city"
import { facadeTexture } from "./facade"

function Building({ x, z, w, d, h, color, roof, rot }: BuildingDef) {
  const pitched = h < 9
  const map = useMemo(() => {
    const tex = facadeTexture().clone()
    tex.needsUpdate = true
    tex.repeat.set(
      Math.max(1, Math.round(w / 2.4)),
      Math.max(1, Math.round(h / 2.6)),
    )
    return tex
  }, [w, h])

  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          map={map}
          color={color}
          roughness={0.78}
          metalness={0.06}
        />
      </mesh>
      {pitched ? (
        <mesh
          position={[0, h + Math.max(w, d) * 0.22, 0]}
          rotation={[0, Math.PI / 4, 0]}
          castShadow
        >
          <coneGeometry args={[Math.max(w, d) * 0.72, Math.max(w, d) * 0.44, 4]} />
          <meshStandardMaterial color={roof} roughness={0.85} />
        </mesh>
      ) : (
        <mesh position={[0, h + 0.3, 0]} castShadow>
          <boxGeometry args={[w + 0.7, 0.6, d + 0.7]} />
          <meshStandardMaterial color={roof} roughness={0.9} />
        </mesh>
      )}
    </group>
  )
}

export function Buildings() {
  return (
    <group>
      {BUILDINGS.map((building, index) => (
        <Building key={index} {...building} />
      ))}
    </group>
  )
}

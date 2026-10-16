import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import { MeshStandardMaterial, type CanvasTexture } from "three"
import { BEACH, CANAL, LAND } from "./city"
import { grassTexture, pavementTexture, sandTexture } from "./terrain"

function WaterSurface() {
  const uniforms = useRef({ uTime: { value: 0 } })

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color: "#4f9fd4",
      roughness: 0.22,
      metalness: 0.35,
    })
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.current.uTime
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;
          float waveH(vec2 p, float t){
            return sin(p.x * 0.055 + t * 1.05) * 0.16
                 + sin(p.y * 0.085 - t * 0.85) * 0.13
                 + sin((p.x + p.y) * 0.045 + t * 1.6) * 0.10;
          }
          float waveDx(vec2 p, float t){
            return cos(p.x * 0.055 + t * 1.05) * 0.16 * 0.055
                 + cos((p.x + p.y) * 0.045 + t * 1.6) * 0.10 * 0.045;
          }
          float waveDy(vec2 p, float t){
            return cos(p.y * 0.085 - t * 0.85) * 0.13 * 0.085
                 + cos((p.x + p.y) * 0.045 + t * 1.6) * 0.10 * 0.045;
          }`,
        )
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>
          {
            float dx = waveDx(position.xy, uTime);
            float dy = waveDy(position.xy, uTime);
            objectNormal = normalize(vec3(-dx, -dy, 1.0));
          }`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          transformed.z += waveH(position.xy, uTime);`,
        )
    }
    return mat
  }, [])

  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]} material={material} receiveShadow>
      <planeGeometry args={[1900, 1300, 100, 70]} />
    </mesh>
  )
}

function LandBlock({
  x0,
  x1,
  z0,
  z1,
  top,
  color,
  texture,
  tile = 22,
}: {
  x0: number
  x1: number
  z0: number
  z1: number
  top: number
  color: string
  texture?: CanvasTexture
  tile?: number
}) {
  const w = x1 - x0
  const d = z1 - z0
  const height = top + 0.6

  const map = useMemo(() => {
    if (!texture) return null
    const tex = texture.clone()
    tex.repeat.set(Math.max(1, w / tile), Math.max(1, d / tile))
    return tex
  }, [texture, w, d, tile])

  return (
    <mesh position={[(x0 + x1) / 2, top - height / 2, (z0 + z1) / 2]} receiveShadow>
      <boxGeometry args={[w, height, d]} />
      <meshStandardMaterial color={color} map={map ?? undefined} roughness={0.95} />
    </mesh>
  )
}

export function Ground() {
  return (
    <group>
      <WaterSurface />

      <LandBlock
        x0={LAND.x0}
        x1={CANAL.x0}
        z0={LAND.z0}
        z1={LAND.z1}
        top={0}
        color="#9ec38c"
        texture={grassTexture()}
      />
      <LandBlock
        x0={CANAL.x1}
        x1={LAND.x1}
        z0={LAND.z0}
        z1={LAND.z1}
        top={0}
        color="#9ec38c"
        texture={grassTexture()}
      />

      <LandBlock
        x0={LAND.x0}
        x1={LAND.x1}
        z0={BEACH.z0}
        z1={BEACH.z1}
        top={-0.14}
        color="#e8d5a6"
        texture={sandTexture()}
        tile={16}
      />

      <LandBlock
        x0={-130}
        x1={-58}
        z0={18}
        z1={50}
        top={0.03}
        color="#b9bec2"
        texture={pavementTexture()}
        tile={8}
      />
      <LandBlock
        x0={-120}
        x1={-40}
        z0={-50}
        z1={-26}
        top={0.03}
        color="#bcc2c6"
        texture={pavementTexture()}
        tile={8}
      />

      <LandBlock x0={-36} x1={-8} z0={-12} z1={10} top={0.02} color="#8ab87a" texture={grassTexture()} />
      <LandBlock x0={72} x1={100} z0={10} z1={32} top={0.02} color="#8ab87a" texture={grassTexture()} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.05, 34]}>
        <planeGeometry args={[46, 22]} />
        <meshStandardMaterial color="#c9b99a" />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[100, 0.05, 50]}>
        <planeGeometry args={[48, 28]} />
        <meshStandardMaterial color="#e8d5a6" />
      </mesh>
    </group>
  )
}

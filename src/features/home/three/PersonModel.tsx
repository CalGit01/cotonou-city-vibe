import { useAnimations, useGLTF } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import type { Group, Mesh, MeshStandardMaterial } from "three"
import { SkeletonUtils } from "three-stdlib"
import { PEOPLE } from "./people"

const SPAN = 3.765

interface PersonProps {
  url: string
  phase?: number
  speed?: number
  height?: number
  clip?: string
  tint?: string
}

export function PersonModel({
  url,
  phase = 0,
  speed = 1,
  height = 1.78,
  clip = "Walk",
  tint,
}: PersonProps) {
  const { scene, animations } = useGLTF(url)
  const root = useRef<Group>(null)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, root)

  useEffect(() => {
    clone.traverse((object) => {
      const mesh = object as Mesh
      if ((mesh as Mesh).isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        const material = mesh.material as MeshStandardMaterial | undefined
        if (material) {
          if ("envMapIntensity" in material) material.envMapIntensity = 0.8
          if (tint) {
            material.color.set(tint)
            material.roughness = Math.max(0.2, material.roughness - 0.1)
          }
        }
      }
    })
  }, [clone, tint])

  useEffect(() => {
    const action = actions[clip] ?? actions["Walk"] ?? Object.values(actions)[0]
    if (!action) return
    action.reset()
    action.timeScale = speed
    action.time = phase
    action.play()
    return () => {
      action.stop()
    }
  }, [actions, clip, phase, speed])

  return (
    <group ref={root} scale={height / SPAN}>
      <group rotation={[0, Math.PI / 2, 0]}>
        <primitive object={clone} />
      </group>
    </group>
  )
}

for (const url of Object.values(PEOPLE)) useGLTF.preload(url)

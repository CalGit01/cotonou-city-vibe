import { OrbitControls } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Bloom,
  BrightnessContrast,
  EffectComposer,
  HueSaturation,
  SMAA,
  SSAO,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing"
import { ToneMappingMode } from "postprocessing"
import { Suspense, useEffect, useRef, useState } from "react"
import { CanvasTexture, NoToneMapping, SRGBColorSpace, type PerspectiveCamera } from "three"
import { Billboards3D } from "./Billboards3D"
import { Buildings } from "./Buildings"
import { Clouds } from "./Clouds"
import { Crowd } from "./Crowd"
import { Ground } from "./Ground"
import { Hero } from "./Hero"
import { Landmarks } from "./Landmarks"
import { MapLabels } from "./MapLabels"
import { MarkerPins } from "./MarkerPins"
import { Roads } from "./Roads"
import { StreetProps } from "./StreetProps"
import { Traffic } from "./Traffic"
import { Trees } from "./Trees"
import { Water } from "./Water"
import { DN, sampleDay, syncToClock } from "./daynight"

function SkyBackground() {
  const [tex] = useState(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 4
    canvas.height = 512
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  })

  useEffect(() => {
    return () => {
      tex.dispose()
    }
  }, [tex])

  useFrame(() => {
    const canvas = tex.image as HTMLCanvasElement
    const ctx = canvas.getContext("2d")!
    const sample = sampleDay(DN.t)
    const grad = ctx.createLinearGradient(0, 0, 0, 512)
    const r = sample.topRgb
    const hr = sample.horizonRgb
    grad.addColorStop(0, `rgb(${r[0]},${r[1]},${r[2]})`)
    grad.addColorStop(0.42, `rgb(${Math.round((r[0]*2+hr[0])/3)},${Math.round((r[1]*2+hr[1])/3)},${Math.round((r[2]*2+hr[2])/3)})`)
    grad.addColorStop(0.72, `rgb(${Math.round((r[0]+2*hr[0])/3)},${Math.round((r[1]+2*hr[1])/3)},${Math.round((r[2]+2*hr[2])/3)})`)
    grad.addColorStop(1, `rgb(${hr[0]},${hr[1]},${hr[2]})`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 4, 512)
    tex.needsUpdate = true
  })

  return <primitive object={tex} attach="background" />
}

function DayNightLights() {
  const sunRef = useRef<any>(null)
  const hemiRef = useRef<any>(null)
  const ambRef = useRef<any>(null)
  const fillRef = useRef<any>(null)

  useEffect(() => {
    syncToClock()
  }, [])
  useFrame((state) => {
    const sample = sampleDay(DN.t)
    const altitude = sample.altitude
    const sunY = 20 + 96 * Math.max(altitude, 0.05)
    if (sunRef.current) {
      sunRef.current.position.set(165, sunY, 92)
      sunRef.current.color.set(sample.sun)
      sunRef.current.intensity = sample.sunI
    }
    if (fillRef.current) {
      fillRef.current.intensity = 0.32 * Math.max(0.2, altitude + 0.5)
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = sample.hemiI
    }
    if (ambRef.current) {
      ambRef.current.intensity = sample.ambI
    }
    const fogObj = state.scene.fog as any
    if (fogObj) {
      fogObj.color.set(sample.fog)
      fogObj.near = sample.fogNear
      fogObj.far = sample.fogFar
    }
  })

  return (
    <>
      <directionalLight ref={sunRef} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-290} shadow-camera-right={290} shadow-camera-top={290} shadow-camera-bottom={-290} shadow-camera-near={1} shadow-camera-far={760} shadow-bias={-0.0004} />
      <directionalLight ref={fillRef} position={[-110, 78, -95]} intensity={0.32} color="#8fb4e6" />
      <hemisphereLight ref={hemiRef} args={["#9dc0e6", "#5f6b48", 0.28]} />
      <ambientLight ref={ambRef} intensity={0.08} />
    </>
  )
}

function CameraRig() {
  const camera = useThree((state) => state.camera)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const placed = useRef(false)

  useEffect(() => {
    if (!width || !height || placed.current) return
    placed.current = true
    const persp = camera as PerspectiveCamera
    const aspect = width / height
    const fovRad = (persp.fov * Math.PI) / 180
    const wantWidth = aspect < 0.95 ? 210 : 330
    const raw = wantWidth / 2 / (Math.tan(fovRad / 2) * aspect)
    const distance = Math.min(Math.max(raw, 150), 420)
    const elevation = (53 * Math.PI) / 180
    persp.position.set(0, distance * Math.sin(elevation), distance * Math.cos(elevation))
    persp.lookAt(0, 0, 2)
    persp.updateProjectionMatrix()
  }, [camera, width, height])

  return null
}

type OrbitLike = { target: { x: number; y: number; z: number } }

function CinematicCamera() {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const controls = state.controls as unknown as OrbitLike | null
    if (controls) {
      controls.target.x = Math.sin(t * 0.11) * 16
      controls.target.z = 2 + Math.cos(t * 0.09) * 12
      controls.target.y = Math.sin(t * 0.24) * 3.5
    }
    const camera = state.camera as PerspectiveCamera
    camera.fov = 44 + Math.sin(t * 0.17) * 1.8
    camera.updateProjectionMatrix()
  })

  return null
}

interface CityCanvasProps {
  selectedId: string | null
  onSelect: (id: string | null) => void
  explore?: boolean
  onExit?: () => void
}

export function CityCanvas({ selectedId, onSelect, explore = false, onExit }: CityCanvasProps) {
  const portalRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div ref={portalRef} className="pointer-events-none absolute inset-0 z-10" />
      <Canvas
        shadows="soft"
        dpr={[1, 1.8]}
        gl={{ antialias: false, powerPreference: "high-performance", toneMapping: NoToneMapping }}
        camera={{ fov: 44, near: 1, far: 2200, position: [0, 200, 150] }}
        onPointerMissed={() => onSelect(null)}
      >
        <SkyBackground />
        <fog attach="fog" args={["#e3d5b4", 520, 1360]} />

        <DayNightLights />

        <CameraRig key={explore ? "explore" : "cine"} />
        {!explore && <CinematicCamera />}
        {explore ? (
          <Suspense fallback={null}>
            <Hero onExit={onExit} />
          </Suspense>
        ) : (
          <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.08} autoRotate autoRotateSpeed={0.24} minDistance={90} maxDistance={440} minPolarAngle={0.42} maxPolarAngle={1.12} target={[0, 0, 0]} />
        )}

        <Ground />
        <Roads />
        <Buildings />
        <Landmarks />
        <Water />
        <Trees />
        <StreetProps />
        <Traffic />
        <Suspense fallback={null}>
          <Crowd />
        </Suspense>
        <Billboards3D />
        <MapLabels portal={portalRef} />
        <MarkerPins selectedId={selectedId} onSelect={onSelect} portal={portalRef} />

        <EffectComposer multisampling={0}>
          <SSAO samples={16} radius={0.06} intensity={1.5} luminanceInfluence={0.55} distanceThreshold={0.2} />
          <Bloom intensity={0.62} luminanceThreshold={0.92} luminanceSmoothing={0.22} mipmapBlur />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <HueSaturation saturation={0.22} hue={0.01} />
          <BrightnessContrast brightness={-0.055} contrast={0.16} />
          <Vignette offset={0.26} darkness={0.46} />
          <SMAA />
        </EffectComposer>

        <Clouds />
      </Canvas>
    </>
  )
}

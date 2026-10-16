import { CanvasTexture, SRGBColorSpace, type Texture } from "three"

const textureCache = new Map<string, Texture | null>()

function getBoardTexture(key: string, lines: string[], theme: BoardTheme) {
  if (!textureCache.has(key)) {
    textureCache.set(key, drawBoard(lines, theme))
  }
  return textureCache.get(key) ?? null
}

export interface BoardTheme {
  from: string
  to: string
  border: string
  text: string
  band?: { color: string; text: string }
}

function drawBoard(lines: string[], theme: BoardTheme) {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  const gradient = ctx.createLinearGradient(0, 0, 512, 256)
  gradient.addColorStop(0, theme.from)
  gradient.addColorStop(1, theme.to)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 256)

  ctx.strokeStyle = theme.border
  ctx.lineWidth = 16
  ctx.strokeRect(8, 8, 496, 240)

  ctx.textAlign = "center"
  ctx.fillStyle = theme.text
  const base = theme.band ? 78 : 108
  lines.forEach((line, index) => {
    const size = index === 0 ? 56 : 32
    const family = index === 0 ? "Fredoka" : "'Plus Jakarta Sans'"
    ctx.font = `${index === 0 ? 600 : 700} ${size}px ${family}, sans-serif`
    ctx.fillText(line, 256, base + index * 50)
  })

  if (theme.band) {
    ctx.fillStyle = theme.band.color
    ctx.fillRect(16, 188, 480, 52)
    ctx.fillStyle = theme.band.text
    ctx.font = "700 34px 'Plus Jakarta Sans', sans-serif"
    ctx.fillText(theme.band.text, 256, 226)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

interface Billboard3DProps {
  x: number
  z: number
  rotationY?: number
  width?: number
  height?: number
  lines: string[]
  theme: BoardTheme
  mega?: boolean
}

export function Billboard3D({
  x,
  z,
  rotationY = 0,
  width = 11,
  height = 5.5,
  lines,
  theme,
  mega = false,
}: Billboard3DProps) {
  const key = `${lines.join("|")}|${theme.from}|${theme.band?.color ?? ""}`
  const texture = getBoardTexture(key, lines, theme)
  const poleHeight = mega ? 11 : 8.5

  return (
    <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      <mesh position={[-width / 2 + 0.9, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.28, 0.34, poleHeight, 8]} />
        <meshStandardMaterial color="#15181b" />
      </mesh>
      <mesh position={[width / 2 - 0.9, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.28, 0.34, poleHeight, 8]} />
        <meshStandardMaterial color="#15181b" />
      </mesh>
      <mesh position={[0, poleHeight + height / 2, 0]}>
        <boxGeometry args={[width, height, 0.5]} />
        <meshStandardMaterial color="#15181b" />
      </mesh>
      {texture ? (
        <mesh position={[0, poleHeight + height / 2, 0.29]}>
          <planeGeometry args={[width - 0.35, height - 0.35]} />
          <meshStandardMaterial map={texture} toneMapped={false} />
        </mesh>
      ) : null}
      {mega ? (
        <mesh position={[0, poleHeight - 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.4, 1.4, 0.4]} />
          <meshStandardMaterial color="#e8c65a" />
        </mesh>
      ) : null}
    </group>
  )
}

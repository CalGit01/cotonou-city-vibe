import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three"

let cached: CanvasTexture | null = null

export function facadeTexture(): CanvasTexture {
  if (cached) return cached
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = "#e6eaee"
  ctx.fillRect(0, 0, size, 3)
  ctx.fillRect(0, size - 3, size, 3)

  ctx.fillStyle = "#b9c6d1"
  ctx.fillRect(12, 12, size - 24, size - 30)

  const glass = ctx.createLinearGradient(0, 12, 0, size - 18)
  glass.addColorStop(0, "#e8f3fa")
  glass.addColorStop(0.5, "#c2d6e4")
  glass.addColorStop(1, "#a7bece")
  ctx.fillStyle = glass
  ctx.fillRect(14, 14, size - 28, size - 34)

  ctx.fillStyle = "rgba(255,255,255,0.5)"
  ctx.fillRect(14, 14, size - 28, 4)

  const tex = new CanvasTexture(canvas)
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  cached = tex
  return tex
}

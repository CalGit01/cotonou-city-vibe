import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three"

const cache = new Map<string, CanvasTexture>()

export function roadTexture(axis: "x" | "z"): CanvasTexture {
  const key = `road-${axis}`
  const hit = cache.get(key)
  if (hit) return hit

  const s = 128
  const canvas = document.createElement("canvas")
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext("2d")!

  ctx.fillStyle = "#69727c"
  ctx.fillRect(0, 0, s, s)

  ctx.fillStyle = "rgba(255,255,255,0.02)"
  for (let i = 0; i < 300; i += 1) {
    ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1)
  }

  ctx.fillStyle = "#f3f4e8"
  if (axis === "x") {
    ctx.fillRect(0, 5, s, 2.4)
    ctx.fillRect(0, s - 7, s, 2.4)
    for (let x = 0; x < s; x += 26) ctx.fillRect(x, s / 2 - 1.8, 16, 3.6)
  } else {
    ctx.fillRect(5, 0, 2.4, s)
    ctx.fillRect(s - 7, 0, 2.4, s)
    for (let y = 0; y < s; y += 26) ctx.fillRect(s / 2 - 1.8, y, 3.6, 16)
  }

  const tex = new CanvasTexture(canvas)
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  cache.set(key, tex)
  return tex
}

export function crosswalkTexture(axis: "x" | "z"): CanvasTexture {
  const key = `crosswalk-${axis}`
  const hit = cache.get(key)
  if (hit) return hit

  const s = 64
  const canvas = document.createElement("canvas")
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext("2d")!
  ctx.clearRect(0, 0, s, s)
  ctx.fillStyle = "#eef1f2"
  if (axis === "z") {
    for (let x = 4; x < s; x += 16) ctx.fillRect(x, 0, 8, s)
  } else {
    for (let y = 4; y < s; y += 16) ctx.fillRect(0, y, s, 8)
  }

  const tex = new CanvasTexture(canvas)
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.colorSpace = SRGBColorSpace
  cache.set(key, tex)
  return tex
}

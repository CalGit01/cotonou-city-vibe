import { CanvasTexture, SRGBColorSpace } from "three"

const cache = new Map<string, CanvasTexture>()

export function signTexture(title: string, bg: string, fg = "#ffffff"): CanvasTexture {
  const key = `${title}|${bg}|${fg}`
  const hit = cache.get(key)
  if (hit) return hit

  const w = 512
  const h = 128
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = "rgba(0,0,0,0.18)"
  ctx.fillRect(0, h - 10, w, 10)
  ctx.fillStyle = "rgba(255,255,255,0.22)"
  ctx.fillRect(0, 0, w, 6)

  ctx.fillStyle = fg
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.font = "bold 46px system-ui, sans-serif"

  const words = title.split(" ")
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > w - 48 && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  lines.push(line)
  const visible = lines.slice(0, 2)
  const step = 52
  const startY = h / 2 - ((visible.length - 1) * step) / 2
  visible.forEach((text, index) => {
    ctx.fillText(text, w / 2, startY + index * step)
  })

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  cache.set(key, tex)
  return tex
}

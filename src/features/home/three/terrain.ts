import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three"

function makeTile(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
): CanvasTexture {
  const size = 128
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  draw(ctx, size)
  const tex = new CanvasTexture(canvas)
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function speckle(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: string[],
  count: number,
  dot: number,
) {
  for (let i = 0; i < count; i += 1) {
    ctx.fillStyle = colors[i % colors.length]
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, dot, 0, Math.PI * 2)
    ctx.fill()
  }
}

let grass: CanvasTexture | null = null
export function grassTexture(): CanvasTexture {
  if (grass) return grass
  grass = makeTile((ctx, size) => {
    ctx.fillStyle = "#8db36a"
    ctx.fillRect(0, 0, size, size)
    speckle(ctx, size, ["#7ea45c", "#99c079", "#87a862", "#a3c987"], 900, 2)
  })
  return grass
}

let sand: CanvasTexture | null = null
export function sandTexture(): CanvasTexture {
  if (sand) return sand
  sand = makeTile((ctx, size) => {
    ctx.fillStyle = "#e6d3a3"
    ctx.fillRect(0, 0, size, size)
    speckle(ctx, size, ["#dcc794", "#efdfb8", "#d3bc84", "#f2e6c6"], 700, 1.6)
  })
  return sand
}

let pavement: CanvasTexture | null = null
export function pavementTexture(): CanvasTexture {
  if (pavement) return pavement
  pavement = makeTile((ctx, size) => {
    ctx.fillStyle = "#c7cacf"
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = "#b4b9bd"
    ctx.lineWidth = 1.6
    const step = size / 4
    for (let i = 0; i <= 4; i += 1) {
      ctx.beginPath()
      ctx.moveTo(i * step, 0)
      ctx.lineTo(i * step, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * step)
      ctx.lineTo(size, i * step)
      ctx.stroke()
    }
    speckle(ctx, size, ["#bfc3c6", "#d2d5d8"], 400, 1.2)
  })
  return pavement
}

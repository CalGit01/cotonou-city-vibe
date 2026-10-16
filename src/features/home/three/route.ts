export interface RouteSample {
  x: number
  z: number
  angle: number
}

export function routeLength(points: [number, number][]) {
  let total = 0
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    total += Math.hypot(b[0] - a[0], b[1] - a[1])
  }
  return total
}

export function sampleRoute(
  points: [number, number][],
  distance: number,
  total: number,
): RouteSample {
  let d = ((distance % total) + total) % total
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    const dx = b[0] - a[0]
    const dz = b[1] - a[1]
    const seg = Math.hypot(dx, dz)
    if (d <= seg) {
      const t = seg === 0 ? 0 : d / seg
      return {
        x: a[0] + dx * t,
        z: a[1] + dz * t,
        angle: Math.atan2(-dz, dx),
      }
    }
    d -= seg
  }
  const a = points[0]
  const b = points[1 % points.length]
  return { x: a[0], z: a[1], angle: Math.atan2(-(b[1] - a[1]), b[0] - a[0]) }
}

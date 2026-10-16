export function dayFraction(date: Date = new Date()) {
  return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400
}

export const DN = { t: dayFraction() }

interface Keyframe {
  t: number
  top: string
  horizon: string
  sun: string
  sunI: number
  hemiI: number
  ambI: number
  fog: string
  fogNear: number
  fogFar: number
}

const KEYS: Keyframe[] = [
    { t: 0.0, top: "#05070f", horizon: "#121c2e", sun: "#2a3a5a", sunI: 0.0, hemiI: 0.16, ambI: 0.07, fog: "#0b1220", fogNear: 300, fogFar: 1100 },
  { t: 0.2, top: "#23385f", horizon: "#d98a5a", sun: "#ff9a52", sunI: 0.85, hemiI: 0.42, ambI: 0.12, fog: "#c9a98c", fogNear: 420, fogFar: 1250 },
  { t: 0.3, top: "#4a86c4", horizon: "#e2ebee", sun: "#ffe6c0", sunI: 2.1, hemiI: 0.62, ambI: 0.15, fog: "#dfe4e6", fogNear: 520, fogFar: 1400 },
  { t: 0.5, top: "#2f74b8", horizon: "#d7e8f2", sun: "#fff6e6", sunI: 2.6, hemiI: 0.72, ambI: 0.18, fog: "#dfe8ee", fogNear: 560, fogFar: 1500 },
  { t: 0.7, top: "#3f74ad", horizon: "#f7e3bd", sun: "#ffcb86", sunI: 2.4, hemiI: 0.5, ambI: 0.14, fog: "#e3d5b4", fogNear: 520, fogFar: 1360 },
  { t: 0.8, top: "#1d2c4a", horizon: "#b5724c", sun: "#ff8a4a", sunI: 0.9, hemiI: 0.32, ambI: 0.1, fog: "#8a7a6a", fogNear: 420, fogFar: 1200 },
  { t: 0.9, top: "#0a1020", horizon: "#1a2436", sun: "#2a3a5a", sunI: 0.0, hemiI: 0.18, ambI: 0.08, fog: "#101828", fogNear: 340, fogFar: 1080 },
  { t: 1.0, top: "#05070f", horizon: "#121c2e", sun: "#2a3a5a", sunI: 0.0, hemiI: 0.16, ambI: 0.07, fog: "#0b1220", fogNear: 300, fogFar: 1100 },
]

function hexToRgb(hex: string) {
  const value = parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const
}

function lerp(a: number, b: number, k: number) {
  return a + (b - a) * k
}

function lerpHex(a: string, b: string, k: number) {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  return [
    Math.round(lerp(ca[0], cb[0], k)),
    Math.round(lerp(ca[1], cb[1], k)),
    Math.round(lerp(ca[2], cb[2], k)),
  ] as const
}

export interface DaySample {
  top: string
  horizon: string
  sun: string
  sunI: number
  hemiI: number
  ambI: number
  fog: string
  fogNear: number
  fogFar: number
  altitude: number
  night: number
  topRgb: readonly [number, number, number]
  horizonRgb: readonly [number, number, number]
}

export function sampleDay(t: number): DaySample {
  const time = ((t % 1) + 1) % 1
  let i = 0
  for (; i < KEYS.length - 1; i += 1) {
    if (time >= KEYS[i].t && time <= KEYS[i + 1].t) break
  }
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const span = b.t - a.t || 1
  const k = (time - a.t) / span

  const altitude = Math.sin((time - 0.25) * Math.PI * 2)
  const night = Math.max(0, Math.min(1, (0.28 - altitude) * 2))

  const topRgb = lerpHex(a.top, b.top, k)
  const horizonRgb = lerpHex(a.horizon, b.horizon, k)
  const sunRgb = lerpHex(a.sun, b.sun, k)
  const fogRgb = lerpHex(a.fog, b.fog, k)

  const toHex = (rgb: readonly [number, number, number]) =>
    `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`

  return {
    top: toHex(topRgb),
    horizon: toHex(horizonRgb),
    sun: toHex(sunRgb),
    fog: toHex(fogRgb),
    topRgb,
    horizonRgb,
    sunI: lerp(a.sunI, b.sunI, k),
    hemiI: lerp(a.hemiI, b.hemiI, k),
    ambI: lerp(a.ambI, b.ambI, k),
    fogNear: lerp(a.fogNear, b.fogNear, k),
    fogFar: lerp(a.fogFar, b.fogFar, k),
    altitude,
    night,
  }
}

export function syncToClock() {
  DN.t = dayFraction()
}

import { useEffect, useState } from "react"

export function formatShort(value: number): string {
  if (value < 1000) return String(Math.round(value))
  return `${(value / 1000).toFixed(1)}k`
}

export function useCountUp(target: number, duration = 2600, drift = 3) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  useEffect(() => {
    if (drift <= 0) return
    const interval = window.setInterval(() => {
      setValue((current) => current + Math.random() * drift)
    }, 1800)
    return () => window.clearInterval(interval)
  }, [drift])

  return value
}

import type { Venue } from "@/config/venues"

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export function isOpenNow(venue: Venue, date: Date = new Date()): boolean {
  if (venue.hours === "24h") return true
  const current = date.getHours() * 60 + date.getMinutes()
  const open = toMinutes(venue.hours.open)
  const close = toMinutes(venue.hours.close)
  if (close <= open) return current >= open || current < close
  return current >= open && current < close
}

export function hoursLabel(venue: Venue, openLabel: string): string {
  if (venue.hours === "24h") return openLabel
  return `${venue.hours.open} - ${venue.hours.close}`
}

export function distanceKm(
  a: [number, number],
  b: [number, number],
): number {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

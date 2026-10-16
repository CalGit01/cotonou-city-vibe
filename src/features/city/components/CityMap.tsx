import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import "leaflet/dist/leaflet.css"
import { getCategory } from "@/config/categories"
import { CITY_CENTER, type Venue } from "@/config/venues"

function createPin(color: string): L.DivIcon {
  return L.divIcon({
    className: "ccv-pin",
    html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -24],
  })
}

function FitBounds({ venues }: { venues: Venue[] }) {
  const map = useMap()

  useEffect(() => {
    if (venues.length === 0) return
    if (venues.length === 1) {
      map.setView([venues[0].lat, venues[0].lng], 15)
      return
    }
    const bounds = L.latLngBounds(
      venues.map((v) => [v.lat, v.lng] as [number, number]),
    )
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 })
  }, [venues, map])

  return null
}

interface CityMapProps {
  venues: Venue[]
}

export function CityMap({ venues }: CityMapProps) {
  const { t } = useTranslation()

  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds venues={venues} />
      {venues.map((venue) => {
        const category = getCategory(venue.category)
        return (
          <Marker
            key={venue.id}
            position={[venue.lat, venue.lng]}
            icon={createPin(category.color)}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold">{venue.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t(`categories.${venue.category}`)} ·{" "}
                  {t(`quartiers.${venue.quartier}`)}
                </p>
                <Link
                  to={`/lieu/${venue.id}`}
                  className="mt-1 inline-block text-xs font-medium text-primary underline"
                >
                  {t("venue.details")} →
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

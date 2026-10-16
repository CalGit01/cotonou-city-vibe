export type LandmarkKind =
  | "airport"
  | "stadium"
  | "market"
  | "port"
  | "cathedral"
  | "clinic"
  | "monument"
  | "beach"
  | "civic"

export interface LandmarkDef {
  id: string
  venueId: string
  kind: LandmarkKind
  x: number
  z: number
  top: number
  clearance: number
  accent?: string
  title?: string
}

export const LANDMARKS: LandmarkDef[] = [
  { id: "airport", venueId: "aeroport", kind: "airport", x: -116, z: -44, top: 22, clearance: 12 },
  { id: "stadium", venueId: "stade-amitie", kind: "stadium", x: 86, z: 21, top: 12, clearance: 10 },
  { id: "market", venueId: "dantokpa", kind: "market", x: -22, z: 22, top: 9, clearance: 10 },
  { id: "monument", venueId: "etoile-rouge", kind: "monument", x: -16, z: -6, top: 16, clearance: 10 },
  { id: "cathedral", venueId: "cathedrale", kind: "cathedral", x: 30, z: -28, top: 30, clearance: 10 },
  { id: "clinic", venueId: "clinique-sezo", kind: "clinic", x: 86, z: -23, top: 15, clearance: 10 },
  { id: "port", venueId: "port-cotonou", kind: "port", x: 66, z: 40, top: 22, clearance: 12 },
  { id: "beach", venueId: "plage-fidjrosse", kind: "beach", x: 110, z: 54, top: 8, clearance: 12 },

  { id: "mairie", venueId: "mairie-cotonou", kind: "civic", x: -48, z: 14, top: 15, clearance: 10, accent: "#e8a63a", title: "Mairie de Cotonou" },
  { id: "lycee-behanzin", venueId: "lycee-behanzin", kind: "civic", x: -56, z: 40, top: 14, clearance: 10, accent: "#4d7cfe", title: "Lycée Béhanzin" },
  { id: "cnhu", venueId: "cnhu-hkm", kind: "civic", x: 60, z: 70, top: 18, clearance: 10, accent: "#dc2626", title: "CNHU-HKM" },
  { id: "clinique-lp", venueId: "clinique-louis-pasteur", kind: "civic", x: 14, z: -70, top: 15, clearance: 10, accent: "#dc2626", title: "Clinique LP" },
  { id: "boa", venueId: "bank-of-africa", kind: "civic", x: 14, z: 40, top: 14, clearance: 10, accent: "#eab308", title: "Bank of Africa" },
  { id: "ecobank", venueId: "ecobank-cotonou", kind: "civic", x: -24, z: 60, top: 14, clearance: 10, accent: "#eab308", title: "Ecobank" },
  { id: "uba", venueId: "uba-benin", kind: "civic", x: -40, z: -40, top: 14, clearance: 10, accent: "#eab308", title: "UBA Bénin" },
  { id: "bceao", venueId: "bceao", kind: "civic", x: -98, z: -20, top: 16, clearance: 10, accent: "#eab308", title: "BCEAO" },
  { id: "institut-fr", venueId: "institut-francais", kind: "civic", x: 50, z: -46, top: 14, clearance: 10, accent: "#4d7cfe", title: "Institut Français" },
  { id: "golden-tulip", venueId: "golden-tulip", kind: "civic", x: 120, z: 30, top: 16, clearance: 10, accent: "#6366f1", title: "Golden Tulip" },
  { id: "benin-royal", venueId: "benin-royal", kind: "civic", x: 30, z: 80, top: 16, clearance: 10, accent: "#6366f1", title: "Bénin Royal" },
  { id: "stade-pleven", venueId: "stade-rene-pleven", kind: "civic", x: -100, z: 70, top: 12, clearance: 10, accent: "#84cc16", title: "Stade René Pleven" },
  { id: "marche-cadjehoun", venueId: "marche-cadjehoun", kind: "civic", x: -70, z: -70, top: 10, clearance: 10, accent: "#10b981", title: "Marché Cadjèhoun" },
  { id: "marche-gbegamey", venueId: "marche-gbegamey", kind: "civic", x: -18, z: 44, top: 10, clearance: 10, accent: "#10b981", title: "Marché Gbégamey" },
  { id: "plage-peches", venueId: "plage-route-peches", kind: "civic", x: 156, z: 110, top: 9, clearance: 10, accent: "#06b6d4", title: "Plage Route des Pêches" },
  { id: "eneam", venueId: "eneam", kind: "civic", x: 128, z: 60, top: 14, clearance: 10, accent: "#4d7cfe", title: "ENEAM" },
]

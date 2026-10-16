import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import fr from "@/locales/fr/common.json"
import fon from "@/locales/fon/common.json"
import gun from "@/locales/gun/common.json"
import min from "@/locales/min/common.json"

export const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "fon", label: "Fon" },
  { code: "gun", label: "Gun" },
  { code: "min", label: "Mina" },
] as const

i18n.use(initReactI18next).init({
  resources: {
    fr: { common: fr },
    fon: { common: fon },
    gun: { common: gun },
    min: { common: min },
  },
  lng: "fr",
  fallbackLng: "fr",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

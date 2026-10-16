import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { VenueCategory } from "@/config/categories"

export type Language = "fr" | "fon" | "gun" | "min"
export type ViewMode = "map" | "list"

interface AppState {
  language: Language
  viewMode: ViewMode
  search: string
  categories: VenueCategory[]
  quartiers: string[]
  favorites: string[]
  setLanguage: (language: Language) => void
  setViewMode: (viewMode: ViewMode) => void
  setSearch: (search: string) => void
  toggleCategory: (category: VenueCategory) => void
  setCategories: (categories: VenueCategory[]) => void
  toggleQuartier: (quartier: string) => void
  setQuartiers: (quartiers: string[]) => void
  toggleFavorite: (id: string) => void
  resetFilters: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "fr",
      viewMode: "map",
      search: "",
      categories: [],
      quartiers: [],
      favorites: [],
      setLanguage: (language) => set({ language }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSearch: (search) => set({ search }),
      toggleCategory: (category) =>
        set((state) => ({
          categories: state.categories.includes(category)
            ? state.categories.filter((c) => c !== category)
            : [...state.categories, category],
        })),
      setCategories: (categories) => set({ categories }),
      toggleQuartier: (quartier) =>
        set((state) => ({
          quartiers: state.quartiers.includes(quartier)
            ? state.quartiers.filter((q) => q !== quartier)
            : [...state.quartiers, quartier],
        })),
      setQuartiers: (quartiers) => set({ quartiers }),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
      resetFilters: () => set({ search: "", categories: [], quartiers: [] }),
    }),
    {
      name: "cotonou-city-vibe",
      partialize: (state) => ({
        language: state.language,
        viewMode: state.viewMode,
        favorites: state.favorites,
      }),
    },
  ),
)

import { useEffect } from "react"
import { Route, Routes } from "react-router"
import { AppLayout } from "@/components/layout/AppLayout"
import { AuthPage } from "@/features/auth/pages/AuthPage"
import { FavoritesPage } from "@/features/city/pages/FavoritesPage"
import { HomePage } from "@/features/city/pages/HomePage"
import { VenueDetailPage } from "@/features/city/pages/VenueDetailPage"
import { LandingPage } from "@/features/home/pages/LandingPage"
import { PlayPage } from "@/features/play/pages/PlayPage"
import { useAuthStore } from "@/store/useAuthStore"

function App() {
  useEffect(() => {
    useAuthStore.getState().init()
  }, [])

  return (
    <Routes>
      <Route path="connexion" element={<AuthPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="explorer" element={<HomePage />} />
        <Route path="lieu/:id" element={<VenueDetailPage />} />
        <Route path="favoris" element={<FavoritesPage />} />
        <Route path="jouer" element={<PlayPage />} />
      </Route>
    </Routes>
  )
}

export default App

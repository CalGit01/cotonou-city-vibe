import { Outlet, useLocation } from "react-router"
import { Header } from "./Header"

export function AppLayout() {
  const { pathname } = useLocation()
  const isLanding = pathname === "/"

  return (
    <div className="flex min-h-dvh flex-col">
      {!isLanding && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import "./index.css"
import App from "./App.tsx"
import { ErrorBoundary, installGlobalErrorOverlay } from "@/components/ErrorOverlay"
import i18n from "@/lib/i18n"
import { useAppStore } from "@/store/useAppStore"

installGlobalErrorOverlay()

i18n.changeLanguage(useAppStore.getState().language)
useAppStore.subscribe((state, previous) => {
  if (state.language !== previous.language) {
    void i18n.changeLanguage(state.language)
  }
})

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>,
)

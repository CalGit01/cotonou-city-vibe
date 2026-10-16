import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  message: string | null
  stack: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { message: null, stack: null }

  static getDerivedStateFromError(error: unknown): State {
    const err = error as Error
    return { message: err?.message ?? String(error), stack: err?.stack ?? null }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[Cotonou] Render error:", error, info)
  }

  render() {
    if (this.state.message) {
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            overflow: "auto",
            background: "#0b1220",
            color: "#ffd7d7",
            fontFamily: "monospace",
            fontSize: 13,
            padding: 20,
            whiteSpace: "pre-wrap",
          }}
        >
          <div style={{ color: "#ff6b6b", fontWeight: 700, fontSize: 16 }}>
            Erreur de rendu — Cotonou City Vibe
          </div>
          <div style={{ marginTop: 12, color: "#ffe08a" }}>{this.state.message}</div>
          <div style={{ marginTop: 16, color: "#9fb3c8" }}>{this.state.stack}</div>
        </div>
      )
    }
    return this.props.children
  }
}

export function installGlobalErrorOverlay() {
  const show = (label: string, detail: unknown) => {
    if (document.getElementById("cotonou-error-overlay")) return
    const err = detail as Error
    const node = document.createElement("div")
    node.id = "cotonou-error-overlay"
    node.style.cssText =
      "position:fixed;left:12px;right:12px;bottom:12px;max-height:44vh;overflow:auto;z-index:999999;background:#0b1220;color:#ffd7d7;font-family:monospace;font-size:12px;padding:14px 44px 14px 14px;white-space:pre-wrap;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5);border:1px solid #ff6b6b55;"
    node.textContent = `${label}\n\n${err?.message ?? String(detail)}\n\n${err?.stack ?? ""}`
    const close = document.createElement("button")
    close.textContent = "\u00d7"
    close.setAttribute("aria-label", "Fermer")
    close.style.cssText =
      "position:fixed;right:22px;bottom:calc(44vh - 2px);min-width:28px;height:28px;border-radius:50%;border:none;background:#ff6b6b;color:#fff;font-size:18px;line-height:1;cursor:pointer;z-index:1000000;"
    close.onclick = () => {
      node.remove()
      close.remove()
    }
    document.body.appendChild(node)
    document.body.appendChild(close)
  }

  window.addEventListener("error", (event) => {
    show("Erreur JS — Cotonou City Vibe", event.error ?? event.message)
  })
  window.addEventListener("unhandledrejection", (event) => {
    show("Promesse rejetée — Cotonou City Vibe", event.reason)
  })
}

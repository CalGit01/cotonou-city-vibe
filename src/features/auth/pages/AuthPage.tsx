import { Eye, EyeOff, Globe, MailCheck } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { CotonouLogo } from "@/components/CotonouLogo"
import { LANGUAGES } from "@/lib/i18n"
import { isSupabaseConfigured } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { useAppStore, type Language } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"

type Mode = "create" | "login"

function mapAuthError(message: string, t: (key: string) => string): string {
  if (/email not confirmed/i.test(message)) return t("auth.errorEmailNotConfirmed")
  if (/already registered/i.test(message)) return t("auth.errorAlreadyRegistered")
  if (/invalid login credentials/i.test(message))
    return t("auth.errorInvalidCredentials")
  if (/password should be at least/i.test(message)) return t("auth.errorWeakPassword")
  return message
}

export function AuthPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const signIn = useAuthStore((s) => s.signIn)
  const signUp = useAuthStore((s) => s.signUp)
  const resendConfirm = useAuthStore((s) => s.resendConfirm)

  const [mode, setMode] = useState<Mode>("login")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canSubmit =
    emailOk &&
    (mode === "login"
      ? password.length > 0
      : password.length >= 6 && username.trim().length >= 2)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    setInfo("")
    if (!canSubmit || loading) return
    setLoading(true)

    if (mode === "login") {
      const { error: err } = await signIn(email.trim(), password)
      setLoading(false)
      if (err) {
        setError(mapAuthError(err, t))
        if (/email not confirmed/i.test(err)) setPendingEmail(email.trim())
        return
      }
      navigate("/")
      return
    }

    const { error: err, needsConfirm } = await signUp(
      email.trim(),
      password,
      username.trim(),
    )
    setLoading(false)
    if (err) {
      setError(mapAuthError(err, t))
      return
    }
    if (needsConfirm) {
      setPendingEmail(email.trim())
      return
    }
    navigate("/")
  }

  async function handleResend() {
    if (!pendingEmail || resending) return
    setResending(true)
    setError("")
    setInfo("")
    const { error: err } = await resendConfirm(pendingEmail)
    setResending(false)
    if (err) {
      setError(mapAuthError(err, t))
      return
    }
    setInfo(t("auth.resendSent"))
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <div className="flex h-dvh flex-col overflow-y-auto bg-[linear-gradient(180deg,#bfe0f7_0%,#e8f1f7_45%,#eef2f7_100%)]">
        <div className="safe-top px-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-2 text-sm font-semibold text-lagoon"
          >
            ← {t("auth.back")}
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
          <div className="text-center">
            <CotonouLogo className="mx-auto mb-2 h-11 w-14" />
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              {t("app.name")}
              <span
                title={t("auth.ageTitle")}
                className="ml-2 inline-grid h-7 place-items-center rounded-lg bg-ink px-1.5 align-middle font-body text-xs font-bold tracking-normal text-white"
              >
                {t("auth.ageBadge")}
              </span>
            </h1>
            <p className="mt-1 text-[15px] text-ink-soft">
              {pendingEmail ? t("auth.confirmSubtitle") : t("auth.subtitle")}
            </p>
          </div>

        {pendingEmail ? (
          <div className="panel mt-6 w-full rounded-[28px] p-5 text-center sm:w-[420px]">
            <span className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-leaf/12">
              <MailCheck className="size-7 text-leaf-deep" />
            </span>
            <h2 className="font-display text-xl font-semibold text-ink">
              {t("auth.confirmTitle")}
            </h2>
            <p className="mt-2 text-[13px] font-medium text-ink-soft">
              {t("auth.confirmText", { email: pendingEmail })}
            </p>

            {error && (
              <p className="mt-4 rounded-2xl bg-terracotta/10 px-3 py-2 text-[13px] font-semibold text-terracotta">
                {error}
              </p>
            )}
            {info && (
              <p className="mt-4 rounded-2xl bg-leaf/10 px-3 py-2 text-[13px] font-semibold text-leaf-deep">
                {info}
              </p>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="btn-press mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-mist px-6 text-sm font-semibold text-ink disabled:opacity-40"
            >
              {resending ? t("auth.loading") : t("auth.resend")}
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingEmail(null)
                setMode("login")
                setError("")
                setInfo("")
              }}
              className="btn-press mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-leaf px-6 text-sm font-semibold text-white shadow-[0_6px_16px_-6px_rgba(34,181,115,.7)] hover:bg-leaf-deep"
            >
              {t("auth.backToLogin")}
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingEmail(null)
                setMode("create")
                setError("")
                setInfo("")
              }}
              className="mt-3 text-[13px] font-semibold text-lagoon"
            >
              {t("auth.changeEmail")}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="panel mt-6 w-full rounded-[28px] p-5 sm:w-[420px]"
          >
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-mist p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("create")
                  setError("")
                  setInfo("")
                }}
                className={cn(
                  "h-10 rounded-xl text-sm font-semibold transition-colors",
                  mode === "create" ? "bg-white text-ink shadow-sm" : "text-ink-soft",
                )}
              >
                {t("auth.tabCreate")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login")
                  setError("")
                  setInfo("")
                }}
                className={cn(
                  "h-10 rounded-xl text-sm font-semibold transition-colors",
                  mode === "login" ? "bg-white text-ink shadow-sm" : "text-ink-soft",
                )}
              >
                {t("auth.tabLogin")}
              </button>
            </div>

            <div className="space-y-3">
              {mode === "create" && (
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">
                    {t("auth.pseudoLabel")}
                  </span>
                  <input
                    maxLength={32}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder={t("auth.pseudoPlaceholder")}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="h-12 w-full rounded-2xl bg-mist px-4 text-[16px] font-semibold outline-none placeholder:font-medium placeholder:text-ink-soft/60 focus:ring-2 focus:ring-lagoon"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">
                  {t("auth.emailLabel")}
                </span>
                <input
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-2xl bg-mist px-4 text-[16px] font-semibold outline-none placeholder:font-medium placeholder:text-ink-soft/60 focus:ring-2 focus:ring-lagoon"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-ink-soft">
                  {t("auth.passwordLabel")}
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-2xl bg-mist px-4 pr-12 text-[16px] font-semibold outline-none placeholder:font-medium placeholder:text-ink-soft/60 focus:ring-2 focus:ring-lagoon"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={t("auth.showPassword")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </label>

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <button type="button" className="text-[13px] font-semibold text-lagoon">
                    {t("auth.forgot")}
                  </button>
                  <button type="button" className="text-[13px] font-semibold text-lagoon">
                    {t("auth.cantGetIn")}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-2xl bg-terracotta/10 px-3 py-2 text-center text-[13px] font-semibold text-terracotta">
                {error}
              </p>
            )}
            {!isSupabaseConfigured && (
              <p className="mt-4 rounded-2xl bg-terracotta/10 px-3 py-2 text-center text-[13px] font-semibold text-terracotta">
                {t("auth.notConfigured")}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="btn-press mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-leaf px-6 text-base font-semibold text-white shadow-[0_6px_16px_-6px_rgba(34,181,115,.7)] transition-colors select-none hover:bg-leaf-deep disabled:opacity-40"
            >
              {loading
                ? t("auth.loading")
                : mode === "login"
                  ? t("auth.submitLogin")
                  : t("auth.submitCreate")}
            </button>
            <p className="mt-3 text-center text-xs text-ink-soft">
              {mode === "login" ? t("auth.welcomeLogin") : t("auth.welcomeCreate")}
            </p>
          </form>
        )}
        </div>

        <div className="mx-auto flex items-center justify-center gap-1 px-6 pt-4 pb-[max(env(safe-area-inset-bottom),18px)]">
          <span className="flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-[11px] font-bold text-ink-soft ring-1 ring-black/5">
            ⭐ {t("auth.official")}
          </span>
          <label className="flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-[11px] font-bold text-ink-soft ring-1 ring-black/5">
            <Globe className="size-3.5 text-leaf-deep" />
            <select
              aria-label={t("common.language")}
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="cursor-pointer appearance-none bg-transparent text-[11px] font-bold text-ink-soft outline-none"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}

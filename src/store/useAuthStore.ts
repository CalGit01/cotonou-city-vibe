import type { Session, User } from "@supabase/supabase-js"
import { create } from "zustand"
import { fetchProfile, touchLastSeen, type Profile } from "@/lib/profile"
import { supabase } from "@/lib/supabase"

interface AuthResult {
  error?: string
  needsConfirm?: boolean
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  ready: boolean
  init: () => void
  loadProfile: (userId: string | null) => Promise<void>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<AuthResult>
  resendConfirm: (email: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

let subscribed = false

export function displayName(user: User | null): string {
  if (!user) return ""
  const meta = user.user_metadata as { username?: string } | null
  return meta?.username || user.email?.split("@")[0] || "Joueur"
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  ready: false,
  init: () => {
    if (subscribed) return
    subscribed = true
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null
      set({ session: data.session, user, ready: true })
      if (user) void get().loadProfile(user.id)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null
      set({ session, user, ready: true })
      void get().loadProfile(user?.id ?? null)
    })
  },
  loadProfile: async (userId) => {
    if (!userId) {
      set({ profile: null })
      return
    }
    const profile = await fetchProfile(userId)
    set({ profile })
    if (profile) void touchLastSeen(userId)
  },
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  },
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    if (error) return { error: error.message }
    return { needsConfirm: !data.session }
  },
  resendConfirm: async (email) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    return error ? { error: error.message } : {}
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ profile: null })
  },
}))

export function useUsername(): string {
  const profile = useAuthStore((s) => s.profile)
  const user = useAuthStore((s) => s.user)
  return profile?.username || displayName(user)
}

import type { Needs } from "@/features/play/game"
import { supabase } from "@/lib/supabase"

export interface Profile {
  id: string
  username: string
  avatar: string | null
  money: number
  day: number
  time_minutes: number
  skill: number
  job_id: string | null
  home_id: string | null
  needs: Needs
  bankrupt: boolean
  created_at: string
  updated_at: string
  last_seen_at: string
}

const MISSING_TABLE = /does not exist|schema cache|relation .* does not exist/i

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()
  if (error) {
    if (!MISSING_TABLE.test(error.message)) {
      console.warn("[profile] fetch:", error.message)
    }
    return null
  }
  return (data as Profile) ?? null
}

export async function updateProfile(
  userId: string,
  patch: Partial<Profile>,
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
  if (error) {
    console.warn("[profile] update:", error.message)
    return false
  }
  return true
}

export async function touchLastSeen(userId: string): Promise<void> {
  await supabase
    .from("profiles")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", userId)
}

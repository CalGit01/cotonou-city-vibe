export type NeedId =
  | "hunger"
  | "energy"
  | "hygiene"
  | "bladder"
  | "fun"
  | "social"

export type Needs = Record<NeedId, number>

export const NEED_IDS: NeedId[] = [
  "hunger",
  "energy",
  "hygiene",
  "bladder",
  "fun",
  "social",
]

export const NEED_RATE_PER_HOUR: Needs = {
  hunger: 6,
  energy: 4,
  hygiene: 3,
  bladder: 7,
  fun: 5,
  social: 4,
}

export const START_MONEY = 20000
export const RENT_AMOUNT = 15000
export const RENT_INTERVAL_DAYS = 7
export const MINUTES_PER_DAY = 1440

export interface LogEntry {
  id: number
  day: number
  time: number
  text: string
}

export interface GameState {
  name: string
  money: number
  day: number
  time: number
  needs: Needs
  jobId: string | null
  skill: number
  log: LogEntry[]
  bankrupt: boolean
}

export interface Job {
  id: string
  pay: number
  energyCost: number
  skillGain: number
  minSkill: number
}

export const JOBS: Job[] = [
  { id: "zem", pay: 3500, energyCost: 30, skillGain: 2, minSkill: 0 },
  { id: "market", pay: 4000, energyCost: 28, skillGain: 3, minSkill: 0 },
  { id: "maquis", pay: 5500, energyCost: 35, skillGain: 4, minSkill: 5 },
  { id: "tailor", pay: 8000, energyCost: 30, skillGain: 6, minSkill: 15 },
  { id: "night", pay: 10000, energyCost: 45, skillGain: 6, minSkill: 25 },
  { id: "office", pay: 18000, energyCost: 40, skillGain: 10, minSkill: 45 },
]

export function getJob(id: string | null): Job | undefined {
  return JOBS.find((job) => job.id === id)
}

export interface ActionDef {
  id: string
  minutes: number
  money: number
  needs: Partial<Needs>
}

export const ACTIONS: ActionDef[] = [
  { id: "eat", minutes: 45, money: -1000, needs: { hunger: 45 } },
  { id: "sleep", minutes: 480, money: 0, needs: { energy: 70, bladder: -20, hunger: -15, hygiene: -10 } },
  { id: "shower", minutes: 30, money: -500, needs: { hygiene: 60 } },
  { id: "toilet", minutes: 15, money: 0, needs: { bladder: 70 } },
  { id: "fun", minutes: 120, money: -2000, needs: { fun: 50, social: 10, energy: -10 } },
  { id: "social", minutes: 90, money: -1500, needs: { social: 50, fun: 15, energy: -5 } },
]

export function getAction(id: string): ActionDef | undefined {
  return ACTIONS.find((action) => action.id === id)
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}

export function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.floor(minutes % 60)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export function applyDecay(needs: Needs, minutes: number): Needs {
  const hours = minutes / 60
  const next = { ...needs }
  for (const id of NEED_IDS) {
    next[id] = clamp(next[id] - NEED_RATE_PER_HOUR[id] * hours)
  }
  return next
}

export function applyNeedsDelta(
  needs: Needs,
  delta: Partial<Needs>,
): Needs {
  const next = { ...needs }
  for (const id of NEED_IDS) {
    const change = delta[id]
    if (typeof change === "number") {
      next[id] = clamp(next[id] + change)
    }
  }
  return next
}

export interface TickResult {
  state: GameState
  messages: string[]
}

export function tick(state: GameState, minutes: number): TickResult {
  if (minutes <= 0) return { state, messages: [] }

  const total = state.time + minutes
  const daysPassed = Math.floor(total / MINUTES_PER_DAY)
  const newTime = total % MINUTES_PER_DAY
  const newDay = state.day + daysPassed

  let next: GameState = {
    ...state,
    time: newTime,
    day: newDay,
    needs: applyDecay(state.needs, minutes),
  }

  const messages: string[] = []

  for (let day = state.day + 1; day <= newDay; day += 1) {
    if (day % RENT_INTERVAL_DAYS === 0) {
      if (next.money >= RENT_AMOUNT) {
        next = { ...next, money: next.money - RENT_AMOUNT }
        messages.push(`loyer:${RENT_AMOUNT}`)
      } else {
        next = { ...next, money: 0, bankrupt: true }
        messages.push("loyer:fail")
      }
    }
  }

  return { state: next, messages }
}

export function createPlayer(name: string): GameState {
  return {
    name,
    money: START_MONEY,
    day: 1,
    time: 7 * 60,
    needs: {
      hunger: 80,
      energy: 80,
      hygiene: 80,
      bladder: 80,
      fun: 70,
      social: 70,
    },
    jobId: null,
    skill: 0,
    log: [],
    bankrupt: false,
  }
}

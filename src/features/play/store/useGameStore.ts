import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  applyNeedsDelta,
  createPlayer,
  getAction,
  getJob,
  tick,
  type GameState,
  type LogEntry,
} from "@/features/play/game"

interface GameStoreState {
  player: GameState | null
  message: string | null
  create: (name: string) => void
  reset: () => void
  doAction: (actionId: string) => void
  work: () => void
  setJob: (jobId: string) => void
  clearMessage: () => void
}

function withLog(
  state: GameState,
  text: string,
  day: number,
  time: number,
): GameState {
  const id = (state.log[0]?.id ?? 0) + 1
  const entry: LogEntry = { id, day, time, text }
  return { ...state, log: [entry, ...state.log].slice(0, 30) }
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      player: null,
      message: null,
      create: (name) =>
        set({ player: createPlayer(name.trim() || "Citoyen"), message: null }),
      reset: () => set({ player: null, message: null }),
      clearMessage: () => set({ message: null }),
      doAction: (actionId) => {
        const player = get().player
        if (!player || player.bankrupt) return
        const action = getAction(actionId)
        if (!action) return

        if (player.money + action.money < 0) {
          set({ message: "no-money" })
          return
        }

        const paid: GameState = {
          ...player,
          money: player.money + action.money,
          needs: applyNeedsDelta(player.needs, action.needs),
        }
        const { state: ticked, messages } = tick(paid, action.minutes)
        let next = withLog(ticked, `action:${action.id}`, ticked.day, ticked.time)
        for (const message of messages) {
          next = withLog(next, message, next.day, next.time)
        }
        set({
          player: next,
          message: messages.includes("loyer:fail")
            ? "rent-fail"
            : messages.length > 0
              ? "rent-paid"
              : null,
        })
      },
      work: () => {
        const player = get().player
        if (!player || player.bankrupt) return
        const job = getJob(player.jobId)
        if (!job) {
          set({ message: "no-job" })
          return
        }
        if (player.needs.energy < job.energyCost) {
          set({ message: "too-tired" })
          return
        }
        const paid: GameState = {
          ...player,
          money: player.money + job.pay,
          skill: player.skill + job.skillGain,
          needs: applyNeedsDelta(player.needs, { energy: -job.energyCost }),
        }
        const { state: ticked, messages } = tick(paid, 480)
        let next = withLog(ticked, `work:${job.pay}`, ticked.day, ticked.time)
        for (const message of messages) {
          next = withLog(next, message, next.day, next.time)
        }
        set({
          player: next,
          message: messages.includes("loyer:fail") ? "rent-fail" : null,
        })
      },
      setJob: (jobId) => {
        const player = get().player
        if (!player) return
        const job = getJob(jobId)
        if (!job || player.skill < job.minSkill) {
          set({ message: "job-locked" })
          return
        }
        set({ player: { ...player, jobId }, message: null })
      },
    }),
    {
      name: "cotonou-city-vibe-game",
    },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorkspaceState, Team, ScoreMap, ResponseMap, ActivityKey, BroadcastMessage } from '../types'
import { upsertWorkspaceData } from '../lib/supabase'

interface WorkspaceStore extends WorkspaceState {
  setTeam: (team: Team, isViewer?: boolean) => void
  updateScore: (key: ActivityKey, points: number, max?: number, completionPts?: number, qualityPts?: number) => void
  lockActivity: (key: ActivityKey) => void
  unlockActivity: (key: ActivityKey) => void
  updateResponse: (patch: Partial<ResponseMap>) => void
  clearWorkspace: () => void
  syncToSupabase: () => Promise<void>
  setBroadcast: (msg: BroadcastMessage | null) => void
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null

const initialState: WorkspaceState = {
  team: null,
  scores: {},
  responses: {},
  syncStatus: 'idle',
  lastSaved: null,
  isViewer: false,
  broadcastMessage: null,
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTeam: (team, isViewer = false) => set({ team, isViewer }),

      updateScore: (key, points, max = 5, completionPts = 0, qualityPts = 0) => {
        if (get().isViewer) return
        set(state => ({
          scores: {
            ...state.scores,
            [key]: {
              key, points, completionPts, qualityPts, max,
              completed: points > 0,
              locked: state.scores[key]?.locked || false,
              timestamp: new Date().toISOString(),
            },
          },
          syncStatus: 'idle',
        }))
        scheduledSync(get)
      },

      lockActivity: (key) => {
        if (get().isViewer) return
        set(state => ({
          scores: {
            ...state.scores,
            [key]: state.scores[key]
              ? { ...state.scores[key]!, locked: true }
              : { key, points: 0, completionPts: 0, qualityPts: 0, max: 5, completed: false, locked: true },
          },
        }))
        scheduledSync(get)
      },

      unlockActivity: (key) => {
        set(state => ({
          scores: {
            ...state.scores,
            [key]: state.scores[key]
              ? { ...state.scores[key]!, locked: false }
              : { key, points: 0, completionPts: 0, qualityPts: 0, max: 5, completed: false, locked: false },
          },
        }))
        scheduledSync(get)
      },

      updateResponse: (patch) => {
        if (get().isViewer) return
        set(state => ({ responses: { ...state.responses, ...patch }, syncStatus: 'idle' }))
        scheduledSync(get)
      },

      clearWorkspace: () => set({ ...initialState }),

      setBroadcast: (msg) => set({ broadcastMessage: msg }),

      syncToSupabase: async () => {
        const state = get()
        if (!state.team || state.isViewer) { set({ syncStatus: 'saved' }); return }
        if (state.team.id.startsWith('demo-')) { set({ syncStatus: 'saved', lastSaved: new Date().toISOString() }); return }
        set({ syncStatus: 'saving' })
        try {
          const ok = await upsertWorkspaceData(state.team.id, {
            scores: state.scores as Record<string, unknown>,
            responses: state.responses as Record<string, unknown>,
          })
          set({
            syncStatus: ok ? 'saved' : 'error',
            lastSaved: ok ? new Date().toISOString() : get().lastSaved,
          })
        } catch {
          set({ syncStatus: 'error' })
        }
      },
    }),
    {
      name: 'bm7621-social-workspace',
      partialize: (state) => ({
        team: state.team,
        scores: state.scores,
        responses: state.responses,
        lastSaved: state.lastSaved,
        isViewer: state.isViewer,
      }),
    }
  )
)

function scheduledSync(get: () => WorkspaceStore) {
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(() => { get().syncToSupabase() }, 2500)
}

export function selectTotalScore(scores: ScoreMap): number {
  return Object.values(scores).reduce((sum, s) => sum + (s?.points || 0), 0)
}

export function selectCompletedCount(scores: ScoreMap): number {
  return Object.values(scores).filter(s => s?.completed).length
}

export function selectAvgQuality(scores: ScoreMap): number {
  const withQ = Object.values(scores).filter(s => s?.completed && (s.qualityPts || 0) > 0)
  if (!withQ.length) return 0
  return Math.round(withQ.reduce((sum, s) => sum + (s?.qualityPts || 0), 0) / withQ.length * 10) / 10
}

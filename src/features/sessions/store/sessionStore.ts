import { create } from 'zustand'
import { sessionService } from '../services/sessionService'
import type { LearningSession, CreateSessionInput, UpdateSessionInput } from '@/models/session'
import type { TeamUser } from '@/models/user'
import type { SessionFilters } from '../services/sessionService'

interface SessionStore {
  sessions: LearningSession[]
  isLoading: boolean
  error: string | null
  fetchAll: () => Promise<void>
  fetchMy: () => Promise<void>
  create: (input: CreateSessionInput, user: TeamUser) => Promise<LearningSession>
  update: (input: UpdateSessionInput) => Promise<void>
  remove: (id: string) => Promise<void>
  search: (query: string) => Promise<void>
  filter: (filters: SessionFilters) => Promise<void>
  clearError: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const sessions = await sessionService.getAllSessions()
      set({ sessions })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMy: async () => {
    set({ isLoading: true, error: null })
    try {
      const sessions = await sessionService.getMySessions()
      set({ sessions })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  create: async (input, user) => {
    set({ isLoading: true, error: null })
    try {
      const session = await sessionService.createSession(input, user)
      set((state) => ({ sessions: [session, ...state.sessions] }))
      return session
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  update: async (input) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await sessionService.updateSession(input)
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === updated.id ? updated : s
        ),
      }))
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await sessionService.deleteSession(id)
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
      }))
    } catch (err) {
      set({ error: (err as Error).message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  search: async (query) => {
    set({ isLoading: true, error: null })
    try {
      const sessions = await sessionService.searchSessions(query)
      set({ sessions })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  filter: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const sessions = await sessionService.filterSessions(filters)
      set({ sessions })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

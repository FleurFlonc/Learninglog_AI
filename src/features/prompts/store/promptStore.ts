import { create } from 'zustand'
import { promptService } from '../services/promptService'
import type { PromptEntry, CreatePromptInput, UpdatePromptInput } from '@/models/prompt'
import type { TeamUser } from '@/models/user'
import type { PromptFilters } from '../services/promptService'

interface PromptStore {
  prompts: PromptEntry[]
  isLoading: boolean
  error: string | null
  fetchAll: () => Promise<void>
  fetchMy: () => Promise<void>
  create: (input: CreatePromptInput, user: TeamUser) => Promise<PromptEntry>
  update: (input: UpdatePromptInput) => Promise<void>
  remove: (id: string) => Promise<void>
  search: (query: string) => Promise<void>
  filter: (filters: PromptFilters) => Promise<void>
  clearError: () => void
}

export const usePromptStore = create<PromptStore>((set) => ({
  prompts: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const prompts = await promptService.getAllPrompts()
      set({ prompts })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMy: async () => {
    set({ isLoading: true, error: null })
    try {
      const prompts = await promptService.getMyPrompts()
      set({ prompts })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  create: async (input, user) => {
    set({ isLoading: true, error: null })
    try {
      const prompt = await promptService.createPrompt(input, user)
      set((state) => ({ prompts: [prompt, ...state.prompts] }))
      return prompt
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
      const updated = await promptService.updatePrompt(input)
      set((state) => ({
        prompts: state.prompts.map((p) =>
          p.id === updated.id ? updated : p
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
      await promptService.deletePrompt(id)
      set((state) => ({
        prompts: state.prompts.filter((p) => p.id !== id),
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
      const prompts = await promptService.searchPrompts(query)
      set({ prompts })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  filter: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const prompts = await promptService.filterPrompts(filters)
      set({ prompts })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

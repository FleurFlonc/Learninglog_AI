import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import { authService } from '../services/authService'
import type { TeamUser } from '@/models/user'

interface AuthStore {
  user: TeamUser | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  signIn: async (email, password) => {
    set({ isLoading: true })
    try {
      const user = await authService.signIn(email, password)
      set({ user, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    try {
      await authService.signOut()
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },

  initialize: async () => {
    set({ isLoading: true })

    // Haal huidige sessie op
    const user = await authService.getCurrentUser()
    set({ user, isAuthenticated: user !== null, isLoading: false })

    // Luister naar auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user
        const mapped: TeamUser = {
          id: u.id,
          email: u.email ?? '',
          displayName:
            (u.user_metadata['display_name'] as string) ??
            (u.email ?? '').split('@')[0],
          createdAt: u.created_at,
        }
        set({ user: mapped, isAuthenticated: true })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    })
  },
}))

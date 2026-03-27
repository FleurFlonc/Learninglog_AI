import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import { authService } from '../services/authService'
import type { TeamUser } from '@/models/user'

interface AuthStore {
  user: TeamUser | null
  isLoading: boolean
  isAuthenticated: boolean
  requiresPasswordSetup: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  clearPasswordSetup: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  requiresPasswordSetup: false,

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

  clearPasswordSetup: () => set({ requiresPasswordSetup: false }),

  initialize: async () => {
    set({ isLoading: true })

    // Detecteer invite/recovery via URL hash vóór Supabase sessie ophaalt
    const hash = window.location.hash
    const isInviteOrRecovery =
      hash.includes('type=invite') || hash.includes('type=recovery')

    if (isInviteOrRecovery) {
      set({ requiresPasswordSetup: true, isAuthenticated: false, isLoading: false })
    } else {
      const user = await authService.getCurrentUser()
      set({ user, isAuthenticated: user !== null, isLoading: false })
    }

    supabase.auth.onAuthStateChange((event, session) => {
      // Password recovery flow
      if (event === 'PASSWORD_RECOVERY') {
        set({ requiresPasswordSetup: true, isAuthenticated: false, isLoading: false })
        return
      }

      // Invite flow: SIGNED_IN terwijl hash nog type=invite bevat
      if (event === 'SIGNED_IN' && window.location.hash.includes('type=invite')) {
        set({ requiresPasswordSetup: true, isAuthenticated: false, isLoading: false })
        return
      }

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

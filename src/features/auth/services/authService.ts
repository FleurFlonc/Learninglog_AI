import { supabase } from '@/lib/supabase/client'
import type { TeamUser } from '@/models/user'

function mapToTeamUser(
  id: string,
  email: string,
  metadata: Record<string, unknown>,
  createdAt: string
): TeamUser {
  return {
    id,
    email,
    displayName: (metadata['display_name'] as string) ?? email.split('@')[0],
    createdAt,
  }
}

export const authService = {
  async signIn(email: string, password: string): Promise<TeamUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('Inloggen mislukt')

    return mapToTeamUser(
      data.user.id,
      data.user.email ?? '',
      data.user.user_metadata,
      data.user.created_at
    )
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async getCurrentUser(): Promise<TeamUser | null> {
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) return null

    return mapToTeamUser(
      data.user.id,
      data.user.email ?? '',
      data.user.user_metadata,
      data.user.created_at
    )
  },

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(error.message)
  },

  async updateDisplayName(displayName: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    })

    if (error) throw new Error(error.message)
  },
}

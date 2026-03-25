export interface TeamUser {
  id: string            // Supabase Auth UUID
  email: string
  displayName: string   // weergavenaam in de app
  createdAt: string
}

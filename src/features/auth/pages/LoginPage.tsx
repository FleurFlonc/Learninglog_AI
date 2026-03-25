import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore((s) => s.signIn)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
      navigate('/sessions', { replace: true })
    } catch {
      setError('Verkeerd e-mailadres of wachtwoord. Probeer het opnieuw.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / titel */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-400">
            <span className="text-xl font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">LearningsAI Team</h1>
          <p className="mt-1 text-sm text-gray-500">Log in om verder te gaan</p>
        </div>

        {/* Formulier */}
        <form
          onSubmit={(e) => { void handleSubmit(e) }}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1A1A1A]"
              >
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                placeholder="naam@bedrijf.nl"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1A1A1A]"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-sage-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-500 disabled:opacity-60"
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Geen account? Neem contact op met de beheerder.
        </p>
      </div>
    </div>
  )
}

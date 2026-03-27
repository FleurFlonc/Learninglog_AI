import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '../store/authStore'

type Mode = 'login' | 'invite' | 'recovery'

function parseHashMode(): Mode {
  const hash = window.location.hash
  if (hash.includes('type=invite')) return 'invite'
  if (hash.includes('type=recovery')) return 'recovery'
  return 'login'
}

export function LoginPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore((s) => s.signIn)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const detected = parseHashMode()
    if (detected !== 'login') {
      setMode(detected)
      // Supabase verwerkt de hash automatisch en start een sessie
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          // Probeer de hash handmatig te verwerken
          supabase.auth.refreshSession()
        }
      })
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
      navigate('/sessions', { replace: true })
    } catch {
      setError('Verkeerd e-mailadres of wachtwoord. Probeer het opnieuw.')
    }
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirm) {
      setError('De wachtwoorden komen niet overeen.')
      return
    }
    if (password.length < 8) {
      setError('Kies een wachtwoord van minimaal 8 tekens.')
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setSuccess(true)
      setTimeout(() => navigate('/sessions', { replace: true }), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.')
    }
  }

  const title = mode === 'invite'
    ? 'Stel je wachtwoord in'
    : mode === 'recovery'
    ? 'Nieuw wachtwoord instellen'
    : 'LearningsAI Team'

  const subtitle = mode === 'invite'
    ? 'Welkom! Kies een wachtwoord om je account te activeren.'
    : mode === 'recovery'
    ? 'Kies een nieuw wachtwoord voor je account.'
    : 'Log in om verder te gaan'

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / titel */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-400">
            <span className="text-xl font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          {success ? (
            <p className="text-center text-sm text-sage-600 font-medium">
              Wachtwoord ingesteld! Je wordt doorgestuurd...
            </p>
          ) : mode === 'login' ? (
            <form onSubmit={(e) => { void handleLogin(e) }} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A]">
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
                <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A]">
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
                <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-sage-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-500 disabled:opacity-60"
              >
                {isLoading ? 'Inloggen...' : 'Inloggen'}
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => { void handleSetPassword(e) }} className="space-y-5">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-[#1A1A1A]">
                  Nieuw wachtwoord
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                  placeholder="Minimaal 8 tekens"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[#1A1A1A]">
                  Herhaal wachtwoord
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-sage-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-500"
              >
                Wachtwoord instellen
              </button>
            </form>
          )}
        </div>

        {mode === 'login' && (
          <p className="mt-6 text-center text-xs text-gray-400">
            Geen account? Neem contact op met de beheerder.
          </p>
        )}
      </div>
    </div>
  )
}

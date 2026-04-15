import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ToastContainer } from '@/features/feedback/ToastContainer'

const navItems = [
  { to: '/sessions', label: 'Alle sessies' },
  { to: '/my-sessions', label: 'Mijn sessies' },
  { to: '/prompts', label: 'Prompts' },
  { to: '/stats', label: 'Inzichten' },
]

function DesktopNav() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="hidden md:flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5">
      {/* Links: naam + nav */}
      <div className="flex items-center gap-8">
        <span className="flex items-center gap-2 text-base font-bold text-[#1A1A1A]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage-400 text-sm font-bold text-white">
            L
          </span>
          LearningsAI Team
        </span>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sage-100 text-sage-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Rechts: gebruiker + uitloggen */}
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-gray-500">{user.displayName}</span>
        )}
        <button
          onClick={() => { void handleSignOut() }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Uitloggen
        </button>
      </div>
    </header>
  )
}

function MobileBottomNav() {
  const { signOut } = useAuthStore()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex border-t border-gray-100 bg-white md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition ${
              isActive ? 'text-sage-500' : 'text-gray-400'
            }`
          }
        >
          {item.to === '/sessions' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ) : item.to === '/my-sessions' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : item.to === '/stats' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
            </svg>
          )}
          {item.label}
        </NavLink>
      ))}
      <button
        onClick={() => { void handleSignOut() }}
        className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium text-gray-400 transition"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Uitloggen
      </button>
    </nav>
  )
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <DesktopNav />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-5 sm:py-8 pb-24 md:pb-10">
        <Outlet />
      </main>
      <MobileBottomNav />
      <ToastContainer />
    </div>
  )
}

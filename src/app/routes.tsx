import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SessionsPage } from '@/features/sessions/pages/SessionsPage'
import { MySessionsPage } from '@/features/sessions/pages/MySessionsPage'
import { NewSessionPage } from '@/features/sessions/pages/NewSessionPage'
import { SessionDetailPage } from '@/features/sessions/pages/SessionDetailPage'
import { PromptsPage } from '@/features/prompts/pages/PromptsPage'
import { NewPromptPage } from '@/features/prompts/pages/NewPromptPage'
import { PromptDetailPage } from '@/features/prompts/pages/PromptDetailPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/sessions" replace />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="sessions/new" element={<NewSessionPage />} />
        <Route path="sessions/:id" element={<SessionDetailPage />} />
        <Route path="my-sessions" element={<MySessionsPage />} />
        <Route path="prompts" element={<PromptsPage />} />
        <Route path="prompts/new" element={<NewPromptPage />} />
        <Route path="prompts/:id" element={<PromptDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/sessions" replace />} />
    </Routes>
  )
}

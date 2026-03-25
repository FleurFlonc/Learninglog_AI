import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { AppRoutes } from './routes'

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

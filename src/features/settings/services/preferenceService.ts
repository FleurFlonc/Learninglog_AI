import type { ThemeMode } from '@/models/enums'

const THEME_KEY = 'learningsai_theme'

export interface UserPreferences {
  theme: ThemeMode
}

export const preferenceService = {
  getTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
    return 'system'
  },

  setTheme(theme: ThemeMode): void {
    localStorage.setItem(THEME_KEY, theme)
    applyTheme(theme)
  },

  getPreferences(): UserPreferences {
    return {
      theme: preferenceService.getTheme(),
    }
  },
}

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

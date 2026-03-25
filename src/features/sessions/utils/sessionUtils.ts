import type { LearningSession } from '@/models/session'
import type { SessionStatus, AIToolType } from '@/models/enums'

export function groupSessionsByDate(
  sessions: LearningSession[]
): Record<string, LearningSession[]> {
  return sessions.reduce<Record<string, LearningSession[]>>((acc, session) => {
    const date = session.createdAt.split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(session)
    return acc
  }, {})
}

export function countByStatus(
  sessions: LearningSession[]
): Record<SessionStatus, number> {
  const counts: Record<SessionStatus, number> = {
    success: 0,
    partial: 0,
    failed: 0,
  }
  for (const s of sessions) {
    counts[s.status]++
  }
  return counts
}

export function getMostUsedTool(
  sessions: LearningSession[]
): AIToolType | null {
  const counts: Partial<Record<AIToolType, number>> = {}
  for (const s of sessions) {
    for (const tool of s.aiTools ?? []) {
      counts[tool] = (counts[tool] ?? 0) + 1
    }
  }

  let max = 0
  let top: AIToolType | null = null
  for (const [tool, count] of Object.entries(counts) as [AIToolType, number][]) {
    if (count > max) {
      max = count
      top = tool
    }
  }
  return top
}

export function getSuccessRate(sessions: LearningSession[]): number {
  if (sessions.length === 0) return 0
  const successes = sessions.filter((s) => s.status === 'success').length
  return Math.round((successes / sessions.length) * 100)
}

export function getSessionsThisWeek(sessions: LearningSession[]): LearningSession[] {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  return sessions.filter(
    (s) => new Date(s.createdAt) >= startOfWeek
  )
}

export function averageDuration(sessions: LearningSession[]): number | null {
  const values = sessions
    .map((s) => s.durationMinutes)
    .filter((v): v is number => v !== undefined)

  if (values.length === 0) return null
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

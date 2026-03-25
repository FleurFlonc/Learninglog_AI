import type { LearningSession } from '@/models/session'
import type { AIToolType, TaskType } from '@/models/enums'
import {
  getMostUsedTool,
  getSuccessRate,
  getSessionsThisWeek,
  averageDuration,
} from '@/features/sessions/utils/sessionUtils'

export interface TeamAnalytics {
  totalSessions: number
  totalPrompts: number
  successRate: number
  mostUsedAITool: AIToolType | null
  topTaskType: TaskType | null
  averageDurationMinutes: number | null
  sessionsThisWeek: number
  sessionsLastWeek: number
  sessionsByUser: { userId: string; displayName: string; count: number }[]
  topPromptRating: number | null
}

export interface UserAnalytics {
  totalSessions: number
  successRate: number
  mostUsedAITool: AIToolType | null
  averageDurationMinutes: number | null
  sessionsThisWeek: number
  topTaskType: TaskType | null
}

function getTopTaskType(sessions: LearningSession[]): TaskType | null {
  const counts: Partial<Record<TaskType, number>> = {}
  for (const s of sessions) {
    if (s.taskType) {
      counts[s.taskType] = (counts[s.taskType] ?? 0) + 1
    }
  }

  let max = 0
  let top: TaskType | null = null
  for (const [type, count] of Object.entries(counts) as [TaskType, number][]) {
    if (count > max) {
      max = count
      top = type
    }
  }
  return top
}

function getSessionsLastWeek(sessions: LearningSession[]): LearningSession[] {
  const now = new Date()
  const startOfThisWeek = new Date(now)
  startOfThisWeek.setDate(now.getDate() - now.getDay())
  startOfThisWeek.setHours(0, 0, 0, 0)

  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

  return sessions.filter((s) => {
    const d = new Date(s.createdAt)
    return d >= startOfLastWeek && d < startOfThisWeek
  })
}

export const analyticsService = {
  calculateTeamAnalytics(
    sessions: LearningSession[],
    totalPrompts = 0
  ): TeamAnalytics {
    const sessionsByUserMap = new Map<
      string,
      { displayName: string; count: number }
    >()

    for (const s of sessions) {
      const existing = sessionsByUserMap.get(s.userId)
      if (existing) {
        existing.count++
      } else {
        sessionsByUserMap.set(s.userId, {
          displayName: s.userDisplayName,
          count: 1,
        })
      }
    }

    const sessionsByUser = Array.from(
      sessionsByUserMap.entries()
    ).map(([userId, { displayName, count }]) => ({ userId, displayName, count }))

    return {
      totalSessions: sessions.length,
      totalPrompts,
      successRate: getSuccessRate(sessions),
      mostUsedAITool: getMostUsedTool(sessions),
      topTaskType: getTopTaskType(sessions),
      averageDurationMinutes: averageDuration(sessions),
      sessionsThisWeek: getSessionsThisWeek(sessions).length,
      sessionsLastWeek: getSessionsLastWeek(sessions).length,
      sessionsByUser,
      topPromptRating: null,
    }
  },

  calculateUserAnalytics(
    sessions: LearningSession[],
    userId: string
  ): UserAnalytics {
    const userSessions = sessions.filter((s) => s.userId === userId)

    return {
      totalSessions: userSessions.length,
      successRate: getSuccessRate(userSessions),
      mostUsedAITool: getMostUsedTool(userSessions),
      averageDurationMinutes: averageDuration(userSessions),
      sessionsThisWeek: getSessionsThisWeek(userSessions).length,
      topTaskType: getTopTaskType(userSessions),
    }
  },
}

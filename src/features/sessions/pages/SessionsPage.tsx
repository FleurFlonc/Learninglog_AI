import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../store/sessionStore'
import { SessionCard } from '../components/SessionCard'
import { FilterBar } from '../components/FilterBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { EmptyState } from '@/components/feedback/EmptyState'
import type { SessionStatus, TaskType } from '@/models/enums'

function hasPromptData(session: { systemPrompt?: string; userPrompt?: string; promptGoal?: string; promptOutput?: string; improvedPrompt?: string }) {
  return !!(session.systemPrompt || session.userPrompt || session.promptGoal || session.promptOutput || session.improvedPrompt)
}

export function SessionsPage() {
  const navigate = useNavigate()
  const { sessions, isLoading, fetchAll } = useSessionStore()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all')
  const [taskTypeFilter, setTaskTypeFilter] = useState<TaskType | ''>('')
  const [promptOnly, setPromptOnly] = useState(false)

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const filtered = sessions.filter((s) => {
    if (query.trim()) {
      const q = query.toLowerCase()
      const matchesText =
        s.taskDescription.toLowerCase().includes(q) ||
        s.lessonLearned.toLowerCase().includes(q) ||
        s.systemPrompt?.toLowerCase().includes(q) ||
        s.userPrompt?.toLowerCase().includes(q) ||
        s.promptGoal?.toLowerCase().includes(q)
      if (!matchesText) return false
    }
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (taskTypeFilter && s.taskType !== taskTypeFilter) return false
    if (promptOnly && !hasPromptData(s)) return false
    return true
  })

  const hasActiveFilters = statusFilter !== 'all' || taskTypeFilter !== '' || promptOnly

  return (
    <div>
      <PageHeader
        title="Alle sessies"
        action={
          <button
            onClick={() => navigate('/sessions/new')}
            className="rounded-lg bg-sage-400 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-500 transition"
          >
            + Nieuwe sessie
          </button>
        }
      />

      <div className="mb-4">
        <input
          type="search"
          placeholder="Zoeken in sessies en prompts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
        />
      </div>

      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        taskTypeFilter={taskTypeFilter}
        onTaskTypeChange={setTaskTypeFilter}
        promptOnly={promptOnly}
        onPromptOnlyChange={setPromptOnly}
        resultCount={filtered.length}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={hasActiveFilters || query ? 'Geen resultaten' : 'Nog geen sessies'}
          description={
            hasActiveFilters || query
              ? 'Geen sessies gevonden voor deze filters.'
              : 'Wees de eerste om een sessie te loggen.'
          }
          action={
            hasActiveFilters || query ? (
              <button
                onClick={() => {
                  setStatusFilter('all')
                  setTaskTypeFilter('')
                  setPromptOnly(false)
                  setQuery('')
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Filters wissen
              </button>
            ) : (
              <button
                onClick={() => navigate('/sessions/new')}
                className="rounded-lg bg-sage-400 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-500 transition"
              >
                Eerste sessie loggen
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePromptStore } from '../store/promptStore'
import { PromptCard } from '../components/PromptCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { EmptyState } from '@/components/feedback/EmptyState'
import type { AIToolType, TaskType } from '@/models/enums'
import { taskTypeSelectOptions, aiToolFilterOptions } from '@/lib/labels'

const taskTypeOptions = taskTypeSelectOptions as { value: TaskType | ''; label: string }[]
const aiToolOptions = aiToolFilterOptions as { value: AIToolType | ''; label: string }[]

export function PromptsPage() {
  const navigate = useNavigate()
  const { prompts, isLoading, fetchAll } = usePromptStore()
  const [query, setQuery] = useState('')
  const [taskTypeFilter, setTaskTypeFilter] = useState<TaskType | ''>('')
  const [aiToolFilter, setAiToolFilter] = useState<AIToolType | ''>('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const filtered = prompts.filter((p) => {
    if (query.trim()) {
      const q = query.toLowerCase()
      const matches =
        p.title.toLowerCase().includes(q) ||
        p.goalSummary.toLowerCase().includes(q) ||
        p.userPromptSummary.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      if (!matches) return false
    }
    if (taskTypeFilter && p.taskType !== taskTypeFilter) return false
    if (aiToolFilter && !p.aiTools.includes(aiToolFilter)) return false
    if (favoritesOnly && !p.isFavorite) return false
    return true
  })

  const hasActiveFilters = taskTypeFilter !== '' || aiToolFilter !== '' || favoritesOnly

  function clearFilters() {
    setTaskTypeFilter('')
    setAiToolFilter('')
    setFavoritesOnly(false)
    setQuery('')
  }

  return (
    <div>
      <PageHeader
        title="Promptbibliotheek"
        action={
          <button
            onClick={() => navigate('/prompts/new')}
            className="rounded-lg bg-sage-400 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-500 transition"
          >
            + Nieuwe prompt
          </button>
        }
      />

      <div className="mb-4">
        <input
          type="search"
          placeholder="Zoeken in prompts, doelen en tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
        />
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <select
          value={taskTypeFilter}
          onChange={(e) => setTaskTypeFilter(e.target.value as TaskType | '')}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-sage-400"
        >
          {taskTypeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={aiToolFilter}
          onChange={(e) => setAiToolFilter(e.target.value as AIToolType | '')}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-sage-400"
        >
          {aiToolOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
            favoritesOnly
              ? 'border-sage-300 bg-sage-50 text-sage-700'
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          ★ Favorieten
        </button>

        {(hasActiveFilters || query) && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Wis filters
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} {filtered.length === 1 ? 'prompt' : 'prompts'}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={hasActiveFilters || query ? 'Geen resultaten' : 'Nog geen prompts'}
          description={
            hasActiveFilters || query
              ? 'Geen prompts gevonden voor deze filters.'
              : 'Voeg de eerste prompt toe aan de bibliotheek.'
          }
          action={
            hasActiveFilters || query ? (
              <button
                onClick={clearFilters}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Filters wissen
              </button>
            ) : (
              <button
                onClick={() => navigate('/prompts/new')}
                className="rounded-lg bg-sage-400 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-500 transition"
              >
                Eerste prompt toevoegen
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  )
}

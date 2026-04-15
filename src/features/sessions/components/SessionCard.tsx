import { useNavigate } from 'react-router-dom'
import type { LearningSession } from '@/models/session'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { toolLabels, taskTypeLabels } from '@/lib/labels'

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Kies het meest relevante promptveld om te previewen
function getPromptPreview(session: LearningSession): { label: string; text: string } | null {
  if (session.userPrompt) return { label: 'Gebruikersprompt', text: session.userPrompt }
  if (session.systemPrompt) return { label: 'Systeemprompt', text: session.systemPrompt }
  if (session.promptGoal) return { label: 'Doel', text: session.promptGoal }
  if (session.promptOutput) return { label: 'Output', text: session.promptOutput }
  if (session.improvedPrompt) return { label: 'Verbeterde prompt', text: session.improvedPrompt }
  return null
}

export function SessionCard({ session }: { session: LearningSession }) {
  const navigate = useNavigate()
  const promptPreview = getPromptPreview(session)

  return (
    <button
      onClick={() => navigate(`/sessions/${session.id}`)}
      className="w-full rounded-2xl bg-white p-5 shadow-sm text-left transition hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#1A1A1A] leading-snug">
          {truncate(session.taskDescription, 100)}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {session.isFavorite && (
            <svg className="h-4 w-4 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          )}
          {session.isPublic === false && (
            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Privé
            </span>
          )}
          <StatusBadge status={session.status} />
        </div>
      </div>

      {/* Les */}
      {session.lessonLearned && (
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          {truncate(session.lessonLearned, 100)}
        </p>
      )}

      {/* Prompt preview — alleen tonen als er promptdata is */}
      {promptPreview && (
        <div className="mt-3 rounded-lg border border-sage-100 bg-sage-50 px-3 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-600">
            {promptPreview.label}
          </span>
          <p className="mt-0.5 text-xs text-gray-600 leading-relaxed font-mono">
            {truncate(promptPreview.text, 120)}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400">
          {session.userDisplayName} · {formatDate(session.createdAt)}
        </span>

        {session.taskType && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {taskTypeLabels[session.taskType] ?? session.taskType}
          </span>
        )}

        {session.aiTools && session.aiTools.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {session.aiTools.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
              >
                {toolLabels[tool] ?? tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

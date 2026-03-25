import { useNavigate } from 'react-router-dom'
import type { PromptEntry } from '@/models/prompt'

const toolLabels: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  cursor: 'Cursor',
  gemini: 'Gemini',
  copilot: 'Copilot',
  other: 'Overig',
}

const taskTypeLabels: Record<string, string> = {
  debugging: 'Debugging',
  prompting: 'Prompting',
  writing: 'Schrijven',
  research: 'Onderzoek',
  automation: 'Automatisering',
  ideation: 'Ideevorming',
  ontwikkelen: 'Ontwikkelen',
  other: 'Overig',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-sm ${n <= rating ? 'text-sage-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

interface PromptCardProps {
  prompt: PromptEntry
}

export function PromptCard({ prompt }: PromptCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/prompts/${prompt.id}`)}
      className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">{prompt.title}</h3>
            {prompt.isFavorite && (
              <span className="text-sage-400 text-sm leading-none" title="Favoriet">★</span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{prompt.goalSummary}</p>
        </div>

        {prompt.promptRating !== undefined && (
          <div className="shrink-0">
            <StarRating rating={prompt.promptRating} />
          </div>
        )}
      </div>

      {prompt.userPromptSummary && (
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Gebruikersprompt</p>
          <p className="text-xs text-gray-600 line-clamp-2 font-mono">{prompt.userPromptSummary}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {prompt.aiTools.map((tool) => (
          <span
            key={tool}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
          >
            {toolLabels[tool] ?? tool}
          </span>
        ))}
        {prompt.taskType && (
          <span className="rounded-full bg-sage-50 px-2.5 py-1 text-xs text-sage-700 border border-sage-100">
            {taskTypeLabels[prompt.taskType] ?? prompt.taskType}
          </span>
        )}
        {prompt.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-sage-100 px-2.5 py-1 text-xs text-sage-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        {prompt.userDisplayName} · {new Date(prompt.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  )
}

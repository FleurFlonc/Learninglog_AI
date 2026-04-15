import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePromptStore } from '../store/promptStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { PromptSchema } from '../schemas/promptSchema'
import type { PromptFormValues } from '../schemas/promptSchema'
import type { PromptEntry } from '@/models/prompt'
import type { AIToolType, TaskType } from '@/models/enums'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { FormField, inputClass } from '@/components/forms/FormField'
import { SelectField } from '@/components/forms/SelectField'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { TagsField } from '@/components/forms/TagsField'
import { RatingField } from '@/components/forms/RatingField'
import { toolLabels, taskTypeLabels, aiToolOptions, taskTypeOptions } from '@/lib/labels'
import { useToastStore } from '@/features/feedback/toastStore'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-[#1A1A1A] whitespace-pre-wrap font-mono">
        {value}
      </dd>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-[#1A1A1A] whitespace-pre-wrap">{value}</dd>
    </div>
  )
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</span>
      <div className="flex-1 border-t border-gray-100" />
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`text-base ${n <= rating ? 'text-sage-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
  )
}

function ViewMode({ prompt, isOwner, onEdit, onDelete }: {
  prompt: PromptEntry
  isOwner: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#1A1A1A]">{prompt.title}</h2>
            {prompt.isFavorite && <span className="text-sage-400">★</span>}
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {prompt.userDisplayName} · {formatDate(prompt.createdAt)}
          </p>
        </div>
        {prompt.promptRating !== undefined && (
          <div className="shrink-0">
            <StarRating rating={prompt.promptRating} />
          </div>
        )}
      </div>

      <dl className="space-y-5">
        <SectionDivider title="Doel" />
        <DetailRow label="Doel (samenvatting)" value={prompt.goalSummary} />
        {prompt.goalFull && <DetailRow label="Doel (volledig)" value={prompt.goalFull} />}

        {(prompt.systemPromptSummary || prompt.systemPromptFull || prompt.userPromptSummary || prompt.userPromptFull) && (
          <>
            <SectionDivider title="Prompt" />
            {prompt.systemPromptSummary && <DetailRow label="Systeemprompt (samenvatting)" value={prompt.systemPromptSummary} />}
            {prompt.systemPromptFull && <DetailBlock label="Systeemprompt (volledig)" value={prompt.systemPromptFull} />}
            <DetailRow label="Gebruikersprompt (samenvatting)" value={prompt.userPromptSummary} />
            {prompt.userPromptFull && <DetailBlock label="Gebruikersprompt (volledig)" value={prompt.userPromptFull} />}
          </>
        )}

        {(prompt.outputSummary || prompt.outputFull) && (
          <>
            <SectionDivider title="Output" />
            {prompt.outputSummary && <DetailRow label="Output (samenvatting)" value={prompt.outputSummary} />}
            {prompt.outputFull && <DetailBlock label="Output (volledig)" value={prompt.outputFull} />}
          </>
        )}

        <SectionDivider title="Meta" />

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">AI tools</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {prompt.aiTools.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                {toolLabels[t] ?? t}
              </span>
            ))}
          </dd>
        </div>

        {prompt.taskType && (
          <DetailRow label="Type taak" value={taskTypeLabels[prompt.taskType] ?? prompt.taskType} />
        )}

        {prompt.tags && prompt.tags.length > 0 && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Tags</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {prompt.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-sage-100 px-2.5 py-1 text-xs text-sage-700">
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {isOwner && (
        <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6">
          <button
            onClick={onEdit}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Bewerken
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            Verwijderen
          </button>
        </div>
      )}
    </div>
  )
}

function EditMode({ prompt, onCancel, onSave }: {
  prompt: PromptEntry
  onCancel: () => void
  onSave: (data: PromptFormValues) => Promise<void>
}) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PromptFormValues>({
    resolver: zodResolver(PromptSchema),
    defaultValues: {
      title: prompt.title,
      aiTools: prompt.aiTools as AIToolType[],
      taskType: prompt.taskType as TaskType | undefined,
      goalSummary: prompt.goalSummary,
      goalFull: prompt.goalFull ?? '',
      systemPromptSummary: prompt.systemPromptSummary ?? '',
      systemPromptFull: prompt.systemPromptFull ?? '',
      userPromptSummary: prompt.userPromptSummary,
      userPromptFull: prompt.userPromptFull ?? '',
      outputSummary: prompt.outputSummary ?? '',
      outputFull: prompt.outputFull ?? '',
      promptRating: prompt.promptRating,
      tags: prompt.tags ?? [],
      isFavorite: prompt.isFavorite ?? false,
    },
  })

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
      <h2 className="mb-6 text-base font-semibold text-[#1A1A1A]">Prompt bewerken</h2>
      <form onSubmit={(e) => { void handleSubmit(onSave)(e) }} className="space-y-5">

        <SectionDivider title="Basisgegevens" />

        <FormField label="Titel" htmlFor="title" error={errors.title?.message} required>
          <input id="title" {...register('title')} className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="AI tools" htmlFor="aiTools" error={errors.aiTools?.message} required>
            <Controller name="aiTools" control={control}
              render={({ field }) => (
                <MultiSelectField options={aiToolOptions} value={field.value ?? []} onChange={field.onChange} />
              )} />
          </FormField>
          <FormField label="Type taak" htmlFor="taskType">
            <SelectField id="taskType" {...register('taskType')} options={taskTypeOptions} placeholder="Optioneel..." />
          </FormField>
        </div>

        <SectionDivider title="Doel" />

        <FormField label="Doel (samenvatting)" htmlFor="goalSummary" error={errors.goalSummary?.message} required>
          <input id="goalSummary" {...register('goalSummary')} className={inputClass} />
        </FormField>

        <FormField label="Doel (volledig)" htmlFor="goalFull">
          <textarea id="goalFull" {...register('goalFull')} rows={3} className={inputClass} />
        </FormField>

        <SectionDivider title="Prompt" />

        <FormField label="Systeemprompt (samenvatting)" htmlFor="systemPromptSummary">
          <input id="systemPromptSummary" {...register('systemPromptSummary')} className={inputClass} />
        </FormField>

        <FormField label="Systeemprompt (volledig)" htmlFor="systemPromptFull">
          <textarea id="systemPromptFull" {...register('systemPromptFull')} rows={4} className={inputClass} />
        </FormField>

        <FormField label="Gebruikersprompt (samenvatting)" htmlFor="userPromptSummary" error={errors.userPromptSummary?.message} required>
          <input id="userPromptSummary" {...register('userPromptSummary')} className={inputClass} />
        </FormField>

        <FormField label="Gebruikersprompt (volledig)" htmlFor="userPromptFull">
          <textarea id="userPromptFull" {...register('userPromptFull')} rows={5} className={inputClass} />
        </FormField>

        <SectionDivider title="Output" />

        <FormField label="Output (samenvatting)" htmlFor="outputSummary">
          <input id="outputSummary" {...register('outputSummary')} className={inputClass} />
        </FormField>

        <FormField label="Output (volledig)" htmlFor="outputFull">
          <textarea id="outputFull" {...register('outputFull')} rows={4} className={inputClass} />
        </FormField>

        <SectionDivider title="Meta" />

        <FormField label="Beoordeling" htmlFor="promptRating">
          <Controller name="promptRating" control={control}
            render={({ field }) => (
              <RatingField value={field.value} onChange={field.onChange} />
            )} />
        </FormField>

        <FormField label="Tags" htmlFor="tags">
          <Controller name="tags" control={control}
            render={({ field }) => <TagsField value={field.value ?? []} onChange={field.onChange} />} />
        </FormField>

        <Controller name="isFavorite" control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                field.value
                  ? 'border-sage-300 bg-sage-50 text-sage-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>★</span>
              <span>{field.value ? 'Favoriet' : 'Markeer als favoriet'}</span>
            </button>
          )} />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Annuleren
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-sage-400 px-5 py-2 text-sm font-semibold text-white hover:bg-sage-500 disabled:opacity-60 transition"
          >
            {isSubmitting ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function PromptDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { prompts, fetchAll, update, remove } = usePromptStore()
  const user = useAuthStore((s) => s.user)
  const toast = useToastStore((s) => s.show)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (prompts.length === 0) void fetchAll()
  }, [fetchAll, prompts.length])

  const prompt = prompts.find((p) => p.id === id)
  const isOwner = !!user && !!prompt && prompt.userId === user.id

  useEffect(() => {
    if (prompts.length > 0 && !prompt) setNotFound(true)
  }, [prompts, prompt])

  async function handleSave(data: PromptFormValues) {
    if (!id) return
    await update({ id, ...data })
    toast('Wijzigingen opgeslagen')
    setIsEditing(false)
  }

  async function handleDelete() {
    if (!id) return
    if (!window.confirm('Weet je zeker dat je deze prompt wilt verwijderen?')) return
    setIsDeleting(true)
    try {
      await remove(id)
      toast('Prompt verwijderd')
      navigate('/prompts', { replace: true })
    } finally {
      setIsDeleting(false)
    }
  }

  if (notFound) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p>Prompt niet gevonden.</p>
        <button onClick={() => navigate('/prompts')}
          className="mt-4 text-sm text-sage-500 hover:underline">
          Terug naar bibliotheek
        </button>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full md:max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A1A1A] transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug
      </button>

      {isDeleting ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : isEditing ? (
        <EditMode prompt={prompt} onCancel={() => setIsEditing(false)} onSave={handleSave} />
      ) : (
        <ViewMode
          prompt={prompt}
          isOwner={isOwner}
          onEdit={() => setIsEditing(true)}
          onDelete={() => { void handleDelete() }}
        />
      )}
    </div>
  )
}

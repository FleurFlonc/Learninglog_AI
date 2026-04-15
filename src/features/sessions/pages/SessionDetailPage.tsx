import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSessionStore } from '../store/sessionStore'
import { usePromptStore } from '@/features/prompts/store/promptStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { SessionSchema } from '../schemas/sessionSchema'
import type { SessionFormValues } from '../schemas/sessionSchema'
import type { LearningSession } from '@/models/session'
import { StatusBadge } from '@/components/feedback/StatusBadge'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { FormField, inputClass } from '@/components/forms/FormField'
import { SelectField } from '@/components/forms/SelectField'
import { TagsField } from '@/components/forms/TagsField'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import type { AIToolType, SessionStatus, TaskType, ProblemCategory, ResolutionType } from '@/models/enums'
import { toolLabels, taskTypeLabels, problemCategoryLabels, resolutionTypeLabels, statusOptions, aiToolOptions, taskTypeOptions, problemCategoryOptions, resolutionTypeOptions, getLabel } from '@/lib/labels'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
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

function ViewMode({ session, isOwner, onEdit, onDelete }: {
  session: LearningSession
  isOwner: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const hasPromptData = !!(
    session.promptGoal || session.systemPrompt || session.userPrompt ||
    session.promptOutput || session.improvedPrompt
  )

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#1A1A1A]">{session.taskDescription}</h2>
          <p className="mt-1 text-xs text-gray-400">
            {session.userDisplayName} · {formatDate(session.createdAt)}
          </p>
        </div>
        <StatusBadge status={session.status} />
      </div>

      <dl className="space-y-5">
        <DetailRow label="Les geleerd" value={session.lessonLearned} />
        {session.whatWentWrong && <DetailRow label="Wat ging mis" value={session.whatWentWrong} />}
        {session.resolution && <DetailRow label="Oplossing" value={session.resolution} />}
        {session.reflectionNotes && <DetailRow label="Reflectie" value={session.reflectionNotes} />}

        {session.aiTools && session.aiTools.length > 0 && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">AI tools</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {session.aiTools.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  {toolLabels[t] ?? t}
                </span>
              ))}
            </dd>
          </div>
        )}

        {session.taskType && <DetailRow label="Type taak" value={getLabel(taskTypeLabels, session.taskType)} />}
        {session.problemCategory && <DetailRow label="Probleemcategorie" value={getLabel(problemCategoryLabels, session.problemCategory)} />}
        {session.resolutionType && <DetailRow label="Type oplossing" value={getLabel(resolutionTypeLabels, session.resolutionType)} />}


        {session.tags && session.tags.length > 0 && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Tags</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {session.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-sage-100 px-2.5 py-1 text-xs text-sage-700">
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}

        {/* Prompt sectie */}
        {hasPromptData && (
          <>
            <SectionDivider title="Prompt details" />
            {session.promptGoal && <DetailRow label="Doel van de prompt" value={session.promptGoal} />}
            {session.systemPrompt && <DetailRow label="Systeemprompt" value={session.systemPrompt} />}
            {session.userPrompt && <DetailRow label="Gebruikersprompt" value={session.userPrompt} />}
            {session.promptOutput && <DetailRow label="Output van de AI" value={session.promptOutput} />}
            {session.improvedPrompt && <DetailRow label="Verbeterde prompt" value={session.improvedPrompt} />}
          </>
        )}
      </dl>

      {isOwner && (
        <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6">
          <button onClick={onEdit}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Bewerken
          </button>
          <button onClick={onDelete}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition">
            Verwijderen
          </button>
        </div>
      )}
    </div>
  )
}

function EditMode({ session, onCancel, onSave }: {
  session: LearningSession
  onCancel: () => void
  onSave: (data: SessionFormValues) => Promise<void>
}) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SessionFormValues>({
    resolver: zodResolver(SessionSchema),
    defaultValues: {
      taskDescription: session.taskDescription,
      status: session.status as SessionStatus,
      lessonLearned: session.lessonLearned,
      whatWentWrong: session.whatWentWrong ?? '',
      resolution: session.resolution ?? '',
      reflectionNotes: session.reflectionNotes ?? '',
      aiTools: (session.aiTools as AIToolType[] | undefined) ?? [],
      taskType: session.taskType as TaskType | undefined,
      problemCategory: session.problemCategory as ProblemCategory | undefined,
      resolutionType: session.resolutionType as ResolutionType | undefined,
      promptGoal: session.promptGoal ?? '',
      systemPrompt: session.systemPrompt ?? '',
      userPrompt: session.userPrompt ?? '',
      promptOutput: session.promptOutput ?? '',
      improvedPrompt: session.improvedPrompt ?? '',
      tags: session.tags ?? [],
      isFavorite: session.isFavorite,
      isPublic: session.isPublic ?? true,
      saveToLibrary: false,
    },
  })

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
      <h2 className="mb-6 text-base font-semibold text-[#1A1A1A]">Sessie bewerken</h2>
      <form onSubmit={(e) => { void handleSubmit(onSave)(e) }} className="space-y-5">

        <FormField label="Wat wilde je bereiken?" htmlFor="taskDescription" error={errors.taskDescription?.message} required>
          <textarea id="taskDescription" {...register('taskDescription')} rows={3} className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Resultaat" htmlFor="status" error={errors.status?.message} required>
            <SelectField id="status" {...register('status')} options={statusOptions} />
          </FormField>
          <FormField label="Type taak" htmlFor="taskType">
            <SelectField id="taskType" {...register('taskType')} options={taskTypeOptions} placeholder="Optioneel..." />
          </FormField>
        </div>

        <FormField label="Wat heb je geleerd?" htmlFor="lessonLearned" error={errors.lessonLearned?.message} required>
          <textarea id="lessonLearned" {...register('lessonLearned')} rows={4} className={inputClass} />
        </FormField>

        <FormField label="Wat ging er mis?" htmlFor="whatWentWrong">
          <textarea id="whatWentWrong" {...register('whatWentWrong')} rows={2} className={inputClass} />
        </FormField>

        <FormField label="Oplossing" htmlFor="resolution">
          <textarea id="resolution" {...register('resolution')} rows={2} className={inputClass} />
        </FormField>

        <FormField label="Reflectie" htmlFor="reflectionNotes">
          <textarea id="reflectionNotes" {...register('reflectionNotes')} rows={2} className={inputClass} />
        </FormField>

        <FormField label="AI tools" htmlFor="aiTools">
          <Controller name="aiTools" control={control}
            render={({ field }) => (
              <MultiSelectField options={aiToolOptions} value={field.value ?? []} onChange={field.onChange} />
            )} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Probleemcategorie" htmlFor="problemCategory">
            <SelectField id="problemCategory" {...register('problemCategory')} options={problemCategoryOptions} placeholder="Optioneel..." />
          </FormField>
          <FormField label="Type oplossing" htmlFor="resolutionType">
            <SelectField id="resolutionType" {...register('resolutionType')} options={resolutionTypeOptions} placeholder="Optioneel..." />
          </FormField>
        </div>

        <FormField label="Tags" htmlFor="tags">
          <Controller name="tags" control={control}
            render={({ field }) => <TagsField value={field.value ?? []} onChange={field.onChange} />} />
        </FormField>

        {/* Prompt sectie */}
        <SectionDivider title="Prompt details (optioneel)" />

        <FormField label="Doel van de prompt" htmlFor="promptGoal">
          <textarea id="promptGoal" {...register('promptGoal')} rows={2}
            placeholder="Wat wilde je bereiken met deze prompt?" className={inputClass} />
        </FormField>

        <FormField label="Systeemprompt" htmlFor="systemPrompt">
          <textarea id="systemPrompt" {...register('systemPrompt')} rows={4}
            placeholder="De systeemprompt die je hebt gebruikt..." className={inputClass} />
        </FormField>

        <FormField label="Gebruikersprompt" htmlFor="userPrompt">
          <textarea id="userPrompt" {...register('userPrompt')} rows={4}
            placeholder="De prompt die je hebt ingevoerd..." className={inputClass} />
        </FormField>

        <FormField label="Output van de AI" htmlFor="promptOutput">
          <textarea id="promptOutput" {...register('promptOutput')} rows={4}
            placeholder="Wat was de uitkomst of het antwoord..." className={inputClass} />
        </FormField>

        <FormField label="Verbeterde prompt" htmlFor="improvedPrompt">
          <textarea id="improvedPrompt" {...register('improvedPrompt')} rows={4}
            placeholder="Hoe zou je de prompt achteraf verbeteren?" className={inputClass} />
        </FormField>

        {!session.promptId && (
          <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              {...register('saveToLibrary')}
              className="h-4 w-4 rounded border-gray-300 accent-[#7a9e87]"
            />
            <span className="text-sm text-gray-700">Opslaan in promptbibliotheek</span>
          </label>
        )}
        {session.promptId && (
          <p className="text-sm text-sage-600 flex items-center gap-1.5 pt-1">
            <span>✓</span> Staat al in de promptbibliotheek
          </p>
        )}

        <label className="flex items-center justify-between gap-3 cursor-pointer select-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-[#1A1A1A]">Deel met team</p>
            <p className="text-xs text-gray-400">Zichtbaar voor alle teamleden</p>
          </div>
          <input
            type="checkbox"
            {...register('isPublic')}
            className="h-4 w-4 rounded border-gray-300 accent-[#7a9e87]"
          />
        </label>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Annuleren
          </button>
          <button type="submit" disabled={isSubmitting}
            className="rounded-lg bg-sage-400 px-5 py-2 text-sm font-semibold text-white hover:bg-sage-500 disabled:opacity-60 transition">
            {isSubmitting ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { sessions, fetchAll, update, remove } = useSessionStore()
  const { create: createPrompt } = usePromptStore()
  const user = useAuthStore((s) => s.user)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (sessions.length === 0) void fetchAll()
  }, [fetchAll, sessions.length])

  const session = sessions.find((s) => s.id === id)
  const isOwner = !!user && !!session && session.userId === user.id

  useEffect(() => {
    if (sessions.length > 0 && !session) setNotFound(true)
  }, [sessions, session])

  async function handleSave(data: SessionFormValues) {
    if (!id || !session) return
    await update({ id, ...data })

    if (data.saveToLibrary && !session.promptId && data.userPrompt && data.userPrompt.length >= 5 && user) {
      const goalText = data.promptGoal || data.taskDescription
      await createPrompt({
        title: data.taskDescription.slice(0, 100),
        aiTools: data.aiTools && data.aiTools.length > 0 ? data.aiTools : ['other'],
        taskType: data.taskType,
        goalSummary: goalText.slice(0, 200),
        goalFull: data.promptGoal,
        systemPromptSummary: data.systemPrompt ? data.systemPrompt.slice(0, 500) : undefined,
        systemPromptFull: data.systemPrompt,
        userPromptSummary: data.userPrompt.slice(0, 500),
        userPromptFull: data.userPrompt,
        outputSummary: data.promptOutput ? data.promptOutput.slice(0, 500) : undefined,
        outputFull: data.promptOutput,
        sessionId: id,
        tags: data.tags,
      }, user)
    }

    setIsEditing(false)
  }

  async function handleDelete() {
    if (!id) return
    if (!window.confirm('Weet je zeker dat je deze sessie wilt verwijderen?')) return
    setIsDeleting(true)
    try {
      await remove(id)
      navigate('/sessions', { replace: true })
    } finally {
      setIsDeleting(false)
    }
  }

  if (notFound) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p>Sessie niet gevonden.</p>
        <button onClick={() => navigate('/sessions')}
          className="mt-4 text-sm text-sage-500 hover:underline">
          Terug naar overzicht
        </button>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full md:max-w-3xl">
      {/* Terug */}
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
        <EditMode session={session} onCancel={() => setIsEditing(false)} onSave={handleSave} />
      ) : (
        <ViewMode session={session} isOwner={isOwner}
          onEdit={() => setIsEditing(true)} onDelete={() => { void handleDelete() }} />
      )}
    </div>
  )
}

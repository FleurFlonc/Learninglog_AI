import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSessionStore } from '../store/sessionStore'
import { usePromptStore } from '@/features/prompts/store/promptStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { SessionSchema, QuickEntrySchema } from '../schemas/sessionSchema'
import type { SessionFormValues, QuickEntryFormValues } from '../schemas/sessionSchema'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField, inputClass } from '@/components/forms/FormField'
import { SelectField } from '@/components/forms/SelectField'
import { TagsField } from '@/components/forms/TagsField'
import { MultiSelectField } from '@/components/forms/MultiSelectField'

const statusOptions = [
  { value: 'success', label: 'Gelukt' },
  { value: 'partial', label: 'Deels gelukt' },
  { value: 'failed', label: 'Mislukt' },
]

const aiToolOptions = [
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'copilot', label: 'Copilot' },
  { value: 'other', label: 'Overig' },
]

const taskTypeOptions = [
  { value: 'debugging', label: 'Debugging' },
  { value: 'prompting', label: 'Prompting' },
  { value: 'writing', label: 'Schrijven' },
  { value: 'research', label: 'Onderzoek' },
  { value: 'automation', label: 'Automatisering' },
  { value: 'ideation', label: 'Ideevorming' },
  { value: 'ontwikkelen', label: 'Ontwikkelen' },
  { value: 'other', label: 'Overig' },
]

const problemCategoryOptions = [
  { value: 'prompting', label: 'Prompting' },
  { value: 'technical', label: 'Technisch' },
  { value: 'context', label: 'Context' },
  { value: 'output_quality', label: 'Output kwaliteit' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'unknown', label: 'Onbekend' },
]

const resolutionTypeOptions = [
  { value: 'reprompt', label: 'Opnieuw geprompt' },
  { value: 'more_context', label: 'Meer context' },
  { value: 'changed_tool', label: 'Andere tool' },
  { value: 'manual_fix', label: 'Handmatig opgelost' },
  { value: 'code_fix', label: 'Code fix' },
  { value: 'research', label: 'Onderzoek' },
  { value: 'other', label: 'Overig' },
]

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</span>
      <div className="flex-1 border-t border-gray-100" />
    </div>
  )
}

function QuickForm({ onSave }: { onSave: (data: QuickEntryFormValues) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<QuickEntryFormValues>({
    resolver: zodResolver(QuickEntrySchema),
  })

  return (
    <form onSubmit={(e) => { void handleSubmit(onSave)(e) }} className="space-y-5">
      <FormField label="Wat wilde je bereiken?" htmlFor="taskDescription" error={errors.taskDescription?.message} required>
        <textarea
          id="taskDescription"
          {...register('taskDescription')}
          rows={3}
          placeholder="Beschrijf de taak of het doel van de sessie..."
          className={inputClass}
        />
      </FormField>

      <FormField label="Resultaat" htmlFor="status" error={errors.status?.message} required>
        <SelectField
          id="status"
          {...register('status')}
          options={statusOptions}
          placeholder="Kies een resultaat..."
        />
      </FormField>

      <FormField label="Wat heb je geleerd?" htmlFor="lessonLearned" error={errors.lessonLearned?.message} required>
        <textarea
          id="lessonLearned"
          {...register('lessonLearned')}
          rows={4}
          placeholder="Beschrijf de les die je hebt geleerd..."
          className={inputClass}
        />
      </FormField>

      <label className="flex items-center justify-between gap-3 cursor-pointer select-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">Deel met team</p>
          <p className="text-xs text-gray-400">Zichtbaar voor alle teamleden</p>
        </div>
        <input
          type="checkbox"
          {...register('isPublic')}
          defaultChecked={true}
          className="h-4 w-4 rounded border-gray-300 accent-[#7a9e87]"
        />
      </label>

      <SubmitBar isSubmitting={isSubmitting} />
    </form>
  )
}

function ExtendedForm({ onSave }: { onSave: (data: SessionFormValues) => Promise<void> }) {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SessionFormValues>({
    resolver: zodResolver(SessionSchema),
    defaultValues: { aiTools: [], tags: [] },
  })

  return (
    <form onSubmit={(e) => { void handleSubmit(onSave)(e) }} className="space-y-5">

      <SectionDivider title="Sessie" />

      <FormField label="Wat wilde je bereiken?" htmlFor="taskDescription" error={errors.taskDescription?.message} required>
        <textarea id="taskDescription" {...register('taskDescription')} rows={3}
          placeholder="Beschrijf de taak of het doel van de sessie..." className={inputClass} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Resultaat" htmlFor="status" error={errors.status?.message} required>
          <SelectField id="status" {...register('status')} options={statusOptions} placeholder="Kies een resultaat..." />
        </FormField>
        <FormField label="Type taak" htmlFor="taskType">
          <SelectField id="taskType" {...register('taskType')} options={taskTypeOptions} placeholder="Optioneel..." />
        </FormField>
      </div>

      <FormField label="Wat heb je geleerd?" htmlFor="lessonLearned" error={errors.lessonLearned?.message} required>
        <textarea id="lessonLearned" {...register('lessonLearned')} rows={4}
          placeholder="Beschrijf de les die je hebt geleerd..." className={inputClass} />
      </FormField>

      <FormField label="Wat ging er mis?" htmlFor="whatWentWrong">
        <textarea id="whatWentWrong" {...register('whatWentWrong')} rows={2}
          placeholder="Optioneel..." className={inputClass} />
      </FormField>

      <FormField label="Hoe heb je het opgelost?" htmlFor="resolution">
        <textarea id="resolution" {...register('resolution')} rows={2}
          placeholder="Optioneel..." className={inputClass} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Probleemcategorie" htmlFor="problemCategory">
          <SelectField id="problemCategory" {...register('problemCategory')} options={problemCategoryOptions} placeholder="Optioneel..." />
        </FormField>
        <FormField label="Type oplossing" htmlFor="resolutionType">
          <SelectField id="resolutionType" {...register('resolutionType')} options={resolutionTypeOptions} placeholder="Optioneel..." />
        </FormField>
      </div>

      <FormField label="AI tools gebruikt" htmlFor="aiTools">
        <Controller name="aiTools" control={control}
          render={({ field }) => (
            <MultiSelectField options={aiToolOptions} value={field.value ?? []}
              onChange={field.onChange} />
          )} />
      </FormField>

      <FormField label="Reflectie" htmlFor="reflectionNotes">
        <textarea id="reflectionNotes" {...register('reflectionNotes')} rows={2}
          placeholder="Vrije notities..." className={inputClass} />
      </FormField>

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

      <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          {...register('saveToLibrary')}
          className="h-4 w-4 rounded border-gray-300 accent-[#7a9e87]"
        />
        <span className="text-sm text-gray-700">Opslaan in promptbibliotheek</span>
      </label>

      <label className="flex items-center justify-between gap-3 cursor-pointer select-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">Deel met team</p>
          <p className="text-xs text-gray-400">Zichtbaar voor alle teamleden</p>
        </div>
        <input
          type="checkbox"
          {...register('isPublic')}
          defaultChecked={true}
          className="h-4 w-4 rounded border-gray-300 accent-[#7a9e87]"
        />
      </label>

      <SubmitBar isSubmitting={isSubmitting} />
    </form>
  )
}

function SubmitBar({ isSubmitting }: { isSubmitting: boolean }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
      <button type="button" onClick={() => navigate(-1)}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
        Annuleren
      </button>
      <button type="submit" disabled={isSubmitting}
        className="rounded-lg bg-sage-400 px-5 py-2 text-sm font-semibold text-white hover:bg-sage-500 disabled:opacity-60 transition">
        {isSubmitting ? 'Opslaan...' : 'Sessie opslaan'}
      </button>
    </div>
  )
}

export function NewSessionPage() {
  const [tab, setTab] = useState<'quick' | 'extended'>('quick')
  const navigate = useNavigate()
  const { create } = useSessionStore()
  const { create: createPrompt } = usePromptStore()
  const user = useAuthStore((s) => s.user)

  async function handleQuickSave(data: QuickEntryFormValues) {
    if (!user) return
    await create({ ...data, isPublic: data.isPublic ?? true }, user)
    navigate('/sessions')
  }

  async function handleExtendedSave(data: SessionFormValues) {
    if (!user) return
    const session = await create(data, user)

    if (data.saveToLibrary && data.userPrompt && data.userPrompt.length >= 5) {
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
        sessionId: session.id,
        tags: data.tags,
      }, user)
    }

    navigate('/sessions')
  }

  return (
    <div className="w-full md:max-w-3xl">
      <PageHeader title="Nieuwe sessie" />

      {/* Tabbladen */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1 w-fit">
        {(['quick', 'extended'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-gray-500 hover:text-[#1A1A1A]'
            }`}
          >
            {t === 'quick' ? 'Snelle invoer' : 'Uitgebreid'}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
        {tab === 'quick' ? (
          <QuickForm onSave={handleQuickSave} />
        ) : (
          <ExtendedForm onSave={handleExtendedSave} />
        )}
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePromptStore } from '../store/promptStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { PromptSchema } from '../schemas/promptSchema'
import type { PromptFormValues } from '../schemas/promptSchema'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormField, inputClass } from '@/components/forms/FormField'
import { SelectField } from '@/components/forms/SelectField'
import { MultiSelectField } from '@/components/forms/MultiSelectField'
import { TagsField } from '@/components/forms/TagsField'
import { RatingField } from '@/components/forms/RatingField'

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

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</span>
      <div className="flex-1 border-t border-gray-100" />
    </div>
  )
}

export function NewPromptPage() {
  const navigate = useNavigate()
  const { create } = usePromptStore()
  const user = useAuthStore((s) => s.user)

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<PromptFormValues>({
    resolver: zodResolver(PromptSchema),
    defaultValues: { aiTools: [], tags: [], isFavorite: false },
  })

  async function handleSave(data: PromptFormValues) {
    if (!user) return
    const prompt = await create(data, user)
    navigate(`/prompts/${prompt.id}`, { replace: true })
  }

  return (
    <div className="w-full md:max-w-3xl">
      <PageHeader title="Nieuwe prompt" />

      <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
        <form onSubmit={(e) => { void handleSubmit(handleSave)(e) }} className="space-y-5">

          <SectionDivider title="Basisgegevens" />

          <FormField label="Titel" htmlFor="title" error={errors.title?.message} required>
            <input
              id="title"
              {...register('title')}
              placeholder="Geef de prompt een herkenbare naam..."
              className={inputClass}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="AI tools" htmlFor="aiTools" error={errors.aiTools?.message} required>
              <Controller name="aiTools" control={control}
                render={({ field }) => (
                  <MultiSelectField
                    options={aiToolOptions}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                )} />
            </FormField>

            <FormField label="Type taak" htmlFor="taskType">
              <SelectField
                id="taskType"
                {...register('taskType')}
                options={taskTypeOptions}
                placeholder="Optioneel..."
              />
            </FormField>
          </div>

          <SectionDivider title="Doel" />

          <FormField label="Doel (samenvatting)" htmlFor="goalSummary" error={errors.goalSummary?.message} required>
            <input
              id="goalSummary"
              {...register('goalSummary')}
              placeholder="Wat wilde je bereiken? (max. 200 tekens)"
              className={inputClass}
            />
          </FormField>

          <FormField label="Doel (volledig)" htmlFor="goalFull">
            <textarea
              id="goalFull"
              {...register('goalFull')}
              rows={3}
              placeholder="Optioneel: uitgebreide beschrijving..."
              className={inputClass}
            />
          </FormField>

          <SectionDivider title="Prompt" />

          <FormField label="Systeemprompt (samenvatting)" htmlFor="systemPromptSummary">
            <input
              id="systemPromptSummary"
              {...register('systemPromptSummary')}
              placeholder="Korte omschrijving van de systeemprompt..."
              className={inputClass}
            />
          </FormField>

          <FormField label="Systeemprompt (volledig)" htmlFor="systemPromptFull">
            <textarea
              id="systemPromptFull"
              {...register('systemPromptFull')}
              rows={4}
              placeholder="De volledige systeemprompt..."
              className={inputClass}
            />
          </FormField>

          <FormField label="Gebruikersprompt (samenvatting)" htmlFor="userPromptSummary" error={errors.userPromptSummary?.message} required>
            <input
              id="userPromptSummary"
              {...register('userPromptSummary')}
              placeholder="Korte omschrijving van de prompt... (max. 500 tekens)"
              className={inputClass}
            />
          </FormField>

          <FormField label="Gebruikersprompt (volledig)" htmlFor="userPromptFull">
            <textarea
              id="userPromptFull"
              {...register('userPromptFull')}
              rows={5}
              placeholder="De volledige prompt..."
              className={inputClass}
            />
          </FormField>

          <SectionDivider title="Output" />

          <FormField label="Output (samenvatting)" htmlFor="outputSummary">
            <input
              id="outputSummary"
              {...register('outputSummary')}
              placeholder="Korte omschrijving van het resultaat..."
              className={inputClass}
            />
          </FormField>

          <FormField label="Output (volledig)" htmlFor="outputFull">
            <textarea
              id="outputFull"
              {...register('outputFull')}
              rows={4}
              placeholder="De volledige output van de AI..."
              className={inputClass}
            />
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
              render={({ field }) => (
                <TagsField value={field.value ?? []} onChange={field.onChange} />
              )} />
          </FormField>

          <div className="flex items-center gap-2">
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
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-sage-400 px-5 py-2 text-sm font-semibold text-white hover:bg-sage-500 disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Opslaan...' : 'Prompt opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

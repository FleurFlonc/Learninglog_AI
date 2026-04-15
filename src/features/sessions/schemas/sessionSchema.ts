import { z } from 'zod'

const sessionStatusSchema = z.enum(['success', 'partial', 'failed'])

const aiToolSchema = z.enum([
  'chatgpt',
  'claude',
  'cursor',
  'gemini',
  'copilot',
  'other',
])

const taskTypeSchema = z.enum([
  'debugging',
  'prompting',
  'writing',
  'research',
  'automation',
  'ideation',
  'ontwikkelen',
  'other',
])

const problemCategorySchema = z.enum([
  'prompting',
  'technical',
  'context',
  'output_quality',
  'workflow',
  'unknown',
])

const resolutionTypeSchema = z.enum([
  'reprompt',
  'more_context',
  'changed_tool',
  'manual_fix',
  'code_fix',
  'research',
  'other',
])

const emptyToUndefined = (val: unknown) =>
  val === '' || val === null ? undefined : val

export const SessionSchema = z.object({
  taskDescription: z
    .string()
    .min(3, 'Minimaal 3 tekens')
    .max(500, 'Maximaal 500 tekens'),
  status: sessionStatusSchema,
  lessonLearned: z
    .string()
    .min(5, 'Minimaal 5 tekens')
    .max(1000, 'Maximaal 1000 tekens'),
  whatWentWrong: z.string().optional(),
  resolution: z.string().optional(),
  reflectionNotes: z.string().optional(),
  aiTools: z.array(aiToolSchema).optional(),
  taskType: z.preprocess(emptyToUndefined, taskTypeSchema.optional()),
  problemCategory: z.preprocess(emptyToUndefined, problemCategorySchema.optional()),
  resolutionType: z.preprocess(emptyToUndefined, resolutionTypeSchema.optional()),
  learningValue: z.number().min(1).max(5).optional(),
  frustrationLevel: z.number().min(1).max(5).optional(),
  confidenceAfter: z.number().min(1).max(5).optional(),
  // Prompt velden
  promptGoal: z.string().max(500).optional(),
  systemPrompt: z.string().max(10000).optional(),
  userPrompt: z.string().max(10000).optional(),
  promptOutput: z.string().max(10000).optional(),
  improvedPrompt: z.string().max(10000).optional(),
  promptId: z.string().uuid().optional(),
  isFavorite: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  saveToLibrary: z.boolean().optional(),
})

export const QuickEntrySchema = SessionSchema.pick({
  taskDescription: true,
  status: true,
  lessonLearned: true,
  isPublic: true,
})

export type SessionFormValues = z.infer<typeof SessionSchema>
export type QuickEntryFormValues = z.infer<typeof QuickEntrySchema>

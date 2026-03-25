import { z } from 'zod'

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

const fullFieldSchema = z.string().max(10000, 'Maximaal 10.000 tekens').optional()

export const PromptSchema = z.object({
  title: z
    .string()
    .min(3, 'Minimaal 3 tekens')
    .max(100, 'Maximaal 100 tekens'),
  aiTools: z
    .array(aiToolSchema)
    .min(1, 'Selecteer minimaal één tool'),
  taskType: taskTypeSchema.optional(),
  goalSummary: z
    .string()
    .min(5, 'Minimaal 5 tekens')
    .max(200, 'Maximaal 200 tekens'),
  goalFull: fullFieldSchema,
  systemPromptSummary: z.string().max(500).optional(),
  systemPromptFull: fullFieldSchema,
  userPromptSummary: z
    .string()
    .min(5, 'Minimaal 5 tekens')
    .max(500, 'Maximaal 500 tekens'),
  userPromptFull: fullFieldSchema,
  outputSummary: z.string().max(500).optional(),
  outputFull: fullFieldSchema,
  promptRating: z.number().int().min(1).max(5).optional(),
  sessionId: z.string().uuid().optional(),
  isFavorite: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export type PromptFormValues = z.infer<typeof PromptSchema>

import type { AIToolType, TaskType, ProblemCategory, ResolutionType, SessionStatus } from './enums'

export interface LearningSession {
  // Identifiers
  id: string
  userId: string
  userDisplayName: string
  createdAt: string
  updatedAt: string

  // Verplichte kernvelden
  taskDescription: string
  status: SessionStatus
  lessonLearned: string

  // Optionele verdiepingsvelden
  whatWentWrong?: string
  resolution?: string
  reflectionNotes?: string
  aiTools?: AIToolType[]
  taskType?: TaskType
  problemCategory?: ProblemCategory
  resolutionType?: ResolutionType

  // Optionele meetvelden
  durationMinutes?: number

  // Prompt velden (inline gelogd bij de sessie)
  promptGoal?: string          // doel van de prompt
  systemPrompt?: string        // systeemprompt
  userPrompt?: string          // gebruikersprompt
  promptOutput?: string        // output van de AI
  improvedPrompt?: string      // verbeterde prompt achteraf

  // Prompt referentie
  promptId?: string

  // Meta
  isFavorite?: boolean
  tags?: string[]
}

export type CreateSessionInput = Omit<
  LearningSession,
  'id' | 'createdAt' | 'updatedAt' | 'userId' | 'userDisplayName'
>

export type UpdateSessionInput = Partial<
  Omit<LearningSession, 'id' | 'createdAt' | 'userId'>
> & { id: string }

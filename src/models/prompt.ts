import type { AIToolType, TaskType } from './enums'

export interface PromptEntry {
  // Identifiers
  id: string
  userId: string
  userDisplayName: string
  createdAt: string
  updatedAt: string

  // Verplichte velden
  title: string
  aiTools: AIToolType[]
  taskType?: TaskType

  // Doel
  goalSummary: string       // max 200 tekens
  goalFull?: string

  // Systeemprompt
  systemPromptSummary?: string
  systemPromptFull?: string

  // Gebruikersprompt
  userPromptSummary: string
  userPromptFull?: string

  // AI Output
  outputSummary?: string
  outputFull?: string

  // Beoordeling
  promptRating?: number     // 1-5
  sessionId?: string

  // Meta
  isFavorite?: boolean
  tags?: string[]
}

export type CreatePromptInput = Omit<
  PromptEntry,
  'id' | 'createdAt' | 'updatedAt' | 'userId' | 'userDisplayName'
>

export type UpdatePromptInput = Partial<
  Omit<PromptEntry, 'id' | 'createdAt' | 'userId'>
> & { id: string }

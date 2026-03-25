export type SessionStatus = 'success' | 'partial' | 'failed'

export type AIToolType =
  | 'chatgpt'
  | 'claude'
  | 'cursor'
  | 'gemini'
  | 'copilot'
  | 'other'

export type TaskType =
  | 'debugging'
  | 'prompting'
  | 'writing'
  | 'research'
  | 'automation'
  | 'ideation'
  | 'ontwikkelen'
  | 'other'

export type ProblemCategory =
  | 'prompting'
  | 'technical'
  | 'context'
  | 'output_quality'
  | 'workflow'
  | 'unknown'

export type ResolutionType =
  | 'reprompt'
  | 'more_context'
  | 'changed_tool'
  | 'manual_fix'
  | 'code_fix'
  | 'research'
  | 'other'

export type ThemeMode = 'system' | 'light' | 'dark'

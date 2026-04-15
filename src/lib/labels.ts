// Centrale definitie van alle enum-labels en options-arrays.
// Importeer vanuit hier — nooit lokaal herdefiniëren.

export const toolLabels: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  cursor: 'Cursor',
  gemini: 'Gemini',
  copilot: 'Copilot',
  other: 'Overig',
}

export const taskTypeLabels: Record<string, string> = {
  debugging: 'Debugging',
  prompting: 'Prompting',
  writing: 'Schrijven',
  research: 'Onderzoek',
  automation: 'Automatisering',
  ideation: 'Ideevorming',
  ontwikkelen: 'Ontwikkelen',
  other: 'Overig',
}

export const statusLabels: Record<string, string> = {
  success: 'Gelukt',
  partial: 'Deels gelukt',
  failed: 'Mislukt',
}

export const problemCategoryLabels: Record<string, string> = {
  prompting: 'Prompting',
  technical: 'Technisch',
  context: 'Context',
  output_quality: 'Output kwaliteit',
  workflow: 'Workflow',
  unknown: 'Onbekend',
}

export const resolutionTypeLabels: Record<string, string> = {
  reprompt: 'Opnieuw geprompt',
  more_context: 'Meer context',
  changed_tool: 'Andere tool',
  manual_fix: 'Handmatig opgelost',
  code_fix: 'Code fix',
  research: 'Onderzoek',
  other: 'Overig',
}

// Options voor formulieren (geen "alles"-optie)
export const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))
export const aiToolOptions = Object.entries(toolLabels).map(([value, label]) => ({ value, label }))
export const taskTypeOptions = Object.entries(taskTypeLabels).map(([value, label]) => ({ value, label }))
export const problemCategoryOptions = Object.entries(problemCategoryLabels).map(([value, label]) => ({ value, label }))
export const resolutionTypeOptions = Object.entries(resolutionTypeLabels).map(([value, label]) => ({ value, label }))

// Options voor filterbalken (met "alles"-optie vooraan)
export const statusFilterOptions = [
  { value: 'all', label: 'Alle statussen' },
  ...statusOptions,
]

export const taskTypeFilterOptions = [
  { value: '', label: 'Alle thema\'s' },
  ...taskTypeOptions,
]

export const aiToolFilterOptions = [
  { value: '', label: 'Alle tools' },
  ...aiToolOptions,
]

export const taskTypeSelectOptions = [
  { value: '', label: 'Alle types' },
  ...taskTypeOptions,
]

/** Geeft de leesbare label terug voor een enum-waarde, of de waarde zelf als fallback. */
export function getLabel(map: Record<string, string>, value: string): string {
  return map[value] ?? value
}

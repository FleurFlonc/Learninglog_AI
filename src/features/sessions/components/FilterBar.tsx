import { useState, useRef, useEffect } from 'react'
import type { SessionStatus, TaskType } from '@/models/enums'

// ── Dropdown primitief ────────────────────────────────────────────────────────

interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface FilterDropdownProps<T extends string> {
  label: string
  options: DropdownOption<T>[]
  value: T
  onChange: (value: T) => void
}

function FilterDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = value !== options[0].value
  const currentLabel = options.find((o) => o.value === value)?.label ?? label

  // Sluit dropdown bij klik buiten component
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition select-none ${
          isActive
            ? 'border-sage-400 bg-sage-50 text-sage-700'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#1A1A1A]'
        }`}
      >
        <span>{isActive ? currentLabel : label}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''} ${isActive ? 'text-sage-500' : 'text-gray-400'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1.5 min-w-[160px] rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
          {options.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-sm transition ${
                  selected
                    ? 'bg-sage-50 text-sage-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {option.label}
                {selected && (
                  <svg className="h-3.5 w-3.5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Filter opties ─────────────────────────────────────────────────────────────

const statusOptions: DropdownOption<SessionStatus | 'all'>[] = [
  { value: 'all', label: 'Alle statussen' },
  { value: 'success', label: 'Gelukt' },
  { value: 'partial', label: 'Deels gelukt' },
  { value: 'failed', label: 'Mislukt' },
]

const taskTypeOptions: DropdownOption<TaskType | ''>[] = [
  { value: '', label: 'Alle thema\'s' },
  { value: 'prompting', label: 'Prompting' },
  { value: 'writing', label: 'Schrijven' },
  { value: 'debugging', label: 'Debugging' },
  { value: 'research', label: 'Onderzoek' },
  { value: 'ontwikkelen', label: 'Ontwikkelen' },
  { value: 'automation', label: 'Automatisering' },
  { value: 'ideation', label: 'Ideevorming' },
  { value: 'other', label: 'Overig' },
]

const promptOptions: DropdownOption<'all' | 'has_prompt'>[] = [
  { value: 'all', label: 'Alle sessies' },
  { value: 'has_prompt', label: 'Heeft prompt' },
]

// ── Publieke interface ────────────────────────────────────────────────────────

interface FilterBarProps {
  statusFilter: SessionStatus | 'all'
  onStatusChange: (value: SessionStatus | 'all') => void
  taskTypeFilter: TaskType | ''
  onTaskTypeChange: (value: TaskType | '') => void
  promptOnly: boolean
  onPromptOnlyChange: (value: boolean) => void
  resultCount: number
}

export function FilterBar({
  statusFilter,
  onStatusChange,
  taskTypeFilter,
  onTaskTypeChange,
  promptOnly,
  onPromptOnlyChange,
  resultCount,
}: FilterBarProps) {
  const hasActiveFilters = statusFilter !== 'all' || taskTypeFilter !== '' || promptOnly

  return (
    <div className="mb-5 flex items-center gap-2 flex-wrap">
      <FilterDropdown
        label="Status"
        options={statusOptions}
        value={statusFilter}
        onChange={onStatusChange}
      />

      <FilterDropdown
        label="Thema"
        options={taskTypeOptions}
        value={taskTypeFilter}
        onChange={onTaskTypeChange}
      />

      <FilterDropdown
        label="Prompt"
        options={promptOptions}
        value={promptOnly ? 'has_prompt' : 'all'}
        onChange={(v) => onPromptOnlyChange(v === 'has_prompt')}
      />

      {/* Scheidingslijn + acties */}
      {hasActiveFilters && (
        <>
          <div className="h-5 w-px bg-gray-200" />
          <button
            type="button"
            onClick={() => {
              onStatusChange('all')
              onTaskTypeChange('')
              onPromptOnlyChange(false)
            }}
            className="text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Wissen
          </button>
        </>
      )}

      <span className="ml-auto text-sm text-gray-400">
        {resultCount} {resultCount === 1 ? 'sessie' : 'sessies'}
      </span>
    </div>
  )
}

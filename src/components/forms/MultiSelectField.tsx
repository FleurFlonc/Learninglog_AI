interface Option {
  value: string
  label: string
}

interface MultiSelectFieldProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
}

export function MultiSelectField({ options, value, onChange }: MultiSelectFieldProps) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              selected
                ? 'bg-sage-400 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-sage-100 hover:text-sage-700'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

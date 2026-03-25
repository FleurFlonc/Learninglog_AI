interface RatingFieldProps {
  value?: number
  onChange: (value: number | undefined) => void
  label?: string
}

export function RatingField({ value, onChange }: RatingFieldProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? undefined : n)}
          className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${
            value === n
              ? 'bg-sage-400 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-sage-100 hover:text-sage-600'
          }`}
        >
          {n}
        </button>
      ))}
      {value !== undefined && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="ml-1 text-xs text-gray-400 hover:text-gray-600"
        >
          wis
        </button>
      )}
    </div>
  )
}

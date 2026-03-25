import { useState } from 'react'

interface TagsFieldProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagsField({ value, onChange }: TagsFieldProps) {
  const [input, setInput] = useState('')

  function addTag() {
    const tag = input.trim().toLowerCase()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 text-sage-500 hover:text-sage-700"
              aria-label={`Verwijder tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder="Tag toevoegen..."
          className="block flex-1 rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </div>
  )
}

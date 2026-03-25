import { forwardRef } from 'react'
import { inputClass } from './FormField'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]
  placeholder?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ options, placeholder, ...props }, ref) => {
    return (
      <select ref={ref} className={inputClass} {...props}>
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
)

SelectField.displayName = 'SelectField'

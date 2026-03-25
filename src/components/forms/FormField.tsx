import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, htmlFor, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#1A1A1A]">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

export const inputClass =
  'block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 outline-none transition focus:border-sage-400 focus:ring-2 focus:ring-sage-100'

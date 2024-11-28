import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const selectDisplayText = (value, options) => {
  const option = options.find((option) => option.value === value)
  return option ? option.label : ''
}

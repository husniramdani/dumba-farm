import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const selectDisplayText = (value, options) => {
  const option = options.find((option) => option.value === value)
  return option ? option.label : ''
}

export const convertMonthsToYearsAndMonths = (months: number): string => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const yearText = years > 0 ? `${years} Tahun` : '';
  const monthText = remainingMonths > 0 ? `${remainingMonths} Bulan` : '';

  // Combine the results, ensuring proper spacing
  return [yearText, monthText].filter(Boolean).join(' ').trim();
}


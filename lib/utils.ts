import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

import { currencyIDR, dateFormat } from '@/constants/format'
import { useIsMobile } from '@/hooks/use-mobile'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const selectDisplayText = (value, options) => {
  const option = options.find((option) => option.value === value)
  return option ? option.label : ''
}

export const convertMonthsToYearsAndMonths = (months: number): string => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  const yearText = years > 0 ? `${years} Tahun` : ''
  const monthText = remainingMonths > 0 ? `${remainingMonths} Bulan` : ''

  // Combine the results, ensuring proper spacing
  return [yearText, monthText].filter(Boolean).join(' ').trim()
}

export const convertVariant = (status: string) => {
  if (status === 'AVAILABLE') return 'solidBlue'
  if (status === 'SOLD') return 'solidGreen'
  if (status === 'DEAD') return 'outlineRed'
}

export const DateCell = ({ date }) => {
  const isMobile = useIsMobile()

  const formattedDate = isMobile
    ? format(new Date(date), 'dd MMM yy')
    : dateFormat(date)

  return formattedDate
}

export const convertToRupiah = (val: number | string) => {
  if (!val && val !== 0) return ''
  return currencyIDR.format(Number(val))
}

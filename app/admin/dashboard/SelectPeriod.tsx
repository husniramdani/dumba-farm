'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const periodOptions = [
  { value: '1', label: '1 Bulan' },
  { value: '3', label: '3 Bulan' },
  { value: '6', label: '6 Bulan' },
  { value: '12', label: '1 Tahun' }, // Default value
]

export default function SelectPeriod() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentPeriod = searchParams.get('period') || '1' // Default to 12 months

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('period', value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select onValueChange={handleChange} defaultValue={currentPeriod}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Pilih Periode" />
      </SelectTrigger>
      <SelectContent>
        {periodOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

import React, { useState } from 'react'

import { Input } from '@/components/ui/input'
import { currencyIDR } from '@/constants/format'

export default function MoneyInputBase({
  placeholder,
  value: initialValue,
  onChange: handleChange,
}: {
  placeholder: string
  value: string | number
  onChange: (value: number) => void
}) {
  const formatValue = (val: number | string) => {
    if (!val && val !== 0) return ''
    return currencyIDR.format(Number(val))
  }

  const [value, setValue] = useState(formatValue(initialValue))

  const handleInputChange = (formattedValue: string) => {
    const digits = formattedValue.replace(/\D/g, '')
    const numericValue = Number(digits)
    setValue(formatValue(numericValue))
    handleChange(numericValue)
  }

  return (
    <Input
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(e) => handleInputChange(e.target.value)}
    />
  )
}

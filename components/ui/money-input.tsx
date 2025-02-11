import React, { useEffect, useReducer } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { currencyIDR } from '@/constants/format'

interface TextInputProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder: string
}

export default function MoneyInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: TextInputProps<T>) {
  const formatValue = (val: number | string) => {
    if (!val && val !== 0) return ''
    return currencyIDR.format(Number(val))
  }

  const [value, setValue] = useReducer((_: string, next: string) => {
    const digits = next.replace(/\D/g, '')
    return formatValue(digits)
  }, formatValue(form.getValues()[name]))

  useEffect(() => {
    const subscription = form.watch((values) => {
      const newValue = values[name as keyof typeof values]
      if (newValue !== undefined) {
        setValue(String(newValue))
      }
    })
    return () => subscription.unsubscribe()
  }, [form, name])

  const handleChange = (
    realChangeFn: (value: number) => void,
    formattedValue: string,
  ) => {
    const digits = formattedValue.replace(/\D/g, '')
    const numericValue = Number(digits)
    realChangeFn(numericValue)
    setValue(String(numericValue))
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type="text"
              {...field}
              onChange={(e) => {
                handleChange(field.onChange, e.target.value)
              }}
              value={value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

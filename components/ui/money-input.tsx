'use client'
import { useReducer } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

interface TextInputProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder: string
}

const moneyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function MoneyInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: TextInputProps<T>) {
  const initialValue = form.getValues()[name]
    ? moneyFormatter.format(form.getValues()[name])
    : ''

  const [value, setValue] = useReducer((_: string, next: string) => {
    const digits = next.replace(/\D/g, '')
    return moneyFormatter.format(Number(digits))
  }, initialValue)

  const handleChange = (
    realChangeFn: (value: number) => void,
    formattedValue: string,
  ) => {
    const digits = formattedValue.replace(/\D/g, '')
    realChangeFn(Number(digits))
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
                setValue(e.target.value)
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

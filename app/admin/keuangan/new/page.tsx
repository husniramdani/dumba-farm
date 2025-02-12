'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import MoneyInput from '@/components/ui/money-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categoryToSatuanFormat } from '@/constants/format'
import { defaultValues, formSchema, FormSchemaType } from '@/db/keuangan/schema'
import { useCreateKeuangan } from '@/services/keuangan'

export default function Page() {
  const router = useRouter()
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const [quantityFormat, setQuantityFormat] = useState(
    categoryToSatuanFormat[defaultValues.category],
  )

  const { mutate, isPending } = useCreateKeuangan()

  function onSubmit(values: FormSchemaType) {
    mutate(values, {
      onSuccess: () => {
        router.push('/admin/keuangan')
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipe Transaksi</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="INCOME" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Pemasukan</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="EXPENSE" />
                    </FormControl>
                    <FormLabel className="cursor-pointer">
                      Pengeluaran
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(e) => {
                  field.onChange(e)
                  setQuantityFormat(categoryToSatuanFormat[e])
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TERNAK">Ternak</SelectItem>
                  <SelectItem value="PAKAN">Pakan</SelectItem>
                  <SelectItem value="OBAT">Obat</SelectItem>
                  <SelectItem value="PEGAWAI">Pegawai</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <MoneyInput
          form={form}
          name="amount"
          label="Harga"
          placeholder="Masukkan harga"
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah ({quantityFormat})</FormLabel>
              <FormControl>
                <Input placeholder="Jumlah" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

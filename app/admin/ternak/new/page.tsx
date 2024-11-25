'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE'], {
    required_error: 'Jenis kelamin harus dipilih',
  }),
  age: z.coerce.number().refine((val) => val > 0, {
    message: 'Umur harus diisi',
  }),
  buy_price: z.coerce.number().refine((val) => val > 0, {
    message: 'Harga harus diisi',
  }),
  breed: z.enum(['GARUT', 'LOKAL', 'PRIANGAN'], {
    required_error: 'Jenis domba harus dipilih',
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function Page() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: 'FEMALE',
      age: 0,
      buy_price: 0,
      breed: 'GARUT',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jeni kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Laki-laki</SelectItem>
                    <SelectItem value="FEMALE">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Umur (bulan)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Umur domba dalam bulan"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <MoneyInput
            form={form}
            name="buy_price"
            label="Harga beli"
            placeholder="Masukkan harga beli"
          />
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jeni domba" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GARUT">Garut</SelectItem>
                    <SelectItem value="LOKAL">Lokal</SelectItem>
                    <SelectItem value="PRIANGAN">Priangan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

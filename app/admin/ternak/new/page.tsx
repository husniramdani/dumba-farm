'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import { useFetch } from '@/lib/client-api'
import { defaultValues, formSchema, FormSchemaType } from '@/schemas/ternak'

export function useCreateTernak() {
  const fetcher = useFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormSchemaType) =>
      fetcher('/ternak', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ternak'] })
      toast.success('Ternak berhasil ditambahkan')
    },
    onError: (error) => {
      toast.error('Gagal menambahkan ternak')
      console.error('Error creating ternak:', error)
    },
  })
}

export default function Page() {
  const router = useRouter()
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const { mutate, isPending } = useCreateTernak()

  function onSubmit(values: FormSchemaType) {
    mutate(values, {
      onSuccess: () => {
        router.push('/admin/ternak') // Redirect back to list page after successful creation
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
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
              <FormLabel>Jenis Domba</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis domba" />
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
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

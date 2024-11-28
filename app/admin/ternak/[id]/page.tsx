'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { breedOptions } from '@/constants/helpers'
import { useFetch } from '@/lib/client-api'
import { defaultValues, formSchema, FormSchemaType } from '@/schemas/ternak'
import { Ternak } from '@/types/ternak'

function useTernakDetail(id: string) {
  const fetcher = useFetch()

  return useQuery<Ternak>({
    queryKey: ['ternak', id],
    queryFn: async () => fetcher<Ternak>(`/ternak/${id}`),
  })
}

export function useUpdateTernak(id: string | number) {
  const fetcher = useFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormSchemaType) =>
      fetcher(`/ternak/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ternak'] })
      toast.success('Ternak berhasil diperbarui')
    },
    onError: (error) => {
      toast.error('Gagal memperbarui ternak')
      console.error('Error updating ternak:', error)
    },
  })
}

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDone, setIsDone] = useState(false)

  const { data, isLoading } = useTernakDetail(params.id)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (data) {
      form.reset(data)
      setIsDone(true)
    }
  }, [data, form])

  const { mutate, isPending } = useUpdateTernak(params.id)

  function onSubmit(values: FormSchemaType) {
    mutate(values, {
      onSuccess: () => {
        router.push('/admin/ternak')
      },
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <Form {...form}>
        <form
          key={String(isDone)}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Jantan</SelectItem>
                      <SelectItem value="FEMALE">Betina</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }}
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
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis domba" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {breedOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
    </div>
  )
}

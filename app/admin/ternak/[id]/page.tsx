'use client'

import { useEffect } from 'react'
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
  const { data, isLoading } = useTernakDetail(params.id)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
    // values: data ? data : defaultValues,
  })

  useEffect(() => {
    if (data) {
      console.log('DATA', data)
      form.reset(data)
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

  useEffect(() => {
    console.log('Form values changed:', form.getValues())
  }, [form])

  if (isLoading) return <div>Loading...</div>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  // onValueChange={(value) => {
                  //   console.log('VALUE', value)
                  //   setSelectedOption(value)
                  // }}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  name={field.name}
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
        {/* <FormField */}
        {/*   control={form.control} */}
        {/*   name="breed" */}
        {/*   render={({ field }) => ( */}
        {/*     <FormItem> */}
        {/*       <FormLabel>Jenis Domba</FormLabel> */}
        {/*       <Select */}
        {/*         onValueChange={field.onChange} */}
        {/*         value={field.value} */}
        {/*         name={field.name} */}
        {/*       > */}
        {/*         <FormControl> */}
        {/*           <SelectTrigger> */}
        {/*             <SelectValue placeholder="Pilih jenis domba"> */}
        {/*               {selectDisplayText(field.value, breedOptions)} */}
        {/*             </SelectValue> */}
        {/*           </SelectTrigger> */}
        {/*         </FormControl> */}
        {/*         <SelectContent> */}
        {/*           {breedOptions.map((option) => ( */}
        {/*             <SelectItem key={option.value} value={option.value}> */}
        {/*               {option.label} */}
        {/*             </SelectItem> */}
        {/*           ))} */}
        {/*         </SelectContent> */}
        {/*       </Select> */}
        {/*       <FormMessage /> */}
        {/*     </FormItem> */}
        {/*   )} */}
        {/* /> */}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}

// const selectDisplayText = (value, options) => {
//   const option = options.find((option) => option.value === value)
//   return option ? option.label : ''
// }

// const genderOptions = [
//   { value: 'MALE', label: 'Laki-laki' },
//   { value: 'FEMALE', label: 'Perempuan' },
// ]
//
// const breedOptions = [
//   { value: 'GARUT', label: 'Garut' },
//   { value: 'LOKAL', label: 'Lokal' },
//   { value: 'PRIANGAN', label: 'Priangan' },
// ]

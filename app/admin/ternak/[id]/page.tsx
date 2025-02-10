'use client'

import { useEffect } from 'react'
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
import { breedOptions, ternakStatusOptions } from '@/constants/options'
import { defaultValues, formSchema, FormSchemaType } from '@/db/ternak/schema'
import { useTernakDetail, useUpdateTernak } from '@/services/ternak'

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { data, isLoading } = useTernakDetail(Number(params.id))

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form])

  const { mutate, isPending } = useUpdateTernak(Number(params.id))

  function onSubmit(values: FormSchemaType) {
    mutate(values, {
      onSuccess: () => {
        router.push(`/admin/ternak/detail/${params.id}`)
      },
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem key={field.value} className="space-y-3">
                <FormLabel>Jenis Kelamin</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="MALE" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Jantan</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="FEMALE" />
                      </FormControl>
                      <FormLabel className="cursor-pointer">Betina</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Berat dalam kilogram</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Berat dalam kilogram"
                    type="number"
                    {...field}
                  />
                </FormControl>
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
            name="buyPrice"
            label="Harga beli per kilogram"
            placeholder="Masukkan harga beli"
          />
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem key={field.value}>
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
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem key={field.value}>
                <FormLabel>Status</FormLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ternakStatusOptions.map((option) => (
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
          <div className="flex gap-x-4 justify-end !mt-12">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/ternak')}
            >
              Kembali
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

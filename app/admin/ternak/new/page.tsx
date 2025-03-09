'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import SingleImageUpload from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MoneyInput from '@/components/ui/money-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { defaultValues, formSchema, FormSchemaType } from '@/db/ternak/schema'
import { useCreateTernak } from '@/services/ternak'

export default function Page() {
  const router = useRouter()
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const { mutate, isPending } = useCreateTernak()
  const [unit, setUnit] = useState('kg')

  function onSubmit(values: FormSchemaType) {
    let finalPrice = values.buyPrice

    if (unit === 'ekor' && values.weight > 0) {
      finalPrice = values.buyPrice / values.weight
    }

    const submitData = {
      ...values,
      buyPrice: finalPrice,
    }

    mutate(submitData, {
      onSuccess: () => {
        router.push('/admin/ternak')
      },
    })
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Tambah Ternak</h1>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/ternak">Ternak</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Ternak</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto Ternak</FormLabel>
                <FormControl>
                  <SingleImageUpload
                    onUploadComplete={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Ternak</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama ternak" {...field} />
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
                <FormLabel>Berat Domba (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Berat dalam kilogram"
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
          <div className="flex gap-1">
            <div className="w-full">
              <div className="flex items-center gap-3">
                <Label>Harga Beli</Label>
                <Select
                  onValueChange={(value) => setUnit(value)}
                  defaultValue="kg"
                >
                  <SelectTrigger className="w-[125px] h-8">
                    <SelectValue placeholder="pilih satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">per kilogram</SelectItem>
                    <SelectItem value="ekor">per ekor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <MoneyInput
                form={form}
                name="buyPrice"
                label=""
                placeholder="Masukkan harga beli"
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Domba</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
    </div>
  )
}

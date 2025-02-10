'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { defaultValues, formSchema, FormSchemaType } from '@/db/history/schema'
import { useUpdateBeratTernak } from '@/services/ternak'

export default function DrawerUpdate({ ternakId }) {
  const [showDrawer, setShowDrawer] = useState(false)

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const { mutate } = useUpdateBeratTernak()

  function onSubmit(values: FormSchemaType) {
    const data = { id: ternakId, weight: values.weight }
    mutate(data, {
      onSuccess() {
        setShowDrawer(false)
        form.reset()
      },
    })
  }

  return (
    <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
      <DrawerTrigger>
        <Button>Update Berat</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Masukkan Berat Terbaru</DrawerTitle>
          <DrawerDescription>Update berat ternak terbaru</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="p-5">
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
            <DrawerFooter>
              <Button type="submit">Submit</Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

'use client'

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
import { useUpdateHistoryTernak } from '@/services/historyTernak'

export default function DrawerEditHistory({
  ternakId,
  historyId,
  open,
  onOpenChange,
}) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const { mutate } = useUpdateHistoryTernak(historyId)

  function onSubmit(values: FormSchemaType) {
    const data = { ...values, ternakId }
    mutate(data, {
      onSuccess() {
        onOpenChange(false)
        form.reset()
      },
    })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
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
                      className="text-xs lg:text-sm"
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

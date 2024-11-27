import { z } from 'zod'

export const formSchema = z.object({
  gender: z
    .string({
      required_error: 'Jenis kelamin harus dipilih',
    })
    .min(1, 'Jenis kelamin harus dipilih'),
  age: z.coerce.number().refine((val) => val > 0, {
    message: 'Umur harus diisi',
  }),
  buy_price: z.coerce.number().refine((val) => val > 0, {
    message: 'Harga harus diisi',
  }),
  breed: z
    .string({
      required_error: 'Jenis domba harus dipilih',
    })
    .min(1, 'Jenis domba harus dipilih'),
  status: z
    .string({
      required_error: 'Jenis kelamin harus dipilih',
    })
    .min(1, 'Jenis kelamin harus dipilih'),
})

export type FormSchemaType = z.infer<typeof formSchema>

export const defaultValues: FormSchemaType = {
  gender: 'FEMALE',
  age: 0,
  buy_price: 0,
  breed: 'GARUT',
  status: 'AVAILABLE',
}

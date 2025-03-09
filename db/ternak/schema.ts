import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

import { BREED, GENDER, STATUS } from '@/constants/enum'

// DB Schema

export const ternakTable = sqliteTable('ternak', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  gender: text('gender', { enum: GENDER }).default('FEMALE').notNull(),
  name: text('name').notNull().default(''),
  buyPrice: real('buy_price').notNull(),
  weight: integer('weight', { mode: 'number' }).notNull().default(0),
  age: integer('age', { mode: 'number' }).notNull(),
  breed: text('breed', { enum: BREED }).notNull(),
  status: text('status', { enum: STATUS }).default('AVAILABLE').notNull(),
  imageUrl: text('image_url').notNull().default(''),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type InsertTernak = typeof ternakTable.$inferInsert
export type SelectTernak = typeof ternakTable.$inferSelect

// Form Schema

export const formSchema = z
  .object({
    name: z.string().optional(),
    gender: z.enum(GENDER).default('FEMALE'),
    imageUrl: z.string().optional(),
    weight: z.coerce.number().refine((val) => val > 0, {
      message: 'Berat harus diisi',
    }),
    age: z.coerce.number().refine((val) => val > 0, {
      message: 'Umur harus diisi',
    }),
    buyPrice: z.coerce.number().refine((val) => val > 0, {
      message: 'Harga harus diisi',
    }),
    breed: z.enum(BREED),
    status: z.enum(STATUS).default('AVAILABLE'),
  })
  .required()

export type FormSchemaType = z.infer<typeof formSchema>

export const defaultValues: FormSchemaType = {
  name: 'X-1',
  gender: 'FEMALE',
  imageUrl:
    'http://res.cloudinary.com/deyycthuk/image/upload/v1741196926/dkkcywsfrumon3ecotha.webp',
  buyPrice: 0,
  weight: 0,
  age: 0,
  breed: 'GARUT',
  status: 'AVAILABLE',
}

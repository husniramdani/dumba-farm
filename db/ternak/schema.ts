import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

import { BREED, GENDER, STATUS } from '@/constants/enum'

// DB Schema

export const ternakTable = sqliteTable('ternak', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  gender: text('gender', { enum: GENDER }).default('FEMALE').notNull(),
  buyPrice: real('buy_price').notNull(),
  age: integer('age', { mode: 'number' }).notNull(),
  breed: text('breed', { enum: BREED }).notNull(),
  status: text('status', { enum: STATUS }).default('AVAILABLE').notNull(),
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

export const formSchema = z.object({
  gender: z.enum(GENDER).default('FEMALE'),
  buyPrice: z.number().min(0, 'Harga harus lebih dari 0').default(0),
  age: z.number().int().min(0, 'Umur harus lebih dari 0').default(0),
  breed: z.enum(BREED),
  status: z.enum(STATUS).default('AVAILABLE'),
}).required()

export type FormSchemaType = z.infer<typeof formSchema>

export const defaultValues: FormSchemaType = {
  gender: 'FEMALE',
  buyPrice: 0,
  age: 0,
  breed: 'GARUT',
  status: 'AVAILABLE',
}

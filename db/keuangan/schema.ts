import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

import { ternakTable } from '../ternak/schema'

import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@/constants/enum'

// DB Schema

export const keuanganTable = sqliteTable('keuangan', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  ternakId: integer('ternak_id', { mode: 'number' }).references(
    () => ternakTable.id,
    {
      onDelete: 'cascade',
    },
  ),
  type: text('type', { enum: TRANSACTION_TYPE }).notNull(),
  category: text('category', { enum: TRANSACTION_CATEGORY }).notNull(),
  amount: real('amount').notNull(),
  quantity: integer('quantity', { mode: 'number' }).default(0).notNull(),
  description: text('description'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type InsertKeuangan = typeof keuanganTable.$inferInsert
export type SelectKeuangan = typeof keuanganTable.$inferSelect

// Form Schema

export const formSchema = z
  .object({
    type: z.enum(TRANSACTION_TYPE).default('EXPENSE'),
    category: z.enum(TRANSACTION_CATEGORY).default('TERNAK'),
    amount: z.coerce.number().refine((val) => val > 0, {
      message: 'Jumlah harus diisi',
    }),
  })
  .required()

export type FormSchemaType = z.infer<typeof formSchema>

export const defaultValues: FormSchemaType = {
  type: 'EXPENSE',
  category: 'TERNAK',
  amount: 0,
}

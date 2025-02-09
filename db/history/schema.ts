import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

import { ternakTable } from '../ternak/schema'

// DB Schema

export const historyTernakTable = sqliteTable('history_ternak', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  ternakId: integer('ternak_id', { mode: 'number' })
    .references(() => ternakTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  weight: integer('weight', { mode: 'number' }).notNull(),
  notes: text('notes'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type InsertHistoryTernak = typeof historyTernakTable.$inferInsert
export type SelectHistoryTernak = typeof historyTernakTable.$inferSelect

// Form Schema

export const formSchema = z
  .object({
    ternakId: z.number(),
    weight: z.coerce.number().refine((val) => val > 0, {
      message: 'Berat harus diisi',
    }),
    notes: z.string(),
  })
  .required()

export type FormSchemaType = z.infer<typeof formSchema>

export const defaultValues: FormSchemaType = {
  ternakId: 0,
  weight: 0,
  notes: '',
}

import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

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

import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const ternakTable = sqliteTable('ternak', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  gender: text('gender', { enum: ['MALE', 'FEMALE'] })
    .default('FEMALE')
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
})

export type InsertTernak = typeof ternakTable.$inferInsert
export type SelectTernak = typeof ternakTable.$inferSelect

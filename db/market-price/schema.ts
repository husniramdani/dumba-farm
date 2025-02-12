import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { MARKET_TYPE } from '@/constants/enum'

// DB Schema

export const marketPriceTable = sqliteTable('market_price', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  price: real('price').notNull(),
  source: text('source').notNull(),
  type: text('type', { enum: MARKET_TYPE }).notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
})

export type InsertMarketPrice = typeof marketPriceTable.$inferInsert
export type SelectMarketPrice = typeof marketPriceTable.$inferSelect

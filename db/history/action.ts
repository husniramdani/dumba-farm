'use server'

import { db } from '../index'
import { historyTernakTable, InsertHistoryTernak } from './schema'

export async function createHistoryTernak(data: InsertHistoryTernak) {
  const [newHistoryTernak] = await db
    .insert(historyTernakTable)
    .values(data)
    .returning()
  return newHistoryTernak
}

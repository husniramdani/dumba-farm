'use server'

import { asc, desc, eq } from 'drizzle-orm'

import { createHistoryTernak } from '../history/action'
import { historyTernakTable } from '../history/schema'
import { db } from '../index'
import { createKeuangan } from '../keuangan/action'
import { InsertTernak, SelectTernak, ternakTable } from './schema'

import type { PaginatedResponse } from '@/types/model'

export async function createTernak(data: InsertTernak) {
  const [newTernak] = await db.insert(ternakTable).values(data).returning()

  // create pengeluaran
  createKeuangan({
    ternakId: newTernak.id,
    type: 'EXPENSE',
    category: 'TERNAK',
    amount: newTernak.buyPrice,
  })

  // Init first ternak weight
  createHistoryTernak({
    ternakId: newTernak.id,
    weight: newTernak.weight,
  })

  return newTernak
}

export async function getTernakById(
  id: SelectTernak['id'],
): Promise<SelectTernak | undefined> {
  const [ternak] = await db
    .select()
    .from(ternakTable)
    .where(eq(ternakTable.id, id))
  return ternak
}

export type GetAllTernakParams = {
  page?: number
  limit?: number
}

export async function getAllTernak({
  page = 1,
  limit = 10,
}: GetAllTernakParams): Promise<PaginatedResponse<Array<SelectTernak>>> {
  const data = await db
    .select()
    .from(ternakTable)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(desc(ternakTable.createdAt), asc(ternakTable.id))

  const totalCount = await db.$count(ternakTable)
  const totalPages = Math.ceil(totalCount / limit)

  return {
    data,
    totalCount,
    totalPages,
    currentPage: page,
  }
}

export async function updateTernak(
  id: SelectTernak['id'],
  data: Partial<Omit<SelectTernak, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const [updated] = await db
    .update(ternakTable)
    .set(data)
    .where(eq(ternakTable.id, id))
    .returning()

  // current price dari hasil crawl terakhir
  // const currentPrice = 50000
  // create pengeluaran
  // if (updated.status === 'SOLD') {
  //   createKeuangan({
  //     ternakId: id,
  //     type: 'INCOME',
  //     category: 'TERNAK',
  //     amount: updated.weight * currentPrice,
  //   })
  // }

  return updated
}

export async function deleteTernak(id: SelectTernak['id']) {
  const [deleted] = await db
    .delete(ternakTable)
    .where(eq(ternakTable.id, id))
    .returning()
  return deleted
}

export async function jualTernak(id: SelectTernak['id'], price?: number) {
  const [ternak] = await db
    .update(ternakTable)
    .set({ status: 'SOLD' })
    .where(eq(ternakTable.id, id))
    .returning()

  // current price dari hasil crawl terakhir
  const currentPrice = 50000
  // create pengeluaran
  createKeuangan({
    ternakId: id,
    type: 'INCOME',
    category: 'TERNAK',
    amount: price || ternak.weight * currentPrice,
  })

  return ternak
}

export async function updateBeratTernak(
  id: SelectTernak['id'],
  weight: number,
) {
  const [ternak] = await db
    .update(ternakTable)
    .set({ weight })
    .where(eq(ternakTable.id, id))
    .returning()

  createHistoryTernak({
    ternakId: ternak.id,
    weight: ternak.weight,
  })

  return ternak
}

/**
 * Syncs the main ternak record’s weight with the latest history record.
 *
 * @param ternakId - The ID of the ternak to update.
 * @returns The updated ternak record, or null if no history was found.
 */
export async function syncTernakWeightFromHistory(
  ternakId: SelectTernak['id'],
): Promise<SelectTernak | null> {
  // Retrive the latest history record for the given ternak.
  const [latestHistory] = await db
    .select({ weight: historyTernakTable.weight })
    .from(historyTernakTable)
    .where(eq(historyTernakTable.ternakId, ternakId))
    .orderBy(desc(historyTernakTable.createdAt))
    .limit(1)

  if (!latestHistory) {
    console.warn(`No history found for ternakId ${ternakId}.`)
    return null
  }

  // Update the main ternak record to use the latest weight
  const [updatedTernak] = await db
    .update(ternakTable)
    .set({ weight: latestHistory.weight })
    .where(eq(ternakTable.id, ternakId))
    .returning()

  return updatedTernak
}

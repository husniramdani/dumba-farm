'use server'

import { asc, desc, eq, sql } from 'drizzle-orm'

import { createHistoryTernak } from '../history/action'
import { historyTernakTable } from '../history/schema'
import { db } from '../index'
import { createKeuangan } from '../keuangan/action'
import { InsertTernak, SelectTernak, ternakTable } from './schema'

import { TPeriod } from '@/services/dashboard'
import type { PaginatedResponse } from '@/types/model'

export async function createTernak(data: InsertTernak) {
  const [newTernak] = await db.insert(ternakTable).values(data).returning()

  // create pengeluaran
  createKeuangan({
    ternakId: newTernak.id,
    type: 'EXPENSE',
    category: 'TERNAK',
    amount: newTernak.buyPrice,
    quantity: newTernak.weight,
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

  if (ternak) {
    return {
      ...ternak,
      buyPrice: Math.round(ternak.buyPrice),
    }
  }

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

  // create pengeluaran
  createKeuangan({
    ternakId: id,
    type: 'INCOME',
    category: 'TERNAK',
    amount: price || ternak.buyPrice,
    quantity: ternak.weight,
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

/**
 * Dashboard function
 *
 * @param period - The period of the total ternak to get.
 * @returns The total ternak record, or zero if no ternak found.
 */

export async function getTotalTernakByPeriod(period: TPeriod) {
  // Get total for the current period
  const currentResult = await db
    .select({
      totalCurrentPeriod: sql<number>`COUNT(*)`,
    })
    .from(ternakTable)
    .where(sql`created_at >= datetime('now', '-' || ${period} || ' months')`)

  // Get total for the previous period
  const previousResult = await db
    .select({
      totalPreviousPeriod: sql<number>`COUNT(*)`,
    })
    .from(ternakTable)
    .where(
      sql`created_at BETWEEN datetime('now', '-' || (${period} * 2) || ' months')
          AND datetime('now', '-' || ${period} || ' months')`,
    )

  const totalCurrentPeriod = currentResult[0]?.totalCurrentPeriod || 0
  const totalPreviousPeriod = previousResult[0]?.totalPreviousPeriod || 0

  // Calculate growth
  const growth = totalCurrentPeriod - totalPreviousPeriod

  // Calculate growth percentage (handle division by zero)
  const growthPercentage =
    totalPreviousPeriod > 0
      ? (growth / totalPreviousPeriod) * 100
      : totalCurrentPeriod > 0
        ? 100
        : 0

  return {
    totalCurrentPeriod,
    totalPreviousPeriod,
    growth,
    growthPercentage,
  }
}

export async function getTotalSoldTernakByPeriod(period: TPeriod) {
  // Get total sold for the current period
  const currentResult = await db
    .select({
      totalSoldCurrentPeriod: sql<number>`COUNT(*)`,
    })
    .from(ternakTable)
    .where(
      sql`status = 'SOLD' AND created_at >= datetime('now', '-' || ${period} || ' months')`,
    )

  // Get total sold for the previous period
  const previousResult = await db
    .select({
      totalSoldPreviousPeriod: sql<number>`COUNT(*)`,
    })
    .from(ternakTable)
    .where(
      sql`status = 'SOLD' AND created_at BETWEEN datetime('now', '-' || (${period} * 2) || ' months') AND datetime('now', '-' || ${period} || ' months')`,
    )

  const totalSoldCurrentPeriod = currentResult[0]?.totalSoldCurrentPeriod || 0
  const totalSoldPreviousPeriod =
    previousResult[0]?.totalSoldPreviousPeriod || 0

  // Calculate growth
  const growth = totalSoldCurrentPeriod - totalSoldPreviousPeriod

  // Calculate growth percentage (handle division by zero)
  const growthPercentage =
    totalSoldPreviousPeriod > 0
      ? (growth / totalSoldPreviousPeriod) * 100
      : totalSoldCurrentPeriod > 0
        ? 100
        : 0

  return {
    totalSoldCurrentPeriod,
    totalSoldPreviousPeriod,
    growth,
    growthPercentage,
  }
}

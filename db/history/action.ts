'use server'

import { desc, eq } from 'drizzle-orm'

import { db } from '../index'
import {
  historyTernakTable,
  InsertHistoryTernak,
  SelectHistoryTernak,
} from './schema'

import { PaginatedResponse, PaginationParams } from '@/types/model'

export async function createHistoryTernak(data: InsertHistoryTernak) {
  const [newHistoryTernak] = await db
    .insert(historyTernakTable)
    .values(data)
    .returning()
  return newHistoryTernak
}

export async function getAllHistoryTernak({
  page = 1,
  limit = 10,
  ternakId, // Add ternakId as an optional parameter
}: PaginationParams & { ternakId?: number }): Promise<
  PaginatedResponse<Array<SelectHistoryTernak>>
> {
  const query = db
    .select()
    .from(historyTernakTable)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(desc(historyTernakTable.createdAt))

  // Apply filter if ternakId is provided
  if (ternakId) {
    query.where(eq(historyTernakTable.ternakId, ternakId))
  }

  const data = await query
  const totalCount = await db.$count(
    historyTernakTable,
    ternakId ? eq(historyTernakTable.ternakId, ternakId) : undefined,
  )
  const totalPages = Math.ceil(totalCount / limit)

  // Calculate progress percentage
  const enrichedData = data.map((entry, index, arr) => {
    if (index === arr.length - 1) return { ...entry, progress: null } // No previous entry to compare
    const prevWeight = arr[index + 1]?.weight
    const currentWeight = entry.weight

    // Calculate percentage change
    const progress = prevWeight
      ? ((currentWeight - prevWeight) / prevWeight) * 100
      : null
    return { ...entry, progress }
  })

  return {
    data: enrichedData,
    totalCount,
    totalPages,
    currentPage: page,
  }
}

'use server'

import { asc, desc, eq } from 'drizzle-orm'

import { db } from '../index'
import { InsertKeuangan, keuanganTable, SelectKeuangan } from './schema'

import type { PaginatedResponse, PaginationParams } from '@/types/model'

export async function createKeuangan(data: InsertKeuangan) {
  const [newKeuangan] = await db.insert(keuanganTable).values(data).returning()
  return newKeuangan
}

export async function getKeuanganById(
  id: SelectKeuangan['id'],
): Promise<SelectKeuangan | undefined> {
  const [keuangan] = await db
    .select()
    .from(keuanganTable)
    .where(eq(keuanganTable.id, id))
  return keuangan
}

export async function getAllKeuangan({
  page = 1,
  limit = 10,
}: PaginationParams): Promise<PaginatedResponse<Array<SelectKeuangan>>> {
  const data = await db
    .select()
    .from(keuanganTable)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(desc(keuanganTable.createdAt), asc(keuanganTable.id))

  const totalCount = await db.$count(keuanganTable)
  const totalPages = Math.ceil(totalCount / limit)

  return {
    data,
    totalCount,
    totalPages,
    currentPage: page,
  }
}

export async function updateKeuangan(
  id: SelectKeuangan['id'],
  data: Partial<Omit<SelectKeuangan, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const [updated] = await db
    .update(keuanganTable)
    .set(data)
    .where(eq(keuanganTable.id, id))
    .returning()
  return updated
}

export async function deleteKeuangan(id: SelectKeuangan['id']) {
  const [deleted] = await db
    .delete(keuanganTable)
    .where(eq(keuanganTable.id, id))
    .returning()
  return deleted
}

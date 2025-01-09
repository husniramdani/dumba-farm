'use server'

import { asc, desc, eq } from 'drizzle-orm'

import { db } from '../index'
import { InsertTernak, SelectTernak, ternakTable } from './schema'

export async function createTernak(data: InsertTernak) {
  const [newTernak] = await db.insert(ternakTable).values(data).returning()
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
  limit = 5,
}: GetAllTernakParams): Promise<Array<SelectTernak>> {
  const baseQuery = db
    .select()
    .from(ternakTable)
    .orderBy(desc(ternakTable.createdAt), asc(ternakTable.id))

  return baseQuery.limit(limit).offset((page - 1) * limit)
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

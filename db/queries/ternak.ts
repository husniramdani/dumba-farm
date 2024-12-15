'use server'

import { asc, count, desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '../index'
import { InsertTernak, SelectTernak, ternakTable } from '../schema/ternak'

export async function createTernak(data: InsertTernak) {
  await db.insert(ternakTable).values(data)
  redirect('/')
}

export async function getCountTernak() {
  return db.select({ count: count() }).from(ternakTable)
}

export async function getTernakById(
  id: SelectTernak['id'],
): Promise<Array<SelectTernak>> {
  return db.select().from(ternakTable).where(eq(ternakTable.id, id))
}

export async function getAllTernak({
  page = 1,
  limit = 5,
}): Promise<Array<SelectTernak>> {
  return db
    .select()
    .from(ternakTable)
    .orderBy(desc(ternakTable.createdAt), asc(ternakTable.id))
    .limit(limit)
    .offset((page - 1) * limit)
}

export async function updateTernak(
  id: SelectTernak['id'],
  data: Partial<Omit<SelectTernak, 'id'>>,
) {
  await db
    .update(ternakTable)
    .set(data)
    .where(eq(ternakTable.id, id))
    .returning({ id: ternakTable.id })

  redirect('/')
}

export async function deleteTernak(id) {
  await db
    .delete(ternakTable)
    .where(eq(ternakTable.id, id))
    .returning({ id: ternakTable.id })

  redirect('/')
}

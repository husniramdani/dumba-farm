'use server'

import { format, subMonths } from 'date-fns'
import { asc, desc, eq, sql } from 'drizzle-orm'

import { db } from '../index'
import { InsertKeuangan, keuanganTable, SelectKeuangan } from './schema'

import { TPeriod } from '@/services/dashboard'
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

  if (keuangan) {
    return {
      ...keuangan,
      amount: Math.round(keuangan.amount),
    }
  }
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

/**
 * Dashboard function
 *
 * @param period - The period of the total keuangan.
 * @returns The total keuangan record, or zero if no keuangan found.
 */

export async function getTotalExpenseByPeriod(period: TPeriod) {
  // Get total expense for the current period
  const currentResult = await db
    .select({
      totalExpenseCurrentPeriod: sql<number>`COALESCE(SUM(amount * quantity), 0)`,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'EXPENSE' AND created_at >= datetime('now', '-' || ${period} || ' months')`,
    )

  // Get total expense for the previous period
  const previousResult = await db
    .select({
      totalExpensePreviousPeriod: sql<number>`COALESCE(SUM(amount * quantity), 0)`,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'EXPENSE' AND created_at BETWEEN datetime('now', '-' || (${period} * 2) || ' months') AND datetime('now', '-' || ${period} || ' months')`,
    )

  const totalExpenseCurrentPeriod =
    currentResult[0]?.totalExpenseCurrentPeriod || 0
  const totalExpensePreviousPeriod =
    previousResult[0]?.totalExpensePreviousPeriod || 0

  // Calculate growth
  const growth = totalExpenseCurrentPeriod - totalExpensePreviousPeriod

  // Calculate growth percentage (handle division by zero)
  const growthPercentage =
    totalExpensePreviousPeriod > 0
      ? (growth / totalExpensePreviousPeriod) * 100
      : totalExpenseCurrentPeriod > 0
        ? 100
        : 0

  return {
    totalExpenseCurrentPeriod,
    totalExpensePreviousPeriod,
    growth,
    growthPercentage,
  }
}

export async function getTotalKeuntunganByPeriod(period: TPeriod) {
  // Get total income for the current period
  const incomeResult = await db
    .select({
      totalIncomeCurrentPeriod: sql<number>`COALESCE(SUM(amount * quantity), 0)`,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'INCOME' AND created_at >= datetime('now', '-' || ${period} || ' months')`,
    )

  // Get total expense for the current period
  const expenseResult = await db
    .select({
      totalExpenseCurrentPeriod: sql<number>`COALESCE(SUM(amount * quantity), 0)`,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'EXPENSE' AND created_at >= datetime('now', '-' || ${period} || ' months')`,
    )

  // Calculate profit/loss
  const totalIncomeCurrentPeriod =
    incomeResult[0]?.totalIncomeCurrentPeriod || 0
  const totalExpenseCurrentPeriod =
    expenseResult[0]?.totalExpenseCurrentPeriod || 0
  const totalKeuntunganCurrentPeriod =
    totalIncomeCurrentPeriod - totalExpenseCurrentPeriod

  // Get total income for the previous period
  const previousIncomeResult = await db
    .select({
      totalIncomePreviousPeriod: sql<number>`COALESCE(SUM(amount * quantity), 0)`,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'INCOME' AND created_at BETWEEN datetime('now', '-' || (${period} * 2) || ' months') AND datetime('now', '-' || ${period} || ' months')`,
    )

  // Get total expense for the previous period
  const previousExpenseResult = await db
    .select({
      totalExpensePreviousPeriod: sql<number>`COALESCE(SUM(amount * quantity), 0)`,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'EXPENSE' AND created_at BETWEEN datetime('now', '-' || (${period} * 2) || ' months') AND datetime('now', '-' || ${period} || ' months')`,
    )

  const totalIncomePreviousPeriod =
    previousIncomeResult[0]?.totalIncomePreviousPeriod || 0
  const totalExpensePreviousPeriod =
    previousExpenseResult[0]?.totalExpensePreviousPeriod || 0
  const totalKeuntunganPreviousPeriod =
    totalIncomePreviousPeriod - totalExpensePreviousPeriod

  // Calculate growth
  const growth = totalKeuntunganCurrentPeriod - totalKeuntunganPreviousPeriod

  // Calculate growth percentage (handle division by zero)
  const growthPercentage =
    totalKeuntunganPreviousPeriod !== 0
      ? (growth / Math.abs(totalKeuntunganPreviousPeriod)) * 100
      : totalKeuntunganCurrentPeriod !== 0
        ? 100
        : 0

  return {
    totalKeuntunganCurrentPeriod,
    totalKeuntunganPreviousPeriod,
    growth,
    growthPercentage,
  }
}

export async function getRecentSalesByPeriod(period: TPeriod) {
  // Get total sales count for the selected period
  const totalSalesResult = await db
    .select({
      totalSales: sql<number>`COUNT(*)`,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'INCOME' AND created_at >= datetime('now', '-' || ${period} || ' months')`,
    )

  // Get the 5 most recent sales transactions
  const recentSalesResult = await db
    .select({
      ternakId: keuanganTable.ternakId,
      quantity: keuanganTable.quantity,
      amount: keuanganTable.amount,
      total: sql<number>`(quantity * amount)`,
      date: keuanganTable.createdAt,
    })
    .from(keuanganTable)
    .where(
      sql`type = 'INCOME' AND created_at >= datetime('now', '-' || ${period} || ' months')`,
    )
    .orderBy(sql`created_at DESC`)
    .limit(5)

  return {
    totalSales: totalSalesResult[0]?.totalSales || 0,
    recentSales: recentSalesResult,
  }
}

export async function getKeuntunganOverview() {
  // Get total keuntungan for each month in the last 12 months
  const results = await db
    .select({
      monthYear: sql<string>`strftime('%Y-%m', created_at)`, // Get 'YYYY-MM'
      totalKeuntungan: sql<number>`COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount * quantity ELSE - (amount * quantity) END), 0)`,
    })
    .from(keuanganTable)
    .where(sql`created_at >= datetime('now', '-12 months')`)
    .groupBy(sql`strftime('%Y-%m', created_at)`)
    .orderBy(sql`strftime('%Y-%m', created_at) ASC`) // Ensure sorting is ascending (earliest month first)

  // Generate last 12 months with default total 0
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i) // Ensure first month is the earliest one
    return {
      name: format(date, 'MMM yy'), // Example: "Mar 24"
      total: 0, // Default value
    }
  })

  // Merge database results into last12Months array
  const finalResults = last12Months.map((monthData) => {
    const match = results.find(
      (r) =>
        r.monthYear ===
        format(
          subMonths(new Date(), 11 - last12Months.indexOf(monthData)),
          'yyyy-MM',
        ),
    )
    return {
      ...monthData,
      total: match ? match.totalKeuntungan : 0,
    }
  })

  return finalResults
}

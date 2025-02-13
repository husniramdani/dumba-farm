'use server'

import { count, desc, eq } from 'drizzle-orm'

import { db } from '../index'
import { marketPriceTable, SelectMarketPrice } from './schema'

import { MARKET_TYPE, MarketType } from '@/constants/enum'
import { MarketPriceParams } from '@/services/marketPrice'
import { PaginatedResponse } from '@/types/model'

export async function getAllMarketPrice({
  page = 1,
  limit = 10,
  marketType = 'DAGING',
}: MarketPriceParams): Promise<PaginatedResponse<Array<SelectMarketPrice>>> {
  if (!MARKET_TYPE.includes(marketType)) {
    throw new Error(`Invalid market type: ${marketType}`)
  }

  const data = await db
    .select()
    .from(marketPriceTable)
    .limit(limit)
    .offset((page - 1) * limit)
    .where(eq(marketPriceTable.type, marketType))
    .orderBy(desc(marketPriceTable.createdAt))

  const totalCountResult = await db
    .select({ count: count() })
    .from(marketPriceTable)
    .where(eq(marketPriceTable.type, marketType))
    .execute()

  console.log(totalCountResult)
  const totalCount = totalCountResult[0]?.count ?? 0
  const totalPages = Math.ceil(totalCount / limit)

  return {
    data,
    totalCount,
    totalPages,
    currentPage: page,
  }
}

export async function getLastMarketPrice(
  marketType: MarketType,
): Promise<SelectMarketPrice | null> {
  if (!MARKET_TYPE.includes(marketType)) {
    throw new Error(`Invalid market type: ${marketType}`)
  }

  const result = await db
    .select()
    .from(marketPriceTable)
    .where(eq(marketPriceTable.type, marketType))
    .orderBy(desc(marketPriceTable.createdAt))
    .limit(1)
    .execute()

  return result.length > 0 ? result[0] : null
}

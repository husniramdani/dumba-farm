import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { MarketType } from '@/constants/enum'
import { getAllMarketPrice, getLastMarketPrice } from '@/db/market-price/action'
import { PaginationParams } from '@/types/model'

const QUERY_KEY = 'marketPrice'

export interface MarketPriceParams extends PaginationParams {
  marketType: MarketType
}

export function useMarketPrice(params: MarketPriceParams) {
  const router = useRouter()

  const query = useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getAllMarketPrice(params),
    enabled: !!params,
  })

  useEffect(() => {
    query.refetch()
  }, [params, router, query])

  return query
}

export function useLastMarketPrice(marketType: MarketType) {
  return useQuery({
    queryKey: [QUERY_KEY, marketType],
    queryFn: () => getLastMarketPrice(marketType),
    enabled: !!marketType,
  })
}

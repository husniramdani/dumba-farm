import { useQuery } from '@tanstack/react-query'

import {
  getTotalExpenseByPeriod,
  getTotalKeuntunganByPeriod,
} from '@/db/keuangan/action'
import {
  getTotalSoldTernakByPeriod,
  getTotalTernakByPeriod,
} from '@/db/ternak/action'

const QUERY_KEY = 'dashboard' as const

export type TPeriod = 1 | 3 | 6 | 12

export function useTotalTernak(period: TPeriod = 1) {
  return useQuery({
    queryKey: [QUERY_KEY, 'totalTernak', period],
    queryFn: () => getTotalTernakByPeriod(period),
  })
}

export function useTotalSoldTernak(period: TPeriod = 1) {
  return useQuery({
    queryKey: [QUERY_KEY, 'totalSoldTernak', period],
    queryFn: () => getTotalSoldTernakByPeriod(period),
  })
}

export function useTotalExpense(period: TPeriod = 1) {
  return useQuery({
    queryKey: [QUERY_KEY, 'totalExpense', period],
    queryFn: () => getTotalExpenseByPeriod(period),
  })
}

export function useTotalKeuntungan(period: TPeriod = 1) {
  return useQuery({
    queryKey: [QUERY_KEY, 'totalKeuntungan', period],
    queryFn: () => getTotalKeuntunganByPeriod(period),
  })
}

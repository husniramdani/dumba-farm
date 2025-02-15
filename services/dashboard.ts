import { useQuery } from '@tanstack/react-query'

import { getTotalTernakByPeriod } from '@/db/ternak/action'

const QUERY_KEY = 'dashboard' as const

export type TPeriod = 1 | 3 | 6 | 12

export function useTotalTernak(period: TPeriod = 1) {
  return useQuery({
    queryKey: [QUERY_KEY, 'totalTernak', period],
    queryFn: () => getTotalTernakByPeriod(period),
  })
}

'use client'

import { Activity, ArrowDown, ArrowUp } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import LoadingCardSmall from '@/components/loading/cardSmall'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { currencyIDR } from '@/constants/format'
import { cn } from '@/lib/utils'
import { TPeriod, useTotalExpense } from '@/services/dashboard'

export default function CardExpense() {
  const searchParams = useSearchParams()
  const period: TPeriod = (Number(searchParams.get('period')) as TPeriod) || 1

  const { data, isLoading } = useTotalExpense(period)

  if (isLoading) return <LoadingCardSmall />

  if (!data) return <div>Data not found!</div>

  const { totalExpenseCurrentPeriod, growthPercentage } = data

  return (
    <Card>
      <CardHeader
        className={cn(
          'flex flex-row items-center justify-between space-y-0 pb-2',
          'sm:text-sm',
          'md:text-md',
        )}
      >
        <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
        <Activity size={16} />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">
          {currencyIDR.format(totalExpenseCurrentPeriod)}
        </div>
        <div className="space-x-1 flex items-center">
          <Badge variant={growthPercentage >= 0 ? 'solidGreen' : 'solidRed'}>
            {growthPercentage > 0 ? (
              <ArrowUp size={12} />
            ) : growthPercentage < 0 ? (
              <ArrowDown size={12} />
            ) : null}
            <span>{Math.abs(growthPercentage).toFixed(0)}%</span>
          </Badge>
          <span className="text-xs text-muted-foreground">
            {period} bulan terakhir
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

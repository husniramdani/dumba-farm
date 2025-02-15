'use client'

import { ArrowDown, ArrowUp, Tickets } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import LoadingCardSmall from '@/components/loading/cardSmall'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TPeriod, useTotalSoldTernak } from '@/services/dashboard'

export default function CardSelling() {
  const searchParams = useSearchParams()
  const period: TPeriod = (Number(searchParams.get('period')) as TPeriod) || 1

  const { data, isLoading } = useTotalSoldTernak(period)

  if (isLoading) return <LoadingCardSmall />

  if (!data) return <div>Data not found!</div>

  const { totalSoldCurrentPeriod, growthPercentage } = data

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Kambing Terjual</CardTitle>
        <Tickets size={16} />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">+{totalSoldCurrentPeriod}</div>
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

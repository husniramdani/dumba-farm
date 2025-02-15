'use client'

import { ArrowDown, ArrowUp, Vegan } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import LoadingCardSmall from '@/components/loading/cardSmall'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TPeriod, useTotalTernak } from '@/services/dashboard'

export default function CardTernak() {
  const searchParams = useSearchParams()
  const period: TPeriod = (Number(searchParams.get('period')) as TPeriod) || 1

  const { data, isLoading } = useTotalTernak(period)

  if (isLoading) return <LoadingCardSmall />

  if (!data) return <div>Data not found!</div>

  const { totalCurrentPeriod, growthPercentage } = data

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Jumlah Kambing</CardTitle>
        <Vegan size={16} />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">+{totalCurrentPeriod}</div>
        <div className="space-x-1 flex items-center">
          <Badge variant={growthPercentage > 0 ? 'solidGreen' : 'solidRed'}>
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

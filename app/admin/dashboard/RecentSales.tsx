'use client'

import { Cat } from 'lucide-react' // Import the specific Lucide icon
import { useSearchParams } from 'next/navigation'

import LoadingCardList from '@/components/loading/cardList'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { currencyIDR } from '@/constants/format'
import { TPeriod, useRecentSales } from '@/services/dashboard'

export function RecentSales() {
  const searchParams = useSearchParams()
  const period: TPeriod = (Number(searchParams.get('period')) as TPeriod) || 1

  const { data, isLoading } = useRecentSales(period)

  if (isLoading) {
    return <LoadingCardList />
  }

  if (!data || data.recentSales.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No recent sales found.</p>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Penjualan Terakhir</CardTitle>
        <CardDescription>
          Sudah terjual {data.totalSales} ternak dalam {period} bulan terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.recentSales.map((sale, index) => (
            <div key={index} className="flex items-center">
              <Cat />
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {sale.quantity} kg
                </p>
                <p className="text-sm text-muted-foreground">
                  {currencyIDR.format(sale.amount)}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {currencyIDR.format(sale.total)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

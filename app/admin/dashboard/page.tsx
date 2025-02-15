import CardExpense from './CardExpense'
import CardIncome from './CardIncome'
import CardSelling from './CardSelling'
import CardTernak from './CardTernak'
import { ChartOverview } from './ChartOverview'
import { RecentSales } from './RecentSales'
import SelectPeriod from './SelectPeriod'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="border-b"></div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className={cn('text-xl font-bold tracking-tight', 'lg:text-3xl')}>
            Dashboard
          </h2>
          <SelectPeriod />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardIncome />
          <CardExpense />
          <CardTernak />
          <CardSelling />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ChartOverview />
            </CardContent>
          </Card>
          <RecentSales />
        </div>
      </div>
    </div>
  )
}

import CardExpense from './CardExpense'
import CardIncome from './CardIncome'
import CardSelling from './CardSelling'
import CardTernak from './CardTernak'
import { ChartOverview } from './ChartOverview'
import { RecentSales } from './RecentSales'
import SelectPeriod from './SelectPeriod'

export default function Page() {
  return (
    <div className="flex flex-col">
      <div className="border-b"></div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <SelectPeriod />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardIncome />
          <CardExpense />
          <CardTernak />
          <CardSelling />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
          <ChartOverview />
          <RecentSales />
        </div>
      </div>
    </div>
  )
}

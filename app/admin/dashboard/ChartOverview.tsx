'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import LoadingCardSmall from '@/components/loading/cardSmall'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatIDRShort } from '@/constants/format'
import { useKeuntunganOverview } from '@/services/dashboard'

export function ChartOverview() {
  const { data, isLoading } = useKeuntunganOverview()

  if (isLoading) {
    return <LoadingCardSmall />
  }

  return (
    <Card className="col-span-5">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatIDRShort(value)}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

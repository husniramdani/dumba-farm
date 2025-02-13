'use client'

import { createColumns } from './columns'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { DataTable } from '@/components/ui/datatable'
import { MARKET_TYPE, MarketType } from '@/constants/enum'
import usePagination from '@/hooks/use-pagination'
import { useMarketPrice } from '@/services/marketPrice'

export default function MarketPricePage({
  params,
}: {
  params: { type: string }
}) {
  const { page, limit } = usePagination()
  const marketType = params.type.toUpperCase() as MarketType // Convert to uppercase to match enum
  const isValidMarketType = Object.values(MARKET_TYPE).includes(marketType)

  const { data, isLoading } = useMarketPrice({
    page,
    limit,
    marketType: isValidMarketType ? marketType : 'DAGING', // Prevent invalid calls
  })

  if (!isValidMarketType) {
    return <div className="text-red-500">Invalid market type</div>
  }

  if (isLoading || !data) return <div>Loading...</div>

  const columns = createColumns(page, limit)

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold capitalize">
        Market Price - {marketType}
      </h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/market">Harga Pasar</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>History Harga</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DataTable
        columns={columns}
        data={data.data}
        page={data.currentPage}
        totalCount={data.totalCount}
        paginateSize={limit}
      />
    </div>
  )
}

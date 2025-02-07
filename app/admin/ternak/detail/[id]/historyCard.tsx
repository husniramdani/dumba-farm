'use client'

import { createColumns } from './columns'

import { DataTable } from '@/components/ui/datatable'
import usePagination from '@/hooks/use-pagination'
import { useTernak } from '@/services/ternak'

export default function HistoryCard() {
  const { page, limit } = usePagination()
  const { data, isLoading } = useTernak({ page, limit })

  const columns = createColumns(page, limit)

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <div>
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

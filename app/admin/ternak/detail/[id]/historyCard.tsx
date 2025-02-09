'use client'

import { createColumns } from './columns'

import { DataTable } from '@/components/ui/datatable'
import usePagination from '@/hooks/use-pagination'
import { useHistoryTernak } from '@/services/historyTernak'

export default function HistoryCard({ ternakId }) {
  const { page, limit } = usePagination()
  const { data, isLoading } = useHistoryTernak({ page, limit, ternakId })

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

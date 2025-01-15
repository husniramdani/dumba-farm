'use client'

import Link from 'next/link'

import { createColumns } from './columns'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/datatable'
import usePagination from '@/hooks/use-pagination'
import { useKeuangan } from '@/services/keuangan'

export default function Page() {
  const { page, limit } = usePagination()
  const { data, isLoading } = useKeuangan({ page, limit })

  const columns = createColumns(page, limit)

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Keuangan</h1>
        <Link href="/admin/keuangan/new">
          <Button>Tambah +</Button>
        </Link>
      </div>
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

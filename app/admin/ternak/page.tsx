'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

import { columns, Ternak } from './columns'
import { DataTable } from './data-table'

import { Button } from '@/components/ui/button'
import { useFetch } from '@/lib/client-api'

export function useTernak() {
  const fetcher = useFetch()

  return useQuery({
    queryKey: ['ternak'],
    queryFn: () => fetcher<Ternak[]>('/ternak'),
  })
}

export default function Page() {
  const { data = [], isLoading } = useTernak()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <Link href="/admin/ternak/new">
        <Button>Tambah +</Button>
      </Link>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

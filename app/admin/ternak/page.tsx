'use client'

import Link from 'next/link'

import { columns } from './columns'
import { DataTable } from './data-table'

import { Button } from '@/components/ui/button'
import { useTernak } from '@/services/ternak'

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

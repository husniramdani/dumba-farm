'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { MenuActions } from './MenuActions'

import { Badge } from '@/components/ui/badge'
import { SelectHistoryTernak } from '@/db/history/schema'
import { DateCell } from '@/lib/utils'

export interface THistoryTernakTable extends SelectHistoryTernak {
  progress?: number
}

export const createColumns = (
  page: number,
  limit: number,
): ColumnDef<THistoryTernakTable>[] => [
  {
    id: 'rowNumber',
    header: () => <div>No.</div>,
    cell: ({ row }) => <div>{row.index + 1 + (page - 1) * limit}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: () => <div>Tanggal</div>,
    cell: ({ row }) => <DateCell date={row.getValue('createdAt')} />,
  },
  {
    accessorKey: 'weight',
    header: () => <div>Berat</div>,
    cell: ({ row }) => (
      <div>
        {row.getValue('weight')} <span className="text-xs">kg</span>
      </div>
    ),
  },
  {
    accessorKey: 'progress',
    header: () => <div>Progress</div>,
    cell: ({ row }) => {
      const progress = row.original.progress

      if (progress === null || progress === undefined) return <div>0.0%</div>

      return (
        <Badge variant={progress > 0 ? 'solidGreen' : 'solidRed'}>
          {progress > 0 ? (
            <ArrowUp size={14} />
          ) : progress < 0 ? (
            <ArrowDown size={14} />
          ) : null}
          <span>{Math.abs(progress).toFixed(1)}%</span>
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div>Aksi</div>,
    cell: ({ row }) => <MenuActions row={row} />,
  },
]

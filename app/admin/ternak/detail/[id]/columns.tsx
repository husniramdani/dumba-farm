'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { dateFormat } from '@/constants/format'
import { SelectHistoryTernak } from '@/db/history/schema'

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
    cell: ({ row }) => <div>{dateFormat(row.getValue('createdAt'))}</div>,
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
        <div className="flex items-center gap-1">
          {progress > 0 ? (
            <ArrowUp className="w-4 h-4 text-green-500" />
          ) : progress < 0 ? (
            <ArrowDown className="w-4 h-4 text-red-500" />
          ) : null}
          <span>{Math.abs(progress).toFixed(1)}%</span>
        </div>
      )
    },
  },
]

'use client'

import { ColumnDef } from '@tanstack/react-table'

import { currencyIDR } from '@/constants/format'
import { SelectMarketPrice } from '@/db/market-price/schema'
import { DateCell } from '@/lib/utils'

export function createColumns(
  page: number,
  limit: number,
): ColumnDef<SelectMarketPrice>[] {
  return [
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
      accessorKey: 'price',
      header: () => <div>Harga</div>,
      cell: ({ row }) => (
        <div className="font-medium">
          {currencyIDR.format(row.getValue('price'))}
        </div>
      ),
    },
    {
      accessorKey: 'source',
      header: () => <div>Sumber</div>,
      cell: ({ row }) => <div>{row.getValue('source')}</div>,
    },
  ]
}

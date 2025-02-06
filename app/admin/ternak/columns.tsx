'use client'

import { ColumnDef } from '@tanstack/react-table'

import { MenuActions } from './MenuActions'
import { ModalQrCode } from './ModalQrCode'

import { Badge } from '@/components/ui/badge'
import { dateFormat, genderFormat, statusFormat } from '@/constants/format'
import { currencyIDR } from '@/constants/format'
import { SelectTernak } from '@/db/ternak/schema'
import { convertMonthsToYearsAndMonths, convertVariant } from '@/lib/utils'

export const createColumns = (
  page: number,
  limit: number,
): ColumnDef<SelectTernak>[] => [
  {
    id: 'rowNumber',
    header: () => <div>No.</div>,
    cell: ({ row }) => <div>{row.index + 1 + (page - 1) * limit}</div>,
  },
  {
    accessorKey: 'breed',
    header: () => <div>Jenis</div>,
    cell: ({ row }) => (
      <div className="capitalize">
        {String(row.getValue('breed')).toLowerCase()}
      </div>
    ),
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
    accessorKey: 'buyPrice',
    header: () => <div>Harga Beli</div>,
    cell: ({ row }) => (
      <div>
        {currencyIDR.format(row.getValue('buyPrice'))}{' '}
        <span className="text-xs">/kg</span>
      </div>
    ),
  },
  {
    accessorKey: 'age',
    header: () => <div>Umur</div>,
    cell: ({ row }) => (
      <div>{convertMonthsToYearsAndMonths(row.getValue('age'))}</div>
    ),
  },
  {
    accessorKey: 'gender',
    header: () => <div>Kelamin</div>,
    cell: ({ row }) => (
      <div className="capitalize">
        {genderFormat[String(row.getValue('gender'))]}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <div>Status</div>,
    cell: ({ row }) => (
      <Badge variant={convertVariant(row.getValue('status'))}>
        {statusFormat[String(row.getValue('status'))]}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => <div>Tanggal Masuk</div>,
    cell: ({ row }) => <div>{dateFormat(row.getValue('createdAt'))}</div>,
  },
  {
    id: 'qrcode',
    header: () => <div>QR Code</div>,
    cell: ({ row }) => <ModalQrCode row={row} />,
  },
  {
    id: 'actions',
    header: () => <div>Aksi</div>,
    cell: ({ row }) => <MenuActions row={row} />,
  },
]

'use client'

import { useState } from 'react'
import { ColumnDef, type Row } from '@tanstack/react-table'
import { Minus, MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
// import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { categoryToSatuanFormat, dateFormat } from '@/constants/format'
import { currencyIDR } from '@/constants/format'
import { SelectKeuangan } from '@/db/keuangan/schema'
import { cn } from '@/lib/utils'
import { useDeleteKeuangan } from '@/services/keuangan'

// const convertVariant = (type: string) => {
//   if (type === 'EXPENSE') return 'destructiveOutline'
//   if (type === 'INCOME') return 'successOutline'
// }

const convertTypeToColor = (type: string) => {
  if (type === 'EXPENSE') return 'text-red-500'
  if (type === 'INCOME') return 'text-green-500'
}

export const createColumns = (
  page: number,
  limit: number,
): ColumnDef<SelectKeuangan>[] => [
  {
    id: 'rowNumber',
    header: () => <div>No.</div>,
    cell: ({ row }) => <div>{row.index + 1 + (page - 1) * limit}</div>,
  },
  // {
  //   accessorKey: 'type',
  //   header: () => <div>Tipe</div>,
  //   cell: ({ row }) => (
  //     <Badge
  //       className="capitalize"
  //       variant={convertVariant(row.getValue('type'))}
  //     >
  //       {transactionTypeFormat[String(row.getValue('type'))]}
  //     </Badge>
  //   ),
  // },
  {
    accessorKey: 'category',
    header: () => <div>Categori</div>,
    cell: ({ row }) => (
      <div className="capitalize">
        {String(row.getValue('category')).toLowerCase()}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div>Harga</div>,
    cell: ({ row }) => <div>{currencyIDR.format(row.getValue('amount'))}</div>,
  },
  {
    accessorKey: 'quantity',
    header: () => <div>Jumlah</div>,
    cell: ({ row }) => (
      <div>
        {row.getValue('quantity')}{' '}
        {categoryToSatuanFormat[row.original.category]}
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: () => <div>Total</div>,
    cell: ({ row }) => {
      const type = row.original.type
      const total = row.original.amount * row.original.quantity
      return (
        <div
          className={cn('flex gap-1 items-center', convertTypeToColor(type))}
        >
          {type === 'INCOME' ? <Plus size={16} /> : <Minus size={16} />}
          {currencyIDR.format(total)}
        </div>
      )
    },
  },

  {
    accessorKey: 'createdAt',
    header: () => <div>Tanggal</div>,
    cell: ({ row }) => <div>{dateFormat(row.getValue('createdAt'))}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]

const ActionsCell = ({ row }: { row: Row<SelectKeuangan> }) => {
  const deleteKeuangan = useDeleteKeuangan()
  const keuanganId = row.original.id
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const handleDelete = () => {
    deleteKeuangan.mutate(keuanganId)
    setShowDeleteAlert(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/keuangan/${keuanganId}`}>Ubah</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data keuangan ini akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

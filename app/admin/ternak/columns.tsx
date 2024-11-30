'use client'

import { useState } from 'react'
import { ColumnDef, type Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteTernak } from '@/hooks/services/ternak'
import { Ternak } from '@/types/ternak'

const ActionsCell = ({ row }: { row: Row<Ternak> }) => {
  const deleteTernak = useDeleteTernak()
  const ternakId = row.original.id
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const handleDelete = () => {
    deleteTernak.mutate(ternakId)
    setShowDeleteAlert(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu {row.id}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/ternak/${ternakId}`}>Ubah</Link>
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
              Tindakan ini tidak dapat dibatalkan. Data ternak ini akan dihapus
              secara permanen.
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

export const columns: ColumnDef<Ternak>[] = [
  {
    id: 'rowNumber',
    header: () => <div>#</div>,
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'age',
    header: () => <div>Umur (Bulan)</div>,
    cell: ({ row }) => <div>{row.getValue('age')}</div>,
  },
  {
    accessorKey: 'buy_price',
    header: () => <div>Harga Beli</div>,
    cell: ({ row }) => <div>{row.getValue('buy_price')}</div>,
  },

  {
    accessorKey: 'breed',
    header: () => <div>Jenis</div>,
    cell: ({ row }) => <div>{row.getValue('breed')}</div>,
  },
  {
    accessorKey: 'gender',
    header: () => <div>Gender</div>,
    cell: ({ row }) => <div>{row.getValue('gender')}</div>,
  },

  {
    accessorKey: 'status',
    header: () => <div>Status</div>,
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
  },
  {
    accessorKey: 'created_at',
    header: () => <div>Tanggal Masuk</div>,
    cell: ({ row }) => (
      <div>{new Date(row.getValue('created_at')).toLocaleString()}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]

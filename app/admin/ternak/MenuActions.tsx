import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import DrawerAddHistory from './detail/[id]/drawerAddHistory'
import { ModalJual } from './ModalJual'

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SelectTernak } from '@/db/ternak/schema'
import { useDeleteTernak } from '@/services/ternak'

export const MenuActions = ({ row }: { row: Row<SelectTernak> }) => {
  const ternakId = row.original.id
  const status = row.original.status
  const weight = row.original.weight
  const buyPrice = row.original.buyPrice

  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showJualAlert, setShowJualAlert] = useState(false)
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  const deleteTernak = useDeleteTernak()
  const handleDelete = () => {
    deleteTernak.mutate(ternakId)
    setShowDeleteAlert(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/ternak/detail/${ternakId}`}>Lihat Detail</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/ternak/${ternakId}`}>Ubah Data</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={status !== 'AVAILABLE'}
            onClick={() => setShowAddDrawer(true)}
          >
            Update Berat
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={status === 'SOLD'}
            onClick={() => setShowJualAlert(true)}
          >
            Jual Ternak
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerAddHistory
        ternakId={ternakId}
        open={showAddDrawer}
        onOpenChange={setShowAddDrawer}
      />

      <ModalJual
        ternakId={ternakId}
        showJualAlert={showJualAlert}
        setShowJualAlert={setShowJualAlert}
        weight={weight}
        buyPrice={buyPrice}
      />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data ternak dan data
              transaksi ternak ini akan dihapus secara permanen.
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

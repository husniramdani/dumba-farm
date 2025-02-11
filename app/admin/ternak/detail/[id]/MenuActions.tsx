import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useParams } from 'next/navigation'

import DrawerEditHistory from './drawerEditHistory'

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
import { SelectHistoryTernak } from '@/db/history/schema'
import { useDeleteHistoryTernak } from '@/services/historyTernak'

export const MenuActions = ({ row }: { row: Row<SelectHistoryTernak> }) => {
  const params = useParams<{ id: string }>()
  const historyId = row.original.id

  const [showEditDrawer, setShowEditDrawer] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const deleteHistoryTernak = useDeleteHistoryTernak()
  const handleDelete = () => {
    deleteHistoryTernak.mutate(historyId)
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
          <DropdownMenuItem onClick={() => setShowEditDrawer(true)}>
            Ubah
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DrawerEditHistory
        ternakId={Number(params.id)}
        historyId={historyId}
        open={showEditDrawer}
        onOpenChange={setShowEditDrawer}
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

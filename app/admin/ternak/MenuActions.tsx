import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import MoneyInputBase from '@/components/ui/money-input-base'
import { SelectTernak } from '@/db/ternak/schema'
import { useDeleteTernak, useJualTernak } from '@/services/ternak'

export const MenuActions = ({ row }: { row: Row<SelectTernak> }) => {
  const ternakId = row.original.id
  const status = row.original.status

  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showJualAlert, setShowJualAlert] = useState(false)
  const [hargaJual, setHargaJual] = useState(0)

  const deleteTernak = useDeleteTernak()
  const handleDelete = () => {
    deleteTernak.mutate(ternakId)
    setShowDeleteAlert(false)
  }

  const jualTernak = useJualTernak()
  const handleJual = () => {
    jualTernak.mutate({ id: ternakId, price: hargaJual })
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
            <Link href={`/admin/ternak/detail/${ternakId}`}>Detail</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/ternak/${ternakId}`}>Ubah</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={status === 'SOLD'}
            onClick={() => setShowJualAlert(true)}
          >
            Jual
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showJualAlert} onOpenChange={setShowJualAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ternak akan berubah menjadi
              terjual dan tidak dapat dirubah lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <Label className="text-sm mb-5 text-blue-600">
              Harga Jual (opsional)
            </Label>
            <MoneyInputBase
              placeholder="Harga jual per kilogram"
              value={hargaJual}
              onChange={setHargaJual}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleJual}>Jual</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

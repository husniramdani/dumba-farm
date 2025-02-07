import { useState } from 'react'

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
import { Label } from '@/components/ui/label'
import MoneyInputBase from '@/components/ui/money-input-base'
import { useJualTernak } from '@/services/ternak'

export const ModalJual = ({ ternakId, showJualAlert, setShowJualAlert }) => {
  const [hargaJual, setHargaJual] = useState(0)
  const jualTernak = useJualTernak()

  const handleJual = () => {
    jualTernak.mutate({ id: ternakId, price: hargaJual })
    setShowJualAlert(false)
  }

  return (
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
  )
}

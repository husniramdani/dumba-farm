import { useEffect, useState } from 'react'

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
import { currencyIDR } from '@/constants/format'
import { useJualTernak } from '@/services/ternak'

export const ModalJual = ({
  ternakId,
  showJualAlert,
  setShowJualAlert,
  weight,
  buyPrice,
}) => {
  const [hargaJual, setHargaJual] = useState(buyPrice)
  const jualTernak = useJualTernak()

  useEffect(() => {
    setHargaJual(buyPrice)
  }, [buyPrice])

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
        <div className="space-y-4">
          <div>
            <Label>Harga Jual</Label>
            <MoneyInputBase
              placeholder="Harga jual per kilogram"
              value={hargaJual}
              onChange={setHargaJual}
            />
          </div>
          <div>
            <Label className="font-semibold">Total</Label>
            <div className="flex gap-2 items-center">
              <FieldValue value={`${weight} Kg`} />
              <span>x</span>
              <FieldValue value={`${currencyIDR.format(hargaJual)} /Kg`} />
              <span>=</span>
              <FieldValue value={currencyIDR.format(hargaJual * weight)} />
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-8">
          <AlertDialogCancel className="w-full">Batal</AlertDialogCancel>
          <AlertDialogAction className="w-full" onClick={handleJual}>
            Jual
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface FieldValueProps {
  value: string | number
}

const FieldValue: React.FC<FieldValueProps> = ({ value }) => {
  return (
    <div className="py-1.5 px-2.5 border border-gray-300 rounded-sm text-sm capitalize bg-gray-100 opacity-80">
      {value}
    </div>
  )
}

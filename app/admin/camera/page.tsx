'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import QRScanner from '@/components/QRScanner/QRScanner'
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
import { getTernakById } from '@/db/ternak/action'
import { useJualTernak } from '@/services/ternak'

export default function Page() {
  const queryClient = useQueryClient()

  const [currentId, setCurrentId] = useState('')
  const [showJualAlert, setShowJualAlert] = useState(false)
  const [showSoldAlert, setSoldAlert] = useState(false)

  const [hargaJual, setHargaJual] = useState(0)
  const [weight, setWeight] = useState(0)

  const jualTernak = useJualTernak()

  const handleJual = () => {
    jualTernak.mutate({ id: Number(currentId), price: hargaJual })
    setShowJualAlert(false)
  }

  const onScanQRCode = async (id: string) => {
    setCurrentId(id)
    const freshData = await queryClient.fetchQuery({
      queryKey: ['ternakDetail', id],
      queryFn: () => getTernakById(Number(id)),
    })

    setWeight(freshData?.weight || 0)
    if (freshData?.status !== 'SOLD') {
      setShowJualAlert(true)
    } else {
      setSoldAlert(true)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-center">Scan QR</h1>
      <QRScanner onScanQRCode={onScanQRCode} />
      <div className="mt-5">
        <Label>Harga Jual</Label>
        <MoneyInputBase
          placeholder="Harga jual per kilogram"
          value={hargaJual}
          onChange={setHargaJual}
        />
      </div>

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
            <AlertDialogAction
              className="w-full"
              onClick={handleJual}
              disabled={hargaJual === 0}
            >
              Jual
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSoldAlert} onOpenChange={setSoldAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Domba sudah terjual</AlertDialogTitle>
            <AlertDialogDescription>
              Domba ini sudah terjual
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="w-full">Tutup</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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

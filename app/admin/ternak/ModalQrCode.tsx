import { useEffect, useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { QrCode as QrCodeIcon } from 'lucide-react'
import Image from 'next/image'
import QRCode from 'qrcode'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SelectTernak } from '@/db/ternak/schema'

export const ModalQrCode = ({ row }: { row: Row<SelectTernak> }) => {
  const ternakId = row.original.id
  const [QRCodeURL, setQRCodeURL] = useState('')
  const baseUrl = `${window.location.protocol}//${window.location.host}`

  useEffect(() => {
    QRCode.toDataURL(
      `${baseUrl}/admin/ternak/${ternakId}`,
      {
        width: 600,
        margin: 2,
        color: {
          dark: '#000',
          light: '#FFF',
        },
      },
      (err, url) => {
        if (err) return console.error(err)
        setQRCodeURL(url)
      },
    )
  }, [ternakId, baseUrl])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <QrCodeIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>Generated QR</DialogDescription>
        </DialogHeader>
        <div className="border mx-auto">
          <Image src={QRCodeURL} alt="qr-code" width={400} height={400} />
        </div>
        <div className="flex justify-between gap-x-4">
          <Button variant="outline" type="button" className="w-full">
            Share
          </Button>
          <Button asChild type="button" className="w-full">
            <a href={QRCodeURL} download={`qrcode-${ternakId}.png`}>
              Download
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

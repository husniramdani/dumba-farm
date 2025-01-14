'use client'

import { useEffect, useState } from 'react'
import { ColumnDef, type Row } from '@tanstack/react-table'
import { MoreHorizontal, QrCode as QrCodeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'qrcode'

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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { dateFormat, genderFormat, statusFormat } from '@/constants/format'
import { currencyIDR } from '@/constants/format'
import { SelectTernak } from '@/db/ternak/schema'
import { convertMonthsToYearsAndMonths } from '@/lib/utils'
import { useDeleteTernak } from '@/services/ternak'

const convertVariant = (status: string) => {
  if (status === 'AVAILABLE') return 'info'
  if (status === 'SOLD') return 'success'
  if (status === 'DEAD') return 'destructive'
}

export const createColumns = (page: number, limit: number): ColumnDef<SelectTernak>[] => [
  {
    id: 'rowNumber',
    header: () => <div>No.</div>,
    cell: ({ row }) => <div>{row.index + 1 + (page - 1) * limit}</div>,
  },
  // SELECT CHECKBOX
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  // },
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
    cell: ({ row }) => <QRCodeModal row={row} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]

const QRCodeModal = ({ row }: { row: Row<SelectTernak> }) => {
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

const ActionsCell = ({ row }: { row: Row<SelectTernak> }) => {
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

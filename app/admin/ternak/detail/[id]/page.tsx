'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { History } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { ModalJual } from '../../ModalJual'
import HistoryCard from './historyCard'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { currencyIDR, genderFormat, statusFormat } from '@/constants/format'
import { defaultValues, formSchema, FormSchemaType } from '@/db/ternak/schema'
import { convertMonthsToYearsAndMonths } from '@/lib/utils'
import { useTernakDetail } from '@/services/ternak'

export default function Page({ params }: { params: { id: string } }) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { data, isLoading } = useTernakDetail(Number(params.id))
  const [showJualAlert, setShowJualAlert] = useState(false)

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form])

  if (isLoading) return <div>Loading...</div>

  const status = form.getValues('status')
  const gender = genderFormat[form.getValues('gender')]
  const breed = form.getValues('breed').toLowerCase()
  const age = form.getValues('age')
  const weight = form.getValues('weight')
  const buyPrice = form.getValues('buyPrice')

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="space-y-2">
            <CardTitle>Detail Domba</CardTitle>
            {/* <CardDescription> */}
            {/*   Status: */}
            {/*   <Badge className="ml-2" variant={convertVariant(status)}> */}
            {/*     {statusFormat[String(status)]} */}
            {/*   </Badge> */}
            {/* </CardDescription> */}
          </div>

          <Button asChild>
            <Link href={`/admin/ternak/${params.id}`}>Ubah Data</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="gap-5 grid grid-cols-2">
            <div>
              <Label>Jenis Kelamin</Label>
              <FieldValue value={gender} />
            </div>

            <div>
              <Label>Jenis Domba</Label>
              <FieldValue value={breed} />
            </div>

            <div>
              <Label>Umur</Label>
              <FieldValue value={convertMonthsToYearsAndMonths(age)} />
            </div>

            <div>
              <Label>Berat</Label>
              <FieldValue value={`${weight} Kg`} />
            </div>

            <div>
              <Label>Status</Label>
              <FieldValue value={statusFormat[String(status)]} />
            </div>

            <div>
              <Label>Harga Beli</Label>
              <FieldValue value={`${currencyIDR.format(buyPrice)} /Kg`} />
            </div>
          </div>
          {status === 'AVAILABLE' && (
            <Button
              className="w-full mt-5"
              onClick={() => setShowJualAlert(true)}
            >
              Jual
            </Button>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-x-2">
            <History />
            History Berat
          </CardTitle>
          <Button>Update Berat</Button>
        </CardHeader>
        <CardContent>
          <HistoryCard />
        </CardContent>
      </Card>

      <ModalJual
        ternakId={params.id}
        showJualAlert={showJualAlert}
        setShowJualAlert={setShowJualAlert}
      />
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

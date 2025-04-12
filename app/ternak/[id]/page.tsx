'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { History } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { currencyIDR, genderFormat, statusFormat } from '@/constants/format'
import { defaultValues, formSchema, FormSchemaType } from '@/db/ternak/schema'
import { convertMonthsToYearsAndMonths } from '@/lib/utils'
import { useTernakDetail } from '@/services/ternak'
import { useHistoryTernak } from '@/services/historyTernak'

export default function Page({ params }: { params: { id: string } }) {
  const { user } = useUser()
  const router = useRouter()
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { data, isLoading } = useTernakDetail(Number(params.id))
  const { data: historyData, isLoading: isHistoryLoading } = useHistoryTernak({ 
    page: 1, 
    limit: 10, 
    ternakId: Number(params.id)
  })

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form])

  useEffect(() => {
    if (user) {
      router.push(`/admin/ternak/detail/${params.id}`)
    }
  }, [user, router, params.id])

  if (isLoading) return <div>Loading...</div>

  const status = form.getValues('status')
  const gender = genderFormat[form.getValues('gender')]
  const breed = form.getValues('breed').toLowerCase()
  const age = form.getValues('age')
  const weight = form.getValues('weight')
  const buyPrice = form.getValues('buyPrice')

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Detail Domba</CardTitle>
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <History />
            History Berat
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isHistoryLoading ? (
            <div>Loading...</div>
          ) : historyData?.data ? (
            <div className="space-y-4">
              {historyData.data.map((history) => (
                <div
                  key={history.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{history.weight} Kg</div>
                    <div className="text-sm text-gray-500">
                      {new Date(history.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Tidak ada history</div>
          )}
        </CardContent>
      </Card>
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
'use client'

import { useEffect, useState } from 'react'
import { RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HargaDomba {
  price: number
  date: string
  source: string
}

export default function Page() {
  const [data, setData] = useState<HargaDomba | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/scrapping')
      const result = await response.json()

      if (response.ok) {
        setData(result)
      } else {
        setError(result.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Error fetching data from server', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) return <div>Loading...</div>

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="text-sm font-medium">
          Harga Daging Domba
        </CardTitle>
        <Button onClick={() => fetchData()} className="absolute top-5 right-5">
          <RefreshCcw />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          Rp {data?.price?.toLocaleString('id-ID')}
        </div>
        <p className="text-xs text-muted-foreground">
          Update terakhir: {data?.date}
        </p>
        <p className="text-xs text-muted-foreground">Sumber: {data?.source}</p>
      </CardContent>
    </Card>
  )
}

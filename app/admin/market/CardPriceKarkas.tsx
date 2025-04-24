'use client'

import { useState } from 'react'
import axios from 'axios'
import { RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { dateFormat } from '@/constants/format'
import { cn } from '@/lib/utils'
import { useLastMarketPrice } from '@/services/marketPrice'

export default function CardPriceKarkas() {
  const { data, isLoading, error, refetch } = useLastMarketPrice('KARKAS')
  const [isScraping, setIsScraping] = useState(false)

  const handleScrapeAndRefetch = async () => {
    setIsScraping(true)
    try {
      await axios.get('/api/karkas')
      await refetch()
      toast.success('Harga terbaru berhasil discrapping')
    } catch (err) {
      console.error('Error scraping market price:', err)
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="font-medium">Harga Karkas</CardTitle>
        <Button
          size="sm"
          onClick={handleScrapeAndRefetch}
          className="absolute top-5 right-5"
          disabled={isScraping}
        >
          <span className={cn(isScraping && 'animate-spin')}>
            <RefreshCcw />
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Skeleton Loader when loading */}
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 animate-pulse rounded w-1/2"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">Error loading price</div>
        ) : data ? (
          <>
            <div className="text-2xl font-bold">
              Rp {data.price.toLocaleString('id-ID')} /kg
            </div>
            <p className="text-xs text-muted-foreground">
              Update terakhir: {dateFormat(data?.createdAt)}
            </p>
            <p className="text-xs text-muted-foreground">
              Sumber: {data.source}
            </p>
          </>
        ) : (
          <p className="text-gray-500">Data harga tidak tersedia.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="w-full">
          <Link href="/admin/market/karkas">Lihat History</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

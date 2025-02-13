import axios from 'axios'
import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { InsertMarketPrice } from '@/db/market-price/schema'
import { marketPriceTable } from '@/db/market-price/schema'

export async function GET() {
  try {
    console.log(
      'Fetching data from: https://simponiternak.pertanian.go.id/harga-daerah.php',
    )

    const url = 'https://simponiternak.pertanian.go.id/harga-daerah.php'
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    const dombaRow = $('table tbody tr').filter((_, element) => {
      return $(element).find('td').first().text().includes('Domba')
    })

    const dateColumns = $('table thead th')
      .toArray()
      .map((th) => $(th).text().trim())

    const lastDate = dateColumns[dateColumns.length - 3]

    const priceText = dombaRow
      .find('td')
      .eq(dateColumns.length - 3)
      .text()
      .trim()

    const numericString = priceText.replace(/[^\d]/g, '')
    const price = Number(numericString)

    console.log('Fetched Data', { price, lastDate })

    const marketPriceData: InsertMarketPrice = {
      price,
      source: 'Simponi Ternak',
      type: 'DAGING',
    }

    await db.insert(marketPriceTable).values(marketPriceData).returning()

    return NextResponse.json(marketPriceData)
  } catch (error) {
    console.error('Error fetching lamb price', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data harga daging domba' },
      { status: 500 },
    )
  }
}

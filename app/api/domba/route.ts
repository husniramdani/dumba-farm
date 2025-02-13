import axios from 'axios'
import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { InsertMarketPrice, marketPriceTable } from '@/db/market-price/schema'

// Configure the function to run every hour
export const config = {
  runtime: 'nodejs', // or 'edge' if you prefer
  schedule: '*/5 * * * * *', // runs every 5 seconds for debugging
}

export async function GET() {
  try {
    const url = 'https://taniku.kulonprogokab.go.id/siganak/domba'
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    let targetPrice = 0

    // Find the header <b> element that contains "kurus betina muda"
    const headerElem = $('table#example1 tbody tr td[colspan="2"] center b')
      .filter((i, el) => $(el).text().includes('kurus betina muda'))
      .first()

    if (headerElem.length) {
      // Get the tbody that contains the header row.
      const headerTbody = headerElem.closest('tbody')
      // The next sibling tbody contains the price rows.
      const priceTbody = headerTbody.next('tbody')

      // Within this tbody, find the row that contains "Harga Terendah"
      const lowestPriceRow = priceTbody
        .find('tr')
        .filter((i, el) => {
          return $(el)
            .find('td')
            .first()
            .text()
            .trim()
            .includes('Harga Terendah')
        })
        .first()

      if (lowestPriceRow.length) {
        // In this row, the second <td> (index 1) holds the price
        const priceText = lowestPriceRow.find('td').eq(1).text().trim() // e.g. "Rp. 1.500.000,00-"
        const match = priceText.match(/Rp\.?\s*([\d\.,]+)/)
        if (match) {
          // Remove thousand separators and convert comma to dot
          const numericStr = match[1].replace(/\./g, '').replace(',', '.')
          targetPrice = parseFloat(numericStr)
        }
      }
    }

    const marketPriceData: InsertMarketPrice = {
      price: targetPrice,
      source: 'Taniku - Domba ekor kurus betina muda (Harga Terendah)',
      type: 'DOMBA',
    }

    console.log(
      'Cron Debug: Scraped price',
      targetPrice,
      'at',
      new Date().toISOString(),
    )

    await db.insert(marketPriceTable).values(marketPriceData).returning()

    // Optionally, you could also return the data directly:
    return NextResponse.json(marketPriceData)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to scrape Taniku Domba page' },
      { status: 500 },
    )
  }
}

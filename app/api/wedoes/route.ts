import axios from 'axios'
import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { marketPriceTable } from '@/db/market-price/schema'

export async function GET() {
  try {
    const url = 'https://wedoes.co/harga-produk-daging/'
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    let dagingMurniPrice = 0

    $('div.elementor-widget-container p').each((_, el) => {
      const blockText = $(el).text().trim()
      // e.g. "Karkas\nRp 150.000/Kg"

      // 1) Check if this block references "Karkas"
      if (blockText.includes('Karkas')) {
        // 2) Split on newlines, in case it’s on multiple lines
        const lines = blockText.split('\n')

        // lines might be: ["Karkas", "Rp 150.000/Kg"]
        for (const line of lines) {
          // if a line has "Rp" and "/Kg", we try to parse a number
          if (line.includes('Rp') && line.includes('/Kg')) {
            // 3) Extract only the number part that appears just before "/Kg"
            //    This pattern captures e.g. "150.000" in "Rp 150.000/Kg"
            const match = line.match(/Rp\s*((?:\d{1,3}\.)*\d{1,3})(?=\/Kg)/)
            // Explanation:
            //  Rp\s*               => "Rp" + optional spaces
            //  ((?:\d{1,3}\.)*\d{1,3}) => digits possibly in groups of 3 separated by "."
            //  (?=\/Kg)            => a lookahead that ensures we stop just before "/Kg"

            if (match) {
              // e.g. match[1] = "150.000"
              const numericStr = match[1].replace(/\./g, '') // "150000"
              dagingMurniPrice = parseInt(numericStr, 10) // 150000
            }
          }
        }
      }
    })

    const marketPriceData = {
      price: dagingMurniPrice,
      date: new Date(),
      source: 'Wedoes - Karkas',
    }

    // TODO: make it not duplicate in the same date
    // this should be running once
    await db.insert(marketPriceTable).values(marketPriceData).returning()

    if (!dagingMurniPrice) {
      return NextResponse.json(
        {
          error: 'Daging Murni price not found',
        },
        { status: 404 },
      )
    }

    return NextResponse.json(marketPriceData)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to scrape Wedoes' },
      { status: 500 },
    )
  }
}

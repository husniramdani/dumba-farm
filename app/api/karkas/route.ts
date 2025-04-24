import axios from 'axios'
import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

import { db } from '@/db'
import { InsertMarketPrice } from '@/db/market-price/schema'
import { marketPriceTable } from '@/db/market-price/schema'

export async function GET() {
  try {
    const url = 'https://wedoes.co/harga-produk-daging/'
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    let karkasPrice = 0

    // Find the element containing "Karkas" text and its price
    $('div.elementor-widget-container').each((_, el) => {
      const blockText = $(el).text().trim()
      console.log('Checking block text:', blockText)
      
      if (blockText.toLowerCase().includes('karkas')) {
        console.log('Found Karkas block:', blockText)
        
        // Extract price using a more flexible pattern that matches various price formats
        const priceMatch = blockText.match(/(?:rp\.?|idr)\s*((?:\d{1,3}\.)*\d{1,3})(?:\/kg|\s*per\s*kg|\s*\/\s*kilogram)/i)
        
        if (priceMatch) {
          console.log('Found price match:', priceMatch[0])
          // Remove thousand separators and convert to number
          const numericStr = priceMatch[1].replace(/\./g, '')
          const parsedPrice = parseInt(numericStr, 10)
          
          if (!isNaN(parsedPrice) && parsedPrice > 0) {
            console.log('Valid price found:', parsedPrice)
            karkasPrice = parsedPrice
          } else {
            console.log('Invalid price value:', parsedPrice)
          }
        } else {
          console.log('No price pattern found in this block')
        }
      }
    })

    console.log('Final karkas price:', karkasPrice)

    if (!karkasPrice) {
      return NextResponse.json(
        {
          error: 'Karkas price not found',
        },
        { status: 404 },
      )
    }

    const marketPriceData: InsertMarketPrice = {
      price: karkasPrice,
      source: 'Wedoes - Karkas',
      type: 'KARKAS',
      createdAt: new Date().toISOString()
    }

    await db.insert(marketPriceTable).values(marketPriceData).returning()

    return NextResponse.json(marketPriceData)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to scrape Wedoes' },
      { status: 500 },
    )
  }
}

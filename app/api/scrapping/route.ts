// app/api/harga-domba/route.ts
import axios from 'axios'
import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log(
      'Fetching data from: https://simponiternak.pertanian.go.id/harga-daerah.php',
    )

    const url = 'https://simponiternak.pertanian.go.id/harga-daerah.php'
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)

    // Find the row containing "Domba"
    const dombaRow = $('table tbody tr').filter((_, element) => {
      return $(element).find('td').first().text().includes('Domba')
    })

    // Extract the last date and price for "Domba" from the table
    const dateColumns = $('table thead th')
      .toArray()
      .map((th) => $(th).text().trim())
    const lastDate = dateColumns[dateColumns.length - 3] // Date for 01/02/2025
    const priceText = dombaRow
      .find('td')
      .eq(dateColumns.length - 3)
      .text()
      .trim() // Price for 01/02/2025
    const price = Number(priceText.replace(/[Rp.,\s]/g, ''))

    console.log('Fetched Data:', { price, lastDate }) // Logging fetched data for debugging

    return NextResponse.json({
      price,
      date: lastDate,
      source: 'Simponi Ternak',
    })
  } catch (error) {
    console.error('Error fetching lamb price:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data harga daging domba' },
      { status: 500 },
    )
  }
}

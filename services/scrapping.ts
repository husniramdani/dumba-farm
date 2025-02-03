import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import * as cheerio from 'cheerio'

export const QUERY_KEY = 'harga-domba'

interface HargaDomba {
  price: number
  date: string
  source: string
}

async function fetchHargaDomba(): Promise<HargaDomba> {
  try {
    const url = 'https://simponiternak.pertanian.go.id/harga-daerah.php'
    const response = await axios.get(url)

    // Log the HTML to check the response
    const html = response.data
    console.log('HTML Response:', html)

    const $ = cheerio.load(html)

    // Log the structure of the table to ensure it's what we expect
    console.log('Table Structure:', $('table').html())

    // Find the row that contains "Domba"
    const dombaRow = $('table tbody tr').filter((_, element) => {
      return $(element).text().includes('Domba')
    })

    if (dombaRow.length === 0) {
      throw new Error('Domba row not found')
    }

    // Extract the date and price from the relevant row
    const lastDate = dombaRow.find('td:first-child').text().trim()
    const priceText = dombaRow.find('td:nth-child(2)').text().trim()

    if (!lastDate || !priceText) {
      throw new Error('Price or date missing for Domba')
    }

    const price = Number(priceText.replace(/[Rp.,\s]/g, ''))

    if (isNaN(price)) {
      throw new Error('Invalid price format')
    }

    return {
      price,
      date: lastDate,
      source: 'Simponi Ternak',
    }
  } catch (error) {
    console.error('Error fetching lamb price:', error)
    throw new Error('Gagal mengambil data harga daging domba')
  }
}

export function useHargaDomba() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchHargaDomba,
    // staleTime: 1000 * 60 * 60, // Data dianggap stale setelah 1 jam
    // gcTime: 1000 * 60 * 60 * 24, // Cache data selama 24 jam
  })
}

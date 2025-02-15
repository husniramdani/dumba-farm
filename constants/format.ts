export const currencyIDR = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const genderFormat = {
  MALE: 'jantan',
  FEMALE: 'betina',
}

export const statusFormat = {
  AVAILABLE: 'Hidup',
  DEAD: 'Mati',
  SOLD: 'Terjual',
}

export const transactionTypeFormat = {
  EXPENSE: 'Pengeluaran',
  INCOME: 'Pemasukan',
}

export function dateFormat(date: string | Date | null | undefined) {
  if (!date) return 'Invalid Date' // Handle null or undefined values

  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) return 'Invalid Date' // Handle invalid dates

  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return formatter.format(parsedDate)
}

export const categoryToSatuanFormat = {
  TERNAK: 'kg',
  PAKAN: 'kg',
  OBAT: 'pcs',
  PEGAWAI: 'orang',
}

export function formatIDRShort(value: number): string {
  const absValue = Math.abs(value) // Convert to positive for formatting
  let formatted: string

  if (absValue >= 1_000_000) {
    formatted = `${(absValue / 1_000_000).toFixed(absValue % 1_000_000 === 0 ? 0 : 1)} jt`
  } else if (absValue >= 1_000) {
    formatted = `${(absValue / 1_000).toFixed(absValue % 1_000 === 0 ? 0 : 1)}k`
  } else {
    formatted = absValue.toString()
  }

  return value < 0 ? `-${formatted}` : formatted // Add minus sign if negative
}

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

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

export function dateFormat(value) {
  const date = new Date(value)
  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return formatter.format(date)
}

export const categoryToSatuanFormat = {
  TERNAK: 'kg',
  PAKAN: 'kg',
  OBAT: 'pcs',
  PEGAWAI: 'orang',
}

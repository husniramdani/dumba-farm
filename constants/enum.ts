export const GENDER = ['MALE', 'FEMALE'] as const

export const BREED = ['GARUT', 'LOKAL', 'PRIANGAN', 'DORPER'] as const

export const STATUS = ['AVAILABLE', 'DEAD', 'SOLD'] as const

export const TRANSACTION_TYPE = ['INCOME', 'EXPENSE'] as const

export const TRANSACTION_CATEGORY = [
  'TERNAK',
  'PAKAN',
  'OBAT',
  'PEGAWAI',
] as const

export const MARKET_TYPE = ['DAGING', 'KARKAS', 'DOMBA'] as const

export type MarketType = (typeof MARKET_TYPE)[number]

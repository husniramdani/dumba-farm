import { columns, Payment } from './columns'
import { DataTable } from './data-table'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 1000000,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52k',
      amount: 1000000,
      status: 'pending',
      email: 'a@kxample.com',
    },
    // ...
  ]
}

export default async function Page() {
  const data = await getData()

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

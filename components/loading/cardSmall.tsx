import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function LoadingCardSmall() {
  return (
    <Card className="space-y-2 p-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </Card>
  )
}

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingCardList() {
  return (
    <Card className="col-span-3">
      <CardHeader></CardHeader>
      <CardContent>
        <div className="space-y-8">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="ml-4 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="ml-auto">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

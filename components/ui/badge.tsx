import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-green-600 text-white hover:bg-green-500',
        warning:
          'border-transparent bg-yellow-600 text-white hover:bg-yellow-500',
        info: 'border-transparent bg-blue-600 text-white hover:bg-blue-500',
        // Additional outline variants for more styling options
        successOutline:
          'border-green-500 text-green-500 bg-transparent hover:bg-green-50',
        warningOutline:
          'border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-50',
        infoOutline:
          'border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

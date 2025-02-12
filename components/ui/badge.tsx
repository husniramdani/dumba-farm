import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
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
        // New additional variants for more color options
        solidGreen:
          'border-transparent bg-green-100 text-green-600 hover:bg-green-200',
        solidRed: 'border-transparent bg-red-100 text-red-600 hover:bg-red-200',
        solidBlue:
          'border-transparent bg-blue-100 text-blue-600 hover:bg-blue-200',
        solidYellow:
          'border-transparent bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
        solidPurple:
          'border-transparent bg-purple-100 text-purple-600 hover:bg-purple-200',
        // Outline variants for the new colors
        outlineGreen:
          'border-green-500 text-green-500 bg-transparent hover:bg-green-50',
        outlineRed:
          'border-red-500 text-red-500 bg-transparent hover:bg-red-50',
        outlineBlue:
          'border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50',
        outlineYellow:
          'border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-50',
        outlinePurple:
          'border-purple-500 text-purple-500 bg-transparent hover:bg-purple-50',
      },
      size: {
        sm: 'text-xs py-0.5 px-1.5',
        md: 'text-sm py-1 px-2.5',
        lg: 'text-base py-1.5 px-3',
        xl: 'text-lg py-2 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
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

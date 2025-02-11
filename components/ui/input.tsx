import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      inputSize: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-3 py-1 text-sm',
        lg: 'h-12 py-2 text-lg',
        xl: 'h-14 py-3 text-xl',
      },
    },
    defaultVariants: {
      inputSize: 'md',
    },
  },
)

export interface InputProps
  extends React.ComponentProps<'input'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, inputSize, ...props }, ref) => {
    if (type === 'number' && value === 0) {
      value = ''
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number') {
        const newValue = e.target.value === '' ? 0 : Number(e.target.value)
        onChange?.(
          Object.assign({}, e, {
            target: { ...e.target, value: newValue },
          }),
        )
        return
      }
      onChange?.(e)
    }

    return (
      <input
        type={type}
        ref={ref}
        value={value}
        onChange={handleChange}
        className={cn(inputVariants({ inputSize }), className)}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }

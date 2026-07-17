import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<any, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
      {
        'bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90': variant === 'default',
        'bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200': variant === 'secondary',
        'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900': variant === 'outline',
        'hover:bg-slate-100 hover:text-slate-900': variant === 'ghost',
        'text-slate-900 underline-offset-4 hover:underline': variant === 'link',
        'h-9 px-4 py-2': size === 'default',
        'h-8 rounded-md px-3 text-xs': size === 'sm',
        'h-10 rounded-md px-8': size === 'lg',
        'h-9 w-9': size === 'icon',
      },
      className
    )

    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<any>
      return React.cloneElement(child, {
        ...props,
        ...child.props,
        className: cn(classes, child.props.className),
        ref: (node: any) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as any).current = node
          const { ref: childRef } = child as any
          if (typeof childRef === 'function') childRef(node)
          else if (childRef) (childRef as any).current = node
        }
      })
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

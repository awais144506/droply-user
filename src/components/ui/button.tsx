import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Default is now your Sky-600 Theme
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        
        // Destructive is your Rose
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white",
          
        // Outline is your standard neutral back/cancel button
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          
        // Secondary is a soft grey
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          
        // Ghost is invisible until hover
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // Link looks like text
        link: "text-primary underline-offset-4 hover:underline",

        //  NEW: Success variant (Emerald) for Saves, Finalizing Sales, Enables
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
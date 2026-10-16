import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        // Frosted Sky Glass (Your signature look, elevated with inner specular highlight & blur)
        default:
          "bg-sky-500/15 text-sky-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] hover:bg-sky-500/25 hover:border-sky-400/80 hover:text-white-700 hover:shadow-sm hover:shadow-sky-500/10",

        // Frosted Emerald Glass (Saves, Finalizing Sales, WhatsApp, Approvals)
        success:
          "bg-emerald-500/15 text-emerald-700 border border-emerald-400/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] hover:bg-emerald-500/25 hover:border-emerald-400/80 hover:text-emerald-800 hover:shadow-sm hover:shadow-emerald-500/10",

        // Frosted Rose Glass (Deletes, Rejections, Cancellations)
        destructive:
          "bg-rose-500/15 text-rose-700 border border-rose-400/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] hover:bg-rose-500/25 hover:border-rose-400/80 hover:text-white hover:shadow-sm hover:shadow-rose-500/10",

        // Frosted Amber Glass (Warnings, Reschedule, Wastage)
        warning:
          "bg-amber-500/15 text-amber-800 border border-amber-400/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] hover:bg-amber-500/25 hover:border-amber-400/80 hover:text-amber-900 hover:shadow-sm hover:shadow-amber-500/10",

        // Frosted Indigo Glass (Invoices, Upgrades, Special Actions)
        indigo:
          "bg-indigo-500/15 text-indigo-700 border border-indigo-400/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] hover:bg-indigo-500/25 hover:border-indigo-400/80 hover:text-indigo-800 hover:shadow-sm hover:shadow-indigo-500/10",

        // Clear White Glass (Outline / Neutral Back & Filter buttons)
        outline:
          "bg-white/70 text-slate-700 border border-slate-200/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] hover:bg-slate-100/70 hover:text-slate-900 hover:border-slate-300",

        // Smoked Slate Glass (Secondary actions)
        secondary:
          "bg-slate-500/10 text-slate-700 border border-slate-300/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] hover:bg-slate-500/20 hover:text-slate-900 hover:border-slate-300",

        // Ghost (Invisible until hover, then turns into soft frosted glass)
        ghost:
          "text-slate-600 hover:bg-slate-500/10 hover:text-slate-900 hover:backdrop-blur-sm",

        // Link
        link:
          "text-sky-600 font-bold underline-offset-4 hover:underline active:scale-100 backdrop-blur-none",
      },
      size: {
        default: "h-10 px-4 py-2 text-xs sm:text-sm",
        xs: "h-7 rounded-lg px-2.5 text-[11px] font-bold",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm sm:text-base font-bold",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
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
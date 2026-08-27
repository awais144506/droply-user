import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex cursor-pointer shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-[0.5px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-sm focus-visible:ring-primary/30",
        create:
          "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 hover:shadow-sm focus-visible:border-emerald-600 focus-visible:ring-emerald-500/30 dark:bg-emerald-600 dark:hover:bg-emerald-500",
        destructive:
          "bg-rose-600 text-white shadow-xs hover:bg-rose-700 hover:shadow-sm focus-visible:border-rose-600 focus-visible:ring-rose-500/30 dark:bg-rose-600 dark:hover:bg-rose-500",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted/80 hover:text-foreground active:bg-muted dark:border-input dark:bg-input/20 dark:hover:bg-input/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 focus-visible:ring-secondary/40",
        ghost:
          "hover:bg-muted/80 hover:text-foreground active:bg-muted dark:hover:bg-muted/50",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
        normal: "bg-gray-200 text-black"
      },
      size: {
        default: "h-9 px-4 py-2 gap-2 text-sm",
        sm: "h-8 rounded-md px-3 gap-1.5 text-xs font-medium",
        lg: "h-10 rounded-lg px-5 gap-2 text-sm font-semibold",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
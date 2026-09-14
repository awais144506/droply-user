"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-bold",
          success: "!bg-emerald-600 !text-white !border-emerald-600 [&>svg]:!text-white",
          error: "!bg-rose-600 !text-white !border-rose-600 [&>svg]:!text-white",
          warning: "!bg-amber-500 !text-white !border-amber-600 [&>svg]:!text-white",
          info: "!bg-sky-500 !text-white !border-sky-600 [&>svg]:!text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
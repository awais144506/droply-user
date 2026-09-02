"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: (Error & { digest?: string }) | string | undefined;
  reset?: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  // Safely extract the error message without shadowing global constructors
  const errorMessage =
    typeof error === "string"
      ? error
      : error && typeof error === "object" && "message" in error
      ? String(error.message)
      : "The requested tenant plant could not be resolved.";

  return (
    <div className="p-8">
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center max-w-md mx-auto">
        <ShieldAlert className="mx-auto h-8 w-8 text-destructive mb-2" />
        <h2 className="text-base font-semibold text-destructive">
          Something went wrong
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {errorMessage}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {reset && (
            <button
              onClick={() => reset()}
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Try Again
            </button>
          )}
          <Link
            href="/app"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
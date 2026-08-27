"use client"
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const Error = ({ error }: { error: string | undefined }) => {
    return (
        <div className="p-8">
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-destructive mb-2" />
                <h2 className="text-base font-semibold text-destructive">
                    Not Found
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    {error || "The requested tenant plant could not be resolved."}
                </p>
                <div className="mt-4">
                    <Link href="/branches" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Error
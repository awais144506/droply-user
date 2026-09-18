import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CreateFormHeaderProps {
    title: string;
    description?: string;
    href: string;
    children?: React.ReactNode;
}

export default function CreateFormHeader({ 
    title, 
    description, 
    href, 
    children 
}: CreateFormHeaderProps) {
    return (
        <div className="flex flex-col gap-4 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left Side: Back Button & Titles */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={href} 
                        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "shrink-0 shadow-sm")}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-4 w-4 text-slate-600" />
                    </Link>
                    
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-slate-500 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side: Optional Actions */}
                {children && (
                    <div className="flex items-center gap-3 shrink-0">
                        {children}
                    </div>
                )}
                
            </div>
            
            <Separator className="bg-slate-200/60" />
        </div>
    );
}
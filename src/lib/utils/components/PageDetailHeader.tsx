import React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Shadcn Imports
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

type PageDetailHeaderProps = {
    href: string;
    heading?: string;
    description: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    breadcrumbs?: { label: string; href?: string }[];
    children?: React.ReactNode;
};

export default function PageDetailHeader({
    href,
    heading,
    description,
    createdAt,
    updatedAt,
    breadcrumbs,
    children,
}: PageDetailHeaderProps) {
    return (
        <div className="flex flex-col gap-4 pb-6">

            {/* 1. Optional Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={crumb.label}>
                                    <BreadcrumbItem>
                                        {isLast || !crumb.href ? (
                                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink>
                                                <Link href={crumb.href}>{crumb.label}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}

            {/* 2. Main Layout (Title + Meta + Actions) */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                {/* Left Side: Back Button & Titles */}
                <div className="flex items-start gap-4">
                    <Link
                        href={href}
                        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "shrink-0 mt-0.5 shadow-sm")}
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-4 w-4 text-slate-600" />
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 line-clamp-1">
                            {heading}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                            {description}
                        </p>

                        {/* Metadata Strip */}
                        {(createdAt || updatedAt) && (
                            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400 mt-3">
                                {createdAt && (
                                    <div className="flex items-center gap-1.5" title="Date Created">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        <span>Created {format(new Date(createdAt), 'MMM d, yyyy • h:mm a')}</span>
                                    </div>
                                )}

                                {createdAt && updatedAt && (
                                    <div className="hidden sm:block h-3.5 w-px bg-slate-200"></div>
                                )}

                                {updatedAt && (
                                    <div className="flex items-center gap-1.5" title="Last Updated">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Action Buttons */}
                {children && (
                    <div className="flex flex-wrap w-full sm:w-auto items-center gap-3 shrink-0">
                        {children}
                    </div>
                )}

            </div>

            {/* 3. Subtle Shadcn Separator */}
            <Separator className="mt-2 bg-slate-200/60" />
        </div>
    );
}
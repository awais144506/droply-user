"use client"
import React from "react";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

type PageDetailHeaderProps = {
    heading?: string;
    description: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    breadcrumbs?: { label: string; href?: string }[];
    children?: React.ReactNode;
};

export default function PageDetailHeader({
    heading,
    description,
    createdAt,
    updatedAt,
    breadcrumbs,
    children,
}: PageDetailHeaderProps) {
    // Helper to safely parse and validate dates
    const isValidDate = (date?: string | Date) => {
        if (!date) return false;
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
    };

    return (
        <div className="flex flex-col gap-3 pb-6">

            {/* 1. Optional Breadcrumbs with Distinguishable Active State */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        {!isLast && item.href ? (
                                            <BreadcrumbLink>
                                                <Link href={item.href} className="text-slate-500 hover:text-slate-900 transition-colors">
                                                    {item.label}
                                                </Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className="text-sky-600 font-semibold">
                                                {item.label}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="text-slate-400" />}
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

                    <div>
                        {heading && (
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 line-clamp-1">
                                {heading}
                            </h1>
                        )}
                        {description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                {description}
                            </p>
                        )}

                        {/* Metadata Strip */}
                        {(isValidDate(createdAt) || isValidDate(updatedAt)) && (
                            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400 mt-2.5">
                                {isValidDate(createdAt) && (
                                    <div className="flex items-center gap-1.5" title="Date Created">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        <span>Created {format(new Date(createdAt!), 'MMM d, yyyy • h:mm a')}</span>
                                    </div>
                                )}

                                {isValidDate(createdAt) && isValidDate(updatedAt) && (
                                    <div className="hidden sm:block h-3.5 w-px bg-slate-200"></div>
                                )}

                                {isValidDate(updatedAt) && (
                                    <div className="flex items-center gap-1.5" title="Last Updated">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Updated {formatDistanceToNow(new Date(updatedAt!), { addSuffix: true })}</span>
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
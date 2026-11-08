"use client"
import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemType {
    label: string;
    href?: string;
}

interface CreateFormHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItemType[];
    children?: React.ReactNode;
}

export default function CreateFormHeader({
    title,
    description,
    breadcrumbs,
    children,
}: CreateFormHeaderProps) {
    return (
        <div className="flex flex-col gap-3 pb-6">
            {/* Optional Breadcrumbs with Distinguishable Active State */}
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Side: Back Button & Titles */}
                <div className="flex items-center gap-4">
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

            <Separator className="bg-slate-200/60 mt-1" />
        </div>
    );
}
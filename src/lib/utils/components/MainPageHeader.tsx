import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

type Props = {
    heading: string;
    description: string;
    href?: string;
    btnText?: string;
    isDisabled?: boolean;
    breadcrumbs?: { label: string; href?: string }[];
    children?: React.ReactNode;
}

export default function MainPageHeader({
    heading,
    description,
    href,
    btnText,
    isDisabled = false,
    breadcrumbs,
    children
}: Props) {
    return (
        <div className="flex flex-col gap-4 pb-6">

            {/* 1. Optional Shadcn Breadcrumbs */}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {heading}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {description}
                    </p>
                </div>

                {/* Actions Container */}
                <div className="flex items-center gap-3 shrink-0">
                    {children}
                    {href && btnText && (
                        <Link
                            href={isDisabled ? "#" : href}
                            className={`${buttonVariants({ variant: "default" })} ${isDisabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                                }`}
                            aria-disabled={isDisabled}
                            tabIndex={isDisabled ? -1 : undefined}
                        >
                            <Plus className="h-4 w-4 mr-2 shrink-0" />
                            {btnText}
                        </Link>
                    )}
                </div>
            </div>
            <Separator className="mt-2 bg-slate-200/60" />
        </div>
    );
}
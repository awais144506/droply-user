"use client";

import Link from "next/link";
import { MapPin, Users, Package, Wallet, ArrowRight } from "lucide-react";
import { ZoneDetails } from "../../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

interface ZoneCardProps {
    zones: ZoneDetails[];
}

export function ZoneCard({ zones }: ZoneCardProps) {
    if (!zones || zones.length === 0) {
        return (
            <Card className="border-dashed shadow-none p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
                <MapPin className="h-9 w-9 sm:h-10 sm:w-10 text-slate-300 mb-3 sm:mb-4" />
                <h3 className="text-sm font-bold text-slate-900">No Zones Found</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
                    Get started by creating your first delivery zone to assign customers and riders.
                </p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {zones.map((zone, index) => {
                const zoneNumber = index + 1;
                return (
                    <Card
                        key={zone.id}
                        className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
                    >
                        {/* Header: Icon, Badge, Name, and Customer Count */}
                        <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 p-4 sm:p-5 pb-3 sm:pb-4 space-y-0">
                            <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 shrink-0">
                                        ZONE {zoneNumber}
                                    </span>
                                    <CardTitle className="text-sm sm:text-[15px] font-bold text-slate-900 truncate">
                                        {zone.name}
                                    </CardTitle>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 text-slate-700">
                                    <Users className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                    <span className="text-xs sm:text-sm font-bold">
                                        {zone.customers?.length || 0} Customers
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Content: Aggregate Metrics Panel */}
                        <CardContent className="p-4 sm:p-5 pt-0 flex-1">
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 bg-slate-50 rounded-xl p-3 sm:p-3.5 border border-slate-100">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Wallet className="h-3 w-3 text-amber-500 shrink-0" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                                            Outstanding
                                        </span>
                                    </div>
                                    <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">
                                        {formatCurrency(zone.calculatedLedger)}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Package className="h-3 w-3 text-indigo-500 shrink-0" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                                            Items Held
                                        </span>
                                    </div>
                                    <span className="block text-xs sm:text-sm font-bold text-slate-900 truncate">
                                        {zone.calculatedReturnables}
                                    </span>
                                </div>
                            </div>
                        </CardContent>

                        {/* Footer: View Details Action */}
                        <CardFooter className="p-3.5 sm:p-4 border-t border-slate-100 mt-auto bg-slate-50/50 rounded-b-xl flex justify-end">
                            <Link
                                href={`/manage/zones/${zone.id}`}
                                className={buttonVariants({
                                    variant: "link",
                                    className: "h-auto p-0 text-xs font-bold text-sky-600 hover:text-sky-700",
                                })}
                            >
                                View Zone Details
                                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Hash, FileText, User, Gauge, Droplets, Box } from "lucide-react";

import { Vehicle } from "../../types/fleet";
type FleetDetailsProps = {
    vehicle: Vehicle;
};

const FleetDetails = ({ vehicle }: FleetDetailsProps) => {
    // Status Badge Formatting
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Active</Badge>;
            case 'MAINTENANCE':
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">Maintenance</Badge>;
            case 'RETIRED':
                return <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100">Retired</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* 1. Primary Identification */}
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                        <Car className="h-4 w-4 text-sky-600" />
                        Vehicle Identity
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                        <Hash className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Registration</p>
                            <p className="font-medium text-slate-900">{vehicle.registration}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Model Info</p>
                            <p className="font-medium text-slate-900">{vehicle.modelInfo}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Box className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle Type</p>
                            <p className="font-medium text-slate-900 capitalize">{vehicle.type.toLowerCase()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Operational Specs */}
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                        <Gauge className="h-4 w-4 text-sky-600" />
                        Operational Specs
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                        <Droplets className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fuel Type</p>
                            <p className="font-medium text-slate-900 capitalize">{vehicle.fuelType.toLowerCase()}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Gauge className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Odometer</p>
                            <p className="font-medium text-slate-900">{vehicle.currentOdometer.toLocaleString()} km</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Box className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Capacity Info</p>
                            <p className="font-medium text-slate-900">{vehicle.capacityInfo || "Not specified"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Status & Assignment */}
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                        <User className="h-4 w-4 text-sky-600" />
                        Status & Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Assigned Staff</p>
                        {vehicle.assignedTo ? (
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-sky-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{vehicle.assignedTo.name}</p>
                                    <p className="text-xs font-medium text-slate-500 capitalize">{vehicle.assignedTo.phone}</p>
                                    {getStatusBadge(vehicle.status)}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 italic bg-slate-50 border border-slate-100 rounded-lg p-3">
                                <User className="h-4 w-4 text-slate-400" />
                                Unassigned
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default FleetDetails;
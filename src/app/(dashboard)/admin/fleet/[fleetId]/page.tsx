import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Truck, Fuel, User, Gauge, Calendar, Edit, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PageProps {
    params: Promise<{ fleetId: string }>;
}

// Dummy Data Generator based on fleetId
const getVehicleDetails = (fleetId: string) => ({
    id: fleetId,
    registration: "LEB-4040",
    modelInfo: "Honda CD-70",
    type: "MOTORCYCLE",
    fuelType: "PETROL",
    status: "ACTIVE",
    capacityInfo: "150 KG",
    currentOdometer: 14250,
    assignedRider: {
        name: "Ali Khan",
        phone: "+92 300 1234567",
    },
    createdAt: "2026-06-15",
});

const dummyFuelLogs = [
    { id: "fuel-1", date: "2026-09-08", liters: 5.5, costPerLiter: 280, totalCost: 1540, odometerReading: 14100 },
    { id: "fuel-2", date: "2026-09-02", liters: 6.0, costPerLiter: 275, totalCost: 1650, odometerReading: 13950 },
    { id: "fuel-3", date: "2026-08-27", liters: 5.2, costPerLiter: 275, totalCost: 1430, odometerReading: 13800 },
];

export default async function VehicleDetailPage({ params }: PageProps) {
    const { fleetId } = await params;
    const vehicle = getVehicleDetails(fleetId);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            
            {/* Top Navigation & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link 
                        href="/admin/fleet" 
                        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-2"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Fleet List
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {vehicle.registration}
                        </h1>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            {vehicle.status}
                        </Badge>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-slate-200">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Vehicle
                    </Button>
                    <Link href={`/admin/fleet/${fleetId}/add-fuel`}>
                        <Button className="bg-sky-600 hover:bg-sky-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Log Fuel Expense
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Vehicle Spec Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Core Info Card */}
                <Card className="border-slate-200 shadow-sm md:col-span-2">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                            <Truck className="h-4 w-4 text-sky-600" />
                            Vehicle Specifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Make & Model</span>
                            <p className="text-sm font-semibold text-slate-800 mt-1">{vehicle.modelInfo}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle Type</span>
                            <p className="text-sm font-semibold text-slate-800 mt-1">{vehicle.type}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fuel Type</span>
                            <p className="text-sm font-semibold text-slate-800 mt-1">{vehicle.fuelType}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capacity</span>
                            <p className="text-sm font-semibold text-slate-800 mt-1">{vehicle.capacityInfo || "N/A"}</p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Odometer</span>
                            <p className="text-sm font-mono font-semibold text-slate-800 mt-1 flex items-center gap-1">
                                <Gauge className="h-4 w-4 text-slate-400" />
                                {vehicle.currentOdometer.toLocaleString()} KM
                            </p>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Added On</span>
                            <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                {vehicle.createdAt}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Assigned Rider Card */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                            <User className="h-4 w-4 text-sky-600" />
                            Assigned Driver
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold">
                                {vehicle.assignedRider.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{vehicle.assignedRider.name}</p>
                                <p className="text-xs text-slate-500 font-mono">{vehicle.assignedRider.phone}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full text-xs h-9">
                            Reassign Vehicle
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Fuel Logs Section */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                        <Fuel className="h-4 w-4 text-sky-600" />
                        Fuel Expense History
                    </CardTitle>
                    <span className="text-xs font-medium text-slate-500">Showing last 3 logs</span>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3 px-6">Date</th>
                                    <th className="py-3 px-6">Liters</th>
                                    <th className="py-3 px-6">Cost / Liter</th>
                                    <th className="py-3 px-6">Total Cost</th>
                                    <th className="py-3 px-6">Odometer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {dummyFuelLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-6 text-slate-600">{log.date}</td>
                                        <td className="py-3 px-6 font-semibold text-slate-800">{log.liters} L</td>
                                        <td className="py-3 px-6 text-slate-600 font-mono">Rs. {log.costPerLiter}</td>
                                        <td className="py-3 px-6 font-bold text-slate-900 font-mono">Rs. {log.totalCost.toLocaleString()}</td>
                                        <td className="py-3 px-6 text-slate-600 font-mono">{log.odometerReading.toLocaleString()} KM</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
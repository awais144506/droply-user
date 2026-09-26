"use client";

import { Fuel, Wrench } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";
import { useVehicle } from "@/features/admin/fleet/api/use-fleet";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

type Props = {
    vehicleId: string;
};

const ExpenseStats = ({ vehicleId }: Props) => {
    // React Query will instantly return the cached data from the parent page
    const { data: vehicle, isLoading } = useVehicle(vehicleId);

    // Calculate totals safely
    const fuelTotal = vehicle?.fuelExpenses
        ?.filter(expense => expense.category === "FUEL")
        .reduce((sum, expense) => sum + (expense.totalCost || 0), 0) || 0;

    const maintenanceTotal = vehicle?.fuelExpenses
        ?.filter(expense => expense.category === "MAINTENANCE")
        .reduce((sum, expense) => sum + (expense.totalCost || 0), 0) || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PageStatsCard
                title="Total Fuel Expense"
                value={formatCurrency(fuelTotal)}
                prefix="Rs"
                icon={Fuel}
                isLoading={isLoading}
                iconContainerClass="bg-sky-50 text-sky-600"
                valueColorClass="text-slate-900"
                description="Total lifetime expenditure on fuel."
            />
            
            <PageStatsCard
                title="Maintenance & Repairs"
                value={formatCurrency(maintenanceTotal)}
                prefix="Rs"
                icon={Wrench}
                isLoading={isLoading}
                iconContainerClass="bg-amber-50 text-amber-600"
                valueColorClass="text-slate-900"
                description="Total lifetime expenditure on services."
            />
        </div>
    );
};

export default ExpenseStats;
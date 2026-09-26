"use client"
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Edit, Receipt } from 'lucide-react';
import PageDetailHeader from '@/lib/utils/components/PageDetailHeader';
import FleetDetails from '@/features/admin/fleet/components/fleet_details/fleet-detail';
import LogFuelTable from '@/features/admin/fleet/components/fleet_details/logFuel-table';
import { useVehicle } from '@/features/admin/fleet/api/use-fleet';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import EditVehicleDialog from '@/features/admin/fleet/components/fleet_details/edit-vehicle-dialog';
import LogExpenseDialog from '@/features/admin/fleet/components/fleet_details/log-expense-dialog';
import ExpenseStats from '@/features/admin/fleet/components/fleet_details/expense-stats';
import { useRole } from '@/lib/hooks/use-role';

export default function VehicleDetailPage() {
    const params = useParams();
    const { branchId } = useRole();
    const fleetId = params.fleetId as string;
    const { data: fleet, isLoading } = useVehicle(fleetId);

    // Dialog States
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

    if (isLoading || !fleet) return <Loading text='Loading vehicle details...' />

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <PageDetailHeader
                heading={`${fleet.registration} - ${fleet.modelInfo}`}
                description='View and manage vehicle specifications and operational metrics.'
                href='/admin/fleet'
                createdAt={fleet.createdAt}
                updatedAt={fleet.updatedAt}
            >
                {/* Action Buttons trigger Dialogs now */}
                <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(true)}
                    className="gap-2 border-slate-200 text-slate-700"
                >
                    <Edit className="h-4 w-4" />
                    Edit Vehicle
                </Button>

                <Button
                    onClick={() => setIsExpenseDialogOpen(true)}
                    className="gap-2 bg-sky-600 hover:bg-sky-700 text-white"
                >
                    <Receipt className="h-4 w-4" />
                    Log Expense
                </Button>
            </PageDetailHeader>

            <FleetDetails vehicle={fleet} />

            <ExpenseStats vehicleId={fleetId} />

            {/* Renaming this component to something like VehicleExpenseTable in the future would be good! */}
            <LogFuelTable
                branchId={branchId}
                vehicleId={fleetId}
                expenses={fleet.fuelExpenses || []} />

            {/* Dialog Mounts */}
            <EditVehicleDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                vehicle={fleet}
            />

            <LogExpenseDialog
                isOpen={isExpenseDialogOpen}
                onClose={() => setIsExpenseDialogOpen(false)}
                vehicle={fleet}
            />
        </div>
    );
}
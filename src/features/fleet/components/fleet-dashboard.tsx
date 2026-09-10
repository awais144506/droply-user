"use client";

import { useState } from "react";
import { Vehicle, FuelExpense, VehicleStatus } from "../api/use-fleet";
import { Truck, Fuel, Wrench, ShieldAlert, Phone, Calendar } from "lucide-react";

interface FleetDashboardProps {
  vehicles: Vehicle[];
  fuelExpenses: FuelExpense[];
}

export function FleetDashboard({ vehicles, fuelExpenses }: FleetDashboardProps) {
  const [activeTab, setActiveTab] = useState<"vehicles" | "fuel">("vehicles");

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case "ACTIVE":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">ACTIVE</span>;
      case "MAINTENANCE":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">MAINTENANCE</span>;
      case "RETIRED":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">RETIRED</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-PK", { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "vehicles" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Truck className="h-4 w-4" /> Vehicles Fleet ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab("fuel")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "fuel" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Fuel className="h-4 w-4" /> Fuel Expenses ({fuelExpenses.length})
        </button>
      </div>

      {/* TAB 1: VEHICLES TABLE */}
      {activeTab === "vehicles" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Info</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type / Fuel</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Odometer</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Driver</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-slate-400">No vehicles registered yet.</td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-xs font-black text-slate-900 font-mono">{v.registration}</td>
                      <td className="py-4 px-6 text-xs font-medium text-slate-700">
                        {v.modelInfo}
                        {v.capacityInfo && <div className="text-[10px] text-slate-400 mt-0.5">Cap: {v.capacityInfo}</div>}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-slate-700 font-semibold">{v.type}</div>
                        <span className="text-[10px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">{v.fuelType}</span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-mono">{v.currentOdometer.toLocaleString()} km</td>
                      <td className="py-4 px-6">
                        {v.assignedTo || v.driverPhone ? (
                          <div>
                            <div className="text-xs font-bold text-slate-800">{v.assignedTo?.name || "Unassigned"}</div>
                            {v.driverPhone && (
                              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3 text-slate-300" /> {v.driverPhone}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" /> Tax: {formatDate(v.tokenTaxExpiry)}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <ShieldAlert className="h-3 w-3 text-slate-400" /> Ins: {formatDate(v.insuranceExpiry)}
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(v.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FUEL LOGS TABLE */}
      {activeTab === "fuel" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liters</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cost / Liter</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Cost</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Odometer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fuelExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-slate-400">No fuel expenses logged yet.</td>
                  </tr>
                ) : (
                  fuelExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-xs text-slate-600">{formatDate(expense.date)}</td>
                      <td className="py-4 px-6">
                        <div className="text-xs font-black text-slate-900 font-mono">{expense.vehicle?.registration || expense.vehicleId}</div>
                        <div className="text-[10px] text-slate-400">{expense.vehicle?.modelInfo}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-700 font-bold">{expense.liters} L</td>
                      <td className="py-4 px-6 text-xs text-slate-600">Rs {expense.costPerLiter}</td>
                      <td className="py-4 px-6 text-xs font-black text-sky-600">Rs {expense.totalCost.toLocaleString()}</td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-mono">{expense.odometerReading.toLocaleString()} km</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
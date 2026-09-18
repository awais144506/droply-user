/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bike, MapPin, Truck } from "lucide-react";

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-600";
    case "MAINTENANCE":
      return "bg-orange-50 text-orange-600";
    case "RETIRED":
      return "bg-rose-50 text-rose-600";
    default:
      return "bg-slate-50 text-slate-600";
  }
};

export default function AssignmentCard({ user }: { user: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 w-full">

      {/* 1. Vehicle Assignment */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Bike className="h-4 w-4 text-emerald-600" /> Assigned Vehicle
        </h3>

        <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-bold text-slate-500 tracking-wide">RIDER LICENSE NO.</span>
          <span className="text-xs font-bold text-slate-900">{user.licenseNumber || "—"}</span>
        </div>

        {user.assignedVehicles && user.assignedVehicles.length > 0 ? (
          <div className="flex flex-col gap-3">
            {user.assignedVehicles.map((vehicle: any) => (
              <div key={vehicle.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl w-full">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Truck className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{vehicle.modelInfo}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">
                    {vehicle.registration}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 truncate">
                    {vehicle.type}
                  </p>
                </div>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusStyles(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            No vehicle assigned yet.
          </p>
        )}
      </div>

      {/* 2. Zone Assignment */}
      <div className="pt-5 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-indigo-600" /> Operating Zones
        </h3>
        {user.zones && user.zones.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.zones.map((z: any) => (
              <span key={z.id} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-700 shadow-sm">
                {z.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
            No zones assigned yet.
          </p>
        )}
      </div>

    </div>
  );
}
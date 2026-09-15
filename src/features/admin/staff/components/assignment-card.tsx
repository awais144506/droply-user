/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bike, MapPin, Truck } from "lucide-react";
export default function AssignmentCard({ user }: { user: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      
      {/* 1. Vehicle Assignment */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Bike className="h-4 w-4 text-emerald-600" /> Fleet Assignment
        </h3>
        
        {user.assignedVehicles && user.assignedVehicles.length > 0 ? (
          <div className="flex flex-col gap-2">
            {user.assignedVehicles.map((vehicle: any) => (
              <div key={vehicle.id} className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="h-8 w-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                  <Truck className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{vehicle.modelInfo}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{vehicle.registration}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
            No vehicle assigned yet.
          </p>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs font-bold text-slate-500">License Number:</span>
            <span className="text-xs font-bold text-slate-900">{user.licenseNumber || "—"}</span>
        </div>
      </div>

      {/* 2. Zone Assignment */}
      <div className="pt-2 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-indigo-600" /> Operating Zones
        </h3>
        {user.zones && user.zones.length > 0 ? (
          <div className="flex flex-wrap gap-2">
             {user.zones.map((z: any) => (
               <span key={z.id} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-700">
                 {z.name}
               </span>
             ))}
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
            No zones assigned yet.
          </p>
        )}
      </div>

    </div>
  );
}
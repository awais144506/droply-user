"use client";

import { useState, useEffect } from "react";
import { Search, UserCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { BranchUserItem } from "../api/use-staff";
import { Button } from "@/components/ui/button";

export function StaffTable({ staff }: { staff: BranchUserItem[] }) {
  const router = useRouter();
  const [localStaff, setLocalStaff] = useState<BranchUserItem[]>([]);
  
  // Filter out the OWNER role immediately upon receiving the data
  useEffect(() => { 
    setLocalStaff(staff.filter(s => s.role !== "OWNER")); 
  }, [staff]);
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = localStaff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.phone.includes(searchQuery)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text" 
            placeholder="Search staff by name or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Employee Info</th>
              <th className="px-6 py-4 whitespace-nowrap">Role & Zone</th>
              <th className="px-6 py-4 whitespace-nowrap">Account Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStaff.map((user) => (
              <tr key={user.id} className={`transition-colors group ${!user.isActive ? "bg-slate-50/50 opacity-75" : "hover:bg-slate-50/50"}`}>
                
                {/* Employee Info */}
                <td className="px-6 py-4">
                  <p className={`font-bold ${!user.isActive ? "text-slate-500 line-through" : "text-slate-900"}`}>
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {user.phone} • {user.email}
                  </p>
                </td>
                
                {/* Role & Zone */}
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                    user.role === "MANAGER" ? "bg-sky-50 text-sky-700 border border-sky-100" :
                    "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {user.role}
                  </span>
                  {user.zones && user.zones.length > 0 && (
                    <p className="text-[10px] font-medium text-slate-500 mt-1">
                      {user.zones.map(z => z.name).join(", ")}
                    </p>
                  )}
                </td>

                {/* Account Status */}
                <td className="px-6 py-4">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <UserCheck className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <ShieldAlert className="h-3 w-3" /> Disabled
                    </span>
                  )}
                </td>

                {/* Action CTA */}
                <td className="px-6 py-4 text-right">
                  <Button 
                    onClick={() => router.push(`/admin/staff/${user.id}`)}
                    className="bg-slate-900 hover:bg-slate-800 text-white h-8 px-4 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Manage Profile <ArrowRight className="h-3 w-3 ml-1.5 opacity-70" />
                  </Button>
                </td>
                
              </tr>
            ))}
            
            {filteredStaff.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No staff records match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
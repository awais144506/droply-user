"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Mail, Phone, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { BranchUserItem } from "../api/use-staff";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function StaffTable({ staff, onEdit }: { staff: BranchUserItem[]; onEdit: (u: BranchUserItem) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "RIDER" | "MANAGER">("ALL");

  const filteredStaff = staff.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (roleFilter !== "ALL" && s.role !== roleFilter) return false;
    return true;
  });

  const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
      case "OWNER": return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">OWNER</span>;
      case "MANAGER": return <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">MANAGER</span>;
      default: return <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">RIDER</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
        <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-200">
          {["ALL", "MANAGER", "RIDER"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${roleFilter === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {r === "ALL" ? "All Roles" : `${r}S`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-4 w-12 text-center">S.No</th>
              <th className="px-4 py-4 whitespace-nowrap">Staff Member</th>
              <th className="px-4 py-4 whitespace-nowrap">Role</th>
              <th className="px-4 py-4 whitespace-nowrap">Contact Details</th>
              <th className="px-4 py-4 whitespace-nowrap">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStaff.length > 0 ? filteredStaff.map((user, index) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4 text-center font-mono text-xs text-slate-400">{index + 1}</td>
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-900">{user.name}</p>
                  {user.role === "RIDER" && user.zones && user.zones.length > 0 && (
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                      Routes: {user.zones.map(z => z.name).join(", ")}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 mb-1 text-xs"><Phone className="h-3 w-3 text-slate-400" />{user.phone}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500"><Mail className="h-3 w-3 text-slate-400" />{user.email}</div>
                </td>
                <td className="px-4 py-4">
                  {user.isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /> ACTIVE</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><XCircle className="h-3.5 w-3.5" /> INACTIVE</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 outline-none">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                      <DropdownMenuItem onClick={() => onEdit(user)}>Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-sky-600">Payroll / Ledger</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">No staff found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white mt-auto">
        <p className="text-xs text-slate-500 font-medium">Showing 1 to {filteredStaff.length} of {staff.length}</p>
        <div className="flex items-center gap-2">
          <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
          <button className="h-8 px-3 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold">1</button>
          <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
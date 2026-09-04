"use client";

import { useState, useEffect } from "react";
import { UserCheck, UserX, ShieldAlert, Calendar, Clock, MapPin, Mail, Phone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BranchUserItem, AttendanceStatus } from "../api/use-staff";
import { Button } from "@/components/ui/button";

export function StaffProfile({ user }: { user: BranchUserItem }) {
  const router = useRouter();
  const [localUser, setLocalUser] = useState<BranchUserItem>(user);
  
  useEffect(() => { setLocalUser(user); }, [user]);

  const markAttendance = (status: AttendanceStatus) => {
    const time = status === "PRESENT" || status === "HALF_DAY" ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null;
    setLocalUser(prev => ({ ...prev, todayAttendance: status, checkInTime: time }));
    toast.success(`${user.name}'s attendance marked as ${status.replace("_", " ")}.`);
  };

  const toggleStatus = () => {
    setLocalUser(prev => ({ ...prev, isActive: !prev.isActive }));
    toast.success(localUser.isActive ? "Staff member disabled. Fleet access revoked." : "Staff member reactivated.");
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch(status) {
      case "PRESENT": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Present</span>;
      case "HALF_DAY": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">Half Day</span>;
      case "ABSENT": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">Absent</span>;
      case "LEAVE": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">On Leave</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">Not Marked</span>;
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Staff Roster
      </button>

      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative overflow-hidden">
        {!localUser.isActive && (
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
        )}
        
        <div className="flex items-center gap-5">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold ${localUser.isActive ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-400"}`}>
            {localUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-xl font-bold ${localUser.isActive ? "text-slate-900" : "text-slate-500 line-through"}`}>{localUser.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${localUser.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                {localUser.isActive ? "Active" : "Disabled"}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                {localUser.role}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {localUser.phone}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {localUser.email}</span>
              {localUser.zones && localUser.zones.length > 0 && (
                <span className="flex items-center gap-1.5 text-sky-600"><MapPin className="h-3.5 w-3.5" /> {localUser.zones.map(z => z.name).join(", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Today's Action */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Today's Attendance</h3>
            <p className="text-xs text-slate-500 mb-6">Log arrival time for payroll calculation.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Current Status</span>
                {getStatusBadge(localUser.todayAttendance)}
              </div>
              
              {localUser.checkInTime && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <Clock className="h-4 w-4" /> Checked in at {localUser.checkInTime}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button onClick={() => markAttendance("PRESENT")} disabled={!localUser.isActive} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 h-10 text-xs font-bold shadow-none cursor-pointer">Present</Button>
                <Button onClick={() => markAttendance("HALF_DAY")} disabled={!localUser.isActive} className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 h-10 text-xs font-bold shadow-none cursor-pointer">Half Day</Button>
                <Button onClick={() => markAttendance("ABSENT")} disabled={!localUser.isActive} className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 h-10 text-xs font-bold shadow-none cursor-pointer">Absent</Button>
                <Button onClick={() => markAttendance("LEAVE")} disabled={!localUser.isActive} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 h-10 text-xs font-bold shadow-none cursor-pointer">Leave</Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm">
            <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2 mb-2"><ShieldAlert className="h-4 w-4" /> Account Access</h3>
            <p className="text-xs text-slate-500 mb-4">Disabling a user revokes their app access but keeps their historical delivery and cash logs intact for reporting.</p>
            <Button 
              onClick={toggleStatus}
              className={`w-full h-10 text-xs font-bold shadow-none cursor-pointer ${localUser.isActive ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"}`}
            >
              {localUser.isActive ? <><UserX className="h-4 w-4 mr-2" /> Disable User</> : <><UserCheck className="h-4 w-4 mr-2" /> Reactivate User</>}
            </Button>
          </div>
        </div>

        {/* Right Col: Historical Log */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Attendance Ledger</h3>
                <p className="text-xs text-slate-500">Historical check-in records for current payroll cycle.</p>
              </div>
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 whitespace-nowrap text-right">Check-in Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localUser.attendanceHistory?.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {new Date(log.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-500">
                        {log.checkInTime || "—"}
                      </td>
                    </tr>
                  ))}
                  {(!localUser.attendanceHistory || localUser.attendanceHistory.length === 0) && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 text-sm">No attendance records found for this cycle.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
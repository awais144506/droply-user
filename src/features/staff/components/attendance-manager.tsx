import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BranchUserItem, AttendanceStatus } from "../../../api/use-staff";

// Helper function we can reuse in both manager and ledger
export const getStatusBadge = (status: AttendanceStatus | undefined) => {
  switch(status) {
    case "PRESENT": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Present</span>;
    case "HALF_DAY": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">Half Day</span>;
    case "ABSENT": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">Absent</span>;
    case "LEAVE": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">On Leave</span>;
    default: return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">Not Marked</span>;
  }
};

export default function AttendanceManager({ user, markAttendance }: { user: BranchUserItem, markAttendance: (s: AttendanceStatus) => void }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Today's Attendance</h3>
          <p className="text-xs text-slate-500">Log arrival time for payroll calculation.</p>
        </div>
        {getStatusBadge(user.todayAttendance)}
      </div>
      
      <div className="space-y-4">
        {user.checkInTime && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 w-fit">
            <Clock className="h-4 w-4" /> Checked in at {user.checkInTime}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
          <Button onClick={() => markAttendance("PRESENT")} disabled={!user.isActive} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 h-9 text-xs font-bold shadow-none">Present</Button>
          <Button onClick={() => markAttendance("HALF_DAY")} disabled={!user.isActive} className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 h-9 text-xs font-bold shadow-none">Half Day</Button>
          <Button onClick={() => markAttendance("ABSENT")} disabled={!user.isActive} className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 h-9 text-xs font-bold shadow-none">Absent</Button>
          <Button onClick={() => markAttendance("LEAVE")} disabled={!user.isActive} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 h-9 text-xs font-bold shadow-none">Leave</Button>
        </div>
      </div>
    </div>
  );
}
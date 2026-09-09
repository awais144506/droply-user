import { Calendar } from "lucide-react";
import { BranchUserItem } from "../../../api/use-staff";
import { getStatusBadge } from "./attendance-manager";

export default function AttendanceLedger({ user }: { user: BranchUserItem }) {
  return (
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
            {user.attendanceHistory?.map((log, idx) => (
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
            {(!user.attendanceHistory || user.attendanceHistory.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No attendance records found for this cycle.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
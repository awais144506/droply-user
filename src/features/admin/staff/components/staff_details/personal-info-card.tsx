/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCurrency, formatDate } from "@/lib/utils/functions/setFormat";
import { User, Briefcase, ShieldAlert } from "lucide-react";

// Safe helper to render fields
const InfoRow = ({ label, value }: { label: string, value: string | number | undefined }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value || "—"}</span>
  </div>
);

export default function PersonalInfoCard({ user }: { user: any }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
      
      {/* Section 1: Core Identity */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-sky-600" /> Identity Details
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
          <InfoRow label="Staff Code" value={user.staffCode} />
          <InfoRow label="CNIC" value={user.cnic} />
          <div className="col-span-2">
            <InfoRow label="Blood Group" value={user.bloodGroup} />
          </div>
          <div className="col-span-2">
            <InfoRow label="Address" value={user.currentAddress} />
          </div>
        </div>
      </div>

      {/* Section 2: Employment Data */}
      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Briefcase className="h-4 w-4 text-indigo-600" /> Employment Details
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
          <InfoRow label="Joining Date" value={formatDate(user.joiningDate)} />
          <InfoRow label="Basic Salary" value={formatCurrency(user.basicSalary)} />
        </div>
      </div>

      {/* Section 3: Family & Guarantor */}
      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <ShieldAlert className="h-4 w-4 text-amber-600" /> Family & Guarantor
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
          <InfoRow label="Father Name" value={user.fatherName} />
          <InfoRow label="Father CNIC" value={user.fatherCnic} />
          <InfoRow label="Guarantor Name" value={user.guarantorName} />
          <InfoRow label="Guarantor CNIC" value={user.guarantorCnic} />
          <div className="col-span-2">
            <InfoRow label="Guarantor Phone" value={user.guarantorPhone} />
          </div>
        </div>
      </div>

    </div>
  );
}
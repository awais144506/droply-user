import { Mail, Phone, Bike, Briefcase } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UpdateStaffEmailDialog from "../../utils/updateEmailDialog";
import { updateStaffEmail } from "../../api/use-mutate-staff";
import { updateStaffEmailValue } from "../../utils/updateEmailDialog";
import { formatPhoneNumber } from "react-phone-number-input";
import { Staff } from "../../types/staff";

export default function ProfileHeader({ user, branchId }: { user: Staff, branchId: string }) {

  const [updateMailModel, setUpdateMailModel] = useState(false);

  const { mutate: updateEmail, isPending } = updateStaffEmail(branchId, () => setUpdateMailModel(false));

  const onSubmit = (data: updateStaffEmailValue) => {
    updateEmail({
      id: user.id,
      data: data,
    });
  };

  const isRider = user.role === "RIDER";
  const roleBadgeStyles = isRider
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-indigo-50 text-indigo-700 border-indigo-200";

  const isActive = user.status === "ACTIVE";

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch md:items-center justify-between relative overflow-hidden min-w-0">
        {!isActive && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />}

        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.name}
              width={64}
              height={64}
              className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover shrink-0 border-2 ${
                isActive ? "border-sky-100" : "border-slate-200 grayscale opacity-75"
              }`}
            />
          ) : (
            <div
              className={`h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${
                isActive ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-400"
              }`}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1 min-w-0">
              <h2
                className={`text-lg sm:text-xl font-bold break-words ${
                  isActive ? "text-slate-900" : "text-slate-500 line-through"
                }`}
              >
                {user.name}
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {isActive ? "Active" : "Disabled"}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${roleBadgeStyles}`}
              >
                {isRider ? <Bike className="h-3 w-3 shrink-0" /> : <Briefcase className="h-3 w-3 shrink-0" />}
                {user.role}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs font-medium text-slate-500 mt-2 min-w-0">
              <span className="flex items-center gap-1.5 min-w-0">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{formatPhoneNumber(user.phone)}</span>
              </span>
              {user.email && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="break-all sm:break-normal sm:truncate">{user.email}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="default"
          onClick={() => setUpdateMailModel(true)}
          className="w-full md:w-auto shrink-0 cursor-pointer"
        >
          <Mail className="h-4 w-4 shrink-0" />
          Update Email
        </Button>
      </div>

      <UpdateStaffEmailDialog
        userName={user.name}
        userEmail={user.email}
        isOpen={updateMailModel}
        onClose={() => setUpdateMailModel(false)}
        onUpdateSubmit={onSubmit}
        isSubmitting={isPending}
      />
    </>
  );
}
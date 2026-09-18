/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Mail, Phone, Bike, Briefcase } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UpdateStaffEmailDialog from "../../utils/updateEmailDialog";
import { updateStaffEmail } from "../../api/use-mutate-staff";
import { updateStaffEmailValue } from "../../utils/updateEmailDialog";
export default function ProfileHeader({ user, branchId }: { user: any, branchId: string }) {

  const [updateMailModel, setUpdateMailModel] = useState(false);

  const { mutate: updateEmail, isPending } = updateStaffEmail(branchId, () => setUpdateMailModel(false))

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

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative overflow-hidden">
        {!user.isActive && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />}

        <div className="flex items-center gap-5">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.name}
              width={50}
              height={50}
              className={`h-16 w-16 rounded-full object-cover shrink-0 border-2 ${user.isActive ? "border-sky-100" : "border-slate-200 grayscale opacity-75"
                }`}
            />
          ) : (
            <div className={`h-16 w-16 shrink-0 rounded-full flex items-center justify-center text-xl font-bold ${user.isActive ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-400"
              }`}>
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-xl font-bold ${user.isActive ? "text-slate-900" : "text-slate-500 line-through"}`}>{user.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                {user.isActive ? "Active" : "Disabled"}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${roleBadgeStyles}`}>
                {isRider ? <Bike className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
                {user.role}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {user.phone}</span>
              {user.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>}
              {user.zones && user.zones.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-500">Zone Assigned:</span>
                  <span className="flex items-center gap-1 text-sky-600 font-bold">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.zones.map((z: any) => z.name).join(", ")}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => setUpdateMailModel(true)}>
          <Mail />Update Email
        </Button>
      </div>
      <UpdateStaffEmailDialog
        userName={user.name}
        userEmail={user.email}
        isOpen={updateMailModel}
        onClose={() => setUpdateMailModel(true)}
        onUpdateSubmit={onSubmit}
        isSubmitting={isPending}
      />
    </>
  );
}
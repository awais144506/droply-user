/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Loader2, User as UserIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 🔥 1. Accept roleData as a prop to sync with SiteHeader
export function NavUser({ roleData }: { roleData: any }) {
  const { userName, userEmail, userProfilePicture, role, isLoading } = roleData;
  const { signOut, openUserProfile } = useClerk();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-2 py-1.5 animate-pulse">
        <div className="hidden sm:flex flex-col items-end gap-1.5">
          <div className="h-3 w-24 bg-slate-200 rounded-full" />
          <div className="h-2 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="h-9 w-9 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
      </div>
    );
  }

  const displayRole = role?.replace("_", " ") || "USER";
  const initials = userName
    ? userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "US";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ redirectUrl: "/sign-in" });
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        {/* 🔥 2. Premium Hover States on Trigger */}
        <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-slate-100/70 p-1.5 pl-4 rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-sky-500/20 border border-transparent cursor-pointer group">
          
          <div className="hidden sm:flex flex-col text-right leading-none">
            <span className="font-bold text-slate-900 text-[13px] group-hover:text-sky-700 transition-colors">
              {userName}
            </span>
            <span className={`text-[9px] font-extrabold tracking-widest mt-1.5 uppercase ${
              role === "OWNER" ? "text-emerald-500" : "text-sky-500"
            }`}>
              {displayRole}
            </span>
          </div>

          <Avatar className="h-9 w-9 rounded-full border-2 border-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 ring-1 ring-slate-100">
            <AvatarImage src={userProfilePicture} alt={userName} />
            <AvatarFallback className="bg-linear-to-br from-sky-50 to-slate-100 text-sky-700 font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/* 🔥 3. Glassmorphic Dropdown Menu */}
        <DropdownMenuContent
          className="w-64 rounded-2xl mb-2 p-2 shadow-xl shadow-slate-200/50 border-slate-200/60 bg-white/95 backdrop-blur-xl"
          side="bottom"
          align="end"
          sideOffset={8}
        >
          <div className="px-3 py-2.5 mb-1.5 bg-slate-50/80 rounded-xl border border-slate-100 text-left">
            <p className="text-[13px] font-bold text-slate-900 truncate">{userName}</p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{userEmail}</p>
          </div>

          <DropdownMenuSeparator className="bg-slate-100/80 mb-1" />

          <DropdownMenuItem
            onSelect={() => openUserProfile()}
            className="cursor-pointer flex items-center gap-3 p-2.5 rounded-xl font-medium text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors group"
          >
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
              <UserIcon className="h-4 w-4 shrink-0" />
            </div>
            <span>Account Profile</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100/80 my-1" />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="cursor-pointer flex items-center gap-3 p-2.5 rounded-xl font-medium text-xs text-rose-600 hover:bg-rose-50 transition-colors group"
          >
            <div className="p-1.5 bg-rose-50 text-rose-500 rounded-lg group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
              <LogOut className="h-4 w-4 shrink-0" />
            </div>
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🔥 4. Redesigned Modern Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-90 rounded-[24px] p-0 overflow-hidden border-slate-100 shadow-2xl">
          <div className="p-6 pb-4">
            <div className="h-12 w-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-4 border border-rose-200/50 shadow-inner">
              <LogOut className="h-6 w-6 text-rose-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 text-left">Sign Out</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-2 text-left leading-relaxed">
                Are you sure you want to end your current session? You will need to securely sign in again to access your branch.
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter className="bg-slate-50/80 p-4 border-t border-slate-100 flex sm:justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              disabled={isLoggingOut}
              className="h-10 rounded-xl text-xs font-semibold px-5 border-slate-200 hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-10 rounded-xl text-xs font-bold px-5 gap-2 bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <span>Yes, sign me out</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
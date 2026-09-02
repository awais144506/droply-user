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
import { useRole } from "@/hooks/use-role";

export function NavUser() {
  const { userName, userEmail, userProfilePicture, role, isLoading } = useRole();
  const { signOut, openUserProfile } = useClerk();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-2 py-1.5 animate-pulse">
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className="h-3 w-20 bg-slate-200 rounded-full" />
          <div className="h-2 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-200" />
      </div>
    );
  }
  const displayRole = role.replace("_", " ");
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
        <DropdownMenuTrigger className="flex items-center gap-2.5 hover:bg-slate-50 p-1 pl-3 rounded-full transition-colors outline-none focus:ring-2 focus:ring-sky-500/20 border border-transparent hover:border-slate-200 cursor-pointer">

          {/* Name & Role (Text right-aligned, sits left of Avatar) */}
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="font-bold text-slate-900 text-xs">{userName}</span>
            <span className="text-slate-500 text-[10px] font-semibold tracking-wide">
              {displayRole}
            </span>
          </div>

          <Avatar className="h-8 w-8 rounded-full border border-slate-200 shadow-2xs">
            <AvatarImage src={userProfilePicture} alt={userName} />
            <AvatarFallback className="bg-sky-50 text-sky-700 font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 rounded-xl mb-2 p-1.5 shadow-lg border-slate-200"
          side="bottom"
          align="end"
          sideOffset={8}
        >
          {/* Internal User Info block */}
          <div className="px-2 py-1.5 mb-1 text-left">
            <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
          </div>

          <DropdownMenuSeparator className="bg-slate-100 mb-1" />

          <DropdownMenuItem
            onSelect={() => openUserProfile()}
            className="cursor-pointer flex items-center gap-2 p-2 rounded-lg font-medium text-xs text-slate-700 focus:bg-slate-100"
          >
            <UserIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Account Profile</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100" />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer flex items-center gap-2 p-2 rounded-lg font-medium text-xs"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-900">Confirm Log Out</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Are you sure you want to end your current session? You will need to sign in again.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-100 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              disabled={isLoggingOut}
              className="h-9 rounded-xl text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-9 rounded-xl text-xs font-semibold gap-1.5 bg-rose-600 hover:bg-rose-700"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
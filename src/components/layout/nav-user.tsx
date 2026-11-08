"use client";

import { useState, useRef, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Loader2, User as UserIcon, X } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/hooks/use-role";

export function NavUser() {
  const { userName, userEmail, userProfilePicture, role, isLoading } = useRole();
  const { signOut, openUserProfile } = useClerk();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="relative" ref={dropdownRef}>
      {/* Custom Trigger */}
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="flex items-center gap-2.5 hover:bg-slate-50 p-1 pl-3 rounded-full transition-colors outline-none focus:ring-2 focus:ring-sky-500/20 border border-transparent hover:border-slate-200 cursor-pointer"
      >
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
      </button>

      {/* Custom Dropdown Menu Content */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-40 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 mb-1 text-left">
            <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          <button
            onClick={() => {
              setShowDropdown(false);
              openUserProfile();
            }}
            className="w-full cursor-pointer flex items-center gap-2 p-2 rounded-lg font-medium text-xs text-slate-700 hover:bg-slate-100 transition-colors text-left"
          >
            <UserIcon className="h-4 w-4 shrink-0 text-slate-400" />
            <span>Account Profile</span>
          </button>

          <div className="h-px bg-slate-100 my-1" />

          <button
            onClick={() => {
              setShowDropdown(false);
              setShowConfirm(true);
            }}
            className="w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer flex items-center gap-2 p-2 rounded-lg font-medium text-xs transition-colors text-left"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* Custom Tailwind Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-100 mx-4">
            
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isLoggingOut}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-sm font-bold text-slate-900">Confirm Log Out</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to end your current session? You will need to sign in again.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-5">
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
                className="h-9 rounded-xl text-xs font-medium"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
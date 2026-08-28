"use client";

import { useUser } from "@clerk/nextjs";

export function useTenant() {
  const { user, isLoaded, isSignedIn } = useUser();

  const branchId = (user?.publicMetadata?.branchId as string) || "";
  const role = (user?.publicMetadata?.role as "OWNER" | "MANAGER" | "RIDER") || "RIDER";

  return {
    branchId,
    role,
    isOwner: role === "OWNER",
    isManager: role === "MANAGER",
    isRider: role === "RIDER",
    isLoading: !isLoaded,
    isAuthenticated: Boolean(isSignedIn && branchId),
  };
}
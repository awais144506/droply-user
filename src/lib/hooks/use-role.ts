"use client";

import { useUser } from "@clerk/nextjs";

export function useRole() {
  const { user, isLoaded, isSignedIn } = useUser();

  const branchId = (user?.publicMetadata?.branchId as string) || "";
  const role = (user?.publicMetadata?.role as "OWNER" | "MANAGER") || "MANAGER";
  const userTier = (user?.publicMetadata.tier as string) || "SILVER";
  const tierCycle = (user?.publicMetadata.cycle as string) || "TRIAL";
  const userStatus = (user?.publicMetadata.status as string) || "SUSPENDED";
  const maxUsersLimit = (user?.publicMetadata.maxUsersLimit as number) || 5;
  const renewDate = user?.publicMetadata.renewDate;
  const userName = String(user?.fullName) || "XYZ";
  const userEmail = String(user?.emailAddresses);
  const userProfilePicture = user?.imageUrl;

  return {
    branchId,
    role,
    userTier,
    tierCycle,
    renewDate,
    userStatus,
    userName,
    userEmail,
    userProfilePicture,
    maxUsersLimit,
    isOwner: role === "OWNER",
    isManager: role === "MANAGER",
    isLoading: !isLoaded,
    isAuthenticated: Boolean(isSignedIn && branchId),
  };
}
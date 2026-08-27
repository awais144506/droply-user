"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, ChevronsUpDown, Loader2, User as UserIcon } from "lucide-react";
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
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-2.5 w-28 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "admin@droplyhq.com";
  const fullName = user?.fullName || "Super Admin";
  const initials = fullName
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
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full flex items-center gap-3 hover:bg-muted/80 data-[state=open]:bg-sidebar-accent cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.imageUrl} alt={fullName} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-semibold">{fullName}</span>
                  <span className="truncate text-muted-foreground text-[11px]">
                    {userEmail}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-lg mb-2 p-1"
              side="top"
              align="start"
              sideOffset={6}
            >
              <DropdownMenuItem
                onSelect={() => openUserProfile()}
                className="cursor-pointer flex items-center gap-2 p-2 rounded-md font-medium text-xs text-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Account Profile</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setShowConfirm(true)}
                className="text-rose-600 dark:text-rose-400 focus:bg-rose-50 focus:text-rose-700 dark:focus:bg-rose-950/50 dark:focus:text-rose-300 cursor-pointer flex items-center gap-2 p-2 rounded-md font-medium text-xs"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Log Out</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to end your SuperAdmin session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="gap-1.5"
            >
              {isLoggingOut && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
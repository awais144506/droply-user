"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { ShieldAlert, LogOut, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as string) || "GUEST";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-lg border-destructive/20">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">Access Restricted</CardTitle>
          <CardDescription className="text-xs">
            This portal is strictly dedicated to branch operations.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-3 py-3 text-xs text-muted-foreground">
          <p>
            You are currently signed in as{" "}
            <span className="font-semibold text-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </p>
          <p className="bg-muted p-2.5 rounded-md text-[11px] leading-relaxed">
            Platform staff and unassigned accounts cannot access tenant plant systems. Please sign out and log in with your branch operator credentials.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          <SignOutButton redirectUrl="/sign-in">
            <Button variant="destructive" className="w-full text-xs">
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign Out & Switch Account
            </Button>
          </SignOutButton>
        </CardFooter>
      </Card>
    </div>
  );
}
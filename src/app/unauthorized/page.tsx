"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import {
  ShieldAlert,
  LogOut,
  CreditCard,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRole } from "@/lib/hooks/use-role";

export default function UnauthorizedPage() {
  const { branchId, role, isOwner, userEmail, isLoading } = useRole();

  const canManageSubscription = isOwner && Boolean(branchId);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full shadow-xl border-rose-200/80 rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-black text-slate-900">
            Access Restricted
          </CardTitle>
          <CardDescription className="text-xs font-medium text-slate-500">
            Your account or branch currently does not have active access to the portal.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-3.5 py-3 text-xs text-slate-600">
          {!isLoading && userEmail && (
            <p>
              Signed in as{" "}
              <span className="font-bold text-slate-900">{userEmail}</span>{" "}
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 ml-1">
                {role}
              </span>
            </p>
          )}

          {/* Suspension / Unpaid Balance Notice */}
          <div className="bg-amber-50/80 border border-amber-200/80 text-amber-900 p-3 rounded-xl text-[11px] leading-relaxed text-left space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Why is my access restricted?</span>
            </div>
            <p className="text-amber-800/90">
              {canManageSubscription
                ? "Your branch has been suspended due to an expired subscription or unpaid balance. Click below to go to the Subscription page and renew your plan to restore full access."
                : "Your branch may be suspended due to an unpaid subscription amount, or your staff account has been suspended by your branch owner. Please contact your branch administrator."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2.5 pt-2">
          {/* 🔥 Shown ONLY if role === "OWNER" */}
          {!isLoading && canManageSubscription && (
            <Link href="/admin/subscription" className="w-full">
              <Button className="w-full h-10 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                <CreditCard className="h-4 w-4" />
                Manage Subscription & Billing
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}

          <SignOutButton redirectUrl="/sign-in">
            <Button
              variant="destructive"
              className="w-full h-10 rounded-xl text-xs font-bold cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign Out & Switch Account
            </Button>
          </SignOutButton>
        </CardFooter>
      </Card>
    </div>
  );
}
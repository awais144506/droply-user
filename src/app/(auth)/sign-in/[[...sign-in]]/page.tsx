import { SignIn } from "@clerk/nextjs";
import { Droplets, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-zinc-50/60 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Droply
            </h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-0.5">
              SuperAdmin Command Center
            </p>
          </div>
        </div>

        {/* Clerk Sign In Card */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full shadow-none",
                card: "border shadow-sm bg-card rounded-xl w-full",
                headerTitle: "text-base font-semibold",
                headerSubtitle: "text-xs text-muted-foreground",
                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-9",
                formFieldInput: "h-9 text-xs",
                footerAction: "hidden", // Removes "Don't have an account? Sign up" for SuperAdmin
              },
            }}
          />
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Restricted session • IP verified • OTP required</span>
        </div>
      </div>
    </div>
  );
}
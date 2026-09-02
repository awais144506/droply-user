import { SignIn } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-zinc-50/60 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="relative flex items-center justify-center overflow-hidden">
            <Image
              src="/logo2.png"
              alt="Droply Logo"
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest mt-1">
              Branch Owner/Manager Command Center
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
                footerAction: "hidden",
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
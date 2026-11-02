"use client";

import { SignIn } from "@clerk/nextjs";
import { ShieldCheck, Activity, Truck, CheckCircle2, MapPin } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-svh w-full overflow-hidden bg-white text-slate-900">

      {/* Animated Light Mode Ambient Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Soft Sky & Emerald Floating Orbs */}
        <div className="absolute -top-32 -left-32 h-137.5 w-137.5 rounded-full bg-sky-100/70 blur-[100px] animate-pulse duration-7000" />
        <div className="absolute top-1/3 left-1/3 h-100 w-100 rounded-full bg-indigo-50/60 blur-[90px] animate-pulse duration-7000" />
        <div className="absolute -bottom-32 -right-32 h-125 w-125 rounded-full bg-emerald-50/70 blur-[100px] animate-pulse duration-7000" />

        {/* Crisp Light Slate Dot-Matrix Pattern */}
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* 2-Column Split Layout */}
      <div className="relative z-10 flex w-full flex-col lg:flex-row">

        {/* Left Side: Light Brand Showcase (Takes exact 50% width on desktop) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 border-r border-slate-200/80 bg-slate-50/60 backdrop-blur-xl relative">

          {/* Top Status Pill */}
          <div className="flex items-center gap-2.5 w-fit rounded-full px-3.5 py-1.5">
            <span className="relative flex h-2 w-2"></span>
            <div className="relative flex items-center justify-center">
              <Image
                src="/logo2.png"
                alt="Droply Logo"
                width={180}
                height={180}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Center Hero & Light Illustration */}
          <div className="my-auto space-y-8 max-w-xl">
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.12] text-slate-900">
                Smart Distribution &{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-indigo-600">
                  Fleet Dispatch.
                </span>
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Manage daily branch sales, monitor live rider routes, verify fuel & maintenance logs, and dispatch customer portal orders in real time.
              </p>
            </div>

            {/* Illustration Card with Floating Badges */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-200/60 group">
                <Image
                  src="/fleet-hero-light.png"
                  alt="Droply Fleet & Dispatch Network"
                  width={800}
                  height={450}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority
                />
              </div>

              {/* Floating Live Card 1 - Top Right */}
              <div className="absolute -top-4 -right-4 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md animate-bounce duration-4000">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live Sync</p>
                  <p className="text-xs font-bold text-slate-800">Orders & Ledgers Active</p>
                </div>
              </div>

              {/* Floating Live Card 2 - Bottom Left */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fleet Telemetry</p>
                  <p className="text-xs font-bold text-slate-800">Odometer & Fuel Tracked</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Highlights */}
          <div className="flex items-center gap-8 text-xs font-medium text-slate-500 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-600" />
              <span>Zone-Based Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span>Real-Time Branch Metrics</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean White Authentication Portal (Takes exact 50% width on desktop) */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-12 bg-white/80 backdrop-blur-md">
          <div className="w-full max-w-md space-y-6">

            {/* Brand Header */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="relative flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Droply Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-100 px-3 py-1 mt-1">
                <Activity className="h-3 w-3 text-sky-600" />
                <p className="text-[10px] text-sky-700 font-mono font-bold uppercase tracking-widest">
                  Branch Owner / Manager Center
                </p>
              </div>
            </div>

            {/* Clerk Sign In Card */}
            <div className="flex justify-center">
              <SignIn
                appearance={{
                  variables: {
                    colorPrimary: "#0284c7",
                  },
                  elements: {
                    rootBox: "w-full shadow-none",
                    card: "border border-slate-200/90 shadow-xl shadow-slate-200/40 bg-white rounded-2xl w-full p-6",
                    headerTitle: "text-lg font-bold text-slate-900",
                    headerSubtitle: "text-xs text-slate-500",
                    formButtonPrimary:
                      "!bg-sky-600 text-white hover:!bg-sky-700 text-xs font-semibold h-10 rounded-xl shadow-none focus:outline-none transition-all",
                    formFieldInput:
                      "h-10 text-xs rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-sky-500 focus:ring-sky-500 transition-all",
                    formFieldLabel: "text-xs font-semibold text-slate-700",
                    socialButtonsBlockButton:
                      "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold h-10 rounded-xl",
                    dividerLine: "bg-slate-200",
                    dividerText: "text-slate-400 text-[10px] font-semibold uppercase tracking-wider",
                    footerAction: "hidden",
                  },
                }}
              />
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/70 py-2.5 px-4 rounded-xl">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Restricted session • OTP required</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
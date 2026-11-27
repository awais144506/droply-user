/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSignature, LogOut, ShieldCheck } from "lucide-react";

export function TermsAgreementModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const hasAgreed = localStorage.getItem("droply_terms_agreed");
    if (!hasAgreed) {
      setShowTerms(true);
    }
  }, []);

  if (!isMounted || !showTerms) return null;

  const handleAgree = () => {
    localStorage.setItem("droply_terms_agreed", "true");
    setShowTerms(false);
  };

  const handleCancel = () => {
    signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col items-center text-center space-y-2.5 shrink-0">
          <div className="h-11 w-11 bg-sky-100 rounded-full flex items-center justify-center">
            <FileSignature className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Droply Terms of Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Please review and accept our terms before accessing your branch dashboard.
            </p>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-5 sm:p-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar text-sm text-slate-600 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">1. Acceptance & Platform Scope</h3>
            <p>
              By accessing or using Droply, you agree to be bound by these Terms of Service. Droply provides software tools for route delivery, inventory management, returnable asset tracking, and customer ledger (Khata) record-keeping.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">2. Financial & Inventory Responsibility</h3>
            <p>
              Droply operates strictly as a digital record-keeping and operational management tool. You and your authorized staff are solely responsible for verifying cash collections, customer credit/advance balances, security deposits, and physical stock counts. Droply is not liable for financial discrepancies, business disputes, or losses resulting from incorrect data entry or staff actions.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">3. Rider GPS & Location Tracking</h3>
            <p>
              If your subscription includes live GPS tracking, you are responsible for informing your riders and delivery staff that their location is tracked during active delivery shifts and ensuring compliance with applicable local privacy laws.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">4. Account Security & Customer Ordering Links</h3>
            <p>
              You are responsible for safeguarding your login credentials, staff accounts, and customer ordering links. While we take strong measures to secure and isolate your branch data, Droply is not responsible for unauthorized orders or changes made through compromised credentials or shared links.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">5. Subscriptions, Fair Use & Suspension</h3>
            <p>
              Access to Droply features depends on your active subscription tier. Failure to renew on time, misuse of the platform, or attempts to disrupt our servers may result in temporary suspension or termination of access.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">6. Updates to Terms</h3>
            <p>
              Droply reserves the right to update these terms as new features are introduced. Continued use of the platform after updates constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4 shrink-0">
          <div className="flex items-start sm:items-center space-x-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <Checkbox
              id="terms"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              className="h-5 w-5 mt-0.5 sm:mt-0 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm font-medium leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none text-slate-700"
            >
              I have read and agree to the Droply Terms of Service and Privacy Policy.
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Decline & Logout
            </Button>

            <Button
              onClick={handleAgree}
              disabled={!isChecked}
              className="bg-sky-600 hover:bg-sky-700 text-white min-w-30 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              I Agree
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
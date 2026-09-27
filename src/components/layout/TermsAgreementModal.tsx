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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center">
            <FileSignature className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Droply Terms of Service</h2>
            <p className="text-sm text-slate-500 mt-1">
              Please read and accept our updated terms before accessing the dashboard.
            </p>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 max-h-[40vh] overflow-y-auto custom-scrollbar text-sm text-slate-600 space-y-4">
          <h3 className="font-bold text-slate-900">1. Acceptance of Terms</h3>
          <p>
            By accessing and using the Droply platform, you accept and agree to be bound by the terms and provision of this agreement. 
            In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
          
          <h3 className="font-bold text-slate-900">2. Data Privacy & Security</h3>
          <p>
            We take the protection of your business data seriously. Your branch operations, financial logs, and staff details are processed 
            securely in accordance with our privacy policy. You are responsible for maintaining the confidentiality of your account credentials.
          </p>

          <h3 className="font-bold text-slate-900">3. Acceptable Use</h3>
          <p>
            You agree not to use the platform for any unlawful purpose or in any way that could damage, disable, overburden, or impair 
            our servers or networks. We reserve the right to suspend accounts that violate these operational guidelines.
          </p>

          <h3 className="font-bold text-slate-900">4. Modifications</h3>
          <p>
            Droply reserves the right to modify these terms at any time. We will do our best to provide notice of any significant changes, 
            but it is your responsibility to review these terms periodically.
          </p>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6">
          <div className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Checkbox 
              id="terms" 
              checked={isChecked} 
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              className="h-5 w-5 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
            />
            <label 
              htmlFor="terms" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none text-slate-700"
            >
              I have read and agree to the Droply Terms of Service and Privacy Policy.
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Decline & Logout
            </Button>
            
            <Button 
              onClick={handleAgree}
              disabled={!isChecked}
              className="bg-sky-600 hover:bg-sky-700 text-white min-w-30"
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
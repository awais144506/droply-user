"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UploadCloud,
  FileText,
  CreditCard,
  Building2,
  ShieldCheck,
  Calendar,
  X,
  Copy,
  Check,
  Zap,
  ArrowUpRight,
  Receipt,
  Landmark,
  QrCode,
  Smartphone,
  ChevronRight,
  ArrowRight,
  Gift,
} from "lucide-react";

// --- TYPES ---
export type BillingCycle = "TRIAL" | "MONTHLY" | "YEARLY";
export type PlanTier = "STARTER" | "GROWTH" | "ENTERPRISE";
export type BillStatus = "CLEARED" | "PENDING_APPROVAL" | "UNPAID" | "OVERDUE";
export type PaymentMethodKey = "MEEZAN_BANK" | "RAAST_PAY" | "JAZZCASH" | "EASYPAISA";

export interface DroplyPaymentMethod {
  id: PaymentMethodKey;
  name: string;
  badge: string;
  accountTitle: string;
  accountNumber: string;
  iban?: string;
  bankBranch?: string;
  qrPayload: string;
}

export interface SubscriptionInvoice {
  id: string;
  invoiceNumber: string;
  billingMonth: string;
  billingPeriod: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  paymentMethod?: string;
  transactionRef?: string;
  receiptUrl?: string;
  submittedAt?: string;
  clearedAt?: string;
  adminNotes?: string;
}

// --- DROPLY OFFICIAL PAYMENT CHANNELS ---
const DROPLY_PAYMENT_ACCOUNTS: DroplyPaymentMethod[] = [
  {
    id: "MEEZAN_BANK",
    name: "Meezan Bank",
    badge: "Bank Transfer",
    accountTitle: "Droply Systems (Pvt) Ltd",
    accountNumber: "0104-0109921448",
    iban: "PK64MEZN0001040109921448",
    bankBranch: "High Street Branch, Sahiwal",
    qrPayload: "meezan:PK64MEZN0001040109921448?name=DroplySystems",
  },
  {
    id: "RAAST_PAY",
    name: "Raast Instant",
    badge: "0% Fee",
    accountTitle: "Droply Tech Operations",
    accountNumber: "+92 300 9876543",
    iban: "PK64MEZN0001040109921448",
    qrPayload: "raast:+923009876543?amount=8500",
  },
  {
    id: "JAZZCASH",
    name: "JazzCash",
    badge: "Till / Wallet",
    accountTitle: "Droply Water Management",
    accountNumber: "0300-9876543",
    bankBranch: "Till ID: 00291048",
    qrPayload: "jazzcash:00291048?title=DroplyWater",
  },
  {
    id: "EASYPAISA",
    name: "Easypaisa",
    badge: "Merchant QR",
    accountTitle: "Droply Tech Solutions",
    accountNumber: "0345-1234567",
    bankBranch: "Merchant Till: 88419",
    qrPayload: "easypaisa:88419?title=DroplyTech",
  },
];

// --- PRICING TIERS ---
const PLAN_DETAILS = {
  STARTER: {
    name: "Starter Plant",
    monthlyPrice: 4500,
    yearlyPrice: 43200, // 20% off
    riders: 3,
    sectors: 2,
  },
  GROWTH: {
    name: "Growth Plant",
    monthlyPrice: 8500,
    yearlyPrice: 81600, // 20% off (Save Rs 20,400)
    riders: 10,
    sectors: 6,
  },
  ENTERPRISE: {
    name: "Enterprise Fleet",
    monthlyPrice: 15000,
    yearlyPrice: 144000,
    riders: 25,
    sectors: 15,
  },
};

const MOCK_INVOICES: SubscriptionInvoice[] = [
  {
    id: "sub-inv-103",
    invoiceNumber: "DPLY-SUB-2026-09",
    billingMonth: "September 2026",
    billingPeriod: "Sep 01, 2026 - Sep 30, 2026",
    amount: 8500,
    dueDate: "Sep 05, 2026",
    status: "UNPAID",
  },
  {
    id: "sub-inv-102",
    invoiceNumber: "DPLY-SUB-2026-08",
    billingMonth: "August 2026",
    billingPeriod: "Aug 01, 2026 - Aug 31, 2026",
    amount: 8500,
    dueDate: "Aug 05, 2026",
    status: "CLEARED",
    paymentMethod: "Meezan Bank Raast",
    transactionRef: "RAAST-9921448201",
    receiptUrl: "https://example.com/receipts/aug-2026.jpg",
    submittedAt: "Aug 03, 2026",
    clearedAt: "Aug 03, 2026, 04:30 PM",
    adminNotes: "Payment verified via Raast instant settlement",
  },
  {
    id: "sub-inv-101",
    invoiceNumber: "DPLY-SUB-2026-07",
    billingMonth: "July 2026",
    billingPeriod: "Jul 01, 2026 - Jul 31, 2026",
    amount: 8500,
    dueDate: "Jul 05, 2026",
    status: "CLEARED",
    paymentMethod: "HBL Online Wire",
    transactionRef: "HBL-TRX-1029481",
    submittedAt: "Jul 04, 2026",
    clearedAt: "Jul 04, 2026, 02:15 PM",
  },
];

// Minimalist QR Code Graphic
function CleanQRCode({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center">
      <div className="relative h-24 w-24 bg-slate-900 rounded-xl p-2 flex items-center justify-center">
        <div className="h-full w-full bg-white rounded-lg p-1 grid grid-cols-5 grid-rows-5 gap-0.5">
          <div className="bg-slate-900 rounded-xs col-span-2 row-span-2" />
          <div className="bg-slate-900 rounded-xs col-span-2 col-start-4 row-span-2" />
          <div className="bg-slate-900 rounded-xs col-span-2 row-start-4 row-span-2" />
          <div className="bg-slate-900 rounded-xs col-start-3 row-start-3" />
          <div className="bg-slate-900 rounded-xs col-start-4 row-start-4" />
          <div className="bg-slate-900 rounded-xs col-start-3 row-start-5" />
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1.5">
        {label}
      </span>
    </div>
  );
}

export default function SubscriptionPage() {
  // Subscription Plan State
  const [currentTier, setCurrentTier] = useState<PlanTier>("GROWTH");
  const [currentCycle, setCurrentCycle] = useState<BillingCycle>("MONTHLY");
  const [daysRemaining, setDaysRemaining] = useState<number>(7); // 7 days left in current cycle
  const [expiryDate, setExpiryDate] = useState<string>("September 05, 2026");

  // Invoices & Payment state
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>(MOCK_INVOICES);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeQRMethod, setActiveQRMethod] = useState<DroplyPaymentMethod>(
    DROPLY_PAYMENT_ACCOUNTS[0]
  );

  // Upload Form State
  const [targetMonth, setTargetMonth] = useState("September 2026");
  const [paymentChannel, setPaymentChannel] = useState<PaymentMethodKey>("MEEZAN_BANK");
  const [transactionRef, setTransactionRef] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Upgrade Form State
  const [upgradeTier, setUpgradeTier] = useState<PlanTier>(currentTier);
  const [upgradeCycle, setUpgradeCycle] = useState<"MONTHLY" | "YEARLY">("YEARLY");

  const activePlan = PLAN_DETAILS[currentTier];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenQRModal = (method: DroplyPaymentMethod) => {
    setActiveQRMethod(method);
    setIsQRModalOpen(true);
  };

  const handleOpenUploadModal = (invoice?: SubscriptionInvoice) => {
    if (invoice) {
      setTargetMonth(invoice.billingMonth);
    }
    setTransactionRef("");
    setUploadedFileName("");
    setIsUploadModalOpen(true);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef && !uploadedFileName) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.billingMonth === targetMonth
          ? {
              ...inv,
              status: "PENDING_APPROVAL",
              paymentMethod: paymentChannel.replace("_", " "),
              transactionRef: transactionRef || "SLIP_ATTACHED",
              submittedAt: "Today, Just now",
              adminNotes: "Submitted for Droply Finance clearance",
            }
          : inv
      )
    );

    setIsUploadModalOpen(false);
  };

  const handleApplyUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentTier(upgradeTier);
    setCurrentCycle(upgradeCycle);
    setDaysRemaining(upgradeCycle === "YEARLY" ? 365 : 30);
    setExpiryDate(
      upgradeCycle === "YEARLY" ? "August 29, 2027" : "September 29, 2026"
    );
    setIsUpgradeModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-700">Billing & Quota</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Subscription & Active License
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor plan expiry, switch billing cycles, scan payment QR codes, and upload monthly renewal receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Upgrade / Switch Plan</span>
          </button>

          <button
            onClick={() => handleOpenUploadModal()}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Upload Payment Slip</span>
          </button>
        </div>
      </div>

      {/* Plan Status & Days Remaining Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Active Tier Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/70">
              {activePlan.name}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
              {currentCycle === "TRIAL"
                ? "Free Trial"
                : currentCycle === "YEARLY"
                ? "Annual Plan (Billed Yearly)"
                : "Monthly Subscription"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Rs{" "}
              {currentCycle === "YEARLY"
                ? activePlan.yearlyPrice.toLocaleString()
                : activePlan.monthlyPrice.toLocaleString()}
            </h2>
            <span className="text-xs text-slate-400">
              /{currentCycle === "YEARLY" ? "year" : "month"}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Includes up to <strong>{activePlan.riders} Rider mobile seats</strong>,{" "}
            <strong>{activePlan.sectors} delivery sectors</strong>, and offline sync persistence.
          </p>
        </div>

        {/* Right: Countdown & Progress Widget */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Plan Validity
              </span>
              <span
                className={`text-xs font-bold font-mono ${
                  daysRemaining <= 3 ? "text-rose-600" : "text-emerald-700"
                }`}
              >
                {daysRemaining} Days Left
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  daysRemaining <= 3 ? "bg-rose-500" : "bg-emerald-600"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (daysRemaining / (currentCycle === "YEARLY" ? 365 : 30)) * 100
                  )}%`,
                }}
              />
            </div>

            <span className="text-[10px] text-slate-500 block pt-0.5">
              Renews on <strong>{expiryDate}</strong>
            </span>
          </div>

          <div className="sm:border-l sm:border-slate-200 sm:pl-4">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
            >
              <span>{currentCycle === "MONTHLY" ? "Save 20% (Switch Annual)" : "Modify Plan"}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Official Droply Payment Accounts & QR Codes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Official Droply Payment Channels & QRs
            </h2>
            <p className="text-[11px] text-slate-500">
              Scan QR code on your banking app or copy the IBAN/account number to clear renewals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DROPLY_PAYMENT_ACCOUNTS.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {method.id === "MEEZAN_BANK" ? (
                      <Landmark className="h-3.5 w-3.5 text-emerald-600" />
                    ) : method.id === "RAAST_PAY" ? (
                      <Zap className="h-3.5 w-3.5 text-sky-600" />
                    ) : (
                      <Smartphone className="h-3.5 w-3.5 text-rose-600" />
                    )}
                    <h3 className="text-xs font-bold text-slate-900">{method.name}</h3>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {method.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{method.accountTitle}</p>
              </div>

              {/* QR Code Container */}
              <CleanQRCode value={method.qrPayload} label="Scan to Pay" />

              {/* Account Number Box */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate mr-1 select-all">
                    {method.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(method.accountNumber, `${method.id}_acc`)}
                    className="p-1 text-slate-400 hover:text-sky-600 transition-colors shrink-0"
                    title="Copy Account Number"
                  >
                    {copiedKey === `${method.id}_acc` ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={() => handleOpenQRModal(method)}
                className="w-full h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] inline-flex items-center justify-center gap-1 transition-colors"
              >
                <QrCode className="h-3 w-3" />
                <span>Fullscreen QR</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Billing & Clearance History */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Billing Ledger & Verification Log
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Track submitted transfer slips and Droply admin clearance stamps.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Billing Month</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4 text-right">Fee (PKR)</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Verification Ref</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{inv.billingMonth}</span>
                    <span className="text-[10px] font-mono text-slate-400">{inv.invoiceNumber}</span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    {inv.billingPeriod}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    Rs {inv.amount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    {inv.dueDate}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {inv.status === "CLEARED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Cleared</span>
                      </span>
                    ) : inv.status === "PENDING_APPROVAL" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                        <Clock className="h-3 w-3" />
                        <span>Verifying</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Unpaid</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {inv.transactionRef ? (
                      <div>
                        <span className="font-mono font-semibold text-slate-900 block text-[11px]">
                          {inv.transactionRef}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                          {inv.clearedAt || inv.adminNotes}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {inv.status === "UNPAID" ? (
                      <button
                        onClick={() => handleOpenUploadModal(inv)}
                        className="h-7 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <UploadCloud className="h-3 w-3" />
                        <span>Upload Slip</span>
                      </button>
                    ) : inv.status === "PENDING_APPROVAL" ? (
                      <span className="text-[11px] font-semibold text-amber-600">Reviewing...</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: PLAN UPGRADE & BILLING CYCLE SWITCHER */}
      {/* ========================================================= */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Change Plan or Billing Cycle</h2>
                  <p className="text-[11px] text-slate-400">Switch to Annual to unlock 20% discount</p>
                </div>
              </div>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleApplyUpgrade} className="space-y-3.5">
              {/* Cycle Toggle: Monthly vs Yearly */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setUpgradeCycle("MONTHLY")}
                  className={`h-9 rounded-xl text-xs font-bold transition-all ${
                    upgradeCycle === "MONTHLY"
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setUpgradeCycle("YEARLY")}
                  className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    upgradeCycle === "YEARLY"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Yearly Billing</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
                    Save 20%
                  </span>
                </button>
              </div>

              {/* Tier Selection */}
              <div className="space-y-2">
                {(["STARTER", "GROWTH", "ENTERPRISE"] as PlanTier[]).map((tierKey) => {
                  const tier = PLAN_DETAILS[tierKey];
                  const isSelected = upgradeTier === tierKey;
                  const price =
                    upgradeCycle === "YEARLY" ? tier.yearlyPrice : tier.monthlyPrice;

                  return (
                    <div
                      key={tierKey}
                      onClick={() => setUpgradeTier(tierKey)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-sky-600 bg-sky-50/40"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{tier.name}</span>
                          {tierKey === "GROWTH" && (
                            <span className="text-[9px] font-bold bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {tier.riders} Riders • {tier.sectors} Delivery Sectors
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-slate-900 block">
                          Rs {price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          /{upgradeCycle === "YEARLY" ? "year" : "month"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Switch & Update Quota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: FULLSCREEN QR CODE MODAL */}
      {/* ========================================================= */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">{activeQRMethod.name}</h3>
              </div>
              <button
                onClick={() => setIsQRModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center">
              <div className="h-44 w-44 bg-white rounded-2xl border border-slate-300 shadow-md p-3 flex flex-col items-center justify-center">
                <div className="h-full w-full bg-slate-900 rounded-xl p-2 grid grid-cols-5 grid-rows-5 gap-1">
                  <div className="bg-white rounded-xs col-span-2 row-span-2" />
                  <div className="bg-white rounded-xs col-span-2 col-start-4 row-span-2" />
                  <div className="bg-white rounded-xs col-span-2 row-start-4 row-span-2" />
                  <div className="bg-white rounded-xs col-start-3 row-start-3" />
                  <div className="bg-white rounded-xs col-start-4 row-start-4" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 mt-3 font-mono">
                {activeQRMethod.accountNumber}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">{activeQRMethod.accountTitle}</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Open your banking app, choose <strong>Scan QR</strong>, and point camera.
            </p>

            <button
              onClick={() => {
                setIsQRModalOpen(false);
                handleOpenUploadModal();
              }}
              className="w-full h-9 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Upload Transfer Slip &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: UPLOAD PAYMENT SLIP */}
      {/* ========================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Upload Subscription Slip</h2>
                  <p className="text-[11px] text-slate-400">Send proof of transfer to Droply Finance for clearance</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-3.5">
              {/* Billing Month Target */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Which Month to Clear? *</label>
                <select
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white font-semibold text-slate-900"
                >
                  <option value="September 2026">September 2026 (Rs 8,500 - Due)</option>
                  <option value="October 2026">October 2026 (Rs 8,500 - Advance)</option>
                  <option value="August 2026">August 2026 (Adjustment)</option>
                </select>
              </div>

              {/* Payment Channel Used */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Payment Channel Used *</label>
                <select
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                >
                  <option value="MEEZAN_BANK">Meezan Bank Direct Transfer</option>
                  <option value="RAAST_PAY">Raast Instant Pay QR</option>
                  <option value="JAZZCASH">JazzCash Wallet / QR</option>
                  <option value="EASYPAISA">Easypaisa Wallet / QR</option>
                </select>
              </div>

              {/* Transaction Reference ID */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Bank Transaction Reference (TRX / RRN / TID #) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. RAAST-99120482, TID-449102, or FT-88129"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-sky-500/20"
                  required
                />
              </div>

              {/* File / Screenshot Upload */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Upload Payment Screenshot / Slip
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="h-6 w-6 text-sky-600 mx-auto mb-1.5" />
                  {uploadedFileName ? (
                    <span className="text-xs font-bold text-emerald-700 block">{uploadedFileName}</span>
                  ) : (
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        Click to select receipt image or PDF
                      </span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, or PDF (Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Amount Preview */}
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between text-xs">
                <span className="text-sky-900 font-medium">Subscription Target:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">Rs 8,500.00</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Submit for Clearance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
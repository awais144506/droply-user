import {
  MapPin, Package, Truck, FileText, Navigation, Factory, PackageCheck, Building,
  Receipt, UserCog, BarChart3, LucideIcon, UserPlus, Settings, ArchiveX, TruckIcon,
  BadgeDollarSign, Undo2, Headphones, CreditCard
} from "lucide-react";

export type UserRole = "OWNER" | "MANAGER";
// 🔥 1. Define the tiers
export type SubscriptionTier = "SILVER" | "GOLD" | "PLATINUM";

//DELETE IN PRODUCTION
export type DevStatus = "DONE" | "PARTIAL" | "TODO";
//DELETE IN PRODUCTION

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  allowedRoles: UserRole[];
  allowedTiers: SubscriptionTier[];
  devStatus?: DevStatus; //DELETE IN PROD 
}

export interface NavGroup {
  label: string;
  headerColor: { text: string; dot: string; border: string; bgHover: string; };
  items: NavItem[];
}

// Helper arrays to keep the config clean
const ALL_TIERS: SubscriptionTier[] = ["SILVER", "GOLD", "PLATINUM"];
const GOLD_PLUS: SubscriptionTier[] = ["GOLD", "PLATINUM"];
const PLATINUM_ONLY: SubscriptionTier[] = ["PLATINUM"];


export const BRANCH_NAV_CONFIG: NavGroup[] = [
  {
    label: "MANAGE DATA",
    headerColor: { text: "text-sky-600 dark:text-sky-400", dot: "bg-sky-500", border: "border-sky-500/20", bgHover: "hover:bg-sky-500/5" },
    items: [
      { title: "Zones & Routes", url: "/manage/zones", icon: MapPin, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS, devStatus: "DONE" },
      { title: "Customers", url: "/manage/customers", icon: UserPlus, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS, devStatus: "DONE" },
      { title: "Products & Pricing", url: "/manage/products", icon: Package, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS, devStatus: "DONE" },
    ],
  },
  {
    label: "SALES & DISPATCH",
    headerColor: { text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-500/20", bgHover: "hover:bg-emerald-500/5" },
    items: [
      { title: "Deliveries & Sales", url: "/sales/orders", icon: Truck, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS, devStatus: "PARTIAL" },
      { title: "Sale Returns & Recovery", url: "/sales/recovery", icon: Undo2, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "TODO" },
      { title: "Invoices & Receipts", url: "/sales/invoices", icon: FileText, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS, devStatus: "TODO" },
      { title: "Live Tracking", url: "/sales/tracking", icon: Navigation, badge: "GPS", allowedRoles: ["OWNER", "MANAGER"], allowedTiers: PLATINUM_ONLY, devStatus: "TODO" },
    ],
  },
  {
    label: "INVENTORY & ASSETS",
    headerColor: { text: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500", border: "border-indigo-500/20", bgHover: "hover:bg-indigo-500/5" },
    items: [
      { title: "Production / Refill", url: "/stock/production", icon: Factory, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: PLATINUM_ONLY, devStatus: "TODO" },
      { title: "Asset Custody Ledger", url: "/stock/assets", icon: PackageCheck, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "TODO" },
      { title: "Wastage & Damages", url: "/stock/wastage", icon: ArchiveX, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "TODO" },
    ],
  },
  {
    label: "SUPPLIES & PURCHASES",
    headerColor: { text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", border: "border-amber-500/20", bgHover: "hover:bg-amber-500/5" },
    items: [
      { title: "Suppliers", url: "/supply/suppliers", icon: Building, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "PARTIAL" },
      { title: "Purchase Orders", url: "/supply/order", icon: Receipt, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "TODO" },
      { title: "Payments", url: "/supply/payments", icon: CreditCard, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "TODO" },
      { title: "Purchase Returns", url: "/supply/returns", icon: Undo2, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "TODO" },
    ],
  },
  {
    label: "OPERATIONS & ADMIN",
    headerColor: { text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500", border: "border-rose-500/20", bgHover: "hover:bg-rose-500/5" },
    items: [
      { title: "Staff & Payroll", url: "/admin/staff", icon: UserCog, badge: "Owner", allowedRoles: ["OWNER"], allowedTiers: ALL_TIERS, devStatus: "DONE" },
      { title: "Vehicles & Fuel", url: "/admin/fleet", icon: TruckIcon, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS, devStatus: "PARTIAL" },
      { title: "Assigned Tasks", url: "/admin/tasks", icon: FileText, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: PLATINUM_ONLY, devStatus: "TODO" },
      { title: "Expenses & Accounts", url: "/admin/expenses", icon: BadgeDollarSign, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS,devStatus: "TODO" },
      { title: "Reports", url: "/admin/reports", icon: BarChart3, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: GOLD_PLUS,devStatus: "TODO" },

      // Admin/Settings are always available to manage their account
      { title: "Subscription", url: "/admin/subscription", icon: CreditCard, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS,devStatus: "TODO" },
      { title: "Branch Settings", url: "/admin/settings", icon: Settings, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS,devStatus: "DONE" },
      { title: "Help", url: "/admin/help", icon: Headphones, allowedRoles: ["OWNER", "MANAGER"], allowedTiers: ALL_TIERS,devStatus: "TODO" },
    ],
  },
];
import {
  MapPin,
  Package,
  Truck,
  FileText,
  Navigation,
  Factory,
  PackageCheck,
  Building,
  Receipt,
  UserCog,
  BarChart3,
  LucideIcon,
  UserPlus,
  Settings,
  ArchiveX,
  TruckIcon,
  BadgeDollarSign,
  Undo2,
  Headphones,
  CreditCard
} from "lucide-react";

export type UserRole = "OWNER" | "MANAGER";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  allowedRoles: UserRole[];
}

export interface NavGroup {
  label: string;
  headerColor: {
    text: string;
    dot: string;
    border: string;
    bgHover: string;
  };
  items: NavItem[];
}

export const BRANCH_NAV_CONFIG: NavGroup[] = [
  {
    label: "MANAGE DATA",
    headerColor: {
      text: "text-sky-600 dark:text-sky-400",
      dot: "bg-sky-500",
      border: "border-sky-500/20",
      bgHover: "hover:bg-sky-500/5",
    },
    items: [
      { title: "Zones & Routes", url: "/manage/zones", icon: MapPin, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Customers", url: "/manage/customers", icon: UserPlus, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Products & Pricing", url: "/manage/products", icon: Package, allowedRoles: ["OWNER", "MANAGER"] },
    ],
  },
  {
    label: "SALES & DISPATCH",
    headerColor: {
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
      border: "border-emerald-500/20",
      bgHover: "hover:bg-emerald-500/5",
    },
    items: [
      { title: "Deliveries & Sales", url: "/sales/orders", icon: Truck, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Sale Returns & Recovery", url: "/sales/recovery", icon: Undo2, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Invoices & Receipts", url: "/sales/invoices", icon: FileText, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Live Tracking", url: "/sales/tracking", icon: Navigation, badge: "GPS", allowedRoles: ["OWNER", "MANAGER"] },
    ],
  },
  {
    label: "INVENTORY & ASSETS",
    headerColor: {
      text: "text-indigo-600 dark:text-indigo-400",
      dot: "bg-indigo-500",
      border: "border-indigo-500/20",
      bgHover: "hover:bg-indigo-500/5",
    },
    items: [
      { title: "Production / Refill", url: "/stock/production", icon: Factory, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Asset Custody Ledger", url: "/stock/assets", icon: PackageCheck, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Wastage & Damages", url: "/stock/wastage", icon: ArchiveX, allowedRoles: ["OWNER", "MANAGER"] },
    ],
  },
  {
    label: "PROCUREMENT",
    headerColor: {
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
      border: "border-amber-500/20",
      bgHover: "hover:bg-amber-500/5",
    },
    items: [
      { title: "Suppliers", url: "/supply/suppliers", icon: Building, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Purchase Orders", url: "/supply/order", icon: Receipt, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Payments", url: "/supply/payments", icon: CreditCard, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Purchase Returns", url: "/supply/returns", icon: Undo2, allowedRoles: ["OWNER", "MANAGER"] },
    ],
  },
  {
    label: "OPERATIONS & ADMIN",
    headerColor: {
      text: "text-rose-600 dark:text-rose-400",
      dot: "bg-rose-500",
      border: "border-rose-500/20",
      bgHover: "hover:bg-rose-500/5",
    },
    items: [
      { title: "Staff & Payroll", url: "/admin/staff", icon: UserCog, badge: "Owner", allowedRoles: ["OWNER"] },
      { title: "Vehicles & Fuel", url: "/admin/fleet", icon: TruckIcon, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Assigned Tasks", url: "/admin/tasks", icon: FileText, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Expenses & Accounts", url: "/admin/expenses", icon: BadgeDollarSign, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Reports", url: "/admin/reports", icon: BarChart3, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Subscription", url: "/admin/subscription", icon: CreditCard, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Branch Settings", url: "/admin/settings", icon: Settings, allowedRoles: ["OWNER", "MANAGER"] },
      { title: "Help", url: "/admin/help", icon: Headphones, allowedRoles: ["OWNER", "MANAGER"] },
    ],
  },
];
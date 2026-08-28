import {
  MapPin,
  Package,
  Users,
  Truck,
  FileText,
  BadgeDollarSign,
  Navigation,
  Factory,
  PackageCheck,
  Building,
  ShoppingCart,
  Receipt,
  UserCog,
  BarChart3,
  Settings,
  CreditCard,
  LucideIcon,
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
    label: "DATA",
    headerColor: {
      text: "text-sky-600 dark:text-sky-400",
      dot: "bg-sky-500",
      border: "border-sky-500/20",
      bgHover: "hover:bg-sky-500/5",
    },
    items: [
      {
        title: "Zones",
        url: "/zones",
        icon: MapPin,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Stock",
        url: "/stock",
        icon: Package,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
        allowedRoles: ["OWNER", "MANAGER"],
      },
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
      {
        title: "Delivery / Sale",
        url: "/orders",
        icon: Truck,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Invoices",
        url: "/invoices",
        icon: FileText,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Payment In",
        url: "/payments",
        icon: BadgeDollarSign,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Live Tracking",
        url: "/tracking",
        icon: Navigation,
        badge: "GPS",
        allowedRoles: ["OWNER", "MANAGER"],
      },
    ],
  },
  {
    label: "PRODUCTION & STOCK",
    headerColor: {
      text: "text-indigo-600 dark:text-indigo-400",
      dot: "bg-indigo-500",
      border: "border-indigo-500/20",
      bgHover: "hover:bg-indigo-500/5",
    },
    items: [
      {
        title: "Production",
        url: "/production",
        icon: Factory,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Bottle & Asset Ledger",
        url: "/inventory",
        icon: PackageCheck,
        allowedRoles: ["OWNER", "MANAGER"],
      },
    ],
  },
  {
    label: "PURCHASES & EXPENSES",
    headerColor: {
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
      border: "border-amber-500/20",
      bgHover: "hover:bg-amber-500/5",
    },
    items: [
      {
        title: "Suppliers",
        url: "/suppliers",
        icon: Building,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Purchases",
        url: "/purchases",
        icon: ShoppingCart,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Expenses",
        url: "/expenses",
        icon: Receipt,
        allowedRoles: ["OWNER", "MANAGER"],
      },
    ],
  },
  {
    label: "ADMIN",
    headerColor: {
      text: "text-rose-600 dark:text-rose-400",
      dot: "bg-rose-500",
      border: "border-rose-500/20",
      bgHover: "hover:bg-rose-500/5",
    },
    items: [
      {
        title: "Users",
        url: "/users",
        icon: UserCog,
        badge: "Owner",
        allowedRoles: ["OWNER"],
      },
      {
        title: "Reports",
        url: "/reports",
        icon: BarChart3,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Branch Settings",
        url: "/settings",
        icon: Settings,
        allowedRoles: ["OWNER", "MANAGER"],
      },
      {
        title: "Subscription",
        url: "/subscription",
        icon: CreditCard,
        allowedRoles: ["OWNER", "MANAGER"],
      },
    ],
  },
];
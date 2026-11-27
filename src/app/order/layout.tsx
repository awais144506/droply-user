import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Droply Customer",
  description: "Place your orders instantly",
  manifest: "/manifest-customer.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Droply Customer",
  },
};

export default function CustomerOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
import { CheckCircle2, UserPlus, AlertCircle, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlatformActivity } from "../types";

const DUMMY_ACTIVITIES: PlatformActivity[] = [
  {
    id: "act_1",
    branchName: "AquaSprings Bottlers",
    description: "Added 2 new delivery riders (Seat 4/15 and 5/15)",
    timestamp: "12 mins ago",
    type: "USER_LIMIT",
  },
  {
    id: "act_2",
    branchName: "Blue Mist Pure Water",
    description: "Monthly subscription (PKR 8,000) settled via Bank Transfer",
    timestamp: "2 hours ago",
    type: "PAYMENT",
  },
  {
    id: "act_3",
    branchName: "Al-Rayan LPG & Gas",
    description: "New tenant branch successfully onboarded with 2FA enabled",
    timestamp: "1 day ago",
    type: "ONBOARDING",
  },
  {
    id: "act_4",
    branchName: "Pak Clean Drop Plant",
    description: "Invoice reminder sent. Account status marked Past Due",
    timestamp: "2 days ago",
    type: "ALERT",
  },
];

export function ActivityFeedCard() {
  const getIcon = (type: PlatformActivity["type"]) => {
    switch (type) {
      case "USER_LIMIT":
        return <UserPlus className="h-4 w-4 text-violet-600" />;
      case "PAYMENT":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case "ALERT":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "ONBOARDING":
      default:
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className="border shadow-none bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">System & Tenant Logs</CardTitle>
        <CardDescription className="text-xs">
          Real-time events across all active branches.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DUMMY_ACTIVITIES.map((item) => (
          <div key={item.id} className="flex items-start gap-3 text-xs">
            <div className="mt-0.5 rounded-full bg-muted p-1.5 shrink-0">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{item.branchName}</span>
                <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
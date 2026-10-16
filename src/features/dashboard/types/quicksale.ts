export interface BranchSummary {
  id: string;
  name: string;
  ownerName: string;
  city: string;
  activeUsers: number;
  maxUsers: number;
  monthlyFee: number;
  status: "ACTIVE" | "PAST_DUE" | "SUSPENDED";
  joinedDate: string;
}

export interface PlatformActivity {
  id: string;
  branchName: string;
  description: string;
  timestamp: string;
  type: "ONBOARDING" | "PAYMENT" | "USER_LIMIT" | "ALERT";
}
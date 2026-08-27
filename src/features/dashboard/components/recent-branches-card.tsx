import Link from "next/link";
import { ArrowUpRight, Building2, MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BranchSummary } from "../types";

const DUMMY_BRANCHES: BranchSummary[] = [
  {
    id: "br_1",
    name: "Blue Mist Pure Water",
    ownerName: "Qamar Abbas",
    city: "Islamabad (I-9)",
    activeUsers: 8,
    maxUsers: 15,
    monthlyFee: 8000,
    status: "ACTIVE",
    joinedDate: "12 Aug 2026",
  },
  {
    id: "br_2",
    name: "Al-Rayan LPG & Gas",
    ownerName: "Zubair Khan",
    city: "Rawalpindi (Saddar)",
    activeUsers: 14,
    maxUsers: 15,
    monthlyFee: 8000,
    status: "ACTIVE",
    joinedDate: "18 Aug 2026",
  },
  {
    id: "br_3",
    name: "AquaSprings Bottlers",
    ownerName: "Hamza Tariq",
    city: "Lahore (Gulberg)",
    activeUsers: 5,
    maxUsers: 15,
    monthlyFee: 8000,
    status: "ACTIVE",
    joinedDate: "21 Aug 2026",
  },
  {
    id: "br_4",
    name: "Pak Clean Drop Plant",
    ownerName: "Farhan Ali",
    city: "Karachi (DHA)",
    activeUsers: 11,
    maxUsers: 15,
    monthlyFee: 8000,
    status: "PAST_DUE",
    joinedDate: "05 Jul 2026",
  },
];

export function RecentBranchesCard() {
  return (
    <Card className="border shadow-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold">Active Tenant Branches</CardTitle>
          <CardDescription className="text-xs">
            Live overview of registered delivery businesses and user seat utilization.
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/app/branches">
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Branch</TableHead>
              <TableHead className="text-xs">Owner & Location</TableHead>
              <TableHead className="text-xs">User Quota</TableHead>
              <TableHead className="text-xs">Plan</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_BRANCHES.map((branch) => (
              <TableRow key={branch.id} className="hover:bg-muted/40">
                <TableCell className="font-medium text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-semibold">{branch.name}</span>
                  </div>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">{branch.ownerName}</div>
                  <div>{branch.city}</div>
                </TableCell>

                <TableCell className="text-xs">
                  <span className="font-semibold text-foreground">{branch.activeUsers}</span>
                  <span className="text-muted-foreground"> / {branch.maxUsers} Users</span>
                </TableCell>

                <TableCell className="text-xs font-mono font-medium">
                  PKR {branch.monthlyFee.toLocaleString()}/mo
                </TableCell>

                <TableCell>
                  {branch.status === "ACTIVE" ? (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[11px] font-medium border-0">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-[11px] font-medium border-0">
                      Past Due
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
"use client";

import Link from "next/link";
import {
  Truck,
  RotateCcw,
  Wallet,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Factory,
  Droplets,
  ArrowRight,
  TrendingUp,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Operations Control Desk
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-semibold"
            >
              Plant Online
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time bottle circulation, fleet dispatch, and shift cash settlement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="h-9 text-xs" asChild>
            <Link href="/app/production">
              <Factory className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              Log Bottling
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-xs" asChild>
            <Link href="/app/orders">
              <Droplets className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Walk-in Sale
            </Link>
          </Button>
          <Button size="sm" className="h-9 text-xs shadow-sm" asChild>
            <Link href="/app/dispatch">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Trip Dispatch
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-none border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Bottles Dispatched Today
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Droplets className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">420 Bottles</div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> 84%
              </span>
              <span>of 500 daily quota loaded</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Empty Bottle Recovery
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-emerald-600">
              91.4%
            </div>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">384 / 420</span>{" "}
              empty shells recovered
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Shift Cash Collected
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">Rs 58,400</div>
            <p className="text-[11px] text-muted-foreground">
              <span className="text-amber-600 font-medium">Rs 12,200</span> pending
              with active riders
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Fleet Status
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Truck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">3 / 4 Vehicles</div>
            <p className="text-[11px] text-muted-foreground">
              <span className="font-medium text-blue-600">2 In-Transit</span> · 1
              Loading · 1 Idle
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Dispatch Desk & Bottle Snapshot (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Dispatch Table */}
          <Card className="shadow-none border">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Live Trip Sheets & Fleet Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Active delivery routes and container reconciliation per vehicle.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" asChild>
                <Link href="/app/dispatch">
                  View All Trips <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40 text-[11px]">
                  <TableRow>
                    <TableHead>Rider & Vehicle</TableHead>
                    <TableHead>Route / Zone</TableHead>
                    <TableHead className="text-center">Full Out</TableHead>
                    <TableHead className="text-center">Empty In</TableHead>
                    <TableHead className="text-right">Cash Handed</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  <TableRow>
                    <TableCell className="font-medium py-3">
                      <div>Tariq Mehmood</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Suzuki Van · LEB-4819
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        Sector F-10 & F-11
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold">140</TableCell>
                    <TableCell className="text-center font-bold text-emerald-600">
                      136
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      Rs 19,500
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 border-blue-500/20 text-[10px]">
                        <Clock className="h-3 w-3 mr-1" /> In Transit
                      </Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium py-3">
                      <div>Imran Qureshi</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Loader Rickshaw · RIP-902
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        Commercial Market
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold">110</TableCell>
                    <TableCell className="text-center font-bold text-emerald-600">
                      110
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-emerald-600">
                      Rs 15,400
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 border-emerald-500/20 text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Settled
                      </Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium py-3">
                      <div>Shahid Khan</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Shehzore Truck · ICT-1120
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        Corporate Zone
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold">170</TableCell>
                    <TableCell className="text-center font-bold text-muted-foreground">
                      0
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-muted-foreground">
                      Rs 0
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 border-amber-500/20 text-[10px]">
                        Loading
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Plant Bottle & Asset Snapshot */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    Plant Asset & Container Ledger (19L Bottles)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Current warehouse floor distribution and customer market float.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[11px]" asChild>
                  <Link href="/app/asset-ledger">Full Ledger</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-muted/40 rounded-xl border">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Floor Stock (Filled)
                  </span>
                  <span className="text-lg font-bold text-foreground mt-0.5 block">
                    380
                  </span>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl border">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Yard Empty (To Wash)
                  </span>
                  <span className="text-lg font-bold text-amber-600 mt-0.5 block">
                    245
                  </span>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl border">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Customer Float
                  </span>
                  <span className="text-lg font-bold text-primary mt-0.5 block">
                    1,420
                  </span>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl border">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    Scrap / Damaged
                  </span>
                  <span className="text-lg font-bold text-destructive mt-0.5 block">
                    12
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Warehouse Floor Capacity Utilization</span>
                  <span className="font-semibold text-foreground">625 / 1,000 Capacity</span>
                </div>
                <Progress value={62.5} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Shift Cash Settlement & Discrepancies (1 Col) */}
        <div className="space-y-6">
          {/* Shift Cash Audit Card */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-600" />
                Shift Cash Audit
              </CardTitle>
              <CardDescription className="text-xs">
                Reconcile physical cash handed by riders.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Trip Cash Invoices</span>
                <span className="font-semibold font-mono">Rs 34,900</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Walk-in Counter Sales</span>
                <span className="font-semibold font-mono">Rs 8,100</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Digital (JazzCash/Bank)</span>
                <span className="font-semibold font-mono text-blue-600">
                  Rs 15,400
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 font-bold text-sm bg-muted/40 p-2.5 rounded-lg">
                <span>Total Shift Deposit</span>
                <span className="font-mono text-primary">Rs 58,400</span>
              </div>
              <Button className="w-full h-8 text-xs font-medium" variant="outline" asChild>
                <Link href="/app/treasury">
                  Close Shift & Lock Register <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Operational Alerts & Discrepancies */}
          <Card className="shadow-none border border-destructive/20 bg-destructive/[0.02]">
            <CardHeader className="pb-3 border-b border-destructive/10">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Shift Discrepancy Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-background border border-destructive/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Missing Bottle Return
                  </span>
                  <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30">
                    4 Bottles
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Tariq Mehmood delivered 6 bottles to Al-Madina Mart without receiving
                  empty return bottles.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-background border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Raw Material Low
                  </span>
                  <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30">
                    Caps & Seals
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Bottle sealing caps stock dropped below 500 units. Reorder required.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
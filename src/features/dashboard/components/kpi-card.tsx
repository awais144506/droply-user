import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: string;
}

export function KPICard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconColor = "text-primary bg-primary/10",
}: KPICardProps) {
  return (
    <Card className="border shadow-none bg-card hover:border-muted-foreground/30 transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className={cn("p-2 rounded-lg shrink-0", iconColor)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          <div className="mt-1 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                )}
              >
                {trend.value}
              </span>
            )}
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
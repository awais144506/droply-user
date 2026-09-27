import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";;
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


const DashboardHeader = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
        <div> <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operations Desk</h1>
                <p className="text-sm text-slate-500 mt-1">Real-time overview of today&apos;s activities.</p>
            </div>

            {/* Actual Interactive Date Picker */}
            <Popover>
                <PopoverTrigger>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-60 justify-start text-left font-medium bg-white border-slate-200",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-sky-600" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-lg border"
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
        </div></div>
    )
}

export default DashboardHeader
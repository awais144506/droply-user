import { Calendar, Radio, History, Info, RefreshCw } from "lucide-react";

interface TrackingHeaderProps {
    isHistoryMode: boolean;
    todayStr: string;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    setSelectedRider: (rider: any) => void;
    onRefresh: () => void;
    isFetching: boolean;
}

const TrackingHeader = ({
    isHistoryMode,
    todayStr,
    selectedDate,
    setSelectedDate,
    setSelectedRider,
    onRefresh,
    isFetching
}: TrackingHeaderProps) => {
    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-sm transition-colors duration-300 ${isHistoryMode ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
            }`}>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    {isHistoryMode ? "Historical Dispatch Tracking" : "Live Fleet Dispatch"}
                    {!isHistoryMode ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 animate-pulse">
                            <Radio className="h-3 w-3" /> Live GPS
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">
                            <History className="h-3 w-3" /> Archive Mode
                        </span>
                    )}
                </h1>

                <p className={`text-sm mt-1.5 flex items-center gap-1.5 font-medium ${isHistoryMode ? "text-amber-700" : "text-emerald-700"}`}>
                    <Info className="h-4 w-4 shrink-0" />
                    {isHistoryMode
                        ? "Viewing past route history and execution data. Select today's date to return to live tracking."
                        : "Monitoring active riders, real-time locations, and current transit cash."}
                </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {/* Manual Refresh Button */}
                <button
                    onClick={onRefresh}
                    disabled={isFetching}
                    title="Refresh Data"
                    className={`flex items-center justify-center h-11 w-11 rounded-xl border bg-white shadow-sm transition-all focus:outline-none focus:ring-2 ${isHistoryMode
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50 focus:ring-amber-500/20"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500/20"
                        } ${isFetching ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    <RefreshCw className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`} />
                </button>

                {/* Date Picker */}
                <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isHistoryMode ? "text-amber-500" : "text-emerald-500"}`} />
                    <input
                        type="date"
                        max={todayStr}
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedRider(null);
                        }}
                        className={`h-11 pl-10 pr-4 rounded-xl border bg-white text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 cursor-pointer shadow-sm transition-colors ${isHistoryMode
                                ? "border-amber-200 focus:ring-amber-500/20"
                                : "border-emerald-200 focus:ring-emerald-500/20"
                            }`}
                    />
                </div>
            </div>
        </div>
    );
};

export default TrackingHeader;
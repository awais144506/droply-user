import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";


interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage:number;
    onPageChange: (page: number) => void;
}

export default function TablePagination({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    itemsPerPage
}: TablePaginationProps) {
    if (totalPages <= 1) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs font-medium text-slate-500">
                Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{endIndex}</span> items of <span className="font-bold text-slate-900">{totalItems}</span> Total
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 rounded-lg text-xs"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>

                <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onPageChange(i + 1)}
                            className={`h-7 w-7 rounded-md text-xs font-bold transition-colors ${currentPage === i + 1
                                ? "bg-sky-600 text-white"
                                : "text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 rounded-lg text-xs"
                >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
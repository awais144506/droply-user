import { ReactNode } from "react";
import { SearchX } from "lucide-react"; // Using SearchX for "No results found" - looks better than just X

// Shadcn Imports
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    className?: string; // e.g. "text-right" for numbers
    render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
    data?: T[];
    columns: ColumnDef<T>[];
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    className?: string; // Allows you to wrap the table in a custom card class if needed
}

export default function DataTable<T>({
    data,
    columns,
    emptyMessage = "No records found.",
    onRowClick,
    className
}: DataTableProps<T>) {
    return (
        <div className={cn("rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm", className)}>
            <Table>
                
                {/* 1. Header */}
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent">
                        {columns.map((col, index) => (
                            <TableHead 
                                key={index} 
                                className={cn("h-11 text-[11px] font-bold uppercase tracking-wider text-slate-500 p-4", col.className)}
                            >
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                {/* 2. Body */}
                <TableBody>
                    {(data?.length || 0) > 0 ? (
                        data?.map((item, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className={cn("transition-colors", onRowClick && "cursor-pointer hover:bg-slate-50")}
                                onClick={() => {
                                    if (onRowClick) onRowClick(item);
                                }}
                            >
                                {columns.map((col, colIndex) => (
                                    <TableCell 
                                        key={colIndex} 
                                        className={cn("py-3 text-sm text-slate-700 p-4", col.className)}
                                    >
                                        {col.render
                                            ? col.render(item)
                                            : col.accessorKey 
                                                ? String(item[col.accessorKey]) 
                                                : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        
                        /* 3. Empty State */
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={columns.length} className="h-64 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-500">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                        <SearchX className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium">{emptyMessage}</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                        Try adjusting your filters or search query to find what you&apos;re looking for.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                        
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
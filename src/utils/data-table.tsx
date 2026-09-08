import { ReactNode } from "react";
import { X } from "lucide-react";

// T represents the data type (e.g., ProductItem, UserItem, CustomerDetails)
export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T; // Used if you just want to print text directly
    className?: string;    // Useful for alignment (e.g., "text-right")
    render?: (item: T) => ReactNode; // Used for custom UI (badges, buttons, formatting)
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
}

export default function DataTable<T>({ 
    data, 
    columns, 
    emptyMessage = "No items found.",
    onRowClick 
}: DataTableProps<T>) {
    return (
        <div className="overflow-x-auto min-h-100"> {/* Fixed min-h-100 typo to Tailwind valid min-h-[400px] */}
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-white text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={`px-4 py-4 whitespace-nowrap ${col.className || ""}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length > 0 ? (
                        data.map((item, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                className={`hover:bg-slate-50/50 transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => {
                                    if (onRowClick) onRowClick(item);
                                }}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`px-4 py-4 ${col.className || ""}`}>
                                        {col.render
                                            ? col.render(item)
                                            : col.accessorKey ? String(item[col.accessorKey]) : null
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-16 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <X className="h-8 w-8 text-slate-300 mb-2" />
                                    <p className="text-sm font-medium text-slate-500">{emptyMessage}</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
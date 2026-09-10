import Image from "next/image";
import { Building2 } from "lucide-react";

interface InvoicePreviewProps {
    data: {
        displayName?: string;
        displayPhone?: string;
        displayEmail?: string;
        displayAddress?: string;
    };
    logoUrl?: string | null;
}

export function InvoicePreview({ data, logoUrl }: InvoicePreviewProps) {
    // Format today's date dynamically
    const today = new Date().toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="sticky top-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Live Invoice Preview</h3>

            <div className="bg-white rounded-sm border border-slate-200 shadow-2xl w-full p-8 flex flex-col relative overflow-hidden mx-auto">
                <div className="absolute top-0 left-0 w-full h-3 bg-sky-600" />
                <div className="flex flex-col items-center text-center mb-4">

                    <div className="h-16 w-16 mb-4 shrink-0 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {typeof logoUrl === 'string' && (logoUrl.startsWith('http') || logoUrl.startsWith('blob')) ? (
                            <Image src={logoUrl} alt="Logo" width={64} height={64} className="object-contain" />
                        ) : (
                            <Building2 className="h-6 w-6 text-slate-300" />
                        )}
                    </div>

                    {/* Branch Details Section */}
                    <div className="w-full">
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-wider wrap-break-word">
                            {data.displayName || "Your Branch Name"}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-2 max-w-55 mx-auto leading-relaxed">
                            {data.displayAddress || "123 Main Street, City"}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
                            <span>{data.displayPhone || "03001234567"}</span>
                            <span className="text-slate-300">•</span>
                            <span>{data.displayEmail || "billing@branch.com"}</span>
                        </div>
                    </div>
                </div>

                {/* Invoice Meta */}
                <div className="flex justify-between items-end border-b border-slate-200 pb-4 mb-6">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Billed To</p>
                        <p className="text-xs font-bold text-slate-800 mt-1">Ali Hassan</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Gulberg III, Lahore</p>
                    </div>
                    <div className="text-right">
                        <h5 className="text-base font-black text-sky-600 uppercase tracking-widest">INVOICE</h5>
                        <p className="text-[10px] font-bold text-slate-500 mt-1">INV-2026-001</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{today}</p>
                    </div>
                </div>

                {/* Dummy Table */}
                <div className="flex-1">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200">
                            <tr>
                                <th className="py-2.5 text-[10px] font-bold text-slate-800 uppercase">Description</th>
                                <th className="py-2.5 text-[10px] font-bold text-slate-800 uppercase text-center w-12">Qty</th>
                                <th className="py-2.5 text-[10px] font-bold text-slate-800 uppercase text-right w-20">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="py-3 text-[11px] text-slate-700 font-medium">Standard Delivery Service</td>
                                <td className="py-3 text-[11px] text-slate-600 text-center">1</td>
                                <td className="py-3 text-[11px] text-slate-900 font-bold text-right">Rs 450</td>
                            </tr>
                            <tr>
                                <td className="py-3 text-[11px] text-slate-700 font-medium">Cash on Delivery Handling Fee</td>
                                <td className="py-3 text-[11px] text-slate-600 text-center">1</td>
                                <td className="py-3 text-[11px] text-slate-900 font-bold text-right">Rs 50</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="border-t border-slate-200 pt-4 flex justify-end mt-auto">
                    <div className="w-2/3 max-w-50 space-y-2">
                        <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-bold text-slate-800">Rs 500</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500">Tax (0%)</span>
                            <span className="font-bold text-slate-800">Rs 0</span>
                        </div>
                        <div className="flex justify-between text-xs font-black border-t border-slate-200 pt-2 mt-2 text-sky-700">
                            <span>Total Due</span>
                            <span>Rs 500</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-center opacity-60">
                    <span className="text-[7px] font-bold text-slate-800 uppercase tracking-widest mb-1.5">
                        Generated via Droply
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Image src="/logo.png" alt="Droply" width={20} height={16} className="object-contain" />
                    </div>
                </div>

            </div>
        </div>
    );
}
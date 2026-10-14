/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
    FileText, 
    Plus, 
    ArrowRightLeft, 
    Download, 
    Trash2, 
    Edit3, 
    Search, 
    CheckCircle2, 
    Clock, 
    Building, 
    DollarSign 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// --- MOCK DATA FOR QUOTATIONS & INVOICES ---
const MOCK_DOCUMENTS = [
    {
        id: "doc_01",
        documentNumber: "58",
        type: "INVOICE",
        status: "UNPAID",
        issueDate: "2025-12-29",
        partyName: "Beacon Energy (Pvt) Limited",
        partyNtn: "6528870-0",
        partyStrn: "3277876181126",
        subTotal: 575000,
        gstAmount: 103500,
        totalAmount: 678500,
        receivedAmount: 0,
        balanceDue: 678500,
        itemsCount: 1,
    },
    {
        id: "doc_02",
        documentNumber: "QUO-2026-012",
        type: "QUOTATION",
        status: "SENT",
        issueDate: "2026-10-10",
        validUntil: "2026-10-25",
        partyName: "Solartech Engineering Lahore",
        partyNtn: "3412567-9",
        partyStrn: "5512348912311",
        subTotal: 320000,
        gstAmount: 57600,
        totalAmount: 377600,
        receivedAmount: 0,
        balanceDue: 377600,
        itemsCount: 3,
    },
    {
        id: "doc_03",
        documentNumber: "57",
        type: "INVOICE",
        status: "PAID",
        issueDate: "2025-12-15",
        partyName: "Al-Hamra Corporation",
        partyNtn: "9988776-1",
        partyStrn: "1122334455667",
        subTotal: 150000,
        gstAmount: 27000,
        totalAmount: 177000,
        receivedAmount: 177000,
        balanceDue: 0,
        itemsCount: 2,
    },
];

export default function InvoicesPage() {
    const [activeTab, setActiveTab] = useState<"ALL" | "QUOTATION" | "INVOICE">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter documents
    const filteredDocs = MOCK_DOCUMENTS.filter((doc) => {
        const matchesTab = activeTab === "ALL" || doc.type === activeTab;
        const matchesSearch = 
            doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.partyName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleConvertToInvoice = (docNumber: string) => {
        toast.success(`Quotation #${docNumber} successfully converted to Tax Invoice!`);
    };

    const handleDeleteDoc = (docNumber: string) => {
        toast.error(`Document #${docNumber} deleted.`);
    };

    const handleDownloadPdf = (docNumber: string) => {
        toast.info(`Generating PDF for document #${docNumber}...`);
    };

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
            
            {/* Header & Create Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Invoices & Quotations</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage B2B quotations, convert them to invoices[cite: 4], and download official PDF statements[cite: 5].</p>
                </div>
                <Button 
                    onClick={() => toast.info("Open Create Quotation / Invoice Modal")}
                    className="h-11 px-5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Create New Document
                </Button>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Invoices</p>
                            <p className="text-2xl font-black text-slate-900 mt-1">
                                Rs. {MOCK_DOCUMENTS.filter(d => d.type === "INVOICE").reduce((acc, d) => acc + d.totalAmount, 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Quotations</p>
                            <p className="text-2xl font-black text-amber-600 mt-1">
                                {MOCK_DOCUMENTS.filter(d => d.type === "QUOTATION").length} <span className="text-xs font-normal text-slate-500">active</span>
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Balance Due</p>
                            <p className="text-2xl font-black text-rose-600 mt-1">
                                Rs. {MOCK_DOCUMENTS.reduce((acc, d) => acc + d.balanceDue, 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Filters & Search */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {[
                            { label: "All Documents", value: "ALL" },
                            { label: "Invoices", value: "INVOICE" },
                            { label: "Quotations", value: "QUOTATION" },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === tab.value 
                                        ? "bg-slate-900 text-white shadow-sm" 
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <Input 
                            placeholder="Search invoice no. or company..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-slate-50 border-slate-200 text-xs rounded-xl"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                <th className="py-3.5 px-6">Doc #</th>
                                <th className="py-3.5 px-6">Type</th>
                                <th className="py-3.5 px-6">Bill To (Client / Company)</th>
                                <th className="py-3.5 px-6">Date</th>
                                <th className="py-3.5 px-6 text-right">Total Amount</th>
                                <th className="py-3.5 px-6 text-right">Balance Due</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                            {filteredDocs.length > 0 ? (
                                filteredDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-6 font-mono font-bold text-slate-900">#{doc.documentNumber}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                doc.type === "INVOICE" 
                                                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}>
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            <div className="flex items-center gap-1.5">
                                                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {doc.partyName}
                                            </div>
                                            <span className="block text-[10px] font-normal text-slate-400 mt-0.5">NTN: {doc.partyNtn || "N/A"}</span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500">{doc.issueDate}</td>
                                        <td className="py-4 px-6 text-right font-black text-slate-900">Rs. {doc.totalAmount.toLocaleString()}</td>
                                        <td className={`py-4 px-6 text-right font-black ${doc.balanceDue > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                            Rs. {doc.balanceDue.toLocaleString()}
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {doc.type === "QUOTATION" && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        title="Convert to Invoice"
                                                        onClick={() => handleConvertToInvoice(doc.documentNumber)}
                                                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                    >
                                                        <ArrowRightLeft className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Download PDF"
                                                    onClick={() => handleDownloadPdf(doc.documentNumber)}
                                                    className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Edit"
                                                    onClick={() => toast.info(`Editing document #${doc.documentNumber}`)}
                                                    className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Delete"
                                                    onClick={() => handleDeleteDoc(doc.documentNumber)}
                                                    className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                                        No invoices or quotations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
}
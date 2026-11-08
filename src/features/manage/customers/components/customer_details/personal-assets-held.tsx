/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    User, MapPin, Phone, Mail,
    Package, Tag, Briefcase, Building2, FileText, Calendar
} from "lucide-react";
import { CustomerDetails } from "../../types/customer";
import { formatPhoneNumber } from "react-phone-number-input";

type Props = {
    customer: CustomerDetails;
}

const PersonalInformationAssets = ({ customer }: Props) => {
    // Format delivery schedule display text
    const getScheduleDisplay = () => {
        if (customer.deliveryScheduleType === "EVERYDAY") return "Everyday";
        if (customer.deliveryScheduleType === "ON_DEMAND") return "On-Demand";
        if (customer.deliveryScheduleType === "CUSTOM_DAYS" && customer.deliveryDays?.length > 0) {
            const formattedDays = customer.deliveryDays
                .map((day: string) => day.charAt(0) + day.slice(1).toLowerCase())
                .join(", ");
            return `Custom Days (${formattedDays})`;
        }
        return customer.deliveryScheduleType || "Not Set";
    };

    return (
        <div>   {/* Profile Information Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-sky-600" />
                        Profile Information
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        customer.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                        {customer.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Phone</label>
                        <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <Phone className="h-4 w-4 text-slate-400" />
                            {formatPhoneNumber(customer.phone)}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Email</label>
                        <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <Mail className="h-4 w-4 text-slate-400" />
                            {customer.email || <span className="text-slate-400 italic">Not provided</span>}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Party Type</label>
                        <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <Briefcase className="h-4 w-4 text-slate-400" />
                            <span className="capitalize">{customer.partyType?.toLowerCase()}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Category</label>
                        <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <Tag className="h-4 w-4 text-slate-400" />
                            <span className="capitalize">{customer.category?.toLowerCase()}</span>
                        </div>
                    </div>

                    {/* Conditional NTN Number */}
                    {customer.ntn && (
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">NTN Number</label>
                            <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                                <FileText className="h-4 w-4 text-slate-400" />
                                <span>{customer.ntn}</span>
                            </div>
                        </div>
                    )}

                    {/* Conditional STRN Number */}
                    {customer.strn && (
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">STRN Number</label>
                            <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span>{customer.strn}</span>
                            </div>
                        </div>
                    )}

                    {/* Delivery Schedule Preference */}
                    <div className="md:col-span-2 pt-3 border-t border-slate-100">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Delivery Schedule Preference</label>
                        <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <Calendar className="h-4 w-4 text-sky-500" />
                            <span>{getScheduleDisplay()}</span>
                        </div>
                    </div>

                    <div className="md:col-span-1 pt-3 border-t border-slate-100">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Assigned Zone</label>
                        <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            {customer.zone?.name || <span className="text-rose-500 italic">Unassigned</span>}
                        </div>
                    </div>

                    <div className="md:col-span-1 pt-3 border-t border-slate-100">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Address</label>
                        <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="truncate">{customer.address || <span className="text-rose-500 italic">Unassigned</span>}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Returnable Assets Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mt-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Package className="h-5 w-5 text-indigo-600" />
                        Returnable Items Held
                    </h3>
                </div>

                {customer.returnables && customer.returnables.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden ">
                        <table className="w-full text-sm text-center">
                            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3">Product Name</th>
                                    <th className="px-4 py-3">Opening Balance</th>
                                    <th className="px-4 py-3">Current Items Held</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {customer.returnables.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {item.productName}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{item.openingBalance}</td>
                                        <td className="px-4 py-3 font-bold text-amber-600">{item.currentBalance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center">
                        <Package className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-600">No assets currently held</p>
                        <p className="text-xs text-slate-400 mt-1">This customer has returned all company assets.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonalInformationAssets;
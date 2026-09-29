"use client";
import { Banknote, Receipt, TrendingDown, BadgeDollarSign, Truck, ShoppingCart, CreditCard } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { useCustomers } from "@/features/manage/customers/api/use-customer";
import { OrderFormValues } from "../../schema/create-order-schema";
import { useOrderCalculations } from "@/features/sales/orders/utils/useOrderCalculations";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";



const CheckoutSale = ({ branchId }: { branchId: string, isDelivery: "WALK_IN" | "DELIVERY" }) => {
    const { control, formState: { isValid, isSubmitting, isDirty } } = useFormContext<OrderFormValues>();
    const { data: customerData } = useCustomers(branchId);
    const customerOptions = customerData?.customerOptions || [];

    const customerId = useWatch({ control, name: "customerId" });

    const customer = customerOptions.find(c => c.value === customerId);
    const previousBalance = Number(customer?.customerCredit || 0);

    const {
        grossTotal,
        totalSecurityDeposit,
        totalDue,
        remainingBalance,
        discountBreakdown,
        scale,
    } = useOrderCalculations(branchId, previousBalance);

    return (
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col h-fit sticky top-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
                <Banknote className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Checkout</h3>
            </div>

            <div className="space-y-4 flex-1">
                {/* Gross Total */}
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Products Total</span>
                    <span className="font-semibold text-white">
                        Rs {grossTotal.toLocaleString()}
                    </span>
                </div>

                {/* Applied FOC Offers */}
                {discountBreakdown.length > 0 && (
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                            <Receipt className="h-3 w-3" /> Free Goods
                        </div>
                        {discountBreakdown.map((disc, idx) => (
                            <div key={idx} className="flex justify-between items-start text-xs">
                                <span className="text-slate-300 pr-2">{disc.name}</span>
                                <span className="text-emerald-400 font-bold">{disc.offerQty} ({scale?.toLowerCase()}) Free</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Security Deposit Tally */}
                {totalSecurityDeposit > 0 && (
                    <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-3">
                        <span>Security Deposits</span>
                        <span className="font-semibold text-amber-400">
                            + Rs {totalSecurityDeposit.toLocaleString()}
                        </span>
                    </div>
                )}

                {/* Global Discount */}
                <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-3">
                    <FormInput
                        label="Discount Bill"
                        type="number"
                        name="discount"
                        min={0}
                        prefix="Rs"
                        lableTextColor="text-slate-400"
                        labelIcon={BadgeDollarSign}
                        iconColor="text-emerald-400"
                    />
                </div>
                <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-3">
                    <FormInput
                        label="Delivery Charges"
                        type="number"
                        name="deliveryCharges"
                        min={0}
                        prefix="Rs"
                        lableTextColor="text-slate-400"
                        labelIcon={Truck}
                        iconColor="text-emerald-400"
                    />
                </div>

                {/* Previous Khata Balance */}
                <div className="flex justify-between items-center text-sm text-slate-400 border-t border-slate-800 pt-3">
                    <span>Previous Balance</span>
                    <span className={`font-semibold ${previousBalance > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        Rs {previousBalance.toLocaleString()}
                    </span>
                </div>

                <div className="pt-4 border-t border-slate-700">
                    {/* Total Due */}
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Due</span>
                        <span className="text-3xl font-extrabold text-white">
                            Rs {totalDue.toLocaleString()}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Payment Method */}
                        <div>
                            <FormSelect
                                label="Payment Method"
                                name="paymentMethod"
                                options={[
                                    { label: "Cash", value: "CASH" },
                                    { label: "Bank/Online", value: "BANK" },
                                ]}
                                placeholder="Select method..."
                                lableTextColor="text-slate-400"
                                labelIcon={CreditCard}
                                iconColor="text-emerald-400"
                            />
                        </div>

                        {/* Amount Received */}
                        <div className="relative">
                            <FormInput
                                name="amountPaid"
                                label="Amount Received Now"
                                lableTextColor="text-slate-400"
                                prefix="Rs"
                                required
                                labelIcon={BadgeDollarSign}
                                iconColor="text-emerald-400"
                            />
                        </div>

                        {/* Live Remaining Balance */}
                        <div className="flex items-center justify-between bg-slate-950 rounded-lg p-3 border border-slate-800">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
                                <TrendingDown className="h-3.5 w-3.5" />Outstanding
                            </div>
                            <span className={`text-sm font-black ${remainingBalance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                Rs {remainingBalance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <FormCTAFooter
                isPending={isSubmitting}
                isValid={isValid}
                isDirty={isDirty}
                isEditMode={false}
                ctaText="Dispatch Order"
                icon={ShoppingCart}
                isCancel={true}
                href="/sales/orders"
                varient="success"
                cancelVarient="secondary"
            />
        </div>
    );
};

export default CheckoutSale;
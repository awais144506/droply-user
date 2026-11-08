/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Package, Plus, Minus, AlertCircle, CalendarClock, Loader2, StickyNote } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

import { useSubmitOrderRequest } from "../api/use-customerOrder";
import { customerOrderSchema, CustomerOrderFormValues } from "../schema/order.schema";
import { RequestedItems } from "../types/customerOrder";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";

interface NewOrderTabProps {
    token: string;
    products: RequestedItems[];
    onSuccess: () => void;
}

export function NewOrderTab({ token, products, onSuccess }: NewOrderTabProps) {
    const [cart, setCart] = useState<Record<string, number>>({});
    const submitRequest = useSubmitOrderRequest(token);

    const methods = useForm<CustomerOrderFormValues>({
        resolver: yupResolver(customerOrderSchema),
        defaultValues: {
            scheduleDate: new Date().toISOString(),
            notes: "",
            items: []
        }
    });

    useEffect(() => {
        const payload = Object.entries(cart)
            .filter(([_, qty]) => qty > 0)
            .map(([productId, quantity]) => ({ productId, quantity }));

        methods.setValue("items", payload, { shouldValidate: !!payload.length });
    }, [cart, methods]);

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => ({ ...prev, [productId]: Math.max(0, (prev[productId] || 0) + delta) }));
    };

    const onSubmit = (data: CustomerOrderFormValues) => {
        submitRequest.mutate(data, {
            onSuccess: () => {
                methods.reset();
                setCart({});
                onSuccess();
            }
        });
    };

    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    const today = new Date();
    const tomorrow = addDays(today, 1);
    const afterTomorrow = addDays(today, 2);

    const dateOptions = [
        { label: `Today: ${format(today, 'MMM dd')}`, value: today.toISOString() },
        { label: `Tomorrow: ${format(tomorrow, 'MMM dd')}`, value: tomorrow.toISOString() },
        { label: `${format(afterTomorrow, 'MMM dd')}`, value: afterTomorrow.toISOString() },
    ];

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-amber-800 leading-snug">
                        Note: Final product prices may vary slightly according to your assigned delivery zone.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">Available Products</h3>
                    {products.map((product) => (
                        <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 bg-sky-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Package className="h-6 w-6 text-sky-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 leading-tight">{product.name}</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-1">Default Price: Rs. {product.priceTiers[0]?.salePrice || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 rounded-full border border-slate-200 p-1 ml-2">
                                <button type="button" onClick={() => updateQuantity(product.id, -1)} className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 active:scale-95 transition-all text-slate-500 hover:text-slate-900">
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-5 text-center font-bold text-slate-700 text-sm">
                                    {cart[product.id] || 0}
                                </span>
                                <button type="button" onClick={() => updateQuantity(product.id, 1)} className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center shadow-sm active:scale-95 transition-all text-white">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {methods.formState.errors.items && (
                        <p className="text-rose-500 text-xs font-bold px-1">{methods.formState.errors.items.message}</p>
                    )}
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <FormSelect
                        name="scheduleDate"
                        label="Request Date"
                        labelIcon={CalendarClock}
                        options={dateOptions}
                        isSearchable={false}
                        placeholder="Select Delivery Date"
                    />

                    <div className="pt-2 border-t border-slate-100">
                        <FormInput
                            name="notes"
                            label="Delivery Notes (Optional)"
                            labelIcon={StickyNote}
                            placeholder="e.g. ring bell, leave at door..."
                            className="bg-transparent border-0 border-b border-slate-200 rounded-none shadow-none px-0 focus:ring-0 focus:border-sky-600"
                        />
                    </div>
                </div>

                {totalItems > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-md border-t border-slate-200 pb-safe z-50">
                        <div className="max-w-md mx-auto">
                            <button
                                type="submit"
                                disabled={submitRequest.isPending}
                                className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-sky-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {submitRequest.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : `Send Request (${totalItems} items)`}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}
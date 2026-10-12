import { CreditCard, ShieldCheck, UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentChannels } from "./payment-channels"; // Adjust path if needed

type Props = {
    amountDue: number;
    requirePayment: boolean;
    buttonText: string;
    buttonClass: string;
    isButtonDisabled: boolean;
};

export default function CheckoutArea({ amountDue, requirePayment, buttonText, buttonClass, isButtonDisabled }: Props) {
    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden flex flex-col bg-slate-50">
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    2. Checkout & Verification
                </h3>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount Due</p>
                    <p className={`text-xl font-black ${requirePayment ? 'text-emerald-600' : 'text-slate-400'}`}>
                        Rs. {requirePayment ? amountDue.toLocaleString() : '0'}
                    </p>
                </div>
            </div>

            <CardContent className={`p-6 transition-opacity duration-300 ${requirePayment ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="mb-6">
                    <PaymentChannels />
                </div>

                <div className="space-y-4 mt-auto border-t border-slate-200 pt-6">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 uppercase">Transaction Reference / TID</Label>
                        <Input 
                            disabled={!requirePayment}
                            placeholder="e.g. 0123456789" 
                            className="h-11 bg-white font-mono text-sm rounded-xl border-slate-200 focus:border-indigo-500"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 uppercase">Upload Payment Screenshot</Label>
                        <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl transition-colors ${requirePayment ? 'bg-white hover:bg-indigo-50 cursor-pointer' : 'bg-transparent cursor-not-allowed'}`}>
                            <div className="flex flex-col items-center justify-center text-slate-500">
                                <UploadCloud className="w-6 h-6 mb-1" />
                                <p className="text-xs font-semibold">Click to upload receipt image</p>
                            </div>
                            <Input disabled={!requirePayment} type="file" className="hidden" accept="image/*" />
                        </label>
                    </div>
                </div>
            </CardContent>

            <div className="p-6 bg-white border-t border-slate-200">
                <Button 
                    disabled={isButtonDisabled}
                    className={`w-full h-14 font-bold rounded-xl shadow-sm text-base transition-all duration-300 ${buttonClass}`}
                >
                    {!isButtonDisabled && requirePayment && <ShieldCheck className="w-5 h-5 mr-2" />}
                    {buttonText}
                </Button>
            </div>
        </Card>
    );
}
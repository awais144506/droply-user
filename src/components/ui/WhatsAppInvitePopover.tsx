"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Send, Copy, Check } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormPhoneInput } from "@/components/ui/form-phone-input"; // 👈 Adjust import path to your FormPhoneInput
import { toast } from "sonner"

interface WhatsAppFormValues {
    phone: string;
}

export function WhatsAppInvitePopover({
    branchName = "Our Branch",
}: {
    branchName?: string;
}) {
    const [lang, setLang] = useState<"both" | "en" | "ur">("both");
    const [copied, setCopied] = useState(false);

    const methods = useForm<WhatsAppFormValues>({
        defaultValues: {
            phone: "",
        },
    });

    const templates = {
        en: `Dear Customer,\nAssalam-o-Alaikum! We have upgraded our delivery system at *${branchName}* for faster and more accurate doorstep service.\n\nPlease reply with your details to update your delivery record:\n1. *Full Name:*\n2. *Phone Number:*\n3. *Complete Address:*\n4. *Pin Location (Google Maps):*\n\n⚠️ *Important:* In WhatsApp Location, tap *"Send your current location"* (Pin Location). Please do *NOT* send Live Location.\n\nThank you!\n*${branchName}*`,

        ur: `محترم کسٹمر،\nالسلام علیکم! ہم نے *${branchName}* پر اپنے ڈیلیوری سسٹم کو جدید بنا دیا ہے تاکہ آپ کو بروقت اور بہترین سروس فراہم کی جا سکے۔\n\nاپنا ریکارڈ اپڈیٹ کروانے کے لیے براہِ کرم اس میسج کے جواب میں درج ذیل معلومات بھیجیں:\n1. *پورا نام:*\n2. *فون نمبر:*\n3. *مکمل پتہ:*\n4. *پن لوکیشن (Pin Location):*\n\n⚠️ *ضروری ہدایت:* واٹس ایپ میں لوکیشن بھیجتے وقت *"Send your current location"* (پن لوکیشن) پر کلک کریں۔ براہِ کرم *"Live Location"* مت بھیجیں۔\n\nشکریہ!\n*${branchName}*`,

        both: `Assalam-o-Alaikum Dear Customer!\nWe have upgraded our delivery system at *${branchName}* for faster and more accurate doorstep service.\n\nہم نے اپنی ڈیلیوری سروس کو مزید بہتر بنانے کے لیے نیا ڈیجیٹل سسٹم متعارف کروایا ہے۔ براہِ کرم اپنا ریکارڈ اپڈیٹ کرنے کے لیے درج ذیل معلومات بھیجیں:\n\n1. *Full Name (پورا نام):*\n2. *Phone Number (فون نمبر):*\n3. *Complete Address (مکمل پتہ):*\n4. *Pin Location (پن لوکیشن):*\n\n⚠️ *Note / نوٹ:* Please send *Pin Location ("Send your current location")* only — do *NOT* send Live Location (لائیو لوکیشن کے بجائے صرف پن لوکیشن بھیجیں).\n\nThank you! — *${branchName}*`,
    };

    const onSubmit = (data: WhatsAppFormValues) => {
        const cleanPhone = (data.phone || "").replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length < 10) {
            methods.setError("phone", {
                type: "manual",
                message: "Please enter a valid phone number",
            });
            return;
        }

        const encodedMessage = encodeURIComponent(templates[lang]);
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    const handleCopyOnly = () => {
        navigator.clipboard.writeText(templates[lang]);
        setCopied(true);
        toast.success("Message template copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Popover>
            <PopoverTrigger
                className="h-10 px-3.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95"
                title="Send Customer Details Request via WhatsApp"
            >
                <FaWhatsapp className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>WhatsApp Request</span>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-80 sm:w-96 p-4 rounded-2xl border-slate-200 shadow-xl bg-white space-y-3.5"
            >
                {/* Header & Language Switcher */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                            Request Customer Info
                        </h4>
                        <p className="text-[10px] text-slate-500">
                            Ask customer for Name, Address & Pin Location
                        </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                        {(["both", "en", "ur"] as const).map((l) => (
                            <button
                                key={l}
                                type="button"
                                onClick={() => setLang(l)}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase cursor-pointer transition-colors ${lang === l
                                        ? "bg-white text-emerald-700 shadow-2xs"
                                        : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {l === "both" ? "Both" : l === "en" ? "ENG" : "اردو"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Phone Number Form using your FormPhoneInput */}
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-3">
                        <FormPhoneInput
                            name="phone"
                            label="Customer WhatsApp Number"
                            placeholder="300 1234567"
                            required
                        />

                        {/* Message Preview Box */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Message Preview
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyOnly}
                                    className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-3 w-3 text-emerald-600" /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3" /> Copy Text Only
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre
                                dir={lang === "ur" ? "rtl" : "ltr"}
                                className="text-[10.5px] leading-relaxed whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-2.5 max-h-40 overflow-y-auto font-sans text-slate-700"
                            >
                                {templates[lang]}
                            </pre>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                        >
                            <Send className="h-3.5 w-3.5" />
                            Send Message on WhatsApp
                        </Button>
                    </form>
                </FormProvider>
            </PopoverContent>
        </Popover>
    );
}
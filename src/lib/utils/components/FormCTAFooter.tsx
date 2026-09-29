import Link from "next/link";
import { Loader2, LucideIcon, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    isPending: boolean;
    isValid: boolean;
    isDirty: boolean;
    isEditMode?: boolean;
    href?: string;
    setStep?: (role: string) => void;
    ctaText?: string;
    icon?: LucideIcon;
    isCancel?: boolean;
    varient?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "success";
    cancelVarient?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "success";
};

export default function FormCTAFooter({
    isPending,
    isValid,
    isDirty,
    isEditMode = false,
    href = "",
    setStep,
    ctaText = "Save Changes",
    icon: ActionIcon,
    isCancel = true,
    varient = "default",
    cancelVarient = "outline",
}: Props) {
    return (
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6 mt-8">
            <div>
                {setStep && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("SELECT_ROLE")}
                    >
                        Change Role
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-3">
                {isCancel && (
                    <Link
                        href={href}
                        className={cn(buttonVariants({ variant: cancelVarient  }))}
                    >
                        Cancel
                    </Link>
                )}

                <Button
                    type="submit"
                    variant={varient}
                    disabled={isPending || (!isDirty && isEditMode) || !isValid}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                            {isEditMode ? "Saving Changes..." : "Creating Record..."}
                        </>
                    ) : (
                        <>
                            {isEditMode ? (
                                <Save className="mr-2 h-4 w-4 shrink-0" />
                            ) : (
                                ActionIcon && <ActionIcon className="mr-2 h-4 w-4 shrink-0" />
                            )}
                            {isEditMode ? "Save Changes" : ctaText}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
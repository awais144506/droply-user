import Link from "next/link";
import { Loader2 } from "lucide-react";

// Shadcn Imports
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    isPending: boolean;
    isValid: boolean;
    isDirty: boolean;
    isEditMode?: boolean;
    href: string;
    setStep?: (role: string) => void;
}

export default function FormCTAFooter({
    isPending,
    isValid,
    isDirty,
    isEditMode = false,
    href,
    setStep
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
                <Link
                    href={href}
                    className={cn(buttonVariants({ variant: "outline" }))}
                >
                    Cancel
                </Link>

                <Button
                    type="submit"
                    variant="default"
                    disabled={isPending || (!isDirty && isEditMode) || !isValid}
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
                    {isEditMode ? "Save Changes" : "Create Record"}
                </Button>
            </div>
        </div>
    );
}
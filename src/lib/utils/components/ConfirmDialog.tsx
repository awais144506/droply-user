import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    confirmButtonClass?: string;
    confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export default function ConfirmActionDialog({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    title,
    description,
    confirmText = "Confirm",
    confirmButtonClass = "bg-sky-600 hover:bg-sky-700 text-white",
    confirmButtonVariant = "default",
}: ConfirmActionDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="sm:max-w-md rounded-2xl p-6">
                <AlertDialogHeader className="space-y-2">
                    <AlertDialogTitle className="text-lg font-bold text-slate-900">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="text-sm text-slate-600 leading-relaxed">
                            {description}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex gap-2">
                    <AlertDialogCancel 
                        disabled={isLoading}
                        className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        variant={confirmButtonVariant}
                        className={`rounded-xl shadow-sm ${confirmButtonClass}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
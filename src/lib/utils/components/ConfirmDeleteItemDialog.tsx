import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
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
    confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; // Added variant prop
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
    confirmButtonVariant = "default" // Defaults to default, can be overridden per action
}: ConfirmActionDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="text-sm text-slate-500 mt-1">{description}</div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <Button 
                        onClick={onConfirm} 
                        disabled={isLoading}
                        variant={confirmButtonVariant}
                        className={confirmButtonClass}
                    >
                        {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</> : confirmText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
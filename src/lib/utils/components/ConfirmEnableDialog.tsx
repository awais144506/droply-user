import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
    itemName?: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isEnabling: boolean;
    btnText?: string;
}

export default function ConfirmEnableDialog({
    itemName = "this item",
    isOpen,
    onClose,
    onConfirm,
    isEnabling,
    btnText = "Enable"
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will enable <span className="font-bold text-slate-900">{itemName}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isEnabling}>Cancel</AlertDialogCancel>
                    <Button variant="success" onClick={onConfirm} disabled={isEnabling}>
                        {isEnabling ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Enabling...</> : btnText}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
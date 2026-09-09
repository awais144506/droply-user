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
    isDeleting: boolean;
}

export default function ConfirmDeleteDialog({ 
    itemName = "this item", 
    isOpen, 
    onClose, 
    onConfirm, 
    isDeleting 
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete/disable <span className="font-bold text-slate-900">{itemName}</span> from your database. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting...</> : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
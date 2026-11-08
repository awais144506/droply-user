import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subApi, SubmitPaymentApiPayload } from "./subscription.service";
import { toast } from "sonner";
import { subscriptionKeys } from "./subscription-keys";
import { useRouter } from "next/navigation";

export const useSubmitPayment = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SubmitPaymentApiPayload) => subApi.submitSubscriptionPayment(payload),
        onSuccess: () => {
            toast.success("Payment submitted successfully!", {
                description: "Your receipt is pending admin verification.",
            });
            router.back();
            queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

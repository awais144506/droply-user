import PageStatsCard from "@/lib/utils/components/StatsMainPageCards"
import { CreditCard, Package, Wallet, ShieldCheck } from "lucide-react"
type Props = {
    customerCredit?: number;
    totalReturnables?: number;
    customerAdvance?: number;
    securityDeposit?: number;
}
const CustomerDetailsStats = ({
    customerCredit,
    totalReturnables,
    customerAdvance,
    securityDeposit,
}: Props) => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <PageStatsCard
                    title="Current Khata (Payable)"
                    value={customerCredit}
                    prefix="Rs."
                    icon={CreditCard}
                    iconContainerClass="bg-amber-50 text-amber-600"
                    valueColorClass="text-amber-600"
                />
                <PageStatsCard
                    title="Total Items Held"
                    value={totalReturnables}
                    postfix="items"
                    icon={Package}
                    iconContainerClass="bg-indigo-50 text-indigo-600"
                    valueColorClass="text-indigo-600"
                />
                <PageStatsCard
                    title="Advance Balance"
                    value={customerAdvance}
                    prefix="Rs."
                    icon={Wallet}
                    iconContainerClass="bg-emerald-50 text-emerald-600"
                    valueColorClass="text-emerald-600"
                />
                <PageStatsCard
                    title="Security Deposit"
                    value={securityDeposit}
                    prefix="Rs."
                    icon={ShieldCheck}
                />
            </div>
        </div>
    )
}

export default CustomerDetailsStats
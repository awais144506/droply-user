import PageStatsCard from "@/lib/utils/components/StatsMainPageCards"
import { Trash2, TrendingDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils/functions/setFormat"

type Props = {
    totalItemsDamaged: number;
    estimatedLossValue: number;
}

const WastageStats = ({ totalItemsDamaged, estimatedLossValue }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <PageStatsCard
                title="Total Items Wasted"
                value={totalItemsDamaged}
                icon={Trash2}
                iconContainerClass="bg-rose-50 text-rose-600"
            />
            <PageStatsCard
                title="Total Value Loss"
                value={formatCurrency(estimatedLossValue)}
                icon={TrendingDown}
                iconContainerClass="bg-rose-50 text-rose-600"
                valueColorClass="text-rose-600"
                prefix="Rs"
            />
        </div>
    )
}

export default WastageStats
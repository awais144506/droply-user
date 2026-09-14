import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const PageDetailHeader = ({
    href,
    heading,
    description,
    children
}: {
    href: string;
    heading?: string;
    description: string;
    children?: React.ReactNode; 
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Side: Back Button & Titles */}
            <div className="flex items-center gap-4">
                <Link
                    href={href}
                    className="h-9 w-9 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 line-clamp-1">{heading}</h1>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                        {description}
                    </p>
                </div>
            </div>

            {/* Right Side: Action Buttons */}
            {children && (
                <div className="flex items-center gap-2.5">
                    {children}
                </div>
            )}
        </div>
    )
}

export default PageDetailHeader
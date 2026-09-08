import Link from "next/link"
import { SearchX, ArrowLeft } from "lucide-react"

type Props = {
    item: string
    href: string
}

const NotFoundPage = ({ item, href }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            {/* Icon Container */}
            <div className="h-24 w-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <SearchX className="h-10 w-10 text-rose-600" />
            </div>
            
            {/* Text Content */}
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                {item} Not Found
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
                We couldn&apos;t find the {item.toLowerCase()} you&apos;re looking for. It may have been deleted, or the link might be incorrect.
            </p>
            
            {/* Call to Action */}
            <Link 
                href={href}
                className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white text-sm font-bold rounded-xl hover:bg-rose-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
                <ArrowLeft className="h-4 w-4" />
                Return to {item}s
            </Link>
        </div>
    )
}

export default NotFoundPage
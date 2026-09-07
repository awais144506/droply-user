import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const CreateFormHeader = ({ href, text }: { href: string, text: string }) => {
    return (
        <div>
            <div className="flex items-center gap-3 border-b pb-4">
                <Link href={href} className={buttonVariants({ variant: "outline", size: "icon-sm" })}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">{text}</h1>
                </div>
            </div></div>
    )
}

export default CreateFormHeader
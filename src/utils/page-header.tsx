import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
    heading: string;
    description: string;
    href?: string;     
    btnText?: string; 
}

export default function PageHeader({ heading, description, href, btnText }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {heading}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    {description}
                </p>
            </div>

            {/* Only render the button if BOTH href and btnText are provided */}
            {href && btnText && (
                <Link
                    href={href}
                    className={buttonVariants({ variant: "create" })}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {btnText}
                </Link>
            )}
        </div>
    );
}
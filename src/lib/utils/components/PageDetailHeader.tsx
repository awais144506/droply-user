import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PageDetailHeader = ({
  href,
  heading,
  description,
  children,
}: {
  href: string;
  heading?: string;
  description: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
      
      {/* Left Side: Back Button & Titles */}
      <div className="flex items-start sm:items-center gap-4">
        <Link
          href={href}
          className="group flex h-10 w-10 mt-0.5 sm:mt-0 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 line-clamp-1">
            {heading}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-1">
            {description}
          </p>
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      {children && (
        <div className="flex w-full sm:w-auto items-center gap-3 pt-2 sm:pt-0">
          {children}
        </div>
      )}
      
    </div>
  );
};

export default PageDetailHeader;
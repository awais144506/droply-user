import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const PageDetailHeader = ({
  href,
  heading,
  description,
  createdAt,
  updatedAt,
  children,
}: {
  href: string;
  heading?: string;
  description: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-2">
      
      {/* Left Side: Back Button & Titles */}
      <div className="flex items-start gap-4">
        <Link
          href={href}
          className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
        
        <div className="flex flex-col justify-center pt-1 sm:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 line-clamp-1">
            {heading}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-1">
            {description}
          </p>

          {/* 🔥 Global Metadata Strip */}
          {(createdAt || updatedAt) && (
            <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mt-2.5">
              {createdAt && (
                <div className="flex items-center gap-1.5" title="Date Created">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Created {format(new Date(createdAt), 'MMM d, yyyy')}</span>
                </div>
              )}
              
              {createdAt && updatedAt && (
                <div className="h-3.5 w-px bg-slate-200"></div>
              )}
              
              {updatedAt && (
                <div className="flex items-center gap-1.5" title="Last Updated">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Action Buttons */}
      {children && (
        <div className="flex w-full sm:w-auto items-center gap-3 pt-2 sm:pt-1">
          {children}
        </div>
      )}
      
    </div>
  );
};

export default PageDetailHeader;
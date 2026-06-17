import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
  showHeader = true,
}: SkeletonTableProps) {
  return (
    <div
      className={cn("ds-card overflow-hidden rounded-lg", className)}
      aria-hidden="true"
    >
      {showHeader && (
        <div className="hidden gap-4 border-b border-border bg-surface-sunken px-5 py-3 lg:grid"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16" />
          ))}
        </div>
      )}
      <ul className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, row) => (
          <li
            key={row}
            className="flex items-center gap-4 px-5 py-4"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-3/5 max-w-xs" />
              <Skeleton className="h-3 w-2/5 max-w-[8rem]" />
            </div>
            <Skeleton className="hidden h-8 w-16 rounded-md sm:block" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}

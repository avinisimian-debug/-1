import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";
import { SkeletonText } from "./SkeletonText";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showHeader?: boolean;
}

export function SkeletonCard({
  className,
  lines = 3,
  showHeader = true,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "ds-card overflow-hidden rounded-lg p-6 sm:p-8",
        className,
      )}
      aria-hidden="true"
    >
      {showHeader && (
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
          <Skeleton className="h-4 w-32" />
        </div>
      )}
      <SkeletonText lines={lines} />
    </div>
  );
}

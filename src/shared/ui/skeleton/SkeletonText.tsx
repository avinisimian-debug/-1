import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  /** Width of the last line as a fraction (0–1) for a natural taper */
  lastLineWidth?: number;
}

export function SkeletonText({
  lines = 3,
  className,
  lastLineWidth = 0.65,
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3.5"
          style={{
            width: i === lines - 1 ? `${lastLineWidth * 100}%` : "100%",
          }}
        />
      ))}
    </div>
  );
}

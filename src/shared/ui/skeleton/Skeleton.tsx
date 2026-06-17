import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Disables shimmer animation (e.g. when parent handles motion) */
  static?: boolean;
}

export function Skeleton({ className, static: isStatic, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md bg-muted",
        !isStatic && "skeleton-shimmer",
        className,
      )}
      {...props}
    />
  );
}

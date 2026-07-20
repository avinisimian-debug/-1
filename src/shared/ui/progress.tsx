import { cn } from "@/shared/lib/cn";

interface ProgressProps extends React.ComponentProps<"div"> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  indeterminate?: boolean;
}

function Progress({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  indeterminate = false,
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;

  const heightClass =
    size === "sm" ? "h-1" : size === "lg" ? "h-2.5" : "h-1.5";

  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{percent}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          heightClass,
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-[width] duration-300 ease-out",
            indeterminate && "w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite]",
          )}
          style={
            indeterminate
              ? undefined
              : { width: `${percent}%`, marginInlineStart: 0 }
          }
        />
      </div>
    </div>
  );
}

export { Progress };

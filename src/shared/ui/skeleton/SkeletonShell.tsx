import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

interface SkeletonShellProps {
  children: React.ReactNode;
  className?: string;
}

/** Mirrors DashboardShell layout — sidebar + header + scrollable main */
export function SkeletonShell({ children, className }: SkeletonShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden bg-background"
      role="status"
      aria-busy="true"
      aria-label="Loading page"
    >
      {/* Sidebar — desktop only */}
      <aside className="hidden w-[var(--sidebar-width)] shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="flex h-14 items-center border-b border-border px-5">
          <Skeleton className="h-6 w-28" />
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2.5">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3.5 flex-1" style={{ maxWidth: `${60 + i * 8}%` }} />
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="hidden h-3 w-52 sm:block" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="hidden h-8 w-24 rounded-md sm:block" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>

        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8", className)}>
          {children}
        </main>
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}

import { Skeleton } from "./Skeleton";
import { SkeletonCard } from "./SkeletonCard";
import { SkeletonShell } from "./SkeletonShell";
import { SkeletonTable } from "./SkeletonTable";

export function DashboardPageSkeleton() {
  return (
    <SkeletonShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="ds-card overflow-hidden rounded-lg">
          <div className="border-b border-border px-6 py-8 sm:px-10">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-7 w-4/5 max-w-md" />
                <Skeleton className="h-4 w-full max-w-lg" />
                <Skeleton className="h-4 w-3/5 max-w-sm" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-28 rounded-md" />
              ))}
            </div>
          </div>
          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
            <Skeleton className="h-44 w-full rounded-lg" />
          </div>
        </div>
        <SkeletonCard lines={2} showHeader={false} className="!p-5" />
      </div>
    </SkeletonShell>
  );
}

export function HistoryPageSkeleton() {
  return (
    <SkeletonShell>
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full max-w-sm rounded-md" />
          <Skeleton className="h-4 w-28" />
        </div>
        <SkeletonTable rows={6} showHeader={false} />
      </div>
    </SkeletonShell>
  );
}

export function SettingsPageSkeleton() {
  return (
    <SkeletonShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <SkeletonCard lines={4} />
        <div className="mx-auto max-w-2xl space-y-6">
          <SkeletonCard lines={3} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div>
      </div>
    </SkeletonShell>
  );
}

export function AdminUsersSkeleton() {
  return (
    <SkeletonShell>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-24" />
        </div>
        <SkeletonTable rows={8} columns={5} />
      </div>
    </SkeletonShell>
  );
}

export function AuthPageSkeleton() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="ds-card space-y-4 rounded-lg p-8">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-px w-full" static />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

"use client";

import { AppShell } from "./AppShell";

interface DashboardShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
}

export function DashboardShell({
  title,
  description,
  children,
  contentClassName,
}: DashboardShellProps) {
  return (
    <AppShell
      title={title}
      description={description}
      contentClassName={contentClassName}
    >
      {children}
    </AppShell>
  );
}

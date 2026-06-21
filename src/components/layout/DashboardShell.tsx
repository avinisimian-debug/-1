"use client";

import { AppShell } from "./AppShell";

interface DashboardShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DashboardShell({ title, description, children }: DashboardShellProps) {
  return (
    <AppShell title={title} description={description}>
      {children}
    </AppShell>
  );
}

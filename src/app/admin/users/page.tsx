"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Copy,
  Crown,
  Download,
  Mail,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import type { StoredUser } from "@/lib/users-store";
import { SkeletonTable } from "@/shared/ui/skeleton";
import { cn } from "@/lib/utils";

type PlanFilter = "all" | "pro" | "free";

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildCsv(users: StoredUser[]): string {
  const header = "name,email,plan,provider,registeredAt,lastLoginAt";
  const rows = users.map((u) =>
    [
      `"${u.name.replace(/"/g, '""')}"`,
      u.email,
      u.plan,
      u.provider,
      u.registeredAt,
      u.lastLoginAt,
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

export default function AdminUsersPage() {
  const { t, locale } = useLocale();
  const { data: session } = useSession();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<PlanFilter>("all");

  const isAdmin = session?.user?.isAdmin;

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (!res.ok) throw new Error("Forbidden");
    const data = (await res.json()) as { users?: StoredUser[] };
    setUsers(data.users ?? []);
    setError(null);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    loadUsers()
      .catch(() => setError(t.adminNoAccess))
      .finally(() => setLoading(false));
  }, [isAdmin, loadUsers, t.adminNoAccess]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUsers();
    } catch {
      setError(t.adminNoAccess);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (filter === "pro") return users.filter((u) => u.plan === "pro");
    if (filter === "free") return users.filter((u) => u.plan === "free");
    return users;
  }, [users, filter]);

  const proCount = useMemo(
    () => users.filter((u) => u.plan === "pro").length,
    [users],
  );

  const copyEmails = async () => {
    const emails = filteredUsers.map((u) => u.email).join(", ");
    await navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    const blob = new Blob([buildCsv(filteredUsers)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `staz-ai-users-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const mailAll = () => {
    const emails = filteredUsers.map((u) => u.email).join(",");
    window.location.href = `mailto:?bcc=${encodeURIComponent(emails)}`;
  };

  if (!isAdmin) {
    return (
      <DashboardShell title={t.adminTitle} description={t.adminDesc}>
        <div className="mx-auto max-w-lg rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-red-600" />
          <p className="text-sm text-red-700">{t.adminNoAccess}</p>
        </div>
      </DashboardShell>
    );
  }

  if (loading) {
    return (
      <DashboardShell title={t.adminTitle} description={t.adminDesc}>
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex items-center gap-3" aria-hidden="true">
            <div className="h-10 w-10 rounded-md bg-muted skeleton-shimmer" />
            <div className="h-8 w-24 rounded-md bg-muted skeleton-shimmer" />
          </div>
          <SkeletonTable rows={8} columns={6} />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={t.adminTitle} description={t.adminDesc}>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-sm text-zinc-500">
                <span className="text-2xl font-semibold text-zinc-900">
                  {users.length}
                </span>{" "}
                {t.adminTotal}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              <Crown className="h-3.5 w-3.5" />
              {proCount} {t.adminProCount}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
              />
              {t.adminRefresh}
            </button>
            {filteredUsers.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={copyEmails}
                  className="btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? t.adminEmailsCopied : t.adminCopyEmails}
                </button>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t.adminExportCsv}
                </button>
                <button
                  type="button"
                  onClick={mailAll}
                  className="btn-cinema inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {t.adminMailAll}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {(["all", "pro", "free"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === key
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
              )}
            >
              {key === "all"
                ? t.adminFilterAll
                : key === "pro"
                  ? t.adminFilterPro
                  : t.adminFilterFree}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        {filteredUsers.length === 0 && (
          <div className="glass-card rounded-lg p-12 text-center text-sm text-zinc-500">
            {t.adminEmpty}
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className="glass-card overflow-hidden rounded-lg">
            <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto_auto_auto_auto] gap-4 border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 lg:grid">
              <span>{t.adminName}</span>
              <span>{t.adminEmail}</span>
              <span>{t.adminPlan}</span>
              <span>{t.adminProvider}</span>
              <span>{t.adminRegistered}</span>
              <span>{t.adminLastLogin}</span>
            </div>
            <ul className="divide-y divide-zinc-100">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-zinc-50 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto_auto_auto_auto] lg:items-center lg:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="truncate text-sm font-medium text-zinc-800">
                      {user.name}
                    </span>
                  </div>

                  <a
                    href={`mailto:${user.email}`}
                    className="flex min-w-0 items-center gap-1.5 truncate text-sm text-indigo-600 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {user.email}
                  </a>

                  <span
                    className={cn(
                      "inline-flex w-fit items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium capitalize",
                      user.plan === "pro"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-zinc-100 text-zinc-500",
                    )}
                  >
                    {user.plan === "pro" && (
                      <Crown className="h-3 w-3" aria-hidden />
                    )}
                    {user.plan}
                  </span>

                  <span className="inline-flex w-fit rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs capitalize text-zinc-600">
                    {user.provider}
                  </span>

                  <span className="text-xs text-zinc-500">
                    {formatDate(user.registeredAt, locale)}
                  </span>

                  <span className="text-xs text-zinc-400">
                    {formatDate(user.lastLoginAt, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, Shield, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useLocale } from "@/context/LocaleContext";
import type { StoredUser } from "@/lib/users-store";
import { cn } from "@/lib/utils";

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminUsersPage() {
  const { t, locale } = useLocale();
  const { data: session } = useSession();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = session?.user?.isAdmin;

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    fetch("/api/admin/users")
      .then(async (res) => {
        if (!res.ok) throw new Error("Forbidden");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users ?? []);
      })
      .catch(() => setError(t.adminNoAccess))
      .finally(() => setLoading(false));
  }, [isAdmin, t.adminNoAccess]);

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

  return (
    <DashboardShell title={t.adminTitle} description={t.adminDesc}>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-sm text-zinc-500">
              <span className="text-2xl font-semibold text-zinc-900">{users.length}</span>{" "}
              {t.adminTotal}
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-center text-sm text-zinc-500">...</p>
        )}

        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && users.length === 0 && (
          <div className="glass-card rounded-lg p-12 text-center text-sm text-zinc-500">
            {t.adminEmpty}
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="glass-card overflow-hidden rounded-lg">
            <div className="hidden grid-cols-[1fr_1fr_auto_auto_auto] gap-4 border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 lg:grid">
              <span>{t.adminName}</span>
              <span>{t.adminEmail}</span>
              <span>{t.adminProvider}</span>
              <span>{t.adminRegistered}</span>
              <span>{t.adminLastLogin}</span>
            </div>
            <ul className="divide-y divide-zinc-100">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-zinc-50 lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-center lg:gap-4"
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
                  <span className="flex items-center gap-1.5 truncate text-sm text-zinc-500">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {user.email}
                  </span>
                  <span className="inline-flex w-fit rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs capitalize text-zinc-600">
                    {user.provider}
                  </span>
                  <span className={cn(
                    "inline-flex w-fit rounded-md px-2.5 py-0.5 text-xs font-medium capitalize",
                    user.plan === "pro"
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-zinc-100 text-zinc-500",
                  )}>
                    {user.plan ?? "free"}
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

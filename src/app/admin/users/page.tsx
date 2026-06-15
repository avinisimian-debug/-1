"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, Shield, User, Users } from "lucide-react";
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
        <div className="mx-auto max-w-lg rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <Shield className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <p className="text-sm text-red-300">{t.adminNoAccess}</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={t.adminTitle} description={t.adminDesc}>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20">
              <Users className="h-5 w-5 text-violet-400" />
            </div>
            <p className="text-sm text-zinc-400">
              <span className="text-2xl font-bold text-white">{users.length}</span>{" "}
              {t.adminTotal}
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-center text-sm text-zinc-500">...</p>
        )}

        {error && (
          <p className="text-center text-sm text-red-400">{error}</p>
        )}

        {!loading && users.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center text-sm text-zinc-500">
            {t.adminEmpty}
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="hidden grid-cols-[1fr_1fr_auto_auto_auto] gap-4 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500 lg:grid">
              <span>{t.adminName}</span>
              <span>{t.adminEmail}</span>
              <span>{t.adminProvider}</span>
              <span>{t.adminRegistered}</span>
              <span>{t.adminLastLogin}</span>
            </div>
            <ul className="divide-y divide-white/[0.04]">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03] lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-center lg:gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-amber-500 text-xs font-bold text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="truncate text-sm font-medium text-zinc-200">
                      {user.name}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 truncate text-sm text-zinc-400">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {user.email}
                  </span>
                  <span className="inline-flex w-fit rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs capitalize text-zinc-400">
                    {user.provider}
                  </span>
                  <span className={cn(
                    "inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                    user.plan === "pro"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-zinc-800 text-zinc-500",
                  )}>
                    {user.plan ?? "free"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatDate(user.registeredAt, locale)}
                  </span>
                  <span className="text-xs text-zinc-600">
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

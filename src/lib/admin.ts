/**
 * Primary platform owner — always has admin access to /admin/users
 * and automatic Pro grant, even if ADMIN_EMAIL env is missing.
 */
export const PRIMARY_ADMIN_EMAIL = "avi.nisimian@gmail.com";

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email?.trim()) return null;
  return email.trim().toLowerCase();
}

/** Extra admins from env: ADMIN_EMAIL and optional comma-separated ADMIN_EMAILS */
function envAdminEmails(): string[] {
  const emails: string[] = [];
  const primary = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (primary) emails.push(primary);

  const extras = process.env.ADMIN_EMAILS;
  if (extras?.trim()) {
    for (const part of extras.split(/[,;\s]+/)) {
      const e = part.trim().toLowerCase();
      if (e) emails.push(e);
    }
  }

  return emails;
}

export function getAdminEmails(): string[] {
  return Array.from(new Set([PRIMARY_ADMIN_EMAIL, ...envAdminEmails()]));
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return getAdminEmails().includes(normalized);
}

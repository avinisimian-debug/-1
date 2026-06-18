import { isProGranted } from "@/lib/pro-grants";
import { readPersistedJson, writePersistedJson } from "@/lib/user-persistence";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
  plan: "free" | "pro";
  registeredAt: string;
  lastLoginAt: string;
  paidAt?: string;
  paypalTransactionId?: string;
}

async function readUsers(): Promise<StoredUser[]> {
  return readPersistedJson<StoredUser[]>([]);
}

async function writeUsers(users: StoredUser[]) {
  await writePersistedJson(users);
}

async function withEffectivePlan(user: StoredUser): Promise<StoredUser> {
  if (await isProGranted(user.email)) {
    return { ...user, plan: "pro" };
  }
  return user;
}

export async function registerOrUpdateUser(input: {
  name: string;
  email: string;
  provider: "email" | "google";
}): Promise<StoredUser> {
  const users = await readUsers();
  const email = input.email.toLowerCase();
  const now = new Date().toISOString();
  const existing = users.find((u) => u.email === email);

  if (existing) {
    existing.name = input.name;
    existing.lastLoginAt = now;
    existing.provider = input.provider;
    if (await isProGranted(email)) {
      existing.plan = "pro";
      existing.paidAt = existing.paidAt ?? now;
    }
    await writeUsers(users);
    return withEffectivePlan(existing);
  }

  const grantedPro = await isProGranted(email);

  const user: StoredUser = {
    id: email,
    name: input.name,
    email,
    provider: input.provider,
    plan: grantedPro ? "pro" : "free",
    registeredAt: now,
    lastLoginAt: now,
    ...(grantedPro ? { paidAt: now } : {}),
  };

  users.unshift(user);
  await writeUsers(users);
  return user;
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const users = await readUsers();
  const enriched = await Promise.all(users.map(withEffectivePlan));
  return enriched.sort(
    (a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
  );
}

export async function getUserCount(): Promise<number> {
  const users = await readUsers();
  return users.length;
}

export async function getUserPlan(email: string): Promise<"free" | "pro"> {
  const normalized = email.toLowerCase();
  if (await isProGranted(normalized)) {
    return "pro";
  }

  const users = await readUsers();
  const user = users.find((u) => u.email === normalized);
  return user?.plan ?? "free";
}

export async function upgradeUserToPro(
  email: string,
  transactionId?: string,
): Promise<void> {
  const users = await readUsers();
  const user = users.find((u) => u.email === email.toLowerCase());

  if (!user) return;

  user.plan = "pro";
  user.paidAt = new Date().toISOString();
  if (transactionId) user.paypalTransactionId = transactionId;

  await writeUsers(users);
}

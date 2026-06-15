import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

const DATA_DIR = join(process.cwd(), "data");
const USERS_FILE = join(DATA_DIR, "users.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await ensureDataDir();
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
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
    await writeUsers(users);
    return existing;
  }

  const user: StoredUser = {
    id: email,
    name: input.name,
    email,
    provider: input.provider,
    plan: "free",
    registeredAt: now,
    lastLoginAt: now,
  };

  users.unshift(user);
  await writeUsers(users);
  return user;
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const users = await readUsers();
  return users.sort(
    (a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
  );
}

export async function getUserCount(): Promise<number> {
  const users = await readUsers();
  return users.length;
}

export async function getUserPlan(
  email: string,
): Promise<"free" | "pro"> {
  const users = await readUsers();
  const user = users.find((u) => u.email === email.toLowerCase());
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

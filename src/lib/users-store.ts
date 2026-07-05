import { isLaunchWeekActive } from "@/lib/constants";
import { isProGranted } from "@/lib/pro-grants";
import { readPersistedJson, writePersistedJson } from "@/lib/user-persistence";

export type ProSubscriptionStatus =
  | "trialing"
  | "active"
  | "cancelled"
  | "past_due";

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
  /** Instant launch-week trial (no PayPal). */
  proTrialEndsAt?: string;
  proTrialUsed?: boolean;
  paypalSubscriptionId?: string;
  proSubscriptionStatus?: ProSubscriptionStatus;
  /** One-time PayPal payment — Pro forever (no recurring billing). */
  proLifetime?: boolean;
}

export interface UserPlanDetails {
  plan: "free" | "pro";
  trialEndsAt?: string;
  subscriptionStatus?: ProSubscriptionStatus;
  onIntroPricing?: boolean;
  /** Pro via one-time lifetime purchase */
  proLifetime?: boolean;
  /** Active PayPal subscription linked to the account. */
  hasSubscription: boolean;
  /** Pro via launch trial only — must add PayPal before trial ends. */
  needsPayPalSetup: boolean;
}

async function readUsers(): Promise<StoredUser[]> {
  return readPersistedJson<StoredUser[]>([]);
}

async function writeUsers(users: StoredUser[]) {
  await writePersistedJson(users);
}

function isTrialActive(user: StoredUser, now = Date.now()): boolean {
  if (!user.proTrialEndsAt) return false;
  return new Date(user.proTrialEndsAt).getTime() > now;
}

function hasActiveSubscription(user: StoredUser): boolean {
  return Boolean(
    user.paypalSubscriptionId &&
      user.proSubscriptionStatus &&
      user.proSubscriptionStatus !== "cancelled",
  );
}

function isLifetimePro(user: StoredUser): boolean {
  return Boolean(user.proLifetime && user.paidAt);
}

function isPaidPro(user: StoredUser): boolean {
  return (
    user.plan === "pro" &&
    Boolean(user.paidAt) &&
    !user.proTrialEndsAt &&
    (isLifetimePro(user) || !user.paypalSubscriptionId || user.proLifetime === true)
  );
}

async function expireTrialIfNeeded(user: StoredUser): Promise<StoredUser> {
  if (!user.proTrialEndsAt || isTrialActive(user)) return user;
  if (hasActiveSubscription(user) || isPaidPro(user)) return user;
  if (await isProGranted(user.email)) return user;

  user.plan = "free";
  return user;
}

async function resolvePlanForUser(user: StoredUser): Promise<UserPlanDetails> {
  const expired = await expireTrialIfNeeded(user);

  if (await isProGranted(expired.email)) {
    return { plan: "pro", hasSubscription: false, needsPayPalSetup: false };
  }

  if (hasActiveSubscription(expired)) {
    return {
      plan: "pro",
      subscriptionStatus: expired.proSubscriptionStatus,
      onIntroPricing:
        expired.proSubscriptionStatus === "trialing" ||
        (isLaunchWeekActive() && expired.proSubscriptionStatus === "active"),
      hasSubscription: true,
      needsPayPalSetup: false,
    };
  }

  if (isPaidPro(expired)) {
    return {
      plan: "pro",
      proLifetime: isLifetimePro(expired) || expired.proLifetime === true,
      hasSubscription: Boolean(expired.paypalSubscriptionId) && !expired.proLifetime,
      needsPayPalSetup: false,
    };
  }

  if (isTrialActive(expired)) {
    return {
      plan: "pro",
      trialEndsAt: expired.proTrialEndsAt,
      hasSubscription: false,
      needsPayPalSetup: true,
    };
  }

  return {
    plan: expired.plan === "pro" ? "free" : (expired.plan ?? "free"),
    hasSubscription: false,
    needsPayPalSetup: false,
  };
}

async function withEffectivePlan(user: StoredUser): Promise<StoredUser> {
  const details = await resolvePlanForUser(user);
  return { ...user, plan: details.plan };
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
    const resolved = await expireTrialIfNeeded(existing);
    await writeUsers(users);
    return withEffectivePlan(resolved);
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
  let changed = false;

  for (let i = 0; i < users.length; i++) {
    const before = users[i].plan;
    const expired = await expireTrialIfNeeded(users[i]);
    users[i] = expired;
    const details = await resolvePlanForUser(expired);
    if (details.plan !== before) changed = true;
    users[i].plan = details.plan;
  }

  if (changed) await writeUsers(users);

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

export async function getUserPlanDetails(email: string): Promise<UserPlanDetails> {
  const normalized = email.toLowerCase();

  if (await isProGranted(normalized)) {
    return { plan: "pro", hasSubscription: false, needsPayPalSetup: false };
  }

  const users = await readUsers();
  const index = users.findIndex((u) => u.email === normalized);
  if (index === -1) {
    return { plan: "free", hasSubscription: false, needsPayPalSetup: false };
  }

  const expired = await expireTrialIfNeeded(users[index]);
  users[index] = expired;
  const details = await resolvePlanForUser(expired);

  if (details.plan !== users[index].plan) {
    users[index].plan = details.plan;
    await writeUsers(users);
  }

  return details;
}

export async function getUserPlan(email: string): Promise<"free" | "pro"> {
  const details = await getUserPlanDetails(email);
  return details.plan;
}

export async function findUserBySubscriptionId(
  subscriptionId: string,
): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((u) => u.paypalSubscriptionId === subscriptionId);
}

export async function setUserSubscription(
  email: string,
  subscriptionId: string,
  status: ProSubscriptionStatus,
): Promise<boolean> {
  const users = await readUsers();
  const user = users.find((u) => u.email === email.toLowerCase());

  if (!user) return false;

  user.paypalSubscriptionId = subscriptionId;
  user.proSubscriptionStatus = status;
  user.plan = status === "cancelled" ? "free" : "pro";
  user.proTrialEndsAt = undefined;
  user.proTrialUsed = undefined;
  if (status !== "cancelled" && !user.paidAt) {
    user.paidAt = new Date().toISOString();
  }

  await writeUsers(users);
  return true;
}

export async function updateSubscriptionByPayPalId(
  subscriptionId: string,
  status: ProSubscriptionStatus,
): Promise<boolean> {
  const users = await readUsers();
  const user = users.find((u) => u.paypalSubscriptionId === subscriptionId);
  if (!user) return false;

  user.proSubscriptionStatus = status;
  user.plan = status === "cancelled" ? "free" : "pro";
  await writeUsers(users);
  return true;
}

export async function upgradeUserToPro(
  email: string,
  transactionId?: string,
): Promise<void> {
  const users = await readUsers();
  const normalized = email.toLowerCase();
  const now = new Date().toISOString();
  let user = users.find((u) => u.email === normalized);

  if (!user) {
    user = {
      id: normalized,
      name: normalized.split("@")[0] || "User",
      email: normalized,
      provider: "email",
      plan: "pro",
      registeredAt: now,
      lastLoginAt: now,
      paidAt: now,
      proLifetime: true,
      ...(transactionId ? { paypalTransactionId: transactionId } : {}),
    };
    users.unshift(user);
    await writeUsers(users);
    return;
  }

  user.plan = "pro";
  user.paidAt = user.paidAt ?? now;
  user.proLifetime = true;
  user.proTrialEndsAt = undefined;
  user.proTrialUsed = undefined;
  user.paypalSubscriptionId = undefined;
  user.proSubscriptionStatus = undefined;
  if (transactionId) user.paypalTransactionId = transactionId;

  await writeUsers(users);
}

import { isLaunchWeekActive, PRO_LAUNCH_WEEK_END } from "@/lib/constants";
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
}

export interface UserPlanDetails {
  plan: "free" | "pro";
  trialEndsAt?: string;
  subscriptionStatus?: ProSubscriptionStatus;
  onIntroPricing?: boolean;
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

function isPaidPro(user: StoredUser): boolean {
  return user.plan === "pro" && Boolean(user.paidAt) && !user.proTrialEndsAt;
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
    return { plan: "pro" };
  }

  if (hasActiveSubscription(expired)) {
    return {
      plan: "pro",
      subscriptionStatus: expired.proSubscriptionStatus,
      onIntroPricing:
        expired.proSubscriptionStatus === "trialing" ||
        (isLaunchWeekActive() && expired.proSubscriptionStatus === "active"),
    };
  }

  if (isPaidPro(expired)) {
    return { plan: "pro" };
  }

  if (isTrialActive(expired)) {
    return { plan: "pro", trialEndsAt: expired.proTrialEndsAt };
  }

  return { plan: expired.plan === "pro" ? "free" : (expired.plan ?? "free") };
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
    return { plan: "pro" };
  }

  const users = await readUsers();
  const index = users.findIndex((u) => u.email === normalized);
  if (index === -1) return { plan: "free" };

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
  const user = users.find((u) => u.email === email.toLowerCase());

  if (!user) return;

  user.plan = "pro";
  user.paidAt = new Date().toISOString();
  user.proTrialEndsAt = undefined;
  if (transactionId) user.paypalTransactionId = transactionId;

  await writeUsers(users);
}

export async function startLaunchTrial(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isLaunchWeekActive()) {
    return { ok: false, error: "launch_ended" };
  }

  const users = await readUsers();
  const user = users.find((u) => u.email === email.toLowerCase());

  if (!user) {
    return { ok: false, error: "user_not_found" };
  }

  if (hasActiveSubscription(user) || isPaidPro(user)) {
    return { ok: true };
  }

  if (isTrialActive(user)) {
    return { ok: true };
  }

  if (user.proTrialUsed) {
    return { ok: false, error: "trial_used" };
  }

  user.plan = "pro";
  user.proTrialEndsAt = PRO_LAUNCH_WEEK_END.toISOString();
  user.proTrialUsed = true;
  await writeUsers(users);

  return { ok: true };
}

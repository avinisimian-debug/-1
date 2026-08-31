/** Client-side plan sync signals (after PayPal, settings, etc.). */

export const PRO_WELCOME_KEY = "staz-pro-welcome";

export function notifyPlanUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("staz:plan-updated"));
}

export function markProWelcomePending(): void {
  try {
    sessionStorage.setItem(PRO_WELCOME_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function consumeProWelcomePending(): boolean {
  try {
    if (sessionStorage.getItem(PRO_WELCOME_KEY) !== "1") return false;
    sessionStorage.removeItem(PRO_WELCOME_KEY);
    return true;
  } catch {
    return false;
  }
}

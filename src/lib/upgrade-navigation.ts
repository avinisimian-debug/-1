export const SETTINGS_UPGRADE_PATH = "/settings#upgrade";

export function scrollToUpgradeSection() {
  const el = document.getElementById("upgrade");
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function scrollToUpgradeWithRetry(maxAttempts = 12) {
  let attempts = 0;

  const tryScroll = () => {
    if (scrollToUpgradeSection()) return;
    attempts += 1;
    if (attempts < maxAttempts) {
      window.setTimeout(tryScroll, 50);
    }
  };

  tryScroll();
}

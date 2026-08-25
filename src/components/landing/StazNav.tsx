"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { LANDING } from "@/lib/landing-copy";
import { StazButton } from "@/components/landing/ui/StazButton";
import type { Locale } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

type StazNavProps = {
  locale: Locale;
  locales: Locale[];
  localeLabels: Record<Locale, string>;
  langLabel: string;
  onLocaleChange: (locale: Locale) => void;
  onDemo: () => void;
  onHow: () => void;
  onOutcomes: () => void;
  onAudience: () => void;
  onPricing: () => void;
  onLogin: () => void;
  onSignup?: () => void;
};

const NUDGE_DISMISS_KEY = "staz-login-nudge-dismissed";

/**
 * Global landing header — Login ("התחברות") is always visible in the initial
 * viewport on every breakpoint. Never hide it behind menus/hover/JS.
 */
export function StazNav({
  locale,
  locales,
  localeLabels,
  langLabel,
  onLocaleChange,
  onDemo,
  onHow,
  onOutcomes,
  onAudience,
  onPricing,
  onLogin,
  onSignup,
}: StazNavProps) {
  const copy = LANDING.nav;
  const menuId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(NUDGE_DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setNudgeVisible(true);
    const hide = window.setTimeout(() => setNudgeVisible(false), 12000);
    return () => window.clearTimeout(hide);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const dismissNudge = () => {
    setNudgeVisible(false);
    try {
      sessionStorage.setItem(NUDGE_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const goLogin = () => {
    dismissNudge();
    setMenuOpen(false);
    onLogin();
  };

  const goSignup = () => {
    dismissNudge();
    setMenuOpen(false);
    (onSignup ?? onLogin)();
  };

  const links = [
    { label: copy.how, onClick: onHow },
    { label: copy.outcomes, onClick: onOutcomes },
    { label: copy.audience, onClick: onAudience },
    { label: copy.pricing, onClick: onPricing },
  ] as const;

  return (
    <header
      className={cn(
        "border-b transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled
          ? "border-white/[0.1] bg-[#05080a]/95 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          : "border-white/[0.06] bg-[#05080a]/88 backdrop-blur-md",
      )}
    >
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6">
        {/* RIGHT (RTL start): brand */}
        <Link
          href="/"
          className="shrink-0 font-brand text-xl tracking-[0.28em] text-white transition-opacity hover:opacity-90 sm:text-2xl"
        >
          STAZ
        </Link>

        {/* CENTER: nav links (desktop only) */}
        <nav
          className="absolute inset-x-0 mx-auto hidden max-w-fit items-center justify-center gap-0.5 lg:flex"
          aria-label="ניווט ראשי"
        >
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={link.onClick}
              className="rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* LEFT (RTL end): Login + Start — always in the first paint */}
        <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <select
            value={locale}
            onChange={(e) => onLocaleChange(e.target.value as Locale)}
            aria-label={langLabel}
            className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/70 transition-colors hover:border-white/20 focus:border-[#2dd4bf]/50 focus:outline-none md:inline-block sm:text-sm"
          >
            {locales.map((l) => (
              <option key={l} value={l} className="text-black">
                {localeLabels[l]}
              </option>
            ))}
          </select>

          {/* Permanent Login — never hidden, never icon-only */}
          <button
            id="staz-nav-login"
            type="button"
            onClick={goLogin}
            className="group/login inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2dd4bf]/50 sm:min-h-10 sm:px-4"
          >
            <span>{copy.login}</span>
            <span
              aria-hidden
              className="inline-block text-white/55 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/login:-translate-x-0.5 group-hover/login:text-white"
            >
              →
            </span>
          </button>

          <StazButton
            size="sm"
            onClick={goSignup}
            className="!min-h-9 shrink-0 !px-3.5 !text-xs sm:!min-h-10 sm:!px-4 sm:!text-sm"
          >
            {copy.start}
          </StazButton>

          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Floating attention — reinforces header Login; never replaces it */}
      <div
        className={cn(
          "pointer-events-none absolute z-[60] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "end-3 top-[calc(100%+0.5rem)] sm:end-6",
          nudgeVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        role="status"
        aria-live="polite"
        aria-hidden={!nudgeVisible}
      >
        <div className="pointer-events-auto relative w-max max-w-[17rem] rounded-2xl border border-white/12 bg-[#0a1210]/96 px-3.5 py-2.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <span
            className="absolute -top-1.5 end-12 size-3 rotate-45 border-s border-t border-white/12 bg-[#0a1210]/96"
            aria-hidden
          />
          <p className="pe-4 text-[11px] leading-snug text-white/55">
            {copy.loginNudge}
          </p>
          <button
            type="button"
            onClick={goLogin}
            className="group/nudge mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#5eead4] transition-colors hover:text-[#99f6e4]"
          >
            {copy.loginNudgeCta}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover/nudge:-translate-x-0.5"
            >
              →
            </span>
          </button>
          <button
            type="button"
            onClick={dismissNudge}
            className="absolute end-1.5 top-1.5 rounded p-1 text-[10px] text-white/35 hover:text-white/60"
            aria-label="סגירה"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Mobile menu — Login already visible in bar; menu is for section links */}
      <div
        id={menuId}
        className={cn(
          "border-t border-white/[0.06] bg-[#05080a]/98 backdrop-blur-xl lg:hidden",
          menuOpen ? "block" : "hidden",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={goLogin}
            className="flex min-h-11 items-center justify-between rounded-xl border border-white/15 bg-white/[0.04] px-3 text-start text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
          >
            <span>{copy.login}</span>
            <span className="text-white/50" aria-hidden>
              →
            </span>
          </button>
          <StazButton onClick={goSignup} className="w-full">
            {copy.start}
          </StazButton>
          <div className="my-2 h-px bg-white/[0.08]" />
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                link.onClick();
              }}
              className="flex min-h-11 items-center rounded-xl px-3 text-start text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onDemo();
            }}
            className="flex min-h-11 items-center rounded-xl px-3 text-start text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            {copy.demo}
          </button>
        </div>
      </div>
    </header>
  );
}

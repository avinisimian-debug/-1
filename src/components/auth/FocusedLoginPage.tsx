"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { StazAuthPanel } from "@/components/auth/StazAuthPanel";
import { LoginLiveStats } from "@/components/auth/LoginLiveStats";
import { LANDING, LANDING_CTA } from "@/lib/landing-copy";
import { useLocale } from "@/context/LocaleContext";

export function FocusedLoginPage() {
  const { t } = useLocale();
  const copy = LANDING.hero;

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#05080a] text-white">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/marketing/staz-hero-cinema.webp"
          alt="Staz AI — כלי AI לתמלול וסיכום פגישות בעברית"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="landing-hero-scrim absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <Logo size="md" tone="dark" href="/" />
          <Link
            href="/#demo"
            className="text-sm text-white/55 transition-colors hover:text-white"
          >
            {LANDING_CTA.secondary}
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-8 sm:py-12">
          <div className="mb-8 max-w-md text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5eead4]">
              {copy.positioning}
            </p>
            <h1 className="mt-3 font-brand text-2xl tracking-tight text-white sm:text-3xl">
              {t.authFocusedHeadline}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {t.authFocusedSubhead}
            </p>
          </div>

          <div className="w-full max-w-md">
            <StazAuthPanel variant="focused" />
            <div className="mt-8">
              <LoginLiveStats />
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-white/40">
            {copy.trustLine}
          </p>
        </div>
      </div>
    </div>
  );
}

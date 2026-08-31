"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LANDING } from "@/lib/landing-copy";
import { SEO_PAGE_LIST } from "@/lib/seo-pages";

export function StazFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030607]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Logo size="md" tone="dark" href="/" />
          <p className="text-sm text-white/40">{LANDING.footer.tagline}</p>
        </div>

        <nav
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.06] pt-8"
          aria-label="מדריכי SEO"
        >
          {SEO_PAGE_LIST.map((page) => (
            <Link
              key={page.slug}
              href={page.path}
              className="text-sm text-white/45 transition-colors hover:text-white/80"
            >
              {page.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

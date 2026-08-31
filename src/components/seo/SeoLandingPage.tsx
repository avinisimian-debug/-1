import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { StazFooter } from "@/components/landing/StazFooter";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import type { SeoPageConfig } from "@/lib/seo-pages";
import { SEO_PAGE_LIST } from "@/lib/seo-pages";
import { cn } from "@/lib/utils";

const primaryCtaClass =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#fff_0%,#e8eeec_100%)] px-6 text-sm font-semibold text-[#04110e] shadow-[0_12px_36px_-16px_rgba(255,255,255,0.35)] transition-all hover:-translate-y-0.5 hover:bg-white";

const ghostCtaClass =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-transparent px-6 text-sm font-semibold text-white transition-all hover:border-white/25 hover:bg-white/6";

type SeoLandingPageProps = {
  page: SeoPageConfig;
};

export function SeoLandingPage({ page }: SeoLandingPageProps) {
  const otherPages = SEO_PAGE_LIST.filter((p) => p.slug !== page.slug);

  return (
    <div className="min-h-[100svh] bg-[#05080a] text-white">
      <header className="border-b border-white/[0.06] bg-[#05080a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo size="md" tone="dark" href="/" />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              התחברות
            </Link>
            <Link href="/#signup" className={cn(primaryCtaClass, "!px-4 !py-2 text-sm")}>
              התחילו חינם
            </Link>
          </div>
        </div>
      </header>

      <main>
        <LandingChapter tone="cool" className="!pt-16 !pb-12 sm:!pt-20 sm:!pb-16">
          <article className="mx-auto max-w-3xl px-4 sm:px-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5eead4]">
              Staz AI · כלי AI לפגישות בעברית
            </p>
            <h1 className="mt-5 font-brand text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/60">{page.subhead}</p>

            <ul className="mt-8 space-y-3">
              {page.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-sm leading-relaxed text-white/75 sm:text-base"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5eead4]"
                    aria-hidden
                  />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/#signup" className={cn(primaryCtaClass, "w-full sm:w-auto")}>
                נסו Staz AI בחינם
              </Link>
              <Link href="/#demo" className={cn(ghostCtaClass, "w-full sm:w-auto")}>
                ראו דמו
              </Link>
            </div>
          </article>
        </LandingChapter>

        <LandingChapter tone="quiet" className="!bg-zinc-950 !py-14 sm:!py-16">
          <div className="mx-auto max-w-3xl space-y-5 px-4 text-base leading-relaxed text-white/65 sm:px-0">
            {page.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </LandingChapter>

        {otherPages.length > 0 ? (
          <LandingChapter tone="cool" className="!py-12 sm:!py-14">
            <nav
              className="mx-auto max-w-3xl px-4 sm:px-0"
              aria-label="מדריכים נוספים על Staz AI"
            >
              <h2 className="font-brand text-xl text-white sm:text-2xl">
                עוד על כלי AI לפגישות בעברית
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {otherPages.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={other.path}
                      className="block rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/70 transition-colors hover:border-[#5eead4]/30 hover:text-white"
                    >
                      {other.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </LandingChapter>
        ) : null}
      </main>

      <StazFooter />
    </div>
  );
}

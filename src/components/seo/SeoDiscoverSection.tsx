import Link from "next/link";
import { LandingChapter } from "@/components/landing/ui/LandingChapter";
import { SectionHeader } from "@/components/landing/ui/SectionHeader";
import { SEO_PAGE_LIST } from "@/lib/seo-pages";

export function SeoDiscoverSection() {
  return (
    <LandingChapter tone="cool" id="discover" className="!py-14 sm:!py-16">
      <SectionHeader
        title="כלי AI לפגישות בעברית — מה Staz עושה"
        subtitle="תמלול, סיכום וסגירת פגישות במקום אחד. בנוי לצוותים בישראל שצריכים החלטות ומשימות — לא רק טקסט."
      />

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 px-4 sm:grid-cols-3 sm:px-0">
        {SEO_PAGE_LIST.map((page) => (
          <article
            key={page.slug}
            className="rounded-2xl border border-[var(--staz-border)] bg-[var(--staz-surface)] p-5 shadow-[var(--staz-shadow-soft)]"
          >
            <h3 className="font-brand text-lg text-[var(--staz-ink)]">{page.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--staz-ink)]/70">
              {page.description}
            </p>
            <Link
              href={page.path}
              className="mt-4 inline-flex text-sm font-medium text-[var(--staz-primary)] hover:underline"
            >
              קראו עוד ←
            </Link>
          </article>
        ))}
      </div>
    </LandingChapter>
  );
}

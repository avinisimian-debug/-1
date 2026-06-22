"use client";

import { BookOpen } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import type { MeetingChapter } from "@/features/transcription/types";

interface ChapterNavigationProps {
  chapters: MeetingChapter[];
  activeChapterIndex: number;
  onChapterSelect: (index: number, timestamp: string) => void;
  variant?: "sidebar" | "topbar";
}

export function ChapterNavigation({
  chapters,
  activeChapterIndex,
  onChapterSelect,
  variant = "sidebar",
}: ChapterNavigationProps) {
  const { t } = useLocale();

  if (chapters.length === 0) return null;

  if (variant === "topbar") {
    return (
      <div className="border-b border-border bg-card/80 px-3 py-2 lg:hidden">
        <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          {t.workspaceChapters}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chapters.map((chapter, index) => (
            <button
              key={`${chapter.timestamp}-${chapter.title}`}
              type="button"
              onClick={() => onChapterSelect(index, chapter.timestamp)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                index === activeChapterIndex
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              <span className="font-mono text-[10px] opacity-70">{chapter.timestamp}</span>
              <span className="ms-1.5">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-4 rounded-xl border border-border bg-card p-3 shadow-sm">
        <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          {t.workspaceChapters}
        </p>
        <nav className="space-y-1">
          {chapters.map((chapter, index) => (
            <button
              key={`${chapter.timestamp}-${chapter.title}`}
              type="button"
              onClick={() => onChapterSelect(index, chapter.timestamp)}
              className={cn(
                "flex w-full flex-col items-start rounded-lg px-2.5 py-2 text-start transition-colors",
                index === activeChapterIndex
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className="font-mono text-[10px]">{chapter.timestamp}</span>
              <span className="mt-0.5 text-xs font-medium leading-snug">{chapter.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

"use client";

import { splitHighlightParts } from "../lib/highlight";

interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
}

export function HighlightedText({ text, query, className }: HighlightedTextProps) {
  const parts = splitHighlightParts(text, query);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.highlight ? (
          <mark
            key={index}
            className="rounded-sm bg-amber-200/80 px-0.5 text-foreground"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  );
}

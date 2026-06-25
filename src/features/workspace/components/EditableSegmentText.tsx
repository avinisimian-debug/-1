"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface EditableSegmentTextProps {
  value: string;
  onChange: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  isActive?: boolean;
}

export function EditableSegmentText({
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  isActive,
}: EditableSegmentTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      dir="auto"
      onCompositionStart={() => {
        isComposing.current = true;
      }}
      onCompositionEnd={(e) => {
        isComposing.current = false;
        onChange(e.currentTarget.textContent ?? "");
      }}
      onInput={(e) => {
        if (!isComposing.current) {
          onChange(e.currentTarget.textContent ?? "");
        }
      }}
      onFocus={onFocus}
      onBlur={(e) => {
        onChange(e.currentTarget.textContent ?? "");
        onBlur?.();
      }}
      className={cn(
        "min-h-[1.5rem] text-start text-[15px] leading-relaxed outline-none",
        "rounded-md px-1 py-0.5 -mx-1",
        "focus-visible:ring-2 focus-visible:ring-amber-400/50",
        "hover:bg-foreground/5",
        isActive && "bg-amber-100/80 ring-1 ring-amber-400/40",
        className,
      )}
    />
  );
}

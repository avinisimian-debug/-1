"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
};

export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  className,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  useEffect(() => {
    if (!autoFocus || disabled) return;
    inputRefs.current[0]?.focus();
  }, [autoFocus, disabled]);

  const emit = useCallback(
    (next: string) => {
      const cleaned = next.replace(/\D/g, "").slice(0, OTP_LENGTH);
      onChange(cleaned);
      if (cleaned.length === OTP_LENGTH) {
        onComplete?.(cleaned);
      }
    },
    [onChange, onComplete],
  );

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    emit((value + pasted).slice(0, OTP_LENGTH));
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, i) => (i === index ? digit : d.trim())).join("");
    emit(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div
      className={cn("flex justify-center gap-2 sm:gap-2.5", className)}
      onPaste={handlePaste}
    >
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          value={digits[index]?.trim() ?? ""}
          aria-label={`ספרה ${index + 1} מתוך ${OTP_LENGTH}`}
          className={cn(
            "h-12 w-10 rounded-xl border text-center text-lg font-semibold tabular-nums outline-none transition-colors sm:h-14 sm:w-12 sm:text-xl",
            "border-white/15 bg-white/[0.06] text-white",
            "focus:border-teal-400/60 focus:bg-white/[0.1] focus:ring-2 focus:ring-teal-400/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}

export { OTP_LENGTH };

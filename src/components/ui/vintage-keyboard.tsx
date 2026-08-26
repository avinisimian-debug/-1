"use client";

/**
 * Vintage interactive keyboard — recreation without 21st.dev API key.
 * Official install when you have API_KEY_21ST:
 *   npx shadcn@latest add "https://21st.dev/r/ayushmxxn/vintage-keyboard"
 *
 * Serenity UI CLI (MIT) does not ship this component yet; 21st CDN source 404s
 * without auth. This is an original retro keyboard matching the public description:
 * nostalgic design + interactive keypress animations.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type KeyDef = {
  id: string;
  label: string;
  width?: number;
  code?: string;
  char?: string;
};

const ROWS: KeyDef[][] = [
  [
    { id: "`", label: "`", char: "`", code: "Backquote" },
    { id: "1", label: "1", char: "1", code: "Digit1" },
    { id: "2", label: "2", char: "2", code: "Digit2" },
    { id: "3", label: "3", char: "3", code: "Digit3" },
    { id: "4", label: "4", char: "4", code: "Digit4" },
    { id: "5", label: "5", char: "5", code: "Digit5" },
    { id: "6", label: "6", char: "6", code: "Digit6" },
    { id: "7", label: "7", char: "7", code: "Digit7" },
    { id: "8", label: "8", char: "8", code: "Digit8" },
    { id: "9", label: "9", char: "9", code: "Digit9" },
    { id: "0", label: "0", char: "0", code: "Digit0" },
    { id: "-", label: "-", char: "-", code: "Minus" },
    { id: "=", label: "=", char: "=", code: "Equal" },
    { id: "Backspace", label: "⌫", width: 1.6, code: "Backspace" },
  ],
  [
    { id: "Tab", label: "Tab", width: 1.4, code: "Tab" },
    { id: "q", label: "Q", char: "q", code: "KeyQ" },
    { id: "w", label: "W", char: "w", code: "KeyW" },
    { id: "e", label: "E", char: "e", code: "KeyE" },
    { id: "r", label: "R", char: "r", code: "KeyR" },
    { id: "t", label: "T", char: "t", code: "KeyT" },
    { id: "y", label: "Y", char: "y", code: "KeyY" },
    { id: "u", label: "U", char: "u", code: "KeyU" },
    { id: "i", label: "I", char: "i", code: "KeyI" },
    { id: "o", label: "O", char: "o", code: "KeyO" },
    { id: "p", label: "P", char: "p", code: "KeyP" },
    { id: "[", label: "[", char: "[", code: "BracketLeft" },
    { id: "]", label: "]", char: "]", code: "BracketRight" },
    { id: "\\", label: "\\", char: "\\", width: 1.2, code: "Backslash" },
  ],
  [
    { id: "Caps", label: "Caps", width: 1.7, code: "CapsLock" },
    { id: "a", label: "A", char: "a", code: "KeyA" },
    { id: "s", label: "S", char: "s", code: "KeyS" },
    { id: "d", label: "D", char: "d", code: "KeyD" },
    { id: "f", label: "F", char: "f", code: "KeyF" },
    { id: "g", label: "G", char: "g", code: "KeyG" },
    { id: "h", label: "H", char: "h", code: "KeyH" },
    { id: "j", label: "J", char: "j", code: "KeyJ" },
    { id: "k", label: "K", char: "k", code: "KeyK" },
    { id: "l", label: "L", char: "l", code: "KeyL" },
    { id: ";", label: ";", char: ";", code: "Semicolon" },
    { id: "'", label: "'", char: "'", code: "Quote" },
    { id: "Enter", label: "Enter", width: 1.8, code: "Enter", char: "\n" },
  ],
  [
    { id: "ShiftL", label: "Shift", width: 2.1, code: "ShiftLeft" },
    { id: "z", label: "Z", char: "z", code: "KeyZ" },
    { id: "x", label: "X", char: "x", code: "KeyX" },
    { id: "c", label: "C", char: "c", code: "KeyC" },
    { id: "v", label: "V", char: "v", code: "KeyV" },
    { id: "b", label: "B", char: "b", code: "KeyB" },
    { id: "n", label: "N", char: "n", code: "KeyN" },
    { id: "m", label: "M", char: "m", code: "KeyM" },
    { id: ",", label: ",", char: ",", code: "Comma" },
    { id: ".", label: ".", char: ".", code: "Period" },
    { id: "/", label: "/", char: "/", code: "Slash" },
    { id: "ShiftR", label: "Shift", width: 2.1, code: "ShiftRight" },
  ],
  [
    { id: "CtrlL", label: "Ctrl", width: 1.3, code: "ControlLeft" },
    { id: "AltL", label: "Alt", width: 1.3, code: "AltLeft" },
    { id: "Space", label: "", width: 6.4, code: "Space", char: " " },
    { id: "AltR", label: "Alt", width: 1.3, code: "AltRight" },
    { id: "CtrlR", label: "Ctrl", width: 1.3, code: "ControlRight" },
  ],
];

function KeyCap({
  def,
  active,
  onPress,
}: {
  def: KeyDef;
  active: boolean;
  onPress: (def: KeyDef) => void;
}) {
  const w = def.width ?? 1;
  return (
    <button
      type="button"
      aria-label={def.label || "Space"}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress(def);
      }}
      className={cn(
        "relative select-none rounded-[6px] border font-mono text-[10px] font-semibold uppercase tracking-wide sm:text-xs",
        "transition-[transform,box-shadow,background-color] duration-75 ease-out",
        "border-[#6b5e4a]/70 bg-gradient-to-b from-[#3f3830] to-[#2a241c] text-[#f3e8d0]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_3px_0_#1a1510,0_5px_8px_rgba(0,0,0,0.35)]",
        active &&
          "translate-y-[3px] from-[#2e2922] to-[#1f1b16] shadow-[inset_0_2px_4px_rgba(0,0,0,0.45),0_1px_0_#1a1510]",
        "hover:from-[#4a4339] hover:to-[#322c24]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a35a]/70",
      )}
      style={{
        width: `calc(${w} * clamp(1.55rem, 3.6vw, 2.35rem))`,
        height: "clamp(1.7rem, 3.8vw, 2.4rem)",
      }}
    >
      <span className="pointer-events-none absolute inset-x-1 top-1 h-[38%] rounded-sm bg-gradient-to-b from-white/10 to-transparent" />
      {def.label}
    </button>
  );
}

export function VintageKeyboard({ className }: { className?: string }) {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [typed, setTyped] = useState("Type something…");
  const [started, setStarted] = useState(false);

  const codeToKey = useMemo(() => {
    const map = new Map<string, KeyDef>();
    for (const row of ROWS) {
      for (const key of row) {
        if (key.code) map.set(key.code, key);
      }
    }
    return map;
  }, []);

  const flash = useCallback((id: string) => {
    setPressed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    window.setTimeout(() => {
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 120);
  }, []);

  const applyKey = useCallback(
    (def: KeyDef) => {
      flash(def.id);
      setTyped((prev) => {
        const base = started ? prev : "";
        setStarted(true);
        if (def.id === "Backspace") return base.slice(0, -1);
        if (def.char != null) return (base + def.char).slice(-80);
        return base;
      });
    },
    [flash, started],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const def = codeToKey.get(e.code);
      if (!def) return;
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      applyKey(def);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [applyKey, codeToKey]);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-4xl flex-col items-center gap-5",
        className,
      )}
    >
      <div
        className="w-full max-w-2xl rounded-lg border border-[#8a7355]/40 bg-[#1a1612] px-4 py-3 font-mono text-sm text-[#f3e8d0] shadow-inner"
        aria-live="polite"
      >
        <span className={cn(!started && "text-[#f3e8d0]/45")}>
          {typed || " "}
        </span>
        <span className="ms-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#c4a35a] align-middle" />
      </div>

      <div
        className={cn(
          "relative w-full overflow-x-auto rounded-[1.35rem] border border-[#a8906e]/55 p-3 sm:p-4",
          "bg-[linear-gradient(165deg,#d8c4a0_0%,#c4ad86_42%,#b79a72_100%)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_50px_-24px_rgba(0,0,0,0.55)]",
        )}
        role="group"
        aria-label="Vintage keyboard"
      >
        <div className="pointer-events-none absolute inset-x-6 top-2 h-px bg-white/35" />
        <div className="flex min-w-[640px] flex-col gap-1.5 sm:gap-2">
          {ROWS.map((row, i) => (
            <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map((def) => (
                <KeyCap
                  key={def.id}
                  def={def}
                  active={pressed.has(def.id)}
                  onPress={applyKey}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] text-[#5c4a35]/80 uppercase">
          Staz · Typewriter
        </p>
      </div>
    </div>
  );
}

/** Matches 21st.dev usage: `import { Component } from "@/components/ui/vintage-keyboard"` */
export function Component() {
  return <VintageKeyboard />;
}

export default Component;

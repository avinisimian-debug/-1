"use client";

/**
 * Glassmorphism trust hero — easemize / 21st.dev
 * Demo export keeps the original portfolio look; StazGlassTrustHero is
 * product-wired (Hebrew trust copy, real CTAs, no fabricated logos/metrics).
 */

import {
  ArrowRight,
  Check,
  Crown,
  Cpu,
  Command,
  FileSearch,
  Ghost,
  Gem,
  Hexagon,
  Languages,
  Lock,
  Play,
  Shield,
  Star,
  Target,
  Triangle,
} from "lucide-react";
import { LANDING } from "@/lib/landing-copy";
import { DEMO_AHA_TIMESTAMP } from "@/features/staz-workspace/data/demo-meeting";
import { cn } from "@/lib/utils";

const CLIENTS = [
  { name: "Acme Corp", icon: Hexagon },
  { name: "Quantum", icon: Triangle },
  { name: "Command+Z", icon: Command },
  { name: "Phantom", icon: Ghost },
  { name: "Ruby", icon: Gem },
  { name: "Chipset", icon: Cpu },
];

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="flex cursor-default flex-col items-center justify-center transition-transform hover:-translate-y-1">
    <span className="text-xl font-bold text-white sm:text-2xl">{value}</span>
    <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 sm:text-xs">
      {label}
    </span>
  </div>
);

const motionStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .glass-fade-in {
    animation: fadeSlideIn 0.8s ease-out forwards;
    opacity: 0;
  }
  .glass-marquee {
    animation: marquee 40s linear infinite;
  }
  .glass-d100 { animation-delay: 0.1s; }
  .glass-d200 { animation-delay: 0.2s; }
  .glass-d300 { animation-delay: 0.3s; }
  .glass-d400 { animation-delay: 0.4s; }
  .glass-d500 { animation-delay: 0.5s; }
`;

/** Original 21st.dev demo (portfolio). Used by /demo/glassmorphism-trust-hero */
export default function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden bg-zinc-950 font-sans text-white">
      <style>{motionStyles}</style>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1920&q=80)",
          maskImage:
            "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 md:pb-20 md:pt-32 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-center space-y-8 pt-8 lg:col-span-7">
            <div className="glass-fade-in glass-d100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md transition-colors hover:bg-white/10">
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 sm:text-xs">
                  Award-Winning Design
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                </span>
              </div>
            </div>
            <h1
              className="glass-fade-in glass-d200 text-5xl font-medium leading-[0.9] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl"
              style={{
                maskImage:
                  "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(180deg, black 0%, black 80%, transparent 100%)",
              }}
            >
              Crafting Digital
              <br />
              <span className="bg-gradient-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">
                Experiences
              </span>
              <br />
              That Matter
            </h1>
            <p className="glass-fade-in glass-d300 max-w-xl text-lg leading-relaxed text-zinc-400">
              We design interfaces that combine beauty with functionality,
              creating seamless experiences that users love and businesses thrive
              on.
            </p>
            <div className="glass-fade-in glass-d400 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]"
              >
                View Portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Showreel
              </button>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-5 lg:mt-12">
            <div className="glass-fade-in glass-d500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">
                      150+
                    </div>
                    <div className="text-sm text-zinc-400">Projects Delivered</div>
                  </div>
                </div>
                <div className="mb-8 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Client Satisfaction</span>
                    <span className="font-medium text-white">98%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-white to-zinc-400" />
                  </div>
                </div>
                <div className="mb-6 h-px w-full bg-white/10" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <StatItem value="5+" label="Years" />
                  <div className="mx-auto h-full w-px bg-white/10" />
                  <StatItem value="24/7" label="Support" />
                  <div className="mx-auto h-full w-px bg-white/10" />
                  <StatItem value="100%" label="Quality" />
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    ACTIVE
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    PREMIUM
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-fade-in glass-d500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">
                Trusted by Industry Leaders
              </h3>
              <div
                className="relative flex overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                }}
              >
                <div className="glass-marquee flex gap-12 whitespace-nowrap px-4">
                  {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                    <div
                      key={`${client.name}-${i}`}
                      className="flex cursor-default items-center gap-2 opacity-50 grayscale transition-all hover:scale-105 hover:opacity-100 hover:grayscale-0"
                    >
                      <client.icon className="h-6 w-6 fill-current text-white" />
                      <span className="text-lg font-bold tracking-tight text-white">
                        {client.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TRUST_ICONS = [Languages, Lock, Shield, FileSearch] as const;

/** Product trust block for landing — glassmorphism look + Staz copy only. */
export function StazGlassTrustHero({
  onPrimary,
  onSecondary,
  className,
}: {
  onPrimary?: () => void;
  onSecondary?: () => void;
  className?: string;
}) {
  const copy = LANDING.trust;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden text-[var(--staz-on-dark)]",
        className,
      )}
    >
      <style>{motionStyles}</style>
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-center space-y-6 pt-2 lg:col-span-6">
            <div className="glass-fade-in glass-d100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                <span className="text-[10px] font-semibold tracking-wider text-[#5eead4] uppercase sm:text-xs">
                  Staz Trust
                </span>
              </div>
            </div>
            <h2 className="glass-fade-in glass-d200 font-brand text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              <span className="block">{copy.headline}</span>
              <span className="mt-2 block bg-gradient-to-br from-white via-white to-[#5eead4] bg-clip-text text-transparent">
                {copy.headlineAccent}
              </span>
            </h2>
            <p className="glass-fade-in glass-d300 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
              {copy.subhead}
            </p>
            {(onPrimary || onSecondary) && (
              <div className="glass-fade-in glass-d400 flex flex-col gap-3 sm:flex-row">
                {onPrimary ? (
                  <button
                    type="button"
                    onClick={onPrimary}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#04110e] transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-[0.98]"
                  >
                    העלו פגישה
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </button>
                ) : null}
                {onSecondary ? (
                  <button
                    type="button"
                    onClick={onSecondary}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    חוו את הדמו
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="space-y-5 lg:col-span-6">
            <div className="glass-fade-in glass-d500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/15 ring-1 ring-teal-400/25">
                    <FileSearch className="h-6 w-6 text-[#5eead4]" />
                  </div>
                  <div>
                    <div className="font-mono-time text-2xl font-bold tracking-tight text-white">
                      {DEMO_AHA_TIMESTAMP}
                    </div>
                    <div className="text-sm text-white/50">רגע ההחלטה בתמלול</div>
                  </div>
                </div>
                <div className="mb-6 flex flex-col items-stretch gap-2 text-center text-sm sm:flex-row sm:items-center sm:justify-between sm:text-start">
                  <span className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 font-medium text-white">
                    החלטה
                  </span>
                  <span className="hidden text-[#5eead4] sm:inline" aria-hidden>
                    →
                  </span>
                  <span className="rounded-xl border border-teal-400/20 bg-teal-400/10 px-3 py-2 font-mono-time text-[#5eead4]">
                    {DEMO_AHA_TIMESTAMP}
                  </span>
                  <span className="hidden text-[#5eead4] sm:inline" aria-hidden>
                    →
                  </span>
                  <span className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-white/70">
                    ראיה
                  </span>
                </div>
                <div className="mb-5 h-px w-full bg-white/10" />
                <ul className="space-y-3">
                  {copy.items.map((item, i) => {
                    const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
                    return (
                      <li
                        key={item.title}
                        className="flex items-start gap-3 text-sm text-white/70"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/8 text-[#5eead4]">
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <span>
                          <span className="font-semibold text-white">
                            {item.title}
                          </span>
                          {" — "}
                          {item.body}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Check className="h-3 w-3 text-teal-400" />
                    מקור אמיתי
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Crown className="h-3 w-3 text-[#5eead4]" />
                    סגירת פגישות
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Compact glass card for the authenticated workbench. */
export function StazGlassWorkCard({
  title,
  body,
  className,
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--line-subtle)] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] p-5 shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-soft)] blur-2xl" />
      <div className="relative z-10 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Shield className="h-4 w-4" />
        </div>
        <div className="min-w-0 text-start">
          <p className="text-sm font-semibold text-[var(--ink-primary)]">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-secondary)]">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

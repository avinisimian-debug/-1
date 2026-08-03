# Staz AI — Phase D0: Premium Design System
**Codename:** Latitude  
**Status:** Spec only — no product UI implementation  
**References:** ChatGPT calm density · Claude reading focus · Notion structure · Linear craft  
**Product promise:** Premium AI workspace for meetings & recordings — never “a transcription site.”

---

## 0. Design ethos

| Rule | Application |
|------|-------------|
| One primary action | Every surface has a single obvious ★ |
| Negative space is intentional | Prefer empty calm over density |
| No kitchen | No provider names, env vars, or quota anxiety in hero chrome |
| Hebrew-first / RTL-native | Logical properties; mirrored layout is first-class |
| WOW or cut | Average → redesign before ship |
| Motion clarifies | Never decorates noise |

**Visual north star:** *A quiet executive desk at dusk — ink surfaces, one intelligent accent, typography that feels commissioned.*

**Avoid (explicitly):**
- Purple-to-indigo AI cliché  
- Warm cream + terracotta “AI blog” kit  
- Hairline newspaper broadsheet density  
- Glow stacks, neon, pill-badge spam, emoji decoration walls  

---

## 1. Color palette

### 1.1 Core tokens (Light — default marketing & reading)

| Token | Hex | Role |
|-------|-----|------|
| `--bg-canvas` | `#F6F5F2` | App / page background — cool bone, **not** yellow cream |
| `--bg-elevated` | `#FFFFFF` | Panels, sheets, modals |
| `--bg-subtle` | `#EEF0EC` | Nested wells, transcript hover base |
| `--bg-mute` | `#E4E7E2` | Disabled tracks, skeletons |
| `--ink-primary` | `#141816` | Primary text (near-black olive ink) |
| `--ink-secondary` | `#5C635C` | Secondary labels |
| `--ink-tertiary` | `#8B928A` | Timestamps, hints |
| `--ink-inverse` | `#F6F5F2` | Text on solid actions |
| `--line-subtle` | `rgba(20,24,22,0.08)` | Dividers |
| `--line-strong` | `rgba(20,24,22,0.14)` | Input borders default |
| `--line-focus` | `#1F6B5C` | Focus ring base |

### 1.2 Brand & accent

| Token | Hex | Role |
|-------|-----|------|
| `--brand-ink` | `#0E1210` | Wordmark, max emphasis |
| `--accent` | `#1F6B5C` | Primary interactive (deep cedar-teal) |
| `--accent-hover` | `#185547` | Hover |
| `--accent-soft` | `rgba(31,107,92,0.10)` | Selected chips, AI rail soft fills |
| `--accent-glow` | `rgba(31,107,92,0.18)` | Focus ring outer |
| `--signal` | `#C4A35A` | Sparse highlight (warm brass — use sparingly on playhead / active word) |

### 1.3 Semantic

| Token | Hex | Role |
|-------|-----|------|
| `--ok` | `#2F6F4E` | Success / ready |
| `--ok-soft` | `rgba(47,111,78,0.10)` | Success wells |
| `--warn` | `#9A6B2F` | Attention |
| `--warn-soft` | `rgba(154,107,47,0.12)` | |
| `--danger` | `#A33B32` | Errors / destructive |
| `--danger-soft` | `rgba(163,59,50,0.10)` | |
| `--info` | `#3D5A6C` | Neutral info |
| `--info-soft` | `rgba(61,90,108,0.10)` | |

### 1.4 Dark mode (Workspace focus / night)

| Token | Hex | Role |
|-------|-----|------|
| `--bg-canvas` | `#0C0E0D` | Stage black-green |
| `--bg-elevated` | `#141816` | Panels |
| `--bg-subtle` | `#1C211E` | Wells |
| `--ink-primary` | `#EDEDEA` | Text |
| `--ink-secondary` | `#A8AEA8` | |
| `--ink-tertiary` | `#6F7670` | |
| `--line-subtle` | `rgba(237,237,234,0.08)` | |
| `--accent` | `#3D9B86` | Lifted teal for dark |
| `--accent-soft` | `rgba(61,155,134,0.14)` | |
| `--signal` | `#D4B46A` | Playhead |

**Landing default:** Dark stage (cinematic) **or** Light calm — **pick one for MVP brand coherence.**  
**MVP decision:** **Landing = dark stage.** **App shell default = light canvas.** Theme toggle optional in settings.

### 1.5 Gradients (atmosphere only — never purple wash)

| Name | Value | Use |
|------|--------|-----|
| `stage-radial` | `radial-gradient(120% 80% at 50% -10%, #1A2A26 0%, #0C0E0D 55%)` | Landing / processing full-bleed |
| `panel-sheen` | `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)` | Dark elevated cards |
| `scrub-fill` | `linear-gradient(90deg, var(--accent) 0%, var(--signal) 100%)` | Progress / timeline (very thin) |

No mesh rainbows. Max **one** atmospheric gradient per viewport.

---

## 2. Typography

### 2.1 Font stack

| Role | Font | Notes |
|------|------|--------|
| **Brand display** | **Fraunces** (opsz 144) | Wordmark & rare marketing display only |
| **UI UI sans** | **Manrope** | En/UI labels, buttons, body |
| **Hebrew UI** | **Heebo** | All Hebrew product UI (weights 400–700) |
| **Mono / time** | **IBM Plex Mono** | Timestamps `12:40`, code-like chips |

**Fallback:** `Heebo, Manrope, "Segoe UI", system-ui, sans-serif`  
**Never ship:** Inter, Roboto, Arial as intended brand faces.

### 2.2 Type scale (desktop)

| Token | Size / Line / Weight | Use |
|-------|----------------------|-----|
| `display-xl` | 56 / 64 / 500 Fraunces | Landing brand only |
| `display-l` | 40 / 48 / 600 Heebo/Manrope | Page hero (app rare) |
| `title-l` | 28 / 36 / 600 | Workspace title |
| `title-m` | 22 / 28 / 600 | Modal titles |
| `title-s` | 18 / 24 / 600 | Section headers in rail |
| `body-l` | 17 / 28 / 400 | Transcript reading |
| `body-m` | 15 / 24 / 400 | Default UI |
| `body-s` | 13 / 20 / 400 | Meta, hints |
| `label` | 12 / 16 / 600 | Uppercase-ish labels; **letter-spacing 0.02em**; avoid full CAPS in Hebrew |
| `mono-s` | 12 / 16 / 500 Plex Mono | Times |

### 2.3 Type scale (mobile)

Downshift: `display-xl` → 40/48 · `title-l` → 22/28 · `body-l` → 16/26  
Minimum body for reading transcript: **16px**.

### 2.4 Voice hierarchy
1. Brand wordmark never fighting a bigger competitor headline  
2. One sentence support max under brand on landing  
3. Rail uses `title-s` + `body-m` only — no decorative quote fonts in product chrome  

---

## 3. Grid system

### 3.1 Breakpoints

| Name | Width | Columns | Margin | Gutter |
|------|-------|---------|--------|--------|
| `xs` | 0–389 | 4 | 16 | 12 |
| `sm` | 390–767 | 4 | 20 | 16 |
| `md` | 768–1023 | 8 | 24 | 16 |
| `lg` | 1024–1279 | 12 | 32 | 20 |
| `xl` | 1280–1535 | 12 | 40 | 24 |
| `2xl` | ≥1536 | 12 | auto (max content) | 24 |

### 3.2 Content max widths

| Surface | Max |
|---------|-----|
| Marketing content | 1120px |
| Landing theatre | full bleed edge-to-edge |
| App shell content | 1440px outer |
| Workspace | fluid 100% of shell (3-pane) |
| Auth card | 400px |
| Modal sm | 420px |
| Modal md | 560px |
| Sheet mobile | 100% width, max 100dvh |

### 3.3 Workspace grid (lg+)

```text
| media 28% | transcript 42% | rail 30% |
min: 280px | min: 360px | min: 320px · max rail 400px
```

Collapses ≤1023 → tabbed single column.

---

## 4. Spacing system

Base unit **4px**. Scale:

| Token | px | Use |
|-------|-----|-----|
| `space-0` | 0 | |
| `space-1` | 4 | Icon gaps |
| `space-2` | 8 | Compact inline |
| `space-3` | 12 | Chip padding y |
| `space-4` | 16 | Default component pad |
| `space-5` | 20 | |
| `space-6` | 24 | Section internal |
| `space-8` | 32 | Between sections |
| `space-10` | 40 | |
| `space-12` | 48 | Major section gaps |
| `space-16` | 64 | Marketing vertical |
| `space-20` | 80 | Landing hero breathing |
| `space-24` | 96 | |

**Touch target:** min **44×44** interactive hit area (`space` padding if visual smaller).

---

## 5. Elevation & surfaces

| Level | Treatment | Use |
|-------|-----------|-----|
| `e0` flat | no shadow, only edge via `--line-subtle` | App canvas |
| `e1` rest | `0 1px 2px rgba(20,24,22,0.04), 0 0 0 1px var(--line-subtle)` | Inputs, list rows |
| `e2` raised | `0 8px 24px rgba(20,24,22,0.08), 0 0 0 1px var(--line-subtle)` | Dropdowns, popovers |
| `e3` float | `0 16px 48px rgba(20,24,22,0.14)` | Modals |
| `e-stage` | no shadow; gradient fill | Landing/processing theatre |

**Radius:**

| Token | px | Use |
|-------|-----|-----|
| `r-s` | 8 | Chips, small controls |
| `r-m` | 12 | Buttons, inputs |
| `r-l` | 16 | Cards, panels |
| `r-xl` | 24 | Sheets, capture stage |
| `r-full` | 999 | Avoid for primary buttons (Linear restraint) — only avatars/progress dots |

**Cards default: OFF in marketing hero.** Cards only when they frame an interaction (workspace panels, library rows).

---

## 6. Motion system

### 6.1 Timing

| Token | ms | Easing | Use |
|-------|-----|--------|-----|
| `motion-instant` | 80 | `ease-out` | Active word highlight |
| `motion-fast` | 160 | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Hover, chip |
| `motion-base` | 240 | same | Panels, tabs |
| `motion-slow` | 400 | `cubic-bezier(0.16, 1, 0.3, 1)` | Theatre crossfade, modal |
| `motion-deliberate` | 600 | same | Processing stage |

### 6.2 Springs (conceptual)
- Prefer ease-out over bounce  
- **No** elastic overshoot on primary navigation  

### 6.3 Standard choreographies

| Name | Description |
|------|-------------|
| `fade-rise` | opacity 0→1 + translateY(6px→0) / 240ms |
| `fade` | opacity only / 160ms |
| `sheet-up` | translateY(100%→0) + fade scrim / 280ms |
| `crossfade` | dual opacity swap / 400ms |
| `type-in` | staggered line reveal 40–60ms per line (landing brief) |
| `pulse-soft` | opacity 0.5↔1 infinite 1.6s (**processing only**, honor reduced-motion) |

### 6.4 Reduced motion
`prefers-reduced-motion: reduce` → all transitions ≤80ms or cut to instant; no infinite loops; theatre uses static frames.

---

## 7. Buttons

### 7.1 Variants

| Variant | Visual | Use |
|---------|--------|-----|
| **Primary** | fill `--accent`, text inverse, r-m, h-44 | ★ one per view |
| **Secondary** | fill transparent, border `--line-strong`, ink primary | Cancel / alternate |
| **Ghost** | no border, hover `--bg-subtle` | Tertiary chrome |
| **Danger** | fill `--danger` or outline danger | Delete |
| **Inverse** | on dark stage: solid near-white fill, ink dark | Landing CTAs |

### 7.2 Sizes

| Size | Height | Pad X | Type |
|------|--------|-------|------|
| sm | 36 | 12 | body-s 600 |
| md | 44 | 16 | body-m 600 |
| lg | 52 | 20 | body-m 600 |

### 7.3 States
Default · Hover (darken 6%) · Active (scale 0.98 optional) · Focus (`0 0 0 3px accent-glow`) · Disabled (opacity 0.4, no pointer)

### 7.4 Icon buttons
44×44 hit; visual 20px icon; ghost/secondary only in chrome.

**Never:** dual equal primary buttons side-by-side.

---

## 8. Inputs

| Spec | Value |
|------|--------|
| Height | 44 (md) |
| Radius | r-m |
| Border | 1px `--line-strong` |
| Focus | border `--accent` + ring accent-glow |
| Background | `--bg-elevated` |
| Placeholder | `--ink-tertiary` |
| Error | border `--danger` + helper text body-s danger |
| Label | body-s 600, ink-secondary, 8px gap above |

**Textarea:** min-height 96, same chrome.  
**Search:** leading icon 16px, clear button when dirty.  
**File drop:** not a generic input — see Capture Stage (elevated pattern).

---

## 9. Cards & panels

| Kind | Spec |
|------|------|
| **Workspace panel** | elevated bg, r-l, e1, pad space-6, no heavy shadow |
| **Library row** | full width, h min 64, hover bg-subtle, no boxed card if list |
| **Artifact preview** | e2, r-l, inner brand header bar accent-soft |
| **Marketing card** | **Avoid** above fold; below fold max 3 equal columns if needed |

---

## 10. Modals, sheets, popovers

| Type | Behavior |
|------|----------|
| **Modal** | Centered, e3, r-xl, scrim `rgba(12,14,13,0.48)`, max-h 85dvh scroll body |
| **Sheet (mobile)** | Bottom dock, grab handle optional thin, full width |
| **Popover** | e2, r-m, 8px offset from anchor |
| **Command palette** | Modal md width, search first, list keyboardable |

**Close:** Esc · scrim click · explicit ghost “סגור”.  
**Always** one primary footer action max.

---

## 11. Toasts

| Spec | Value |
|------|--------|
| Position | Logical bottom-end (RTL-aware) |
| Width | min 280 / max 400 |
| Style | e2, r-m, icon + text + optional action |
| Duration | 4s default · 0 if error with action |
| Types | neutral · ok · warn · danger |
| Motion | fade-rise |

No stacked more than 3; newest replaces noise.

---

## 12. Icons

| Rule | Spec |
|------|------|
| Family | **Lucide** (consistent stroke) |
| Stroke | 1.5–1.75 |
| Sizes | 16 / 20 / 24 |
| Color | currentColor from parent ink/accent |
| Avoid | Multi-color filled icons, emoji as UI icons |

Semantic set (MVP): `play`, `pause`, `upload`, `link`, `mic`, `sparkles` (AI only sparingly), `message-circle`, `share`, `download`, `check`, `x`, `search`, `chevron`, `clock`, `list-checks`, `shield-check`.

---

## 13. Empty states

**Layout (standard component `EmptyState`)**

```text
[ soft illustration OR monoline icon 40 ]
title (title-s)
one sentence (body-m secondary)
★ single primary button
optional text link
```

| Surface | Title HE | Primary |
|---------|----------|---------|
| Library empty | עדיין אין פגישות | העלו הקלטה |
| Chat empty | שאלו על הפגישה | chip suggestions only |
| Search no hits | אין תוצאות | נקו חיפוש |

Illustration style: abstract soft ink strokes — **not cartoon**.

---

## 14. Loading states

| Pattern | Use |
|---------|-----|
| **Skeleton** | Workspace panes, library rows — `--bg-mute` pulse soft (reduced-motion: solid) |
| **Progress rail** | Processing stages (determinate when known) |
| **Streaming text** | Chat answers, landing type-in |
| **Spinner** | Rare — only icon-sized for <1s waits |
| **Theatre stages** | Named HE stages (see Processing screen) |

Never full-page white flash; always keep shell chrome visible inside app.

---

## 15. Error states

| Level | Pattern |
|-------|---------|
| **Field** | Border danger + helper |
| **Inline banner** | danger-soft bar, icon, one line, optional ★ retry |
| **Full panel** | EmptyState composition with recovery |
| **Toast** | Transient non-blocking |

Copy formula: *What happened* · *What to do* · **one CTA**  
No stack traces. No `CONFIG_*` for customers — map to human HE.

---

## 16. Composite patterns (MVP exclusives)

### 16.1 Capture Stage
- Dominant region, r-xl, dashed line-subtle → accent on drag  
- Center: short instruction · secondary: link/record as quiet text buttons under  
- Keyboard: whole stage activatable  

### 16.2 Interactive Timeline / Transcript
- Active line: accent-soft bg + brass signal 2px bar on **inline-start**  
- Timestamp mono-s tertiary  
- Speaker name label 600 body-s  

### 16.3 AI Rail
- Sticky header section tabs if needed — default **Brief**  
- Chat composer docked bottom of rail  
- Grounded answer: paragraph + `[12:41 ↗]` chip  

### 16.4 Product Theatre (Landing)
- Full-bleed stage-radial  
- Split or stacked: media · live rail typing  
- No floating badges on media  

---

## 17. Accessibility

- Contrast body text ≥ 4.5:1 on canvas  
- Focus visible always  
- `aria-live` polite for processing stage changes & chat answers  
- Media control keyboardable  
- Do not convey status by color alone  

---

## 18. Design QA checklist (every screen)

- [ ] One ★ primary only  
- [ ] Works at 390 width  
- [ ] RTL mirror correct  
- [ ] No purple/glow cliché  
- [ ] Empty / loading / error considered  
- [ ] Motion honors reduced-motion  
- [ ] WOW test: investor would not apologize  
- [ ] Feels assistant, not “upload tool”  

---

## 19. Token export map (for later implementation)

When implementing (after approval), map tokens → CSS variables in one root file only.  
No one-off hex in components.

---

**Phase D0 complete.** → See `HI_FI_SCREENS.md` (D1) and `PROTOTYPE.md` (D2).

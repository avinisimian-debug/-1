# Staz AI — Phase D1: High-Fidelity Screen Specs
**Fidelity:** Production-ready visual specification (not wireframes)  
**Pair with:** `D0_DESIGN_SYSTEM.md` tokens  
**Devices:** Desktop **1440×900** · Mobile **390×844**  
**Status:** No React implementation until prototype approval  

Each screen includes: purpose, layout geometry, type/color map, states, WOW bar, redesign trigger.

---

## Global chrome (in-app)

### Desktop app shell
- Height top bar: **56px**  
- BG: `--bg-elevated` · bottom border `--line-subtle`  
- Wordmark **STAZ** Fraunces 20px tracking tight · logical start  
- Nav text body-m: בית · ספרייה · (settings icon end)  
- Active nav: accent ink + 2px underline accent at bottom of bar  
- No sidebar for MVP (Linear-thin top nav — lowers cognitive load)

### Mobile app shell
- Top 52px + optional bottom tab bar **only if** needed; MVP: top only + hamburger-free 3 links overflow menu  
- Prefer: brand · page title · avatar  

---

# L1 — Landing (Desktop)

## Purpose
30-second proof that Staz is an executive AI workspace.

## Composition (single viewport)
```
Y0–56     transparent/light border over stage — STAZ | lang | התחברות | ★ התחילו
Y56–100%  stage-radial full bleed
          vertical center-bias content block max-w 1120 centered
```

### Content block (logical)
1. **Wordmark** Fraunces display-xl `--ink-inverse` (≈56px) — dominant  
2. **Support** one line body-l secondary `#A8AEA8` — max 70 chars HE  
   “יוצאים מהפגישה עם החלטות ומשימות — לא עם קובץ טקסט.”  
3. **CTA row**  
   - ★ Primary Inverse lg “נסו עכשיו”  
   - Ghost inverse “ראו איך זה עובד” (smooth scroll to theatre if below — but theatre is **in first viewport**)  
4. **Product Theatre** (occupies ~48–55% viewport height)  
   - Full width of content max, r-xl, e-stage inner panel `#141816`  
   - Grid 55% media | 45% AI rail  
   - Left: muted video/poster + transport thin  
   - Active transcript line under player (2 lines max visible) with signal bar  
   - Right: “Staz” label mono · streaming brief lines · 2 decision pills · 3 action checks appearing  

### Below fold (one section only)
- Section title title-m inverse or on light band switch  
- MVP: soft transition to light canvas for “איך זה עובד” **3 steps horizontal** — no feature card grid of 12  

### Footer
Minimal line: פרטיות · תנאים · ©  

## Visual finish
- Grain optional ≤3% opacity  
- Soft vignette on stage edges  
- Playhead uses `--signal` 2px  

## States
| State | Treatment |
|-------|-----------|
| Demo playing | type-in lines cascade |
| Demo paused | freeze frame + soft play affordance |
| Prefers reduced motion | static final brief, no loop |

## WOW bar
User understands product **before** reading any bullet.

## Redesign if
Looks like generic SaaS hero + stock illustration. **Must** show live assistant rail.

---

# L2 — Landing (Mobile)

## Composition
```
Pad 20
Brand 40px Fraunces
Support 2 lines max
★ נסו עכשיו full width lg
Ghost secondary full width
Theatre stacked: media 200h → rail auto height min 220
```

Theatre border r-l · no side-by-side.

## WOW bar
Same as desktop; theatre scrolls slightly but first 30s still visible with brand+CTA+start of media without hunting.

---

# A1 — Login

## Desktop
Centered on soft canvas (light) **or** dual pane: left stage brand 40% | right form 60%.  
**MVP pick:** single centered card — lower cost, calmer if landing already wowed.

### Card 400px e2 r-xl pad 32
- STAZ Fraunces 28  
- Title “ברוכים השבים” title-m  
- ★ Google button full width (neutral elevated border, Google color mark 18px)  
- Divider “או”  
- Email input  
- Name optional collapse  
- ★ המשך secondary only if email path; Google remains primary  

Trust line body-s tertiary under.

## Mobile
Card full width margins 20 · same stack.

## WOW bar
Feels inevitable, not a marketing form.

## Redesign if
Looks like Firebase template or multi-field enterprise form.

---

# O1–O3 — Onboarding (overlays on demo workspace)

## Visual
Scrim 48% · spotlight radius r-l cutout · coach card e3 r-l pad 20 max-w 320  
Steps 1/3 · title-s · body-m · ★ הבא · ghost דלג  

### Step content (HE)
1. “לחצו על משפט — קופצים לרגע בו זה נאמר.”  
2. “כאן Staz מסכם החלטות ומשימות.”  
3. “שאלו כל שאלה על הפגישה.” → then prompt capture  

## Mobile
Coach sheet bottom sheet-up.

## WOW bar
Learning by demo workspace, not slides.

---

# H1 — Home / Capture

## Desktop (light canvas)
```
Top shell
Greeting body-m secondary “שלום, {name}” optional one line
If history: Continue strip max 1 row (title · ready · open →) 

★ CAPTURE STAGE
  height min 280 / max 360
  width 100% max 880 centered
  border dashed line-strong → accent on drag
  icon upload 32 muted
  title-s “העלו הקלטה”
  body secondary “או גררו לכאן”
  row of 3 ghost text buttons: קישור · הקלטה · פגישה חיה(tertiary)
```

No plan badge, no quota hero.

## Mobile
Capture stage full width · continue horizontal snap cards 280w.

## States
Empty / dragging (accent) / error (danger banner above stage)

## WOW bar
The stage feels like a **desk**, not a form field.

## Redesign if
 competes with multi-widget dashboard.

---

# P1 — Processing Theatre

## Full-bleed stage-radial (dark) — same DNA as landing

```
Centered column max 480
STAZ monomark small opacity 0.7
title-m inverse “Staz מקשיב”
Stage list:
  (done check) מקשיבים
  (active pulse) מבינים
  (todo) מארגנים החלטות
Progress thin scrub-fill bar under
body-s “אפשר לסגור — נעדכן כשמוכן”
```

No spinner death ring as hero.

## Mobile
Same stack full bleed pad 24.

## Crossfade
Final stage holds 300ms → workspace fade-rise.

## WOW bar
Waiting feels like competence.

## Redesign if
Generic “Loading…” with percent lies.

---

# W1 — Workspace default (Desktop) — CORE

## Layout 1440
```
Shell 56
Subheader 52: back library · editable title · status pill Ready · ★ שתף
Body calc(100vh-108px) three panes with 1px lines
```

### Pane Media 28%
- pad 16  
- Video/audio visualizer area r-l bg-subtle aspect ~16/10  
- Transport: play 44 · time mono · slim scrub with signal head  
- Optional playback rate popover  

### Pane Transcript 42%
- Search sticky top h 48  
- Scrollable body pad 16 20  
- Lines: time | speaker | text body-l  
- Active line accent-soft + signal bar inline-start 2px  

### Pane AI Rail 30%
- Segmented control or vertical section: **תמצית** (default) | החלטות | משימות  
- Brief: 5–8 lines body-m · generous measure  
- Decisions list with ↗ time chips  
- Actions checklist-style (non-interactive checkboxes OK as visual only MVP)  
- Divider  
- Chat composer dock: suggestions row + input + ★  

## Micro polish
- Soft scrollbar  
- Pane resize **not** in MVP (fixed %)  
- Title truncate  

## WOW bar
Feels like Claude + Descript fused — **assistant first**.

## Redesign if
Equal tabs of 7 competing tools; transcript-first without rail; boxed Bootstrap cards.

---

# W2 — Workspace Chat (Desktop)

Same shell; rail locks to **Chat mode** expanded:
- Above composer: scroll messages  
- User bubble: subtle bg-subtle r-m pad 12  
- Assistant: plain full width ink · grounded chips under  
- Loading: three-pulse soft or streaming caret  

Suggested chips only when empty.

## WOW bar
Answer cites `12:41 ↗` and jump works.

---

# W3 — Workspace Mobile

```
Shell
Compact media 160h sticky
Scrub full width
Tabs 3 equal: סיכום | תמלול | שאל  (accent underline)
Content area flex 1 scroll
Chat tab: composer sticky bottom safe-area
★ שתף in header
```

## WOW bar
One-handed path: open → read brief → ask → share.

---

# S1 — Share / Export sheet

## Desktop modal 560
- Header “שתף סיכום”  
- Artifact card preview: brand strip accent · title · date · 4-line brief excerpt · STAZ mark  
- ★ העתק סיכום  
- Secondary הורד PDF  
- Ghost הורד תמלול  
- Close  

## Mobile sheet
Same content bottom sheet.

## WOW bar
Artifact looks board-ready **before** download.

## Redesign if
File-format dump list only.

---

# Lib1 — Library

## Desktop
Max content 880 centered  
Header title-m “ספרייה” · ★ חדש  
Search full width  
Rows: title · date mono · status dot · chevron  
Hover bg-subtle  

## Empty
EmptyState pattern.

## Mobile
Full bleed rows 72h min.

---

# E1 — Error / Failed processing

Dark or light consistent with flow:  
Icon danger · title “לא הצלחנו לסיים” · body one recovery · ★ נסו שוב · ghost תמיכה  

Never raw API strings.

---

# Visual reference frames (asset checklist)

Produce or commission these **PNG/WebP mockups** at 2x before engineering:

| ID | File suggestion | Size |
|----|-----------------|------|
| L1 | `mock-landing-desktop.png` | 2880×1800 |
| L2 | `mock-landing-mobile.png` | 780×1688 |
| A1 | `mock-login.png` | 2880×1800 |
| H1 | `mock-home-capture.png` | 2880×1800 |
| P1 | `mock-processing.png` | 2880×1800 |
| W1 | `mock-workspace.png` | 2880×1800 |
| W2 | `mock-workspace-chat.png` | 2880×1800 |
| W3 | `mock-workspace-mobile.png` | 780×1688 |
| S1 | `mock-share.png` | 2880×1800 |
| Lib1 | `mock-library.png` | 2880×1800 |

Generated previews for key frames may sit alongside this doc in `docs/design/mockups/`.  
**Approval is based on fidelity of art direction + this spec**, not engineering.

---

## Copy deck (MVP HE — finalist short)

| Key | Copy |
|-----|------|
| Landing support | יוצאים מהפגישה עם החלטות ומשימות — לא עם קובץ טקסט. |
| CTA primary | נסו עכשיו |
| Login title | ברוכים השבים |
| Capture title | העלו הקלטה |
| Processing | Staz מקשיב |
| Stage1–3 | מקשיבים · מבינים · מארגנים החלטות |
| Rail brief | תמצית מנהלים |
| Chat placeholder | שאלו על הפגישה… |
| Chip1–3 | מה הוחלט? · מה המשימות? · טיוטת מייל לצוות |
| Share | שתף סיכום · העתק סיכום |
| Share secondary | הורד PDF |

---

## Screen-by-screen average triggers (auto redesign)

| If you see… | Redesign to… |
|-------------|--------------|
| Purple gradient CTA | Accent solid cedar-teal |
| Grid of 6 feature icons | Theatre proof |
| Sidebar dashboard | Top shell + capture stage |
| 7 result tabs equal | 3-pane assistant |
| Spinner only processing | Named stages theatre |
| English ops strings | Full HE calm copy |
| Price banner on home | Settings only |

---

**Phase D1 complete.** → Interactions in `D2_PROTOTYPE.md`.

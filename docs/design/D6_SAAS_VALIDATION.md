# Staz AI — Phase D6: SaaS Product Validation
**Status:** Product validation only — no engineering, no React  
**Goal:** Build a product people **pay for**, not only a beautiful demo  
**Inputs:** Latitude design (D0–D2), existing product capabilities, competitor reality  

---

## Executive verdict

| Question | Answer |
|----------|--------|
| Is the design direction right? | **Yes** — workspace beats “transcription site” |
| Will beauty alone convert? | **No** — payment needs a recurring **job-to-be-done** |
| Who pays first? | **Hebrew-speaking B2B operators who live in meetings** (not students) |
| What to sell? | **Time + decisions quality after meetings** — not minutes of audio |
| Is current MVP design monetizable? | **Yes, if scope is ruthlessly fixed** around post-meeting executive output |

---

## 1. Who is the first ideal customer?

### Primary ICP (pay first)
**“Operator-Executive” in Hebrew-speaking SMBs / agencies**

| Attribute | Definition |
|-----------|------------|
| **Title archetypes** | CEO / founding GM · Sales manager · Management consultant · Agency account lead · Professional services partner |
| **Not first** | Student, casual content creator, pure developer playground user |
| **Context** | 5–20 meetings/week; decisions get lost in WhatsApp + memory |
| **Language** | Works in **Hebrew** (often mix HE/EN); English-only tools feel second-class |
| **Budget** | Can expense $10–30/seat/mo without procurement theatre |
| **Trigger** | Missed action item cost real money / client trust / team confusion |
| **Current stack** | Zoom/Meet + Notion/Google Docs + WhatsApp; maybe Fireflies/ChatGPT ad hoc |

### Why this ICP (not others)

| Persona | Why not #1 now |
|---------|----------------|
| Student | High curiosity, low willingness to pay, low meeting density |
| Content creator | Needs Descript-class edit; different product |
| Enterprise L&D | Long sales cycle; compliance; not MVP |
| Solo creator English global | Crowded commodity STT; no Hebrew wedge |

### Ideal customer profile (one sentence)
> A Hebrew-speaking manager who finishes back-to-back calls and needs a **board-ready brief + owners + sendable update** before the next meeting starts.

### Design implication
Every default in onboarding, copy, sample demo, and empty states should speak to **this manager** — not a student “trying transcription.”

---

## 2. Single strongest paid use case

### The use case
**Post-meeting executive closeout in under 5 minutes.**

User ends a call (or uploads recording) → Staz produces:

1. **תמצית מנהלים** (what mattered)  
2. **החלטות** (what was agreed)  
3. **משימות עם הקשר** (who / what / when if said)  
4. **משהו שאפשר לשלוח** (copy email / team update)  

…grounded in moments they can **jump to and trust**.

### Why people open the wallet
- Commodity: “transcript text” (TurboScribe, free Whisper)  
- Paid: **decision clarity + time reclaim + professional output**  
- Hebrew + calm workspace reduces “open ChatGPT and paste for 20 minutes”

### Price story (positioning, not pricing engineering)
They don’t buy STT minutes. They buy:

> “אני לא מאבד החלטות אחרי פגישות.”

### Weak use cases (don’t market as #1)
- Pure lecture archival without actions  
- Live bot novelty without digest  
- Chat as unrestricted ChatGPT  

---

## 3. Aha moment (first 5 minutes)

### Definition
The aha is **not** “upload succeeded.”  
The aha is:

> **“This brief is what I would have written myself — and I can click into the exact moment it was decided.”**

### Timed path (cold → aha)

| Time | Experience | Signal |
|------|------------|--------|
| 0:00–0:30 | Landing theatre: demo brief writes itself | Emotional “this is an assistant” |
| 0:30–1:00 | Start / demo workspace or first short upload | Commitment |
| 1:00–3:30 | Processing theatre (honest wait for real file) | Trust if stages feel intelligent |
| 3:30–5:00 | Open rail: brief + 1 decision ↗ time jump works | **AHA** |

### Measurement (later analytics)
- % sessions with **time-jump click** within first open of workspace  
- % sessions that **copy summary** or open share in first session  
- % that send **≥1 chat** with grounded answer  

Aha proxy: **time-jump OR copy summary within 5 min of workspace ready.**

### Design implication
Demo sample must contain **a clear decision + timestamp** and force one guided ↗ in onboarding.  
If onboarding skips that, aha fails.

---

## 4. What prevents return after first use

| Barrier | Why it kills retention | Design / product fix |
|---------|------------------------|----------------------|
| **One-off novelty** | “Cool once” then back to WhatsApp | Make **Day-1 reminder** + empty home = “המשך” not dead upload only |
| **No second meeting that week** | Habit never forms | ICP must be high-meeting; marketing attracts them |
| **Output not sendable** | Transcript stays in app | Share sheet + copy email must be *easier than* rewriting |
| **Trust fails once** | Hallucinated decision → churn forever | Grounding + modest claims; never invent owners |
| **Friction to import** | Hard to get next recording in | One-click capture; later calendar; keep Live secondary but real |
| **History feels empty / local mess** | Can’t find last week’s client call | Named library + search (minimal is enough) |
| **Quota / paywall mid-magic** | Resentment | Gate **after** aha, clearly |
| **Mobile failure** | Managers on phone between meetings | Mobile brief + copy must work |
| **Hebrew quality poor on real accent** | “Doesn’t get us” | Pipeline quality = product; sample truth in demo |
| **No reason to open without new file** | App becomes archive | Home “open actions / last brief” even without upload |

### Top 3 churn killers for Staz specifically
1. Beautiful UI + **useless brief** (generic AI summary)  
2. User can’t get file in **faster than ChatGPT paste**  
3. No **habit hook** between meetings  

---

## 5. Retention loop

### Day 0 — Activate + Aha
**Jobs**
- Understand assistant position (landing theatre)  
- Reach workspace with sample **or** first real short recording  
- Complete **one** of: time-jump · copy brief · chat “מה הוחלט?”  

**Success state**
Account exists · at least one completed “meeting object” · aha event fired.

**Do not** force full profile, calendar, team invite, or billing on Day 0.

---

### Day 1 — Prove it on *their* work (if Day 0 was demo)
**Jobs**
- Upload/import **real** meeting (yesterday’s call)  
- Send one recap (email copy / WhatsApp paste) to a real person  

**Product touches**
- Soft prompt on home: “העלו פגישה אמיתית — 2 דקות”  
- Optional single email: “הסיכום הראשון שלכם מחכה” with deep link  

**Success state**
Real meeting object + external share action (copy counts).

---

### Day 7 — Habit of closeout
**Jobs**
- Second (or third) real meeting closed out in Staz  
- Use **library** to reopen a client/project  

**Product touches**
- Home “המשך” + last decisions strip  
- Optional weekly pulse later; **MVP: in-app only** is enough if usage weekly  

**Success state**
≥2 real meetings · ≥1 return visit from library · brief not only from first session.

---

### Day 30 — Paid loyalty
**Jobs**
- Staz is default after important meetings  
- User would feel pain if removed (lost decisions, lost search)  

**Product touches**
- Visible library value (search)  
- Consistent quality  
- Clear Pro value: longer/more meetings, export pack, Live bot if ready  

**Success state**
Paying or clearly blocked by value wall they’ve already felt.

---

### Loop diagram

```text
Meeting ends
    → Capture (upload/bot)
    → Ready workspace
    → Approve brief in 2 min
    → Send / assign (copy)
    → Library stores truth
    → Next meeting prompts “המשך / העלה”
    → (week) Re-open past decision via search/chat
```

**Retention is the loop of closeout — not streak gamification.**

---

## 6. Minimum features for a paid subscription

### Principle
Charge for **ongoing capacity + outcomes**, not for “seeing the UI once.”

### Free (must still deliver aha)
| Included | Why |
|----------|-----|
| Landing + demo workspace | Trust + aha |
| Limited real meetings / minutes per month | Try on real work |
| Brief + decisions + actions + grounded chat on those | Core product |
| Copy summary | Virality / habit |
| Mobile readable workspace | Real life |

### Paid (minimum worth money)
| Feature | Payment psychology |
|---------|-------------------|
| **Enough meetings/minutes for a real job** | Primary — operators hit wall week 2 |
| **Full export pack** (exec PDF + transcript) | Artifact pride |
| **Library history retained** (not disposable) | Compound value |
| **Priority / faster path reliability** (if differentiated later) | Optional year 1 |
| **Live meeting capture (bot)** as Pro when reliable | Expansion, not Day-0 gate if flaky |

### Explicitly *not* required to charge
- Team seats v1  
- CRM sync  
- Clip editor  
- Cross-meeting org brain  
- White-label  
- API access  

### Packaging recommendation (conceptual)
**One clear Pro** for operators (“סביבת עבודה לפגישות”)  
Avoid 3-tier feature matrices in year one.

---

## 7. What NOT to build in the next 90 days

Hard freeze (unless revenue emergency):

| Do not build | Why |
|--------------|-----|
| Multi-team roles / SSO / SCIM | Enterprise, not ICP-1 |
| Descript-class media editing | Wrong product |
| Full CRM / HubSpot deep sync | Integration tar pit |
| Cross-library multi-meeting RAG “ask all history” | Quality + cost risk before single-meeting excellence |
| Public marketplace / templates store | Distraction |
| Live real-time mid-call copilot | Latency + trust + hard |
| Slack/Notion full product suite | One export path max if any |
| Student campus plans | Wrong ICP |
| Complex analytics dashboards | Vanity |
| Rebuilding Live Hub as second product | Keep tertiary until closeout loop is paid |
| Custom model training UI | Not needed |
| Heavy settings / notification center | Empty promises |
| Redesign of billing into 3 “Enterprise” tiers | Confusion |

### 90-day product theme
> **Nail Hebrew post-meeting closeout so hard that paid users refuse to go back.**

---

## 8. Onboarding review — will a cold user get value without explanation?

### Current designed onboarding (D1/D2)
Landing theatre → login → ≤3 coach marks on demo → capture real file.

### Verdict
| Lens | Score | Notes |
|------|-------|-------|
| Value *visible* without reading | **Strong** IF landing theatre ships as designed | Demo rail = product explanation |
| Value *understood* without coach marks | **Good** | Theatre carries it |
| Value *believed* on *their* data | **Fragile** | Requires Day 0 real file or strong Day 1 |
| Zero-explanation upload-only entry | **Fail** | Pure upload = transcription tool again |

### Gaps to fix **before** engineering (spec tweaks, not code)

1. **Default first experience = demo workspace already “ready”** — not empty capture  
2. **Forced-optional one click:** “ראו רגע החלטה” (auto ↗ once)  
3. **Sample is ICP-real:** sales/exec Hebrew meeting — not generic lecture  
4. **Guest path keeps result** when they signup (if product allows) — avoid re-upload death  
5. **No env / bot ops / pricing wall** in first path  

### Pass/fail sentence
> A cold user should be able to mute the soundtrack of the landing page and still point at the screen and say *“it wrote what mattered from the meeting.”*

If only the headline explains, **onboarding fails.**

---

## 9. Workspace review — AI assistant vs transcript hero?

### Designed structure (D1)
3-pane: media | transcript | **AI rail default open on Brief**  
Mobile tabs default **סיכום** first.

### Verdict
| Surface | Current hero risk |
|---------|-------------------|
| Spec intent | **Assistant is hero** |
| If engineered badly as 7 transcript tabs | **Transcript becomes hero again** |
| If rail is collapsible default-closed | **Transcript wins** |
| If brief is short generic LLM blob | **Neither — product loses** |

### Hard product rules (lock before React)

1. **Desktop:** AI rail **open by default**; width ≥30%  
2. **Mobile:** default tab **סיכום**, not תמלול  
3. **Title bar status** is about “מוכן לסיכום / משימות” not “Transcription complete”  
4. **Primary CTA sticky:** העתק סיכום / שאל — not Download SRT  
5. Transcript is **evidence layer** (trust + jump), not the brand promise  
6. Chat sits **inside** assistant rail — not a buried secondary page  

### North-star sentence
> Staz is an executive assistant that **cites** the transcript — not a transcript viewer that **offers** AI.

---

## 10. Final MVP scope before engineering

### Product name (experience)
**Staz AI — workspace for meetings & recordings**  
(Internal: “Closeout MVP”)

### In scope (build this)

| # | Capability | Why paid SaaS |
|---|------------|---------------|
| 1 | World-class landing + product theatre (demo) | Acquisition + aha seed |
| 2 | Auth (simple) | Account = retention unit |
| 3 | Interactive onboarding on **demo ready workspace** | Aha without waiting |
| 4 | Capture: upload (+ optional URL if reliable) | Day 1 real work |
| 5 | Processing theatre (honest states) | Trust |
| 6 | Premium workspace: media + timeline sync + AI rail | Core |
| 7 | Brief · decisions · actions (structured) | What they pay for |
| 8 | Grounded chat **this meeting only** | Assistant feel |
| 9 | Time-jump from rail/chat → transcript | Trust mechanism |
| 10 | Share sheet: copy brief + exec PDF | Sendable outcome |
| 11 | Thin library + search titles | Return path |
| 12 | Mobile-class brief + chat + share | Manager reality |
| 13 | Free limits + one Pro tier that unlocks capacity/export/history | Monetization |
| 14 | Calm Latitude UI (D0) | Willingness to pay & brand |

### Out of scope (MVP)

Everything in §7, plus: team features, deep Live redesign, multi-meeting chat, CRM, editor, marketplace.

### Live bot?
| Decision | Rationale |
|----------|-----------|
| **Not required for first paid MVP** | Reliability + ICP can start with upload |
| **May ship soft** if already reliable | Pro differentiator after closeout works |
| Never block aha on bot setup | Bot friction kills Day 0 |

### Quality bar (non-features but scope)
- HE copy complete on MVP path  
- No provider names in UI  
- Grounding attempted; errors human  
- P95 path feels designed on mobile  

### Success criteria to call MVP “done” (business)

| Metric | Directional target |
|--------|-------------------|
| Aha rate (jump or copy in first ready session) | ≥35% of activated |
| Day-7 return | ≥25% of activated with ≥1 real meeting |
| Free→paid among weekly active operators | enough to learn (track; don’t optimize vanity) |
| Qualitative | “אני שולח את זה לצוות” unprompted |

---

## Final implementation order (still no React)

Engineering may start **only after** explicit:  
`Prototype approved — implement UI`  
and acceptance of this D6 scope.

### Wave 0 — Foundations of product (not features)
1. Confirm ICP copy + **demo script** (Hebrew executive sample with decision)  
2. Finalize Figma clickable prototype = D1/D2 + D6 rules (rail default, mobile סיכום first)  
3. Define Free/Pro limits in plain language (one screen in settings later)  

### Wave 1 — Experience spine (must feel world-class)
1. Design tokens (Latitude) in app foundation  
2. App shell (top nav only)  
3. Landing + theatre  
4. Auth minimal  
5. Demo workspace path + 3-step onboarding focused on ↗ + brief  
6. Processing theatre  
7. Workspace 3-pane + timeline sync  
8. AI rail (brief/decisions/actions)  
9. Grounded chat  
10. Share sheet (copy + PDF)  
11. Capture home  
12. Library thin  
13. Mobile parity for brief/chat/share  
14. Paywall only after aha path (capacity/export)  

### Wave 2 — After paid signal (post-MVP)
- Live bot reliability as Pro  
- Calendar one-way later  
- Cross-meeting ask only when single-meeting quality is boringly good  

### Dependency rule
**Do not polish Live Hub / admin / integrations until Wave 1 aha + share loop is production-quality.**

---

## Decision log (locked for engineering)

| Decision | Value |
|----------|--------|
| First ICP | HE operator-executive / sales / consultant |
| Paid job | Post-meeting closeout |
| Aha | Brief feels self-written + time jump |
| Retention core | Closeout loop + library return |
| Hero surface | AI rail / סיכום |
| Transcript role | Evidence |
| 90-day freeze | Teams, editor, RAG-all, CRM, Live-as-center |
| Monetization | One Pro: capacity + export + retained library |

---

## What “SaaS people pay for” means for Staz

Not:
- prettier upload box than competitors  

Yes:
- **A default ritual after every important meeting**  
- in Hebrew  
- that produces **sendable truth**  
- with **citeable moments**  
- in a calm workspace they **trust at 23:40 after a hard day**

---

**Phase D6 complete.**  
No React. No implementation.

### Next human gates
1. Approve / amend ICP + paid use case + MVP scope above  
2. Finish Figma prototype against D6 rules  
3. Say **`Prototype approved — implement UI`** to unlock Wave 1 engineering order above  

If amending, change **ICP or paid use case first** — UI will follow.

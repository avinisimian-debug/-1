# Staz AI — Product Transformation Plan

**Date:** 19 August 2026  
**Scope:** Audit of the existing codebase. **No implementation in this document.**  
**North star:** Make Hebrew-speaking operators **pay for Staz because it reliably saves them time after meetings.**

Optimization order (non-negotiable):

**VALUE → TRUST → REPEAT USAGE → PAYMENT**

Do not optimize for feature count. Do not delete working pipelines in the first engineering phases. Hide, freeze, or simplify surfaces that steal attention from the closeout loop.

---

## 1. Executive diagnosis

Staz already has the **spine of a paid meeting product**: upload → STT → GPT closeout → 3-pane workspace → decision chips with timestamp jump → copy/PDF share → local history.

It does **not** yet have a product operators will **pay to keep using**.

The gap is not “missing AI features.” It is four structural lies:

1. **The aha is behind an account wall.** Unauthenticated visitors see a landing theatre + signup. They cannot click a decision and jump. Guest transcription exists (`/api/transcribe/guest`) but the landing that used it (`LandingHero`) is unmounted. The first interactive aha requires name + email with **no verification**.
2. **Pro does not buy a cloud library.** History is `localStorage` (`meetscribe-history`). Pro only raises the cap (5 → 50) on **this browser**. Plan/PayPal state *does* sync via Blob `meetscribe/users.json`. A paying user who opens Staz on another device sees an empty library. That kills the reason to pay.
3. **The product still presents as a transcription toolkit.** Live Hub, global AI FAB, integrations, webhooks, AdSense, Tidio, onboarding checklists, Enterprise pricing, speaker analytics on the Live workspace, and Pro-only “insights extras” (sentiment, chapters, quotes, risks) compete with the one job: **executive closeout in under 5 minutes**.
4. **Trust is unearned at the two moments that matter.** Auth is impersonation-by-email (Credentials provider accepts any name+email). Timestamp mapping **falls back to mid-meeting** when the match is weak. One wrong jump after a real client call ends the relationship.

**Verdict:** Wave 1 UI made Staz *look* like an assistant. Persistence, gating, billing copy, and attention still make it a **transcription demo with a prettier shell**. Transform by concentrating the loop, putting aha before payment, storing meetings in the cloud for Pro, and making jump + brief **boringly true**.

---

## 2. Product strategy

### Promise

> After a meeting, Staz turns the conversation into a clear executive closeout in under 5 minutes.

Not: minutes of audio. Not: chatbot. Not: meeting bot novelty.

### Buyer

Hebrew-speaking operator who lives in meetings:

CEO / founding GM · sales manager · agency owner · consultant · account manager · SMB operator.

Not first: students, content editors, enterprise L&D.

### Job to be done

Finish a call → know **what was decided**, **what must happen**, **who owns it**, **what to remember**, **what to send**, **where in the recording that happened**.

### Primary loop (only loop that may grow)

```
MEETING
→ UPLOAD / RECORD
→ PROCESSING (honest wait)
→ EXECUTIVE BRIEF
→ DECISIONS
→ ACTION ITEMS
→ TIMESTAMP JUMP
→ SHARE (copy + professional PDF)
→ SAVE TO LIBRARY
→ RETURN FOR NEXT MEETING
```

Every screen, nav item, paywall, and email must either **serve this loop** or **get out of the way**.

### Dual aha

1. **Value aha:** “This is exactly what I would have written myself — in less than 5 minutes.”
2. **Trust aha:** “I click a decision/action and land on the exact moment.”

If (2) is wrong, (1) becomes a hallucination. Never ship jump chips that guess.

### 90-day product rule

Ship a **ritual after important meetings**, in Hebrew, with sendable truth and citeable moments.  
Do not ship teams, CRM, transcript editor, cross-meeting RAG, marketplace, or Live-as-the-center.

---

## 3. Current strengths

Tied to the north star: these already save (or can save) operator time.

| Strength | Where | Why it matters |
|----------|--------|----------------|
| Closeout payload exists for Free | `analyze-transcript.use-case.ts` + GPT-4o JSON: headline, executive bullets, decisions, action items (task/owner/deadline), language-matched to transcript | This *is* the product. Do not bury it under extra insight types. |
| Hebrew-aware analysis prompt | `analysis-prompts.ts`: same language as transcript; “never invent facts” | Required for Israeli operators. |
| Premium workspace + AI rail | `PremiumWorkspace`, `AiAssistantRail`: תמצית / החלטות / משימות / שאלו | Correct information architecture for the loop. |
| Time-jump UI | Decision/action chips → `seekTimestamp` + timeline highlight | Second aha is designed, not missing. |
| Grounded meeting chat | `ground-citations.ts` + tests; chat cites `[L#]` and server drops unmatched quotes | Chat can support “מה הוחלט?” without becoming ungrounded ChatGPT. |
| Demo meeting with a known moment | `demo-meeting.ts`, `DEMO_AHA_TIMESTAMP = "02:14"`, `AhaOnboarding` | Fast path to show jump without waiting on STT. |
| Processing theatre concept | `ProcessingTheatre` Hebrew stages | Honest wait builds trust *if* stages are real. |
| Share sheet | Copy brief + HTML→PDF | Sendable output is the conversion moment. |
| Ingest is real | File, in-browser record, URL/YouTube (AssemblyAI), Blob multipart for large files | Operators can get a file in. |
| Production STT path | AssemblyAI primary + Whisper fallback + ffmpeg for large/odd containers + job poll | Capable of real meetings, not toy clips. |
| PayPal capture → Pro flag | `capture-order` + `upgradeUserToPro` | Money path exists. |
| RTL + Heebo | `layout.tsx` | Hebrew-first presentation is started. |
| Design system Latitude | D0–D2, cedar teal, 3-pane | Willingness-to-pay visual bar is in the right direction. |

**Do not rewrite these.** Tighten them.

---

## 4. Current weaknesses

| Weakness | Evidence | Effect on pay/repeat/trust |
|----------|----------|----------------------------|
| Interactive aha requires signup | `page.tsx` → `LoginScreen`; theatre is watch-only | Operators bounce before value. |
| Passwordless email = identity | `auth.ts` Credentials `authorize` returns user for any valid email | Anyone can steal Pro by typing a paid email. Billing is unsafe. |
| Google sign-in unused in UI | Provider exists; `LoginScreen` only `signIn("credentials")` | Extra friction vs one-tap Google. |
| Library is local | `history-store.ts`; reopen via `sessionStorage` | Pro cannot return from another device. |
| Reopen has no media | Object URL gone; history stores `TranscriptionResult` only | Jump on return is weaker; “library” is a text archive. |
| Quota is client-only | `usage-store.ts` localStorage; server does not enforce 10/100 | Marketing claim is fake; abuse is free. |
| Price matrix contradicts itself | `constants.ts` $24.90/mo + lifetime $19; `pricing-tiers.ts` Pro $19/$19 yearly + Enterprise $99; launch week ended **2026-06-29** | Confused offer → no payment. |
| Paywall story ≠ feature flags | D6: Pro = capacity + export + library. Code: PDF/`pdfExport` is **both**; extras (sentiment, chapters…) are Pro; diarization Pro | Selling the wrong upgrades. |
| Dual workspace | Dashboard → `PremiumWorkspace`; Live → `MeetingWorkspace` (chapters, speaker analytics, editable transcript) | Two products. Operator doesn’t know which ritual to form. |
| Dual landing | Unused `LandingHero` + guest API vs current theatre + signup | Dead aha path. |
| Fake share links | `sharedLinks` Pro gate; `ShareLinkPanel` `/share/demo-token`; **no** `/share` route | Trust hit if copied URL 404s. |
| Timestamp fallback | `map-decision-timestamp.ts`: if score &lt; 0.15, **mid-meeting** | Destroys second aha. |
| Analysis does not emit timestamps | GPT returns decision *strings*; mapping is heuristic token overlap | Jump quality is luck. |
| Processing theatre is cosmetic | Ignores `uploadProgress` / `stageIndex`; fake bar (`tick % 3`) | Wait feels like a spinner with copy. |
| Premium UI hardcoded Hebrew | Rail, onboarding, share, theatre | EN locale users still see HE in the aha path (OK for ICP if we **commit**; confusing if we advertise 6 languages). |
| PDF filename strips Hebrew | sanitizer `[^\w\s-]` → `"report"` | Unprofessional send. |
| Empty states incomplete | Actions: no empty copy; empty brief can be blank | “AI produced nothing” with no recovery. |
| Dashboard idle is noisy | Demo + upload + `DashboardInspector` + `OnboardingChecklist` | Aha overlay competes with checklist and quota. |
| No product analytics | Vercel Analytics pageviews only | Cannot prove aha, share, return, pay. |
| Tests are four files | Grounding, timestamp map, OpenAI key shape, live URL parse | Closeout quality unguarded. |
| Single Blob JSON for all users | `meetscribe/users.json`; comments already record wiped Pro purchases | Revenue-critical data is a race. |

---

## 5. Revenue blockers

Why a Hebrew operator who *liked* the demo still does not pay:

1. **They never reach value before the ask.** Landing sells signup and pricing (`LandingPricing`) before a clickable brief.
2. **They cannot tell what Pro is.** Mix of lifetime checkout (`PayPalCheckout` one-time capture), subscription routes, expired $9.99 launch week, $24.90 vs $19, Enterprise with no checkout, 7-day trial fields, “needs PayPal setup” flags.
3. **Pro’s advertised library is a lie.** If they pay for “history” and switch laptops, meetings vanish. Chargeback / churn / word-of-mouth death.
4. **Quota and large-file gates may fire without aha.** Client usage toast; `largeFiles` paywall on 25 MB. Fine *after* a successful short meeting; hostile *before*.
5. **Selling Pro extras (sentiment, chapters, webhooks) instead of the job.** Operators do not pay for WPM. They pay to stop losing decisions.
6. **Unsafe auth makes PayPal dangerous.** Until email is verified, “upgrade this session” is not “upgrade this person.”
7. **Trust failure on first real file.** Generic GPT brief or wrong jump → they paste into ChatGPT next time (free competitor for the job).
8. **Live Hub / bots as a sales story.** Unreliable bot days teach “Staz is complicated” before closeout is a habit.

**Revenue rule:** Do not ask for money until (a) identity is real, (b) they have seen a true brief + at least one correct jump, (c) Pro clearly buys **capacity + cloud library + professional send**.

---

## 6. Retention blockers

Why they don’t come back next week:

| Blocker | Mechanism |
|---------|-----------|
| **No cloud library** | Cannot reopen last client’s closeout on the phone between meetings. |
| **No media on reopen** | Ritual of “jump to the decision” dies after day 0. |
| **Home is an upload box** | Empty idle should be “המשך: last brief / open actions,” not only capture. |
| **One-off novelty** | Demo aha without a *their* meeting that week. |
| **Output not easier than WhatsApp rewrite** | If copy/PDF is clumsy (Hebrew filename, extra tabs), they rewrite. |
| **Habit stolen by Live / global chat / Tidio** | They don’t know the default ritual. |
| **Quota in localStorage** | Resets per browser; or they hit a fake limit and churn angry. |
| **No Day-1 reminder** | Product never says “you have unsent actions from yesterday.” (Do this only after library exists.) |

Retention is **closeout loop + library return**, not more insight types.

---

## 7. Trust blockers

Operators will forgive a slow upload. They will not forgive a **confident lie**.

1. **Wrong timestamp jump** (mid-meeting fallback). Prefer **no chip** or “לא נמצא רגע מדויק” over a false ↗.
2. **Invented owners/dates.** Prompt says don’t invent; schema still allows `"Unassigned"` / `"TBD"`. UI must show uncertainty, not fake names.
3. **Email takeover** of Pro.
4. **Blob user-file races** wiping paid flags.
5. **Provider names / failures** that look like “the app is broken” instead of human Hebrew errors (`ErrorState` is better than theatre with no error).
6. **Marketing widgets** (AdSense, Tidio, fake live-activity toasts) on a product that claims calm executive trust.
7. **Demo without media** teaching a slider that doesn’t play audio — OK for transcript scroll aha; dangerous if we imply playback.
8. **Inconsistent HE/EN** in Premium vs shell.
9. **“Share link” that 404s.**

Trust work is product work. It is how we earn payment.

---

## 8. Technical risks

| Risk | Detail | Impact |
|------|--------|--------|
| **Monolithic JSON in Blob** | Users, live meetings, integrations — read/modify/write whole files | Lost Pro; lost meetings |
| **Job runtime on Vercel** | `waitUntil(runTranscriptionJob)`; isolate may die; webhook path depends on HTTPS + secret | Stuck “processing”; abandoned aha |
| **Hobby vs long ffmpeg** | Large Pro files, 300s `maxDuration` | Failed long Zoom recordings — ironically the Pro promise |
| **localStorage history size** | Full transcript JSON in browser | Quota errors; lost library; privacy on shared PCs |
| **No server usage ledger** | 10/100 months unenforceable | Cost overrun + dishonest UX |
| **Credentials auth** | Unverified email = user id | Fraud |
| **Heuristic mapping + GPT without line IDs** | Jump quality unmeasured | Churn |
| **Dual analysis engines** | Live GPT-4o path vs unused `SummarizationEngine` / `/api/insights` | Drift, cost, confusion |
| **PayPal dual mode** | One-time lifetime + subscriptions + trial fields | Ops nightmare, wrong entitlements |
| **In-memory guest quota** | `Map` per isolate | Guest limits don’t work (if guest is revived) |
| **Almost no tests** | Four unit files | Regressions in the loop |

---

## 9. Recommended architecture

**Smallest reliable production architecture.** Do not add Kubernetes, multi-region, or a data lake. Do not keep “one JSON file for all customers.”

### Keep

- Next.js 16 on Vercel  
- Vercel Blob for **media files** (audio/video) and large transcript blobs  
- AssemblyAI + Whisper + OpenAI  
- NextAuth JWT session  
- PayPal as the payment rail (pick **one** commercial model — see §10)

### Add (required)

**A real database for rows that must not race:** users, entitlements, usage, meeting index.

Recommended: **Vercel Postgres (Neon)** — one project, one region (`fra` or `eu-central` for Israeli latency), no extra vendor story.

Do **not** put 3-hour transcripts in a single Postgres row if they can exceed practical row size. Split:

| Store | What |
|--------|------|
| **Postgres** | `users`, `meetings` metadata, `usage_month`, `payments` |
| **Blob** | `audio/{userId}/{meetingId}` · `payload/{userId}/{meetingId}.json` (transcript + analysis) |

### Minimal schema

```
users
  id, email (unique), name, email_verified_at,
  plan (free|pro), pro_kind (none|lifetime|subscription),
  paypal_customer / subscription / last_txn,
  created_at, last_login_at

meetings
  id, user_id, title, source (upload|url|record|live),
  status (processing|ready|failed),
  duration_seconds, language,
  media_blob_url nullable,
  payload_blob_url,
  headline, created_at
  -- optional denormalized: decision_count, action_count for library list

usage_month
  user_id, yyyymm, transcription_count
  primary key (user_id, yyyymm)

payments
  id, user_id, provider, provider_ref, kind, amount_usd, created_at
```

**RLS / access:** all meeting APIs keyed by `session.user.id` (stable UUID, **not** raw email as PK once verified auth exists). Email remains unique login identifier.

### Why not Blob-only library

The codebase already documents Blob JSON wiping Pro. A per-user Blob index is still a read-modify-write race. Postgres `INSERT meeting` is the smallest *reliable* library.

### Why not Supabase-first in this phase

Zero Supabase usage in repo today. Introducing Auth+DB+Storage together is a rewrite. Postgres + existing NextAuth + existing Blob is the smallest delta. Revisit Supabase later only if Auth/storage unification is worth a migration.

### Application shape (do not rewrite folders)

Keep `src/features/transcription`, `staz-workspace`, `chat`.  
Add `src/features/library` (server: create/list/get/delete meeting; client: history page reads API).  
One workspace for the loop: **PremiumWorkspace**. Live viewer may keep `MeetingWorkspace` **frozen** (see §13).

### Auth target (smallest safe)

Phase A: **Google OAuth as primary** (provider already in `auth.ts`) + keep email only if **magic link / OTP** is added.  
**Remove unverified Credentials as a way to obtain a session that can hold Pro.** Until then, do not market paid plans as durable.

### Jobs

Keep Blob job records **per job id** (already `meetscribe/jobs/{id}.json` — this pattern is OK). Prefer AssemblyAI webhook completion over long `waitUntil` for files that need it. Surface failure in the theatre, not a fake bar.

---

## 10. Recommended Free / Pro model

Strategic direction (confirmed):

- **Free = enough product to reach aha**  
- **Pro = capacity + retained library + professional workflow**  
- **Paywall after value, never before**

### What Free includes (must)

- Interactive **demo workspace** on the public site (no account) — brief + ↗ jump  
- After signup: **first real short meeting(s)** with **full closeout**: תמצית, החלטות, משימות, jump, **copy** to send  
- Hebrew/RTL  
- Processing theatre  
- Chat **on that meeting** (grounded), limited

**Suggested capacity (enforce server-side):**  
3 real transcriptions / month, **25 MB**, ~30 min. Enough for aha on *their* work; not enough for a sales manager’s week.

### What Free must not include

- Cloud library beyond “this session / this device” **or** a **single** saved meeting that expires (pick one; recommend **1 saved meeting, 7 days**, then Pro for retain)  
- Professional PDF / branded send (copy text stays Free — that *is* aha)  
- Files &gt; 25 MB  
- Live bots  
- Integrations / webhooks  
- Diarization as a billed extra can stay Pro **if** Free still gets a usable single-speaker or lightly labeled transcript. If Hebrew multi-speaker meetings are the ICP default, **consider diarization on Free for the first 3** so the brief has owners. Prefer **owners in the brief** over gating diarization if it blocks aha.

### What Pro includes (sell this, only this)

| Pillar | Meaning |
|--------|---------|
| **Capacity** | 100 meetings/month, 500 MB, long recordings |
| **Retained cloud library** | Log in anywhere: list, reopen, transcript, analysis, decisions, actions, exports |
| **Professional workflow** | Branded PDF, keep media for jump-on-return, optional follow-up email draft |
| **Speakers** | Diarization for real Zoom/Meet calls |

**Do not sell as the headline:** sentiment, chapters, key quotes, risks, templates, Slack, webhooks, “priority processing,” Enterprise.

Those may remain in code **hidden**. If they improve the brief quality, fold into the default Pro brief — not as a feature grid.

### Paywall timing

| Moment | Gate? |
|--------|--------|
| Landing demo jump | No |
| Signup | Soft — required before **their** file (cost + abuse), **after** demo aha |
| First real brief + jump + copy | No Pro paywall |
| 4th meeting / file too large / want PDF / want library on phone | Yes |
| Chat after aha | No (or generous Free cap) |

### Pricing presentation (one offer)

Kill the contradiction. Recommend **one** public offer:

| | Recommendation |
|--|----------------|
| **Public price** | **$19 / month** Pro (matches `pricing-tiers.ts` Pro monthly, simpler than $24.90) |
| **Annual** | **$190 / year** (≈ 2 months free). Do **not** show yearly = $19 total. |
| **Lifetime** | **Remove from marketing** or keep as a quiet one-time $99 for early believers — **not** $19 forever next to $19/month (that kills subscriptions). Current `$19 lifetime` vs `$24.90/mo` is incoherent. |
| **Enterprise** | **Hide**. No checkout, no ICP. |
| **Launch $9.99 / ended 29 Jun 2026** | **Delete from UI.** Dead urgency destroys trust. |
| **Trial** | If used: **7 days Pro library + capacity after first aha**, card optional. Do not grant Pro via unverified email. |
| **Checkout** | Pick **subscriptions** as default (retention). Lifetime only as a later experiment. Align `PayPalCheckout` with that choice — today the prominent path is **one-time capture → lifetime**. |

### Feature flag cleanup (target)

| Capability | Free | Pro |
|------------|------|-----|
| Demo aha | Yes | Yes |
| Brief / decisions / actions | Yes | Yes |
| Timestamp jump (high-confidence only) | Yes | Yes |
| Copy brief | Yes | Yes |
| Grounded chat (per meeting) | Yes (rate-limited) | Yes |
| PDF / branded export | No | Yes |
| Cloud library + media retain | No (or 1 meeting) | Yes |
| Large files / volume | No | Yes |
| Diarization | First meetings Yes **or** Pro — decide in Phase 2 by Hebrew quality | Yes |
| Live / Slack / webhooks | Hidden | Hidden until Wave 2 |

`plan-features.ts` today marks `pdfExport` and `history` as `both` — **change the product meaning**, not by deleting PDF code: **gate cloud persist + PDF**, keep copy.

---

## 11. Analytics event schema

Vercel Analytics pageviews cannot prove the funnel. Add **custom events** (Vercel Analytics custom events **or** a single Posthog project — one tool, not both).

Minimum funnel:

**Acquisition → First successful meeting → Aha → Share → Return → Upgrade → Payment**

### Event names (exact)

| Event | When | Properties |
|-------|------|------------|
| `landing_view` | LoginScreen mount | `locale`, `ref` |
| `demo_open` | Demo workspace opened | `locale` |
| `aha_jump` | User clicks ↗ on decision/action **or** onboarding jump | `source`: `demo` \| `real`, `meeting_id`, `kind`: `decision` \| `action` \| `onboarding`, `confidence` (0–1) |
| `aha_copy` | Copy brief | `source`, `meeting_id` |
| `signup_submit` | Credentials/Google success | `method`: `google` \| `email` |
| `upload_started` | File/url/record accepted | `source`: `file` \| `url` \| `record`, `bytes`, `plan` |
| `processing_failed` | Job/error state | `reason_code`, `plan` |
| `meeting_ready` | Analysis shown | `meeting_id`, `duration_s`, `plan`, `had_demo_before` |
| `share_pdf` | PDF generated | `meeting_id`, `plan` |
| `library_open` | History/library list | `count`, `plan` |
| `meeting_reopen` | Open from library | `meeting_id`, `has_media` |
| `paywall_view` | Gate shown | `reason`: `quota` \| `large_file` \| `pdf` \| `library` \| `pricing_page` |
| `upgrade_click` | CTA to checkout | `reason` |
| `payment_succeeded` | PayPal capture/activate OK | `kind`: `subscription` \| `lifetime`, `amount` |
| `return_session` | Signed-in home, `days_since_last_meeting_ready` ≥ 1 | `days_since` |

### Aha definition (product)

A session counts as **aha** if within **5 minutes of `meeting_ready` or `demo_open`**:

- `aha_jump` **or** `aha_copy`

Do not count “upload succeeded” as aha.

### Identity

`user_id` once logged in; `anonymous_id` cookie before. Never send transcript text to analytics.

---

## 12. Exact MVP funnel

The only funnel to implement and measure for 90 days:

1. **Land** (`landing_view`) — Hebrew operator, dark theatre, promise = closeout not STT.  
2. **Demo aha** (`demo_open` → `aha_jump`) — clickable decision at `02:14`, transcript evidence. No signup required.  
3. **Signup** (`signup_submit`) — Google-first; copy: “כדי לעבד את הפגישה שלך.”  
4. **Upload their short file** (`upload_started`) — default capture, not Live.  
5. **Honest processing** — real stages; failure in Hebrew.  
6. **First real closeout** (`meeting_ready`) — תמצית / החלטות / משימות.  
7. **Real aha** (`aha_jump` or `aha_copy`) — paywall still closed.  
8. **Share** optional (`share_pdf` Pro-gated later; copy Free).  
9. **Save** — Free: local or 1 cloud slot; Pro: library.  
10. **Return** (`return_session`, `meeting_reopen`) — last meeting on home.  
11. **Hit a real Pro reason** (`paywall_view`: 4th meeting, PDF, second device).  
12. **Pay** (`payment_succeeded`).

Anything that is not a step on this list is **not MVP**.

---

## 13. What to freeze

**Freeze = leave code, hide or de-emphasize in UI, no polish, no new scope.** Deleting now would violate “do not remove functionality” and burn working Live/ingest.

| Surface | Why freeze |
|---------|------------|
| **Live Hub / Recall bots / cron / digest email** | Not required for first paid MVP; reliability risk; steals ritual. Soft-hide nav or “בקרוב” for Free. |
| **Integrations (Slack) + transcription webhooks** | Wave 2. Not the closeout loop. |
| **Global AI FAB / `/api/chat/workspace`** | Cross-meeting chat without a library and without citations. Distracts. |
| **MeetingWorkspace extras** (speaker analytics, chapters UI, editable transcript) | Second product. Keep for Live only while Live is frozen. |
| **SummarizationEngine UI / SummaryTemplatePanel** | Unused by Premium path. |
| **`/api/insights`** | No UI consumer. |
| **Guest IP Map quota** | Until guest is a measured path. |
| **AdSense + Tidio** | Anti-trust on an executive tool. Freeze loading on app shell. |
| **Enterprise tier** | No buyer, no checkout. |
| **Launch-week / fake urgency** | Date passed. |
| **Admin PayPal verify / inspector quota upsell** | Ops only; don’t put in operator home. |
| **Onboarding checklist modal** | Conflicts with 3-step aha overlay. Freeze checklist. |
| **Command palette / LiveActivityToast** | Noise. |
| **Language upgrade gate** | `languageSelect` is already `both`; dead paywall. |

Engineering rule from D6 still stands: **do not polish Live / admin / integrations until aha + share + library are production-quality.**

---

## 14. What to remove

**Remove from the operator-facing product** (hide/disable). Physical file deletion is a later cleanup PR, not Phase 1.

| Remove from UX | Reason |
|----------------|--------|
| Enterprise price column | Confusion |
| $9.99 launch / dual $24.90 vs $19 vs lifetime $19 as simultaneous stories | Cannot pay what they don’t understand |
| Fake share URLs / `ShareLinkPanel` until real links exist | Trust |
| Guest **dead** landing *or* the opposite: remove unused `LandingHero` **after** demo-on-landing is wired | One acquisition path |
| Feature grid selling sentiment/quotes/risks/webhooks | Wrong job |
| Mid-meeting timestamp **fallback** | Trust (this is a behavior removal, keep mapping) |
| Unverified email as Pro identity | Revenue safety |

**Do not remove in 90 days:** STT pipelines, PayPal, Blob uploads, grounded chat, demo data, PremiumWorkspace, analysis use-case.

---

## 15. What to build

Only what the north star requires. Each item is a capability, not a rewrite.

### A. Acquisition aha (before signup)

- Mount **interactive demo** on the public landing (reuse `DemoWorkspaceEntry` / `PremiumWorkspace` + `AhaOnboarding`).  
- CTA after jump: “עכשיו הפגישה שלך.”

### B. Honest processing

- Drive theatre from real `stage` / upload %.  
- Error inside or immediately after theatre (Hebrew, no provider names).  
- No fake infinite progress.

### C. True jump

- Analysis: attach **transcript line ids / timestamps** to each decision and action in the GPT JSON (schema change + prompt).  
- Mapper: **drop** mid-meeting fallback; if `score` &lt; threshold, show decision **without** ↗.  
- Measure `aha_jump` with `confidence`.  
- Tests: Hebrew decisions from demo + 2 real-like fixtures.

### D. Closeout quality

- Brief must lead with decisions + owners + sendable paragraph.  
- Empty states: אין החלטות / אין משימות + “שאל את Staz” / retry.  
- Owners: never invent; `Unassigned` labeled in Hebrew as לא צוין.

### E. Share that operators actually send

- Copy stays excellent (WhatsApp/email).  
- PDF: Hebrew-safe filename; gate as Pro **after** copy aha.  
- No pretend public links until `meetings` exist.

### F. Auth that can hold money

- Google primary in UI.  
- Stop granting sessions that inherit another user’s Pro via typed email.  
- Verified `user_id` in DB.

### G. Cloud library (the Pro product)

- Save payload + optional media to Blob; row in Postgres.  
- History page reads API.  
- Reopen = full workspace + media if stored.  
- Home: last meeting + “פגישה חדשה”.

### H. Server usage + paywall after aha

- Increment `usage_month` on successful `meeting_ready`.  
- Paywall reasons: quota, size, PDF, library-on-second-device.

### I. One pricing story + matching checkout

- One Pro price; subscription default; hide Enterprise/launch.

### J. Analytics

- Events in §11 on the loop only.

### K. Home for return

- After first real meeting, idle dashboard = library snippet + upload, **not** checklist + inspector + demo forever. Hide demo after `hasProcessedFirstFile` (already started in `user-milestones.ts`).

---

## 16. Priority order

Work **in this order**. Do not start (7) before (3)–(4) are true.

1. **Freeze attention** — hide Live/integrations/global AI/ads/checklist from the default operator shell (flags, not deletion).  
2. **Kill false jumps** — remove mid-meeting fallback; hide ↗ when unconfident. (Trust before more traffic.)  
3. **Landing demo aha** — interactive closeout without signup.  
4. **Instrument funnel** — events §11 (even if library still local).  
5. **Auth that is safe to bill** — Google-first; block email impersonation.  
6. **Closeout schema with timestamps** — GPT line anchors + tests.  
7. **Postgres + cloud library + server quota** — this is the Pro SKU.  
8. **Media retain for Pro reopen** — jump still works next week.  
9. **Pricing/checkout alignment** — one offer; paywall after aha.  
10. **Share/PDF professionalism** — Hebrew PDF names; Pro PDF.  
11. **Return home** — last meeting, open actions.  
12. **Only then** consider Live as a Pro ingest source (Wave 2).

If capacity is scarce: **1 → 2 → 3 → 7 → 9**. Library + honest jump + demo aha beat new AI fields.

---

## 17. Definition of Done

Call the transformation **done for paid MVP** only when **all** are true:

### Value

- A new Hebrew visitor can **jump a demo decision in &lt; 60 seconds** without an account.  
- A signed-in Free user can finish **their** short meeting and see תמצית + החלטות + משימות in one rail.  
- Copy produces a sendable Hebrew brief without opening ChatGPT.

### Trust

- No ↗ unless mapped with confidence above threshold **or** GPT-supplied timestamp that exists on a real line.  
- No unverified-email Pro takeover.  
- Failures are Hebrew and human. Theatre progress is tied to the job.  
- Analytics can show jump `confidence`.

### Repeat

- Pro user logs in on another browser and **sees the same meetings**, can reopen brief + decisions + actions, and export.  
- Home offers the last meeting, not only upload.  
- Demo hides after first real file (already intended).

### Payment

- One Pro price shown everywhere.  
- Paywall does not fire before first real aha (demo + first meeting).  
- Pro is described as **capacity + library + professional send**, and the product **does that**.  
- Usage enforced on the server.  
- `payment_succeeded` is logged.

### Discipline

- Live, Slack, webhooks, global FAB, Enterprise, AdSense/Tidio are not on the default path.  
- No new insight types shipped as marketing features.

**Directional targets** (from D6; start measuring, don’t fake them):

- Aha rate (jump or copy in first ready/demo session) ≥ 35% of activated  
- Day-7 return ≥ 25% of activated with ≥ 1 real meeting  

---

## 18. Recommended implementation phases

**Do not implement until this plan is accepted.** Phases below are the engineering contract after approval. Each phase ships to production. No “big bang rewrite.”

### Phase 0 — Attention freeze (1–2 days)

- Feature-flag or nav-hide: Live, integrations, webhooks, global AI, Tidio/AdSense on app routes, Enterprise, launch pricing, onboarding checklist, DashboardInspector upsell.  
- Keep routes working for admin/deep links.  
- **Exit:** Operator shell is Capture + Library + Settings (billing).

### Phase 1 — Trust on the loop (2–4 days)

- Remove mid-meeting timestamp fallback; UI for unmapped decisions.  
- Theatre uses real stage/progress; errors visible.  
- Empty states on rail.  
- Tests for mapping + 2 Hebrew fixtures.  
- **Exit:** Impossible to click a knowingly false ↗.

### Phase 2 — Aha before account (2–3 days)

- Interactive demo on `LoginScreen`.  
- Events: `landing_view`, `demo_open`, `aha_jump`, `aha_copy`.  
- Signup CTA after aha.  
- **Exit:** Unauthenticated user can complete second aha.

### Phase 3 — Identity (3–5 days)

- Google button live; disable unverified Credentials for producing a durable user, or add email OTP.  
- `users` table (Postgres) as source of plan; stop relying on impersonatable email + single Blob file for entitlements.  
- **Exit:** Pro cannot be stolen by typing an email.

### Phase 4 — Closeout truth (3–5 days)

- GPT schema: each decision/action includes `line_id` or `timestamp` that must exist; server validates like `ground-citations`.  
- Prompt tightened for Hebrew operators (decisions, owners, sendable update) — fewer fluff fields in the default rail.  
- **Exit:** Jump uses model+server evidence, not midpoint.

### Phase 5 — Library is the product (5–8 days)

- Postgres + Blob payload; save on `meeting_ready`; list/get/delete API; history page.  
- Server `usage_month`.  
- Free: 3 meetings / optional 1 retained; Pro: retain all + media blob.  
- Reopen into PremiumWorkspace.  
- Events: `meeting_ready`, `library_open`, `meeting_reopen`.  
- **Exit:** Second device test as a paying user works.

### Phase 6 — Offer and paywall (2–4 days)

- Single price in `constants` + `pricing-tiers` + UI.  
- Checkout matches (subscription **or** lifetime — one default).  
- Gates: quota, size, PDF, library — **after** aha.  
- Events: `paywall_view`, `upgrade_click`, `payment_succeeded`.  
- **Exit:** A stranger can explain Pro in one sentence that is true.

### Phase 7 — Return ritual (2–3 days)

- Home = last closeout + new meeting.  
- Hebrew PDF filenames; Pro PDF.  
- `return_session` event.  
- **Exit:** Day-1 reopen is obvious.

### Phase 8 — Wave 2 (explicitly later)

- Live bot as **Pro ingest** into the **same** Premium workspace (not a second IA).  
- Real share links.  
- Calendar later.  
- Cross-meeting ask only when single-meeting quality is boringly good.

---

## Traceability

Every recommendation above exists so that a Hebrew-speaking operator will **pay because Staz reliably saves time after meetings** — not because Staz has more transcription features.

| If we… | Operator outcome |
|--------|------------------|
| Put demo jump before signup | They feel the 5-minute closeout before we ask for an email |
| Stop false jumps | They trust the brief enough to send it |
| Store meetings in Postgres+Blob | They pay for a library they can actually reopen |
| Hide Live/integrations/ads | They form one ritual |
| Align Pro to capacity + library + send | They know what the card is for |
| Measure aha → share → return → pay | We stop arguing opinions and ship the loop |

---

**Plan complete. No code was changed except this document.**  
Next human gate: approve / amend this plan, then explicitly start **Phase 0**.

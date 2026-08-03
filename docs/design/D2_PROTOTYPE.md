# Staz AI — Phase D2: Interactive Prototype Spec
**Flow:** Landing → Login → Upload → Processing → Workspace → Chat → Export  
**Purpose:** Document every interaction so implementation is deterministic.  
**No React until you approve this prototype plan + hi-fi direction.**

Recommended build medium for clickable prototype: **Figma prototype** (or Framer) matching D0 tokens + D1 frames.  
This file is the **interaction contract**.

---

## 1. Prototype graph

```text
[L1 Landing]
    │ ★ נסו עכשיו / התחילו
    ▼
[A1 Login]
    │ success
    ▼
[O1 Onboarding] ──דלג──┐
    │ complete         │
    ▼                  │
[H1 Home Capture] ◄────┘
    │ file selected / drop
    ▼
[P1 Processing]
    │ success auto
    ▼
[W1 Workspace Brief]
    │ tab/chip “שאלו” or composer focus
    ▼
[W2 Workspace Chat]
    │ ★ שתף
    ▼
[S1 Share Sheet]
    │ copy / download / close
    ▼
[W1 or Lib1]
```

**Secondary edges**
- Landing “התחברות” → A1  
- Landing theatre end → still L1 (no auto login)  
- H1 Continue row → W1 (skip processing)  
- W1 library back → Lib1  
- Lib1 row → W1  
- P1 fail → E1 → H1  

---

## 2. Hotspot inventory (Figma)

### L1 Landing Desktop
| Hotspot | Target | Transition |
|---------|--------|------------|
| ★ נסו עכשיו | A1 | fade 240ms |
| התחברו | A1 | fade |
| התחילו (nav) | A1 | fade |
| ראו איך זה עובד | scroll/focus theatre | smart animate |
| Lang toggle | visual only | none |

**Autoplay (prototype overlay):**  
On load, after 400ms delay: simulate type-in of 3 brief lines (use interactive component variants or video).

### A1 Login
| Hotspot | Target |
|---------|--------|
| ★ Google | O1 (first-time flag) or H1 |
| המשך email | O1/H1 |
| Back brand | L1 |

### O1–O3 Onboarding
| Hotspot | Target |
|---------|--------|
| הבא | next step → H1 after 3 |
| דלג | H1 |
| Click spotlight transcript (step 1) | advance |
| Click rail (step 2) | advance |
| Click chip (step 3) | H1 with capture emphasized |

### H1 Capture
| Hotspot | Target |
|---------|--------|
| Stage click / drop | P1 |
| Continue row | W1 |
| קישור (secondary) | small inline URL field expand (optional prototype) |
| ★ חדש in lib nav | H1 |

### P1 Processing
| Hotspot | Target |
|---------|--------|
| (auto after 2.5s prototype timer) | W1 |
| Optional “דמו מהיר” skip for stakeholder demos | W1 |

Prototype: advance stages every 700ms (listen → understand → organize).

### W1 Workspace
| Hotspot | Target |
|---------|--------|
| Transcript line | same frame; set active line + playhead component |
| Time scrub | same frame; change active line |
| Rail tab Decisions | component variant |
| Rail tab Actions | variant |
| Suggestion chip | W2 with prefilled user message + answer |
| Composer + send | W2 |
| ★ שתף | S1 overlay |
| ← library | Lib1 |

### W2 Chat
| Hotspot | Target |
|---------|--------|
| Grounded chip 12:41↗ | W1 with that line active |
| ★ שתף | S1 |
| New question send | append message variant |

### S1 Share
| Hotspot | Target |
|---------|--------|
| ★ העתק | toast “הועתק” then stay |
| הורד PDF | toast “הורדה…״ |
| סגור / scrim | W1 |

---

## 3. Interaction micro-docs (detailed)

### 3.1 Landing theatre loop
1. t=0s: media playhead at 0; first transcript line active  
2. t=0–1.2s: first brief line type-in  
3. t=1.2–2.4s: second line; decision pill fades in  
4. t=2.4–4s: action rows check-pop  
5. t=4–8s: playhead advances; active transcript line changes ×2  
6. Loop or hold final — **never** auto-redirect  

**Hover media:** show play control fade.  
**Click media:** pause/resume prototype only.

### 3.2 Login
- Google button hover: e2 lift  
- No validation theatre beyond empty email disable  
- Success: 160ms fade to onboarding  

### 3.3 Onboarding
- Scrim click does **not** close (force intentional דלג)  
- Spotlight cutout aligns to real UI component  
- Step progress 1/3 · 2/3 · 3/3 dots  

### 3.4 Capture
**Drag enter:** border color → accent; stage scale 1.01  
**Drop:** 200ms morph (stage opacity) → cut to P1  
**Click:** native file metaphor — prototype jumps P1  

### 3.5 Processing
| Stage | Duration (proto) | Visual |
|-------|------------------|--------|
| מקשיבים | 700ms | check draws |
| מבינים | 700ms | pulse active |
| מארגנים | 700ms | then hold 400ms |
| Exit | 400ms crossfade | W1 |

**Copy always honest in prod** — prototype may compress time.

### 3.6 Timeline sync (Workspace)
| User action | System response |
|-------------|-----------------|
| Press play | active line follows pseudo-time every 1s (prototype) |
| Click line N | playhead jumps; line N active; media state “playing” icon optional |
| Drag scrub | nearest line activates |
| Search type | filter lines; on submit jump first match |

### 3.7 Chat
| User action | System response |
|-------------|-----------------|
| Tap chip | user bubble appears immediately; 400ms delay; assistant streams 2 sentences + grounded chip |
| Send custom | same pattern with generic sample answer in prototype |
| Click ↗ | close keyboard mobile; switch to transcript tab/line highlight |

### 3.8 Export
| User action | System response |
|-------------|-----------------|
| Open share | sheet-up + scrim |
| Copy | toast ok |
| PDF | toast; optional success check on button 1s |
| Close | reverse sheet |

---

## 4. Prototype device frames

Build **two** full flows:
1. Desktop 1440  
2. Mobile 390  

Same graph; mobile uses tab variants for W1/W2.

---

## 5. Stakeholder demo script (90 seconds)

1. Open L1 — “Watch the rail write the brief” (8s)  
2. Click נסו עכשיו → login → skip onboarding optional  
3. Drop file → processing stages (3s compressed)  
4. Workspace: click a decision’s time chip → line jumps  
5. Ask chip “מה הוחלט?” → grounded answer  
6. Share → show artifact preview → copy  
7. Stop. Silence. Let WOW land.

---

## 6. Acceptance criteria for **your** prototype approval

Approve Phase D2 only if:

- [ ] Landing first viewport has **no** feature-card clutter  
- [ ] Brand dominates; assistant theatre visible  
- [ ] Path Landing→…→Share works without explanation  
- [ ] Workspace is 3-pane desktop / 3-tab mobile — not 7 tool tabs  
- [ ] Chat answers show time jump affordance  
- [ ] Share preview looks like a finished product artifact  
- [ ] Every screen passes WOW / not-average check  
- [ ] Tokens match D0 (accent cedar-teal, no purple cliché)  
- [ ] Hebrew UI strings from D1 copy deck  

---

## 7. What “interactive prototype” means here

| Deliverable | Owner after you approve D0–D2 docs |
|-------------|-------------------------------------|
| Figma pages + components | Design execution (you, design partner, or agent with Figma — not React app) |
| Clickable prototype link | Shared for review |
| Recorded Loom of 90s script | Optional |

This repository currently holds **the complete written specification**.  
Pixel painting in Figma is the next design craft step; **React remains blocked**.

---

## 8. Handoff gate to engineering (future — not now)

Engineering starts **only** when you reply:  
**“Prototype approved — implement UI.”**

Then implement order (locked):
1. Design tokens → CSS variables  
2. Shell  
3. Landing theatre  
4. Workspace + timeline  
5. Rail + chat  
6. Processing  
7. Capture home  
8. Onboarding  
9. Share  
10. Library  

Each PR re-runs WOW check. Average UI is rejected in review.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Figma drifts from tokens | Bind styles to D0 variable names |
| Prototype overpromises processing speed | Label “דמו” compressed |
| Mobile compromise | Mobile frames approved before code |
| Scope creep mid-Figma | Out-of-MVP stay hidden in archive page |

---

**Phase D2 complete.**

## Approval reply templates

- `Approve D0–D2` — design system + hi-fi + prototype contract accepted; next = Figma craft / visual comps  
- `Request changes:` …  
- `Prototype approved — implement UI` — **only phrase that unlocks React**

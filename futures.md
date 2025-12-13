# Features we will implement (24h MVP)

This doc lists the **realistic** features for a 24-hour hackathon MVP, and **where they live in the app** (Pages 1–5 match your tab layout).

## MVP principle
- The app is a **personal assistant** that understands a user’s situation and turns it into **clear recommendations + a task plan**.
- The app **does not submit** anything externally. It produces **Draft → Review → User action** only.

---

# Page map

## Page 1 — Home (Overview)
**Goal:** One place to start and see what matters now.

**Features**
- **Start a scan** (shortcut into Page 3: Personal AI, Scan mode)
- “Continue last case” / “See my next steps” shortcuts (deep links into Page 4)
- Simple “Today / This week” reminders list (read-only preview)

**24h scope:** ✅ Easy (mostly UI + pulling counts/status from stored tasks)

---

## Page 2 — Regelingen (Browse supports)
**Goal:** Lightweight browsing/search for schemes.

**Features**
- Simple list of 8–12 example schemes (seeded data)
- Scheme detail modal/page: what it is, typical requirements (static or semi-static)
- CTA: **“Add to my plan”** (creates a case + default tasks in Page 4)

**24h scope:** ✅ Easy if you keep data static / JSON

---

## Page 3 — Personal AI (Chat + Voice-first intake)
**Goal:** The **core wow**. Users talk/type, assistant builds context, recommends supports.

**Features**
1) **Chat Q&A with context**
- User asks anything; assistant answers in plain language using the current **Situation Profile**.

2) **Voice-first intake (“Start a scan”)**
- Voice or text input (toggle)
- Assistant asks follow-ups (scripted or semi-dynamic)
- Output: **Structured Situation Profile**
- Confirmation screen: “Here’s what I understood. Edit anything.”

3) **Personalized eligibility coaching (Top 3)**
- Show **Top 3** recommended supports
- For each: **why it matches**, **confidence (H/M/L)**, and **missing questions** (if any)

4) **Inline action in chat**
- Each recommendation has a button: **“Add to my plan”** → creates a case + tasks in Page 4

**24h scope:** ✅ Doable if you constrain it:
- Use a **fixed profile schema** (JSON)
- Use **simple ranking rules** (impact score) + LLM for explanations
- Keep schemes list small (8–12)

---

## Page 4 — My Plan / Tasks (Action plan + drafts)
**Goal:** Turn advice into *doable steps* and keep the user moving.

**Features**
- Case list (each added scheme becomes a “case”)
- Task checklist per case:
  - missing documents
  - reminders due dates (view-only here; scheduling handled by automation)
- **Drafts section (MVP)**
  - “Generate draft packet” button (produces a **draft letter / filled fields preview**)
  - Status labels: Draft / Needs review / Approved (simple)

**Explicit non-goals (24h)**
- ❌ No real submission to municipalities/funds
- ❌ No external messaging as “final”

**24h scope:** ✅ Medium (keep drafts as one generated text + optional PDF later)

---

## Page 5 — Profile / Settings (Minimal)
**Goal:** Preferences + voice controls.

**Features**
- Toggle: Voice output on/off
- Show transcript on/off
- Basic privacy notice
- “Delete my data” button (can be a simple demo reset)

**24h scope:** ✅ Easy

---

# Automation (Activepieces / n8n) — what we actually build in 24h

## Automation MVP (1–2 flows only)
1) **Reminders**
- When a task has a due date → schedule a reminder
- Channel: email (fastest), optional WhatsApp/SMS only if already set up
- “Snooze” can be a simple link/button that reschedules

2) **Document missing nudges (optional)**
- If doc is still missing after X days → send nudge

**24h scope:** ✅ Doable if you keep it to 1 channel and 1–2 flows.

---

# Recommended 24h tech approach (simple & reliable)

## Data objects (keep it simple)
- `SituationProfile` (JSON): household, income band, housing, kids, employment, debts flags, location
- `Scheme` (JSON): name, description, eligibility hints, impact score
- `Case` + `Task` (JSON): schemeId, tasks[], dueDates, status
- `Draft` (text): generated letter/summary (stored as text)

## AI pattern (stable)
- LLM returns **structured JSON**:
  - updated profile fields
  - follow-up questions
  - top 3 recommendations
  - “why” bullets + confidence + missing questions

---

# Is this doable in 24 hours?

✅ **Yes**, if you treat it like a hackathon MVP and keep scope tight:

- You can deliver:
  - Voice/text intake → structured profile + edit
  - Top 3 recommendations with explanations + confidence
  - “Add to my plan” button inside chat
  - Task list page with checklist + a simple “generate draft”
  - 1 reminder automation via Activepieces

⚠️ What will blow up scope:
- Real integrations for submission portals
- Many municipalities/schemes with complex rules
- Fully featured helper dashboard + full audit trail UI
- Multi-channel notifications (WhatsApp/SMS) without accounts ready

---

# n8n vs Activepieces — should you use both?

**Recommendation for 24h: use ONE tool only.**
- If you already have **Activepieces** set up: use **Activepieces only**.
- Only use **n8n** if the team already knows it and has templates ready.

Using both in 24h usually adds:
- duplicate setup time
- more failure points
- unclear “source of truth” for automations

**Best hackathon call:** pick the one you can ship with fastest (most familiarity + easiest hosting).

---

# Page-to-feature summary (quick list)

- **Page 1 (Home):** Start scan, continue case, next reminders preview
- **Page 2 (Regelingen):** Browse 8–12 schemes, add to plan
- **Page 3 (Personal AI):** Chat Q&A, voice scan, profile summary/edit, top 3 recs, add-to-plan button
- **Page 4 (My Plan):** Cases + tasks, missing docs checklist, generate simple draft, statuses
- **Page 5 (Profile):** Voice + transcript toggles, demo reset/delete

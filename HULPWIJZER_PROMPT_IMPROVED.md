# MASTER PROMPT — Hulpwijzer (Next.js + TS + Supabase)

> **Purpose**: Design spec for a production-grade web app helping single mothers in the Netherlands discover and access financial support (toeslagen, regelingen, subsidies).

---

## 🎯 Core Concept

**Hulpwijzer** ("Help Guide") is a trusted digital assistant that:
1. Understands a user's situation through conversational AI intake
2. Matches them to relevant government schemes/benefits
3. Helps prepare applications with AI-generated drafts
4. Ensures human review before any official submission

---

## 🛠 Tech Stack (Mandatory)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Database | Supabase Postgres + RLS |
| Auth | Supabase Auth (magic link) |
| Storage | Supabase Storage (documents) |
| Styling | Tailwind CSS + shadcn/ui |
| Voice | ElevenLabs TTS |
| Automation | Activepieces |
| AI | OpenAI GPT-4 |

---

## 🚫 Non-Negotiable Constraints

### Human-in-the-Loop (CRITICAL)
```
✅ AI CAN: recommend, draft, explain, prepare, remind
❌ AI CANNOT: submit applications, contact authorities, make final decisions
```

### Trust-First UX
- Plain Dutch (B1 reading level)
- No bureaucratic jargon
- Every recommendation shows: source, reasoning, last verified date
- User always in control

### Privacy by Design
- Minimal data collection
- Explicit consent required
- Easy data export/deletion
- GDPR compliant

---

## 👥 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `guest` | Anonymous visitor | Browse schemes, start intake (no save) |
| `user` | Registered mother | Full access to own data, matches, applications |
| `helper` | Volunteer/social worker | Review assigned cases, approve drafts |
| `admin` | Platform admin | Manage schemes, users, system config |

---

## 📋 Required Output Sections

When responding to this prompt, produce these sections:

### 1. Project Structure
- Complete `/app` directory layout
- Route groups: `(public)`, `(auth)`, `(user)`, `(helper)`, `(admin)`
- Shared layouts, loading/error states
- Middleware approach

### 2. Page Specifications
For each page, provide:
- Route path and auth requirements
- UI sections and key components
- Features (user actions, AI assistance, approval gates)
- Data (tables, queries, RLS notes)
- Trust elements (sources, explainability)

**Required pages**: Landing, How it works, Schemes browser, Scheme detail, Login, Dashboard, Intake, Matches, Application detail, Documents, Settings, Helper queue, Case review, Admin panels

### 3. Component Library
For each component:
- Props interface
- Key state
- Accessibility notes
- Trust/UX role

**Required components**: SchemeCard, EligibilityBadge, TrustFooter, DocumentUploader, ApprovalGate, IntakeChat, VoicePlayer

### 4. Database Schema
For each table:
- Columns with types
- Foreign keys and indexes
- RLS policy summary

**Required tables**: profiles, schemes, intake_sessions, eligibility_matches, applications, documents, audit_log

### 5. API Routes
For each endpoint:
- Method and path
- Auth requirements
- Input/output shape
- Side effects

### 6. AI Architecture
- Prompt templates for: intake, drafting, explanation
- Structured output schemas
- Guardrails (what AI must never do)
- Escalation triggers

### 7. Human-in-the-Loop Guardrails
- Matrix of allowed vs restricted AI actions
- Approval gates in UI
- Audit logging approach

### 8. Key User Journeys
Step-by-step flows for:
- First-time visitor completing intake
- Applying for a scheme
- Helper reviewing and approving

### 9. MVP Scope
Clear table showing what's MVP vs Phase 2 vs Phase 3

### 10. Design System Notes
- Color palette (hex codes)
- Typography scale
- Accessibility requirements

---

## 📝 Output Format Rules

1. **No implementation code** — structure, specs, and prompts only
2. **Be specific** — actual route paths, column names, prop types
3. **Be complete** — cover every page, component, table
4. **Be practical** — a developer should be able to build from this immediately
5. **Use Dutch context** — terms like gemeente, toeslag, regeling where appropriate

---

## ✅ Success Criteria

The output is complete when a developer can:
1. Set up the project structure in under 10 minutes
2. Know exactly which components to build
3. Create all database tables from the schema
4. Understand every user flow
5. Distinguish MVP from future features

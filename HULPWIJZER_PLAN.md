# 🏗️ HULPWIJZER — Implementation Plan

> **Goal**: Help single mothers in the Netherlands discover and access financial support they're entitled to.
>
> **Team Split**: Frontend (FE) and Backend (BE) can work in parallel with minimal merge conflicts.

---

## 📋 Quick Reference

| Item | Detail |
|------|--------|
| **Stack** | Next.js 14 (App Router), TypeScript, Supabase, Tailwind, shadcn/ui |
| **Auth** | Supabase Magic Link |
| **AI** | OpenAI GPT-4 |
| **Voice** | ElevenLabs TTS |
| **Automation** | Activepieces |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| `guest` | Browse schemes, start intake (no save) |
| `user` | Full access to own data, matches, applications |
| `helper` | Review assigned cases, approve drafts |
| `admin` | Manage schemes, users, system config |

---

## 🚦 MVP vs Later

| Feature | MVP | Phase 2 | Phase 3 |
|---------|:---:|:-------:|:-------:|
| Landing + info pages | ✅ | | |
| Schemes browser | ✅ | | |
| Intake chat (AI) | ✅ | | |
| Basic eligibility matching | ✅ | | |
| User dashboard | ✅ | | |
| Document upload | ✅ | | |
| AI draft generator | ✅ | | |
| Helper review queue | ✅ | | |
| Voice explanations (ElevenLabs) | | ✅ | |
| User ↔ Helper messaging | | ✅ | |
| Timeline & deadlines | | ✅ | |
| Activepieces automations | | ✅ | |
| Admin panel | | ✅ | |
| Renewal reminders | | | ✅ |
| Multi-language support | | | ✅ |
| Mobile app | | | ✅ |

---

## 📁 Project Structure

```
hulpwijzer/
├── app/
│   ├── (public)/          # No auth required
│   ├── (auth)/            # Login/verify pages
│   ├── (user)/            # Authenticated user pages
│   ├── (helper)/          # Helper role pages
│   ├── (admin)/           # Admin role pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn components
│   ├── intake/            # Intake-specific components
│   ├── schemes/           # Scheme-related components
│   ├── applications/      # Application components
│   └── shared/            # Shared/common components
├── lib/
│   ├── supabase/          # Supabase client helpers
│   ├── ai/                # AI prompts and helpers
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
└── supabase/
    ├── migrations/        # Database migrations
    └── seed.sql           # Sample data
```

---

# 🔧 BACKEND TASKS

> **Owner**: Backend Developer  
> **Workspace**: `/supabase`, `/app/api`, `/lib`, `/types`

---

## Phase 1: MVP 🎯

### 1.1 Project Setup

- [ ] Create Supabase project (local or cloud)
- [ ] Set up environment variables in `.env.local`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
- [ ] Create Supabase client helpers (browser + server versions)
- [ ] Generate TypeScript types from database schema

---

### 1.2 Database Schema

#### Table: `profiles`
- [ ] Create table with fields:
  - `id` (UUID, references auth.users)
  - `email`, `full_name`, `phone`, `postal_code`, `city`
  - `situation` (JSONB) — stores intake answers like `{ children: 2, income: "low", housing: "rent" }`
  - `role` (text: user/helper/admin)
  - `onboarding_completed` (boolean)
  - `created_at`, `updated_at`
- [ ] Add RLS: users can only read/update own profile
- [ ] Add trigger: auto-create profile on new auth user

#### Table: `schemes`
- [ ] Create table with fields:
  - `id`, `slug` (unique)
  - `name`, `short_description`, `full_description`
  - `category` (income/housing/childcare/healthcare/other)
  - `requirements` (JSONB) — e.g., `{ max_income: 30000, has_children: true }`
  - `source_url`, `source_name`, `last_verified_at`
  - `how_to_apply`, `documents_needed` (text array)
  - `typical_duration`, `is_active`
  - `created_at`, `updated_at`
- [ ] Add RLS: anyone can read active schemes, only admins can write
- [ ] Add indexes on `slug`, `category`, `is_active`

#### Table: `intake_sessions`
- [ ] Create table with fields:
  - `id`, `user_id` (nullable for guests)
  - `status` (in_progress/completed/abandoned)
  - `messages` (JSONB array) — conversation history
  - `extracted_data` (JSONB) — structured data from conversation
  - `completed_at`, `created_at`, `updated_at`
- [ ] Add RLS: users can only access own sessions

#### Table: `eligibility_matches`
- [ ] Create table with fields:
  - `id`, `user_id`, `scheme_id`
  - `status` (likely/maybe/unlikely)
  - `match_score` (0-100)
  - `reasoning` (text) — why they match
  - `missing_info` (text array) — what we still need
  - `is_dismissed`, `is_saved`
  - `calculated_at`
- [ ] Add RLS: users see only own matches
- [ ] Add unique constraint on (user_id, scheme_id)

#### Table: `applications`
- [ ] Create table with fields:
  - `id`, `user_id`, `scheme_id`
  - `status` (draft/ready_for_review/changes_requested/approved/submitted/accepted/rejected)
  - `draft_content` (JSONB) — form answers
  - `ai_draft` (text) — generated application text
  - `assigned_helper_id`, `helper_notes`
  - `submitted_at`, `decision_at`
  - `created_at`, `updated_at`
- [ ] Add RLS: users manage own, helpers see assigned cases

#### Table: `documents`
- [ ] Create table with fields:
  - `id`, `user_id`, `application_id` (nullable)
  - `name`, `file_path`, `file_type`, `file_size`
  - `category` (id/income/housing/other)
  - `created_at`
- [ ] Add RLS: users manage own documents
- [ ] Set up Supabase Storage bucket for files

#### Table: `audit_log`
- [ ] Create table with fields:
  - `id`, `actor_id`, `actor_role`
  - `action` (e.g., "application.approved")
  - `resource_type`, `resource_id`
  - `details` (JSONB)
  - `ip_address`, `created_at`
- [ ] Add RLS: only helpers/admins can read

---

### 1.3 Seed Data

- [ ] Create seed file with 5-10 Dutch schemes:
  - Kinderbijslag (child benefit)
  - Zorgtoeslag (healthcare allowance)
  - Huurtoeslag (rent allowance)
  - Kinderopvangtoeslag (childcare allowance)
  - Kindgebonden budget (child budget)
- [ ] Include realistic requirements JSON for each
- [ ] Add source URLs to official government sites

---

### 1.4 Authentication

- [ ] Configure Supabase Auth for magic link email
- [ ] Create auth callback route
- [ ] Create middleware for route protection:
  - Public routes: no auth needed
  - User routes: require authenticated user
  - Helper routes: require helper or admin role
  - Admin routes: require admin role
- [ ] Add helper function to get current user + role

---

### 1.5 API Routes

#### Intake
- [ ] `POST /api/intake/message` — send message, get AI response, extract data
- [ ] `POST /api/intake/complete` — finalize intake, save to profile, trigger matching

#### Matching
- [ ] `POST /api/matches/calculate` — calculate matches for current user based on profile.situation

#### Applications
- [ ] `POST /api/applications` — create new application for a scheme
- [ ] `GET /api/applications/[id]` — get application details
- [ ] `PATCH /api/applications/[id]` — update draft content
- [ ] `POST /api/applications/[id]/generate-draft` — generate AI draft
- [ ] `POST /api/applications/[id]/submit` — submit for helper review

#### Documents
- [ ] `POST /api/documents/upload` — upload file to storage, create record
- [ ] `DELETE /api/documents/[id]` — delete document

#### Helper
- [ ] `GET /api/helper/queue` — get applications awaiting review
- [ ] `POST /api/helper/applications/[id]/assign` — assign to self
- [ ] `POST /api/helper/applications/[id]/review` — approve or request changes

---

### 1.6 AI Integration

- [ ] Create prompts file with:
  - **Intake prompt**: conversational, extracts structured data, asks one question at a time
  - **Draft prompt**: formal Dutch, fills in application based on user data
  - **Explanation prompt**: simple language (B1 level), explains schemes clearly
- [ ] Create AI client wrapper with helper functions
- [ ] Create intake handler that manages multi-turn conversation
- [ ] Create draft generator function

---

## Phase 2: Enhanced Features

### 2.1 Additional Tables
- [ ] `messages` — user ↔ helper communication
- [ ] `timeline_events` — deadlines and reminders
- [ ] `consents` — GDPR consent tracking

### 2.2 Voice Integration
- [ ] `POST /api/voice/generate` — ElevenLabs TTS endpoint

### 2.3 Webhooks
- [ ] `POST /api/webhooks/activepieces` — handle automation triggers

### 2.4 Admin Endpoints
- [ ] CRUD for schemes
- [ ] User role management

---

# 🎨 FRONTEND TASKS

> **Owner**: Frontend Developer  
> **Workspace**: `/app/(public)`, `/app/(user)`, `/components`, `/hooks`

---

## Phase 1: MVP 🎯

### 1.1 Project Setup

- [x] Initialize Next.js 14 with TypeScript + Tailwind
- [x] Install and configure shadcn/ui (custom components built)
- [x] Set up custom color palette (CSS variables)
- [x] Create utility functions (cn, formatDate, formatCurrency)
- [x] Configure font (Geist)

---

### 1.2 Shared Components

#### Layout Components
- [x] `PublicHeader` — logo, nav links, login/CTA buttons
- [x] `PublicFooter` — links, about, contact info
- [x] `UserHeader` — logo, user menu (DashboardHeader)
- [x] `UserSidebar` — dashboard navigation
- [x] `MobileBottomNav` — 5-tab mobile navigation
- [ ] `HelperHeader` — helper-specific nav (Phase 2)

#### Custom Components
- [x] `SchemeCard` — name, description, category badge (Card component)
- [x] `EligibilityBadge` — likely/maybe/unlikely (Badge component)
- [x] `ChatMessage` — bubble for intake conversation
- [x] `LoadingSpinner` — consistent loading state (Skeleton)
- [x] `Button`, `Input`, `Textarea`, `Select`, `Modal`, `Tabs`, `Progress`, `Avatar`
- [ ] `DocumentUploader` — drag-drop with preview (Phase 2)
- [ ] `ApprovalGate` — message explaining human review (Phase 2)

---

### 1.3 Public Pages

#### Landing `/`
- [x] Hero with value proposition
- [x] 3-step "how it works"
- [x] CTA to start intake/assistent

#### How It Works `/hoe-werkt-het`
- [x] Step-by-step explanation
- [x] AI vs human roles
- [x] Privacy info

#### Browse Schemes `/regelingen`
- [x] List of schemes with cards
- [x] Filter by category
- [x] Search by name
- [x] Collapsible info header

#### Scheme Detail `/regelingen/[slug]`
- [x] Full description
- [x] Requirements
- [x] Documents needed
- [x] Source info (provider, last updated)
- [x] CTA to check eligibility

#### Privacy `/privacy`
- [x] Clear privacy policy

#### FAQ `/faq`
- [x] Accordion with common questions

#### Over Ons `/over-ons`
- [x] Mission and values

#### Contact `/contact`
- [x] Contact form

---

### 1.4 Auth Pages

#### Login `/login`
- [x] Email input
- [x] Magic link flow (mock)
- [x] Success state with confirmation

---

### 1.5 User Pages

#### Dashboard `/dashboard`
- [x] Welcome message
- [x] Stats (matches, applications, documents)
- [x] Quick actions

#### Intake `/intake`
- [x] Chat interface
- [x] Message input
- [x] Progress indicator
- [x] Completion modal

#### Assistent `/assistent`
- [x] Mobile-first chat interface
- [x] Quick reply buttons
- [x] Typing indicator

#### Matches `/dashboard/matches`
- [x] List of matched schemes
- [x] Status indicators

#### Applications `/dashboard/aanvragen`
- [x] List with status badges
- [x] Filter by status

#### Documents `/dashboard/documenten`
- [x] List uploaded files
- [x] Upload button
- [x] Delete action

#### Profile `/dashboard/profiel` & `/profiel`
- [x] User info display
- [x] Settings options

#### Meer `/meer`
- [x] Extra menu options
- [x] Links to all pages

---

### 1.6 Helper Pages (Phase 2)

#### Queue `/queue`
- [ ] Applications awaiting review
- [ ] Assign to self

#### Case Detail `/cases/[id]`
- [ ] User info summary
- [ ] Application + draft
- [ ] Documents
- [ ] Approve / Request changes buttons

#### Audit Log `/audit`
- [ ] List of actions
- [ ] Filters

---

### 1.7 Hooks

- [x] `useSupabase()` — current user + profile
- [x] `useRegelingen()` — fetch schemes with filters
- [x] `useMatches()` — user's matches
- [x] `useApplications()` — user's applications
- [x] `useChat()` — conversation state
- [x] `useDocuments()` — document management

---

## Phase 2: Enhanced Features

### 2.1 Voice
- [ ] `VoicePlayer` component with play/pause
- [ ] Integration on scheme detail pages

### 2.2 Messaging
- [ ] Messages page
- [ ] Conversation threads
- [ ] Real-time updates

### 2.3 Timeline
- [ ] Visual timeline view
- [ ] Deadline alerts

### 2.4 Admin
- [ ] Scheme management UI
- [ ] User management UI

---

# 🤝 COORDINATION

## Shared Files (Coordinate Changes)

| File | Owner | Notes |
|------|-------|-------|
| `types/database.ts` | BE | Generated from Supabase |
| `types/api.ts` | Both | Agree on shapes |
| `middleware.ts` | BE | FE needs to know protected routes |
| `lib/supabase/*` | BE | FE uses these |

## API Contract

Before building, agree on:
- [ ] Request/response shapes for each endpoint
- [ ] Error format: `{ error: string, code?: string }`
- [ ] Pagination format (if needed)

## Git Strategy

```
main          ← production
develop       ← integration
feature/be-*  ← backend features
feature/fe-*  ← frontend features
```

---

# ✅ Launch Checklist

- [ ] All MVP features working
- [x] Mobile responsive
- [ ] Error handling complete
- [x] Loading states everywhere (Skeleton component)
- [x] 5+ real schemes seeded (12 regelingen in mock-data)
- [x] Privacy policy written
- [ ] Environment variables set
- [ ] Domain + SSL configured

---

# 📚 Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [ElevenLabs](https://elevenlabs.io/docs)

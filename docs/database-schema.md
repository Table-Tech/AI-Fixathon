# Hulpwijzer Database Schema

Last updated: 2024-12-13
Status: VERIFIED against Supabase

## Tables Overview

1. **profiles** - User profiles with eligibility data
2. **regelingen** - Benefits/schemes data
3. **tasks** - User's action plan items
4. **subtasks** - Checkable items within tasks
5. **audit_log** - Action tracking for transparency
6. **user_consents** - GDPR consent tracking
7. **chat_messages** - Conversation history

---

## Table: `profiles`

Extends Supabase Auth users with profile and eligibility data.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | - | Primary key (from auth.users) |
| email | TEXT | NO | - | User email |
| name | TEXT | YES | - | Display name (show "Mama" if null) |
| created_at | TIMESTAMPTZ | YES | NOW() | - |
| updated_at | TIMESTAMPTZ | YES | NOW() | - |
| **Persoonlijk** |
| date_of_birth | DATE | YES | - | For age requirements |
| postal_code | TEXT | YES | - | For gemeente-specific regelingen |
| city | TEXT | YES | - | City/town |
| **Gezinssituatie** |
| number_of_children | INT | YES | 0 | Number of children |
| children_ages | INT[] | YES | {} | Array of children's ages |
| is_single_parent | BOOLEAN | YES | FALSE | Alleenstaande ouder |
| **Financieel** |
| income_range | TEXT | YES | - | 'low', 'middle', 'high' |
| employment_status | TEXT | YES | - | 'employed', 'unemployed', 'self_employed', 'student', 'retired' |
| receives_benefits | TEXT[] | YES | {} | Array of current benefits |
| **Wonen** |
| housing_type | TEXT | YES | - | 'rent', 'own' |
| monthly_rent | INT | YES | - | Monthly rent in euros |
| **Eligibility** |
| has_dutch_residence | BOOLEAN | YES | TRUE | Has valid residence permit |
| has_health_insurance | BOOLEAN | YES | TRUE | Has Dutch health insurance |
| has_debts | BOOLEAN | YES | FALSE | Has problematic debts |
| savings_under_limit | BOOLEAN | YES | TRUE | Savings below threshold |

**RLS Policies:**
- Users can view/update only their own profile

---

## Table: `regelingen`

Benefits and schemes data (mostly static/seeded).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| slug | TEXT | NO | - | URL-friendly identifier (unique) |
| title | TEXT | NO | - | e.g., "Huurtoeslag" |
| eligible_for | TEXT[] | YES | {} | e.g., ['single_mom', 'low_income'] |
| min_age | INT | YES | - | Minimum age requirement |
| max_age | INT | YES | - | Maximum age requirement |
| details | JSONB | YES | {} | See below |
| is_active | BOOLEAN | YES | TRUE | Soft delete flag |
| created_at | TIMESTAMPTZ | YES | NOW() | - |

**details JSONB structure:**
```json
{
  "description": "Full description",
  "short_description": "Brief summary",
  "category": "toeslagen|uitkeringen|kindregelingen|wonen",
  "requirements": ["req1", "req2"],
  "documents_needed": ["doc1", "doc2"],
  "source_url": "https://...",
  "provider": "Belastingdienst|SVB|Gemeente",
  "how_to_apply": "Application instructions",
  "estimated_amount": "€100 - €500 per maand",
  "impact_score": 8
}
```

**RLS Policies:**
- Anyone can view active regelingen

---

## Table: `tasks`

User's action plan items.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | FK → profiles |
| regeling_id | UUID | YES | - | FK → regelingen (optional link) |
| title | TEXT | NO | - | Task title |
| description | TEXT | YES | - | Task details |
| status | TEXT | YES | 'pending' | 'pending', 'in_progress', 'completed' |
| created_at | TIMESTAMPTZ | YES | NOW() | - |
| updated_at | TIMESTAMPTZ | YES | NOW() | - |

**RLS Policies:**
- Users can CRUD only their own tasks

---

## Table: `subtasks`

Checkable items within a task.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| task_id | UUID | NO | - | FK → tasks |
| title | TEXT | NO | - | Subtask title |
| is_done | BOOLEAN | YES | FALSE | Completion status |
| order | INT | YES | 0 | Sort order |
| created_at | TIMESTAMPTZ | YES | NOW() | - |

**RLS Policies:**
- Users can CRUD subtasks of their own tasks

---

## Table: `audit_log`

Track important actions for transparency.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | YES | - | FK → profiles (nullable for anon) |
| action | TEXT | NO | - | e.g., 'task.created', 'recommendation.viewed' |
| resource_type | TEXT | YES | - | e.g., 'task', 'regeling', 'draft' |
| resource_id | UUID | YES | - | ID of affected resource |
| details | JSONB | YES | {} | Extra context |
| risk_level | TEXT | YES | 'low' | 'low', 'medium', 'high' |
| created_at | TIMESTAMPTZ | YES | NOW() | - |

**RLS Policies:**
- Users can view their own audit logs
- Service role can insert

---

## Table: `user_consents`

GDPR consent tracking.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | FK → profiles |
| consent_type | TEXT | NO | - | e.g., 'data_processing', 'ai_recommendations' |
| granted | BOOLEAN | YES | FALSE | Consent status |
| granted_at | TIMESTAMPTZ | YES | - | When granted |
| revoked_at | TIMESTAMPTZ | YES | - | When revoked |

**Unique constraint:** (user_id, consent_type)

**RLS Policies:**
- Users can manage their own consents

---

## Table: `chat_messages`

Conversation history with AI assistant.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | YES | - | FK → profiles |
| session_id | UUID | NO | - | Groups messages by session |
| role | TEXT | NO | - | 'user', 'assistant' |
| content | TEXT | NO | - | Message text |
| metadata | JSONB | YES | {} | Extracted data, etc. |
| created_at | TIMESTAMPTZ | YES | NOW() | - |

**RLS Policies:**
- Users can view/create their own messages

---

## Indexes

```sql
idx_tasks_user_id ON tasks(user_id)
idx_tasks_status ON tasks(status)
idx_subtasks_task_id ON subtasks(task_id)
idx_chat_messages_user_id ON chat_messages(user_id)
idx_chat_messages_session_id ON chat_messages(session_id)
idx_audit_log_user_id ON audit_log(user_id)
idx_regelingen_slug ON regelingen(slug)
idx_regelingen_is_active ON regelingen(is_active)
idx_profiles_postal_code ON profiles(postal_code)
idx_profiles_income_range ON profiles(income_range)
```

---

## Eligible_for Values

Used in `regelingen.eligible_for` array to match with user profiles:

| Value | Description | Profile Match |
|-------|-------------|---------------|
| `low_income` | Low income | income_range = 'low' |
| `renter` | Renting | housing_type = 'rent' |
| `parent` | Has children | number_of_children > 0 |
| `single_mom` | Single mother | is_single_parent = true |
| `single_parent` | Single parent | is_single_parent = true |
| `working_parent` | Working with kids | employment_status = 'employed' AND number_of_children > 0 |
| `student_parent` | Student with kids | employment_status = 'student' AND number_of_children > 0 |
| `unemployed` | Unemployed | employment_status = 'unemployed' |
| `no_income` | No income | income_range = 'low' OR employment_status = 'unemployed' |
| `debt` | Has debts | has_debts = true |
| `financial_hardship` | Financial trouble | has_debts = true OR income_range = 'low' |
| `long_term_low_income` | 3+ years low income | (needs additional tracking) |
| `high_housing_costs` | High rent costs | monthly_rent > threshold |

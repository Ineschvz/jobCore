# JobCore — Architecture Plan (MVP)

Internal tool for Chavez Concrete — you, your cousin, and group leaders.

```
┌─────────────────────────────────────────────────────────┐
│                        USERS                             │
│                                                         │
│          👔 You & Cousin          👷 Group Leaders       │
│          (Full Access)            (View Jobs + Logs)     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│               NEXT.JS APP (Frontend)                    │
│                                                         │
│  PAGES                         UI TOOLS                 │
│  ──────                        ────────                 │
│  /login                        Tailwind CSS             │
│  /register                     shadcn/ui                │
│  /dashboard                    react-hook-form + zod    │
│  /jobs            ◄──────────  date-fns                 │
│  /jobs/[id]                    Mapbox (react-map-gl)    │
│  /bids                         react-pdf (viewer)       │
│  /timeline                     Recharts (dashboard)     │
│                                react-dropzone (uploads) │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │  @supabase/ssr
                     ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    SUPABASE                              │
│                                                         │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ │
│  │   AUTH   │ │  DATABASE │ │ STORAGE  │ │ REALTIME │ │
│  │          │ │ (Postgres)│ │          │ │          │ │
│  │ Email +  │ │           │ │ bid-docs │ │ Live job │ │
│  │ Password │ │ jobs      │ │ job-     │ │ updates  │ │
│  │          │ │ daily_logs│ │  photos  │ │ across   │ │
│  │ RLS per  │ │ bids      │ │          │ │ team     │ │
│  │ user     │ │           │ │          │ │          │ │
│  └──────────┘ └───────────┘ └──────────┘ └──────────┘ │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
     ┌─────────┐ ┌────────┐ ┌────────────┐
     │ MAPBOX  │ │react-  │ │ @react-pdf/│
     │         │ │pdf     │ │ renderer   │
     │ Job site│ │        │ │            │
     │ map pins│ │ View   │ │ Generate   │
     │ address │ │ bid    │ │ bid sheets │
     │ search  │ │ docs   │ │ (later)    │
     └─────────┘ └────────┘ └────────────┘


## Database Schema

  auth.users (built-in)
  ├── id (UUID)
  ├── email
  └── created_at
       │
       │ user_id FK on every table (RLS enforced)
       │
       ▼
  ┌──────────────────────────┐
  │          jobs             │  ◄── Phase 1 ✅ DONE
  ├──────────────────────────┤
  │ id          BIGINT PK    │
  │ user_id     UUID FK      │
  │ title       TEXT         │
  │ description TEXT         │
  │ address     TEXT         │
  │ lat         FLOAT        │
  │ lng         FLOAT        │
  │ status      TEXT         │  ◄── pending / active / complete
  │ start_date  DATE         │
  │ end_date    DATE         │
  │ created_at  TIMESTAMPTZ  │
  └────────────┬─────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
  ┌────────────┐  ┌────────────┐
  │ daily_logs │  │    bids    │   ◄── Phase 2
  ├────────────┤  ├────────────┤
  │ id         │  │ id         │
  │ job_id  FK │  │ job_id  FK │
  │ user_id FK │  │ user_id FK │
  │ date       │  │ amount     │
  │ notes      │  │ status     │  ◄── draft / sent / accepted / rejected
  │ hours      │  │ notes      │
  │ weather    │  │ doc_url    │  ◄── PDF in Supabase Storage
  │ photos[]   │  │ sent_date  │
  │ created_at │  │ created_at │
  └────────────┘  └────────────┘


## Page Flow

                    ┌──────────┐
                    │  /login  │
                    └────┬─────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     /dashboard      │
              │                     │
              │  Jobs overview      │
              │  Map of all sites   │
              │  Active bid count   │
              │  Quick stats        │
              └──┬──────┬───────┬──┘
                 │      │       │
         ┌───────┘      │       └────────┐
         ▼              ▼                ▼
    ┌─────────┐   ┌──────────┐    ┌──────────┐
    │  /jobs  │   │  /bids   │    │/timeline │
    │         │   │          │    │          │
    │ List    │   │ All bids │    │ All jobs │
    │ Add     │   │ Status   │    │ by date  │
    │ Filter  │   │ filters  │    │ range    │
    └────┬────┘   └──────────┘    └──────────┘
         │
         ▼
    ┌───────────┐
    │ /jobs/[id]│
    │           │
    │ Details   │
    │ Map pin   │
    │ Status    │
    │ Daily logs│
    │ Bid docs  │
    └───────────┘


## MVP Build Phases

  PHASE 1 — Auth + Jobs ✅ DONE
  ─────────────────────────────
  ✔ Supabase project + env vars
  ✔ Login / Register pages
  ✔ Dashboard (shell)
  ✔ Jobs CRUD (add, delete)
  ✔ Auth middleware (protected routes)
  ✔ RLS policies on jobs table

  PHASE 2 — Job Details + Map + Bids
  ────────────────────────────────────
  ○ Job detail page /jobs/[id]
  ○ Add address, start/end date, status to jobs
  ○ Mapbox map on dashboard (pins for all jobs)
  ○ Mapbox on job detail (single pin)
  ○ Daily logs per job
  ○ Bids page — track status + upload PDFs
  ○ Supabase Storage buckets (bid-docs, job-photos)
  ○ Better forms (react-hook-form + zod)

  PHASE 3 — Polish
  ─────────────────
  ○ Timeline view (jobs by date range)
  ○ Dashboard stats (active jobs, pending bids)
  ○ Charts (Recharts — jobs by status, bids by month)
  ○ Filter/search on jobs and bids
  ○ Mobile-friendly layout for group leaders on-site


## Tech Stack (MVP — Lean)

  FRONTEND              WHY
  ────────              ───
  Next.js 15            Framework (already set up)
  React 19              UI (already set up)
  Tailwind CSS          Styling (already set up)
  shadcn/ui             Components (already installed)
  react-hook-form       Forms (lightweight)
  zod                   Validation
  date-fns              Dates
  react-map-gl          Mapbox wrapper for React
  mapbox-gl             Mapbox GL JS
  react-pdf             View uploaded PDFs
  react-dropzone        File upload drag-and-drop
  recharts              Simple dashboard charts

  BACKEND               WHY
  ───────               ───
  Supabase Auth         Email/password login
  Supabase Database     Postgres — jobs, logs, bids
  Supabase Storage      PDF uploads, job photos
  Supabase Realtime     Live updates across team
  RLS Policies          Each user sees their own data

  EXTERNAL              WHY
  ────────              ───
  Mapbox                Map tiles + geocoding
                        50K free loads/month

  COST: ~$25/month (Supabase Pro to avoid auto-pause)
         Mapbox free tier covers a small team easily
```

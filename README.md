# Statura — Legal Intelligence Frontend

A production-ready Next.js 14 frontend for the Statura Legal Intelligence Backend (FastAPI + Celery).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS (custom design tokens) |
| UI Primitives | Radix UI (unstyled, fully accessible) |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios with interceptors |
| Charts | Recharts (confidence score gauge) |
| Notifications | Sonner |
| Unit tests | Vitest + React Testing Library |
| E2E tests | Playwright |

---

## Quick Start

```bash
# 1. Clone / copy the project
cd statura-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and set:
#   NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com

# 4. Run development server
npm run dev
# → http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev          # Next.js dev server with HMR
npm run build        # Production build
npm run start        # Serve production build locally
npm run lint         # ESLint
npm test             # Vitest unit tests (single run)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright end-to-end tests
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Base URL of your Statura FastAPI backend |

---

## Project Structure

```
statura-frontend/
├── app/
│   ├── (auth)/              # Login & Register pages (public)
│   │   ├── layout.tsx       # Split-panel auth shell
│   │   ├── login/
│   │   └── register/
│   └── (app)/               # Authenticated pages
│       ├── layout.tsx       # Sidebar + Topbar shell
│       ├── dashboard/
│       ├── documents/
│       │   └── [id]/        # Document detail + analysis workflow
│       ├── tenant/
│       └── activity/
│
├── features/                # Feature-first modules
│   ├── auth/                # types · api · hooks
│   ├── documents/           # types · api · hooks · DropzoneUpload
│   ├── analysis/            # types · api · hooks · AnalysisReport · TaskStatusBadge
│   └── tenant/              # types · api · hooks
│
├── components/
│   ├── ui/                  # Reusable primitives (Button, Card, Badge …)
│   └── layout/              # Sidebar, Topbar
│
├── hooks/
│   └── usePolling.ts        # Cancellation-safe polling with timeout
│
├── lib/
│   ├── axios.ts             # HTTP client + interceptors + error normalizer
│   ├── env.ts               # Environment validation
│   ├── query-keys.ts        # Typed TanStack Query key factory
│   └── utils.ts             # cn(), formatDate(), persistToken(), clearToken()
│
├── middleware.ts             # Next.js route guard (server-side)
├── providers/index.tsx       # QueryClient + Toaster providers
└── __tests__/
    ├── auth-guard.test.tsx
    ├── upload-form.test.tsx
    └── polling-hook.test.ts
```

---

## Auth Flow

- JWT is stored in `localStorage` and mirrored to a cookie named `access_token`
- The Next.js `middleware.ts` reads the cookie to redirect unauthenticated requests server-side
- The Axios request interceptor reads from `localStorage` to attach `Authorization: Bearer <token>` on every API call
- A 401 response clears both stores and redirects to `/login`
- Session is bootstrapped on app load via `GET /auth/me`

> **Security note:** For maximum security, consider moving the token to an `httpOnly` cookie via a Next.js API route proxy (`/api/auth/login`). This prevents XSS access to the token entirely.

---

## Analysis Workflow

1. User navigates to a document → `/documents/[id]`
2. Clicks **Run Analysis** → `POST /analysis/run` returns `{ task_id }`
3. `useTaskPolling` hook polls `GET /analysis/status/{task_id}` every 2.5 seconds
4. On `SUCCESS`, the result (full `Analysis` object) is rendered via `<AnalysisReport />`
5. Polling auto-cancels on component unmount and after a 5-minute timeout

---

## Deploy to Render

### Option A — Web Service (recommended for SSR)

1. Push repo to GitHub
2. Render → **New Web Service** → connect repo
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm run start`
5. Add env var: `NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com`

### Option B — Static Export

Add to `next.config.js`:
```js
output: 'export'
```
Then use a **Static Site** with publish directory `out`.

> Note: Static export disables middleware-based redirects. Use client-side route guards instead.

---

## Running Tests

```bash
# Unit + component tests
npm test

# Watch mode
npm run test:watch

# E2E (requires dev server on :3000)
npm run test:e2e
```

Test coverage:
- **`auth-guard.test.tsx`** — middleware redirect logic for all route/auth combinations
- **`upload-form.test.tsx`** — DropzoneUpload file selection, upload trigger, and clear behaviour
- **`polling-hook.test.ts`** — usePolling interval, timeout, error recovery, stop(), and unmount cancellation

---

## Design Decisions & Assumptions

1. **Token storage:** `localStorage` + cookie mirror was chosen over `httpOnly` cookies to avoid requiring a backend proxy, since the FastAPI backend doesn't set cookies directly. Documented as a future improvement.
2. **Analysis result shape:** `GET /analysis/status/{task_id}` is assumed to return the full `Analysis` object in the `result` field on success. If your backend returns only an `analysis_id`, swap to a second `GET /analysis/{id}` call inside `useTaskPolling`.
3. **Tenant 404:** If `GET /tenant/current` returns a 404 / error (user has no tenant), the workspace page renders the creation form. Adjust if your backend returns a different sentinel.
4. **Activity log:** Client-side only (localStorage). This is intentional for the MVP — no backend endpoint exists for audit logging.
5. **Polling interval:** Set to 2.5 seconds. Increase to 5s if your Celery tasks are typically long-running to reduce backend load.

---

## Future Improvements

- **httpOnly cookie auth** via `/api/auth` proxy routes to eliminate XSS token exposure
- **Optimistic UI** on document upload — show file in list immediately, mark as "uploading"
- **Persistent analysis history** — cache past analyses per document in TanStack Query or localStorage
- **WebSocket / SSE** — replace polling with real-time Celery task updates
- **Role-based UI** — hide admin-only actions from `member` role users using a `useAbility` hook
- **PDF preview pane** — embed `react-pdf` alongside the analysis report
- **Bulk document upload** — queue multiple files with per-file progress tracking
- **Light mode** — CSS variable structure already supports it; add `next-themes` + toggle
- **i18n** — `next-intl` for multi-language firm support
- **Storybook** — isolate and document all UI primitives

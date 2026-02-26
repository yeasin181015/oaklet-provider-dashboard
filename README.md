# Oaklet Provider Dashboard

A unified case management dashboard for providers credentialed across multiple practices on the Oaklet EHR platform.

## Quick Start

```bash
# 1. Clone and install
pnpm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo credentials:** `dr.smith@example.com` / `password123`

## What's Built

### Required Features
- **Login screen** — form validation, show/hide password, clear error messages on bad credentials
- **Protected routes** — unauthenticated users are redirected to `/login`; authenticated users redirected away from `/login`
- **Case list** — paginated table with: patient name + MRN, practice name, case type, status badge, priority badge, due date (highlighted red if overdue), unread message indicator
- **Filtering** — by practice, status, priority; sorting by updated\_at / due\_date / priority / created\_at with asc/desc toggle; search by patient name or case ID/MRN
- **Logout** — clears NextAuth session and redirects to login

### Nice-to-Have Features (all implemented)
- **Summary cards** — active cases, urgent count, overdue count, unread messages; reactive to practice filter
- **Additional filtering** — priority filter, sort controls
- **Search** — patient name, case ID, MRN
- **Pagination** — with smart page-number display and item range
- **Loading / empty / error states** — throughout all data-fetching surfaces
- **Responsive layout** — table columns collapse gracefully at smaller widths
- **Case detail view** — full case metadata, description, and timeline of events

---

## Architecture

### Mock Layer Design

The mock backend is implemented as **Next.js API route handlers** (`src/app/api/`). This was chosen over MSW or static fixtures for the following reasons:

1. **Zero client-side configuration.** MSW requires a service worker registration step and browser-specific setup. Route handlers work identically in every environment.
2. **Realistic network behaviour.** Each handler introduces a small artificial delay (150–400 ms) so the UI's loading states are exercised during development.
3. **Exact API contract fidelity.** The handlers return exactly the envelope shapes defined in the spec (`{ data, pagination }`, error objects, 401 on missing token), so switching to a real backend is a single env-var change.
4. **Swappability.** The service layer (`src/modules/*/services/service.ts`) only uses `apiClient`, which reads `NEXT_PUBLIC_API_BASE_URL`. Pointing that variable at a real host requires zero changes to component or hook code.

### Data-Fetching Abstraction

```
UI component
  └─ TanStack Query hook  (src/modules/cases/hooks/useCases.ts)
       └─ Service          (src/modules/cases/services/service.ts)
            └─ API Client   (src/lib/api-client/index.ts)
                 └─ fetch   → Next.js API route (mock) or real backend
```

Each layer has a single responsibility. To swap the mock for a live API: set `NEXT_PUBLIC_API_BASE_URL` to the real base URL.

### Directory Structure

```
src/
├── app/                  # Next.js App Router pages + API routes
│   ├── api/              # Mock backend handlers (auth, cases, practices)
│   ├── dashboard/        # Protected dashboard and case detail pages
│   └── login/            # Public login page
├── modules/              # Feature modules (isolated by design)
│   ├── authentication/   # Login form, service, types, validation
│   ├── cases/            # Case list, filters, table, detail, summary cards
│   └── practices/        # Practice service + hook
├── components/           # Shared UI components (button, input, badge, etc.)
├── contexts/             # React/TanStack Query providers
├── hooks/api/            # Query key factories
├── lib/
│   ├── api-client/       # Thin fetch wrapper
│   ├── mock/             # Mock data (32 cases, 3 practices)
│   └── routes/           # Centralised route constants
└── types/                # Shared TypeScript types + NextAuth augmentation
```

### Key Technology Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 App Router | Project requirement; server components for auth checks |
| Auth | NextAuth v5 (beta) | JWT strategy, credentials provider, built-in session management |
| Data fetching | TanStack Query | Declarative loading/error states, automatic deduplication, stale-time control |
| Forms | react-hook-form + zod | Type-safe validation with minimal boilerplate |
| UI primitives | Radix UI + CVA | Accessible, unstyled primitives; variant management via CVA |
| Styling | Tailwind CSS v4 | Utility-first, no runtime CSS-in-JS |

---

## What I Would Do Differently With More Time

1. **Token refresh.** The `POST /auth/refresh` endpoint is mocked but the JWT callback doesn't attempt a refresh when the token is near expiry. A production build would check `exp` in the JWT callback and call the refresh endpoint transparently.

2. **Optimistic updates & mutations.** Status changes and case assignments could use TanStack Query's `useMutation` with optimistic cache updates so the UI responds instantly.

3. **URL-driven filter state.** Filters are currently held in React state. Storing them in URL search params would allow bookmarking, browser back/forward navigation, and sharable filtered views — important for a clinical tool.

4. **Comprehensive test coverage.** Unit tests for the service layer (mock the fetch client), integration tests for the API route handlers, and component tests for the filter logic would increase confidence before a real deployment.

5. **MSW for Storybook / component tests.** While route handlers are the right choice for end-to-end mock fidelity, adding MSW alongside them would make component-level Storybook stories easier to write without needing a running server.

6. **Accessibility audit.** The table needs `aria-sort` attributes on sortable columns; the filter selects need clearer focus indicators on high-contrast displays.

---

## Approximate Time Spent

| Phase | Time |
|---|---|
| Project setup, architecture planning | ~30 min |
| Mock data + API route handlers | ~45 min |
| Auth (NextAuth, login page, middleware) | ~30 min |
| Core dashboard UI (table, filters, pagination) | ~60 min |
| Summary cards, case detail view | ~30 min |
| TypeScript fixes, build validation | ~15 min |
| README | ~15 min |
| **Total** | **~3.5 hours** |

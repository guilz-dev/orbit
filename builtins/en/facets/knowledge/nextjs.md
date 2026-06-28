# Next.js Knowledge

Next.js App Router + React Server Components patterns. Pair with `react` / `frontend` knowledge.

## Server vs Client Components

| Criteria | Judgment |
|----------|----------|
| `"use client"` added at a high boundary, pulling the whole tree to the client | REJECT |
| Data fetching done in a Client Component when a Server Component could | REJECT |
| Secret / server-only key imported into a Client Component | REJECT |
| `useState`/`useEffect`/event handlers in a file without `"use client"` | REJECT (won't run) |

- Default to Server Components. Add `"use client"` only at the leaf that needs interactivity/state.
- Fetch data in Server Components (`async` component + `fetch`/DB call); pass plain data down.
- Keep secrets server-side; never reference them below a `"use client"` boundary.

## Rendering & Data

| Concern | Guidance |
|---------|----------|
| Static content | Default static; cache via `fetch` options |
| Dynamic/per-request | `cache: 'no-store'` or `dynamic = 'force-dynamic'` |
| Revalidation | `next.revalidate` (ISR) for time-based freshness |
| Mutations | Server Actions or Route Handlers; revalidate affected paths/tags |

| Criteria | Judgment |
|----------|----------|
| Mutation without `revalidatePath`/`revalidateTag` (stale UI) | REJECT |
| Sequential awaits that could be parallel (`Promise.all`) | Warning |
| Client-side fetch in `useEffect` for data available at request time | REJECT |

## Routing & Anti-patterns

| Anti-pattern | Problem |
|--------------|---------|
| Putting everything under one Client Component | Loses RSC benefits |
| `loading.tsx` / `error.tsx` missing on async routes | No Suspense/error UX |
| Layout fetching per-page data | Layouts persist; fetch in the page |
| Importing a Server Component into a Client Component as a child via `import` | Pass as `children` prop instead |

# AS Test 2 — Frontend

This repository contains the frontend for the "as-test-2" project (Next.js app). This README documents project layout, key files, configuration, development setup, and guidance for contributors.

**Project Summary**
- **Purpose:** Frontend built with Next.js (app router) providing authentication flows, a protected dashboard, UI components, and client/server utilities.
- **What to look for:** Authentication implementation under `app/api/auth/[...nextauth]/route.ts`, pages and routes under `app/`, UI components under `components/`, and reusable libs in `lib/`.

**Tech Stack**
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules / global CSS (`app/globals.css` present)
- **Auth:** NextAuth-style route present in `app/api/auth/[...nextauth]/route.ts`
- **Linting:** `eslint.config.mjs` exists (project uses ESLint config)

**Prerequisites**
- Node.js (16+/18+ recommended)
- npm or pnpm or yarn

**Quick Start**
- Install dependencies:

  ```bash
  npm install
  ```

- Run the development server:

  ```bash
  npm run dev
  ```

- Build for production:

  ```bash
  npm run build
  npm run start
  ```

Note: Check `package.json` for exact script names and any additional scripts (lint, format, test).

**Environment / Configuration**
The project includes an auth route which will typically require environment variables. Common variables you may need to set:
- `NEXTAUTH_URL`: URL where the app is hosted (used by NextAuth)
- `NEXTAUTH_SECRET`: Secret used by NextAuth
- `DATABASE_URL`: If server-side persistence is used
- `GITHUB_ID` / `GITHUB_SECRET` or other provider-specific secrets: If OAuth providers are configured

Action: open `app/api/auth/[...nextauth]/route.ts` to confirm which provider env variables are required and set them in your `.env.local`.

**Repository Structure (top-level)**
- `app/` — Next.js app router entry points and routes
- `components/` — Reusable UI and auth components
- `hooks/` — Custom React hooks
- `lib/` — Utility modules, API wrappers, auth helpers
- `public/` — Static assets
- `eslint.config.mjs`, `next.config.ts`, `tsconfig.json` — Project config files

**Detailed Folder Map and Key Files**

- `app/`
  - `globals.css` — global styles
  - `layout.tsx` — root layout for the app
  - `page.tsx` — home page
  - `(auth)/`
    - `login/page.tsx` — login page
    - `register/page.tsx` — registration page
  - `(common)/demo/page.tsx` — demo page (shared/common UI)
  - `(protected)/dashboard/page.tsx` — dashboard for authenticated users
  - `(protected)/dashboard/transaction-extractor.tsx` — feature component for extracting transactions
  - `(protected)/dashboard/transactions-list.tsx` — component to show transactions
  - `api/auth/[...nextauth]/route.ts` — API route implementing auth (NextAuth-style)

- `components/`
  - `auth/logout-button.tsx` — logout UI and logic
  - `ui/` — design-system components used across pages
    - `alert.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `field.tsx`, `input.tsx`, `label.tsx`, `separator.tsx`, `skeleton.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `tooltip.tsx`

- `hooks/`
  - `useRegister.ts` — registration helper hook (likely client-side logic for registering users)

- `lib/`
  - `auth.ts` — shared auth helpers (session handling, redirects, etc.)
  - `fetcher.ts` — fetch wrapper for API calls
  - `utils.ts` — miscellaneous utilities
  - `api/auth.ts` — client-side API wrapper for auth endpoints

- `public/` — currently empty (use for images, favicon, other static assets)

**Folder Structure (tree)**
```
d:/. (repo root)
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ (common)/
│  │  └─ demo/page.tsx
│  ├─ (protected)/
│  │  └─ dashboard/
│  │     ├─ page.tsx
│  │     ├─ transaction-extractor.tsx
│  │     └─ transactions-list.tsx
│  └─ api/
│     └─ auth/
│        └─ [...nextauth]/route.ts
├─ components/
│  ├─ auth/
│  │  └─ logout-button.tsx
│  └─ ui/
│     ├─ alert.tsx
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ dropdown-menu.tsx
│     ├─ field.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ separator.tsx
│     ├─ skeleton.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     └─ tooltip.tsx
├─ hooks/
│  └─ useRegister.ts
├─ lib/
│  ├─ api/
│  │  └─ auth.ts
│  ├─ auth.ts
│  ├─ fetcher.ts
│  └─ utils.ts
├─ public/
└─ config files (package.json, tsconfig.json, next.config.ts, eslint.config.mjs)
```

**Example Workflow — how an input flows through the app**
This walkthrough explains a typical flow for a user action (e.g., submitting a transaction or registering):

1. User input (UI)
  - The user visits a page such as the dashboard or the register page: `app/(auth)/register/page.tsx` or `app/(protected)/dashboard/page.tsx`.
  - They interact with form components built from `components/ui/*` (for example `input.tsx`, `field.tsx`, and `button.tsx`).

2. Client-side hook & validation
  - Form logic can use `hooks/useRegister.ts` (for registration) or in-component handlers for dashboard forms.
  - Client-side validation runs before network calls.

3. Client fetch / API wrapper
  - The component calls a client API wrapper in `lib/api/auth.ts` or directly uses `lib/fetcher.ts` to POST data to an API route (for example, to `app/api/auth/...` or a custom app route).
  - `lib/fetcher.ts` standardizes headers, JSON parsing, and error handling.

4. Authentication / Session (if required)
  - Protected actions check session state via helpers in `lib/auth.ts` or client session hooks provided by NextAuth.
  - If the user is not authenticated, the UI redirects to `app/(auth)/login/page.tsx`.

5. Server-side API / NextAuth route
  - Auth-specific network requests hit `app/api/auth/[...nextauth]/route.ts` for provider callbacks, sign-in, and session handling.
  - Other server routes (not present in the scanned tree) could process transactions, persist to DB, and return responses.

6. Server response → client
  - The server returns JSON; `lib/fetcher.ts` unwraps the payload and forwards it back to the caller.
  - The client updates local state and UI components (for example, `transactions-list.tsx`) based on the response.

7. UI update and persist
  - On success, the UI shows confirmation with `components/ui/alert.tsx` or updates the `components/ui/table.tsx` to include new data.
  - For persisted data, ensure the backend writes to a database and that callbacks/redirects in `route.ts` are correct.

Notes & tips:
- To trace a bug: start in the UI component, follow the API calls through `lib/fetcher.ts` and client wrappers in `lib/api/*`, then inspect `app/api/*` server routes and provider callbacks in `app/api/auth/[...nextauth]/route.ts`.
- For new features, add unit-tests around `lib/fetcher.ts` and `lib/api/*`, and integration tests exercising `app/` routes.

**Routing and Pages**
- App router map is driven by `app/` folders. Notable routes:
  - `/` — home (root `app/page.tsx`)
  - `/login` — login
  - `/register` — register
  - `/demo` — demo
  - `/dashboard` — protected dashboard

When adding routes, follow the Next.js App Router conventions used in this codebase.

**Authentication Flow (where to inspect / change)**
- Server-side auth route: `app/api/auth/[...nextauth]/route.ts` — this is the canonical place for providers, callbacks, and sessions.
- Client-side / UI helpers: `lib/auth.ts`, `lib/api/auth.ts`, and `hooks/useRegister.ts`.
- Login / Register UI: `app/(auth)/login/page.tsx` and `app/(auth)/register/page.tsx`.

**Components and Design System**
- The `components/ui/` directory contains primitives and shared UI patterns. Prefer these over ad-hoc markup for consistent styling.
- The `components/auth/logout-button.tsx` contains the logout flow and is likely used in protected areas like the dashboard.

**Development Notes & Conventions**
- File grouping: This repository uses the Next.js App Router and groups route-level UI in the `app/` directory; route folders use parentheses for special grouping like `(auth)` and `(protected)`.
- Shared UI: Centralize new UI elements in `components/ui/` and avoid duplication.
- API calls: Use `lib/fetcher.ts` and `lib/api/*` wrappers for consistent error handling and JSON parsing.
- TypeScript: Keep types and interfaces close to the code they describe, and leverage `tsconfig.json` for strictness.

**Testing & Linting**
- `eslint.config.mjs` exists; run linting via the script in `package.json` (commonly `npm run lint`).
- No test framework files were discovered in the scanned structure; consider adding Jest/Testing Library or Playwright if end-to-end testing is desired.

**Build & Deployment Tips**
- Ensure environment variables for authentication and any external APIs are provided in production (e.g., provider secrets and `NEXTAUTH_URL`).
- Use `npm run build` then `npm run start` for production deployment.

**Troubleshooting**
- If auth fails, check `app/api/auth/[...nextauth]/route.ts` for provider configuration and callback URLs.
- For missing styles, confirm `app/globals.css` is imported by `layout.tsx` and classes used by components match CSS definitions.

**Contribution Guide**
- Before creating a PR:
  - Run `npm run lint` and fix issues.
  - Run build locally with `npm run build` to catch compile-time issues.
  - Keep UI changes in `components/ui` and route changes within `app/`.

**Next Steps / Suggested Improvements**
- Add a `README.md` for the backend (if applicable) and link to it.
- Add a `.env.example` listing the required env vars and sample values.
- Add automated tests and CI (GitHub Actions) for linting and build checks.

**Contact & Maintainers**
- If you have questions, open an issue or contact the repo maintainer directly.

---

Generated by scanning the project's top-level folders and files. For more precise information about scripts and runtime configuration, inspect `package.json` and `app/api/auth/[...nextauth]/route.ts`.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

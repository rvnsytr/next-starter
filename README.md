# Next.js Starter Template

A lightweight, opinionated starter template for **Next.js 16 (App Router)** with just the tools and configurations I use in most projects. Built to minimize the setup process so I can get straight to building features rather than configuring the basics.

## Features

- Authentication with user dashboard and RBAC
- Clean, modular project structure
- Database and S3 integration (Drizzle + AWS SDK)
- Handy utility functions, actions and S3 helpers
- Ready-to-use components, and styling
- Scalable feature-based modules architecture

## Tech Stack

- Framework and Language
  - [Next.js 16](https://nextjs.org)
  - [React 19.2](https://react.dev)
  - [TypeScript](https://www.typescriptlang.org)

- Styling
  - [Tailwind CSS v4](https://tailwindcss.com)
  - [Shadcn/ui](https://ui.shadcn.com)

- Database and ORM
  - [PostgreSQL](https://www.postgresql.org)
  - [Drizzle ORM](https://orm.drizzle.team)

- Authentication
  - [Better Auth](https://better-auth.com)

- Other
  - [Prettier](https://prettier.io)
  - [Zod v4](https://zod.dev)
  - [SWR](https://swr.vercel.app/)
  - [Motion](https://motion.dev)
  - [AWS SDK for S3](https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3)

## Getting Started

### Installation

```sh
git clone https://github.com/RvnSytR/next-starter
cd next-starter
bun install
```

### Database Setup

Push database schema to your PostgreSQL instance:

```sh
bunx drizzle-kit push
```

### Development Server

```sh
bun run dev
```

## File Structure

This project uses a **feature-based module architecture**, where each feature is isolated, self-contained, and exports only its public API, where shared, stable, low-change code lives in `core/`.

### Principles

- Each feature lives in `modules/<feature>/`
- A Module contain **only what the module needs**
- Prefer the **shortest possible import path**
- Components can be structured either as:
  - a single file (`component.tsx`, `component.client.tsx`), or
  - grouped (`components/*`) — as long as public components are exported from the module’s index.ts
- `core/` contains shared, stable, low-change code and **should not be edited**
- Only edit the following files when extending domain logic:
  - `core/constants/menu.ts` — Menus metadata
  - `core/route.ts` — Routes metadata
  - `core/schema.db.ts` — Drizzle DB schemas
  - `core/schema.zod.ts` — Zod schemas

```pgsql
next-starter/
  app/
    api/
    dashboard/
    sign-in/
    layout.tsx
    not-found.tsx
    page.tsx

  modules/
    auth/
      actions.ts
      components.tsx
      components.client.tsx
      constants.ts
      hooks.ts                -- Module-specific hooks and SWR helpers (useSWR and its mutator).
      provider.auth.tsx       -- format: provider.<name>.tsx

    parent-module/
      sub-module/

  core/
    components/
      layout/
      ui/
    constants/
      menu.ts                 -- Modifiable.
    hooks/
    providers/
    utils/

    actions.ts
    api.ts
    auth.client.ts
    auth.ts
    data-table.ts
    db.ts
    filter.ts
    permissions.ts
    route.ts             -- Modifiable.
    schema.db.ts             -- Modifiable.
    schema.zod.ts            -- Modifiable.
    storage.ts

  public/

  styles/
    globals.css
```

### Examples

#### - Prefer Shortest Import

```typescript
import ... from "./auth";      // ✅ OK
import ... from "../auth";     // ✅ OK
import ... from "@/core/auth"; // ✅ OK

import ... from "../../auth";  // ❌ Avoid deep relative imports
```

## TODO

- Ban & Unban Table Action
- More Numeric Form Inputs
- Event Calendar
- Rich Text Editor
- from react-starter: email verification
- from react-starter: reset password

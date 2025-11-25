# Next.js Starter Template

A lightweight, opinionated starter template for **Next.js 16 (App Router)** with just the tools and configurations I use in most projects. Designed to speed up the setup process so I can get straight to building features rather than configuring the basics.

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
  - [Drizzle ORM](https://orm.drizzle.team) with [drizzle-zod](https://orm.drizzle.team/docs/zod)

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

This project follows a module-based architecture, where each feature is isolated and self-contained.

### Principles

- Each feature lives in `modules/<feature>/`
- A Module contain **only what the module needs**
- Export only **high-level** module APIs via `index.ts`
- Do **not** re-export low-level files such as `schemas.zod.ts` or `schemas.db.ts`
- `core/` **should not be edited**, except `core/db/schemas.ts` when adding new module DB schemas
- Prefer the **shortest possible import path**
- Components can be structured either as single files (`module/<feature>/component.tsx`, `module/<feature>/component.client.tsx`) or grouped inside a folder (`module/<feature>/components/*`) — as long as the public components are exported through the module’s `index.ts`

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
      schemas.db.ts
      schemas.zod.ts
      provider.auth.tsx       -- format: provider.<name>.tsx
      index.ts                -- high-level exports

    parent-module/
      sub-module/
        index.ts
      index.ts

  core/                       -- Shared, stable, low-change code
    components/
      layout/
      ui/
    constants/
      routes.ts               -- Contains all route metadata. Modify when adding or updating modules or routes.
    db/
      index.ts
      schemas.ts              -- Aggregate Drizzle schemas. Allowed to edit if new module includes a `db.schemas.ts`
    hooks/
    providers/
    utils/

    actions.ts
    api.ts
    auth.client.ts
    auth.ts
    permissions.ts
    s3.ts
    schemas.ts                -- Shared base Zod schemas.

  public/

  styles/
    globals.css
```

### Example

#### - Module Entry Point ( `@/modules/<thing>/index.ts` )

```typescript
export * from "./actions";
export * from "./components";
export * from "./components.client";
export * from "./constants";
export * from "./provider.auth";
```

#### - Importing Module Schemas

```typescript
// ❌ Wrong (do not re-export schemas in index.ts)
// @/modules/auth/index.ts
export * from "./schemas.zod";

// @/modules/post/components.tsx
import { userSchema } from "@/modules/auth";

// ✅ Correct (import schema directly)
// @/modules/post/components.tsx
import { userSchema } from "@/modules/auth/schemas.zod";
```

#### - Prefer Shortest Import

```typescript
import ... from "./auth";      // ✅ OK
import ... from "../auth";     // ✅ OK
import ... from "@/core/auth"; // ✅ OK

import ... from "../../auth";  // ❌ Avoid deep relative imports
```

## TODO

- Date Picker Input
- Drizzle Studio Integration
- Server-Side Data Table
- Dashboard Menu Search (Ctrl + K) + Pinning
- More Numeric Form Inputs
- Event Calendar
- safeMutate(key) helper for SWR

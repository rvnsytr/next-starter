# Next.js Starter Template

A **Next.js 16 App Router** starter template with authentication, database, S3 file handler, and a modular architecture. Skip the boring part.

## Tech Stack

- Framework and Language
  - [Next.js 16](https://nextjs.org)
  - [React 19.2](https://react.dev)
  - [TypeScript](https://www.typescriptlang.org)

- Styling
  - [Tailwind CSS v4](https://tailwindcss.com)
  - [coss/ui](https://coss.com/ui), [shadcn/ui](https://ui.shadcn.com) and other mentioned component libraries

- Database and ORM
  - [PostgreSQL](https://www.postgresql.org)
  - [Drizzle ORM (v1)](https://orm.drizzle.team)

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
git clone https://github.com/rvnsytr/next-starter &&
cd next-starter &&
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

This project uses a **feature-based (module) architecture** where each feature is isolated and self-contained, where stable low-change code lives in `core/` and globally used code or configs lives in `shared/`.

### Principles

- Common utilities and components are placed in `core/` for reuse across modules, while shared configurations and types are in `shared/`.
- Each module is self-contained, with its own actions, config, components, and hooks.
- Import paths should be as short as possible, avoiding deep relative imports.
- Modules code can be structured as either a single file (e.g., `actions.ts`) or a folder containing multiple related files (e.g., `components/`), depending on the complexity of the feature. The key is to keep related code together and maintain clarity in the project structure. For example, a module usually contains:
  - `actions` — Server actions
  - `config` — Module-specific configuration
  - `components` — React components related to the module
  - `hooks` — Custom hooks related to the module
  - `schema` — Zod schemas

### Import Conventions

```typescript
import ... from "./feature";           // ✅ OK - shortest path
import ... from "../sibling";          // ✅ OK
import ... from "@/core/utils";        // ✅ OK - alias imports
import ... from "@/shared/menu";       // ✅ OK - shared config

import ... from "../../deep/path";     // ❌ Avoid deep relative imports
```

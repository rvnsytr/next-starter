# Next.js Starter Template

A lightweight, opinionated starter template for **Next.js 16 (App Router)** with just the tools and configurations I use in most projects. Designed to speed up the setup process so I can get straight to building features rather than configuring the basics.

## Features

- Authentication with user dashboard and RBAC
- Clean, modular project structure
- Database and S3 integration (Drizzle + AWS SDK)
- Handy utility functions, actions and S3 helpers
- Ready-to-use components, and styling
- Feature-based “modules” system for scaling apps

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
  - [AWS SDK for S3](https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3)
  - [Zod v4](https://zod.dev)
  - [SWR](https://swr.vercel.app/)
  - [Motion](https://motion.dev)
  - [Prettier](https://prettier.io)

## Getting Started

### Installation

Create a new repository using this template or clone the repository directly:

```sh
git clone https://github.com/RvnSytR/next-starter
cd next-starter
```

Install the dependencies:

```sh
bun install
```

### Database Setup

Push database schema to your PostgreSQL instance:

```sh
bunx drizzle-kit push
```

### Development Server

Start the Next.js development server:

```sh
bun run dev
```

## File Structure

The project uses a **module-based** architecture:

- Each feature lives inside `modules/...`
- Modules contain only what they need
- Modules must export everything through `index.ts`
- `core/` contains shared logic and should not be edited

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
    auth/                     -- Example "auth" feature module
      actions.ts              -- Server actions
      constants.ts            -- Module-specific constants
      components.tsx          -- Server components
      components.client.tsx   -- Client components
      db.schemas.ts            -- Drizzle schema for this module
      zod.schemas.ts           -- Zod validation for this module
      index.ts                -- Re-export everything from this module. So it can be imported cleanly, like: import { SignInForm } form "@/modules/auth"

  core/                       -- Shared, stable, "do-not-edit" code
    components/
      layout/
      ui/
    constants/
    db/
      index.ts
      schemas.ts              -- Master Drizzle schema that unifies all module db schemas. Allowed to edit if new module includes a `db.schemas.ts`.
    hooks/
    providers/
    utils/

    api.ts
    auth.client.ts
    auth.ts
    menu.ts
    permissions.ts
    s3.ts
    zod.ts

  public/

  styles/
    globals.css
```

## Tips

To avoid default imports for `next/router` and `radix-ui` components, you can adjust your TypeScript settings by adding the following configuration to your `.vscode/settings.json` file:

```json
{
  "typescript.preferences.autoImportFileExcludePatterns": [
    "next/router",
    "radix-ui"
  ]
}
```

## TODO

- Date Picker Input
- Drizzle Studio
- Server Side Data Table
- Dashboard Menu Search (ctrl + k) and Pinning
- More Input Number Fields
- Event Calendar
- ? safeMutate(key) for SWR

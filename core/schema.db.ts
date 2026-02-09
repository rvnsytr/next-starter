/*
    * Central export for all database schemas across modules.
    This file is the single source of truth for:
        - Drizzle runtime (`db.ts`)
        - and Drizzle Kit (`drizzle.config.ts`) schema loader.

    ! Do not define schemas here directly.
    Always add schemas in their respective modules and export them here.
 */

export * from "@/modules/auth/schema.db";

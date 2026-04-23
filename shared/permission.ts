// https://www.better-auth.com/docs/plugins/admin#admin-roles

import {
  Role as BetterAuthRole,
  createAccessControl,
} from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export type Role = (typeof allRoles)[number];
export const allRoles = ["user", "admin"] as const;
export const defaultRole: Role = "user";

export const ac = createAccessControl({
  ...defaultStatements,
  storage: ["create", "list", "get", "delete"],
  "event-log": ["list", "list:own", "list:user"],
});

export const roles: Record<Role, BetterAuthRole> = {
  user: ac.newRole({
    storage: ["create", "get", "delete"],
    "event-log": ["list:own"],
  }),

  admin: ac.newRole({
    ...adminAc.statements,
    storage: ["create", "list", "get", "delete"],
    "event-log": ["list", "list:own", "list:user"],
  }),
};

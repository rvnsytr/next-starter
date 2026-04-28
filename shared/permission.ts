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
  files: ["create", "list", "get", "delete"],
  activity: ["list", "get"],
});

export const roles: Record<Role, BetterAuthRole> = {
  user: ac.newRole({
    files: ["create", "get", "delete"],
  }),

  admin: ac.newRole({
    ...adminAc.statements,
    files: ["create", "list", "get", "delete"],
    activity: ["list", "get"],
  }),
};

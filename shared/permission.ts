// https://www.better-auth.com/docs/plugins/admin#admin-roles

import { Role } from "@/modules/auth/constants/roles";
import {
  Role as BetterAuthRole,
  createAccessControl,
} from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,
  files: ["create", "list", "get", "delete"],
  histories: ["list", "get"],
});

export const roles: Record<Role, BetterAuthRole> = {
  user: ac.newRole({
    files: ["create", "get", "delete"],
  }),

  admin: ac.newRole({
    ...adminAc.statements,
    files: ["create", "list", "get", "delete"],
    histories: ["list", "get"],
  }),
};

// https://www.better-auth.com/docs/plugins/admin#admin-roles

import { Role } from "@/modules/auth/constants";
import {
  Role as BetterAuthRole,
  createAccessControl,
} from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,
  example: ["create", "update", "delete"],
});

export const roles: Record<Role, BetterAuthRole> = {
  user: ac.newRole({
    example: ["create"],
  }),

  admin: ac.newRole({
    ...adminAc.statements,
    example: ["create", "update", "delete"],
  }),
};

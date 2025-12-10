// https://www.better-auth.com/docs/plugins/admin#admin-roles

import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,
  project: ["create", "update", "delete"],
});

export const roles = {
  user: ac.newRole({ project: ["create"] }),

  admin: ac.newRole({
    ...adminAc.statements,
    project: ["create", "update", "delete"],
  }),
};

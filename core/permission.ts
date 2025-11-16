// Any role that isn't in the adminRoles list, even if they have the permission, will not be considered an admin.
// https://www.better-auth.com/docs/plugins/admin#admin-roles

import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import { LucideIcon, ShieldUser, UserRound } from "lucide-react";

export const ac = createAccessControl({
  ...defaultStatements,
  project: ["create", "update", "delete"],
} as const);

export const roles = {
  user: ac.newRole({ project: ["create"] }),

  admin: ac.newRole({
    ...adminAc.statements,
    project: ["create", "update", "delete"],
  }),
};

export type Role = keyof typeof roles;
export const defaultRole = "user" satisfies Role;

export const allRoles = Object.keys(roles) as Role[];
export const adminRoles: Role[] = ["admin"];
export const userRoles: Role[] = allRoles.filter(
  (role) => !adminRoles.includes(role),
);

export const rolesMeta: Record<
  Role,
  { displayName: string; desc: string; icon: LucideIcon; color: string }
> = {
  user: {
    displayName: "Pengguna",
    icon: UserRound,
    desc: "Pengguna standar dengan akses dan izin dasar.",
    color: "var(--primary)",
  },
  admin: {
    displayName: "Admin",
    icon: ShieldUser,
    desc: "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
    color: "var(--rvns)",
  },
};

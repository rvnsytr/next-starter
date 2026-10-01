"use client";

import { useSession } from "../hooks/use-session";
import { UserRoleBadge } from "./user-role-badge";
import { UserVerifiedBadge } from "./user-verified-badge";

export function ProfileBadges() {
  const { user } = useSession();
  return (
    <>
      {user.emailVerified && <UserVerifiedBadge />}
      <UserRoleBadge value={user.role} />
    </>
  );
}

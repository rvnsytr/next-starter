"use client";

import { useSession } from "../hooks/use-session";
import { RoleBadge } from "./role-badge";
import { UserVerifiedBadge } from "./user-verified-badge";

export function ProfileBadges() {
  const { user } = useSession();
  return (
    <>
      {user.emailVerified && <UserVerifiedBadge />}
      <RoleBadge value={user.role} />
    </>
  );
}

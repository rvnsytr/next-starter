"use client";

import { useAuth } from "../provider";
import { UserRoleBadge } from "./user-role-badge";
import { UserVerifiedBadge } from "./user-verified-badge";

export function ProfileBadges() {
  const { user } = useAuth();
  return (
    <>
      {user.emailVerified && <UserVerifiedBadge />}
      <UserRoleBadge value={user.role} />
    </>
  );
}

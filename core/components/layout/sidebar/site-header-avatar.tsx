"use client";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { useSession } from "@/modules/auth/provider";

export function SidebarAppSiteHeaderAvatar() {
  const { user } = useSession();

  return (
    <Avatar className="rounded-md *:rounded-md after:rounded-md">
      <AvatarImage src={user.image ?? undefined} />
      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
      <AvatarBadge className="bg-success" />
    </Avatar>
  );
}

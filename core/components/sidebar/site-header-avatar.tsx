"use client";

import { useSession } from "@/modules/auth/hooks/use-session";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";

export function SidebarAppSiteHeaderAvatar() {
  const { user } = useSession();

  return (
    <Avatar radius="md">
      <AvatarImage src={user.image ?? undefined} />
      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
      <AvatarBadge className="bg-success" />
    </Avatar>
  );
}

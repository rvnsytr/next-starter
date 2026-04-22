"use client";

import { Badge } from "@/core/components/ui/badge";
import { Ping } from "@/core/components/ui/ping";
import { Layers2Icon } from "lucide-react";
import { useAuth } from "../provider";

export function ImpersonateUserBadge({
  impersonating,
}: {
  impersonating?: boolean;
}) {
  const { session } = useAuth();

  const isImpersonating = impersonating ?? !!session.impersonatedBy;
  if (!isImpersonating) return;

  return (
    <div className="relative">
      <Badge variant="outline" className="relative">
        <Layers2Icon />
        <span className="hidden md:flex">Mode Impersonasi</span>
      </Badge>
      <Ping />
    </div>
  );
}

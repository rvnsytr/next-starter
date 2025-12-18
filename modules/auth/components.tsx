import { AuthSession, Role } from "@/core/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { cn } from "@/core/utils";
import { BadgeCheck } from "lucide-react";
import { rolesMeta } from "./constants";

export function UserRoleBadge({
  value,
  className,
}: {
  value: Role;
  className?: string;
}) {
  const { displayName, desc, icon: Icon, color } = rolesMeta[value];
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        <Badge
          variant="outline"
          style={{ "--badge-color": color } as React.CSSProperties}
          className={cn(
            "border-(--badge-color) text-(--badge-color) capitalize",
          )}
        >
          <Icon /> {displayName}
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        style={{ "--tooltip-color": color } as React.CSSProperties}
        className="bg-(--tooltip-color)"
        arrowClassName="bg-(--tooltip-color) fill-(--tooltip-color)"
      >
        {desc}
      </TooltipContent>
    </Tooltip>
  );
}

export function UserVerifiedBadge({
  withoutText = false,
  className,
  classNames,
}: {
  withoutText?: boolean;
  className?: string;
  classNames?: { badge?: string; icon?: string; content?: string };
}) {
  return (
    <Tooltip>
      <TooltipTrigger className={className} asChild>
        {withoutText ? (
          <BadgeCheck
            className={cn("text-rvns size-4 shrink-0", classNames?.icon)}
          />
        ) : (
          <Badge
            variant="outline_rvns"
            className={cn("capitalize", classNames?.badge)}
          >
            <BadgeCheck className={classNames?.icon} /> Terverifikasi
          </Badge>
        )}
      </TooltipTrigger>
      <TooltipContent className={classNames?.content}>
        Pengguna ini telah memverifikasi email mereka.
      </TooltipContent>
    </Tooltip>
  );
}

export function UserAvatar({
  data,
  className,
  classNames,
}: {
  data: Pick<AuthSession["user"], "image" | "name">;
  className?: string;
  classNames?: { image?: string; fallback?: string };
}) {
  return (
    <Avatar className={cn("rounded-lg", className)}>
      <AvatarImage
        src={data.image ?? undefined}
        className={cn("rounded-lg", classNames?.image)}
      />
      <AvatarFallback className={cn("rounded-lg", classNames?.fallback)}>
        {data.name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}

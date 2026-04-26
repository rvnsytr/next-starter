import { Badge } from "@/core/components/ui/badge";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { cn } from "@/core/utils";
import { BadgeCheckIcon } from "lucide-react";

export function UserVerifiedBadge({
  withText = true,
  className,
  classNames,
}: {
  withText?: boolean;
  className?: string;
  classNames?: { badge?: string; icon?: string; content?: string };
}) {
  return withText ? (
    <Badge variant="success" className={cn("capitalize", classNames?.badge)}>
      <BadgeCheckIcon className={classNames?.icon} /> Terverifikasi
    </Badge>
  ) : (
    <Tooltip>
      <TooltipTrigger
        className={className}
        render={
          <BadgeCheckIcon
            className={cn("text-success size-4 shrink-0", classNames?.icon)}
          />
        }
      />
      <TooltipPopup>Terverifikasi</TooltipPopup>
    </Tooltip>
  );
}

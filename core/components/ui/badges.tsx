import { Gender, genderMeta } from "@/core/constants";
import { cn } from "@/core/utils";
import { Badge } from "./badge";

export function GenderBadge({
  gender,
  className,
}: {
  gender: Gender;
  className?: string;
}) {
  const { displayName, icon: Icon, color } = genderMeta[gender];
  return (
    <Badge
      variant="outline"
      style={{ "--badge-color": color } as React.CSSProperties}
      className={cn("border-(--badge-color) text-(--badge-color)", className)}
    >
      <Icon /> {displayName}
    </Badge>
  );
}

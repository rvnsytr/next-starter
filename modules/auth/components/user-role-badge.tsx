import { CustomColorBadge } from "@/core/components/ui/badge";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { ROLE_META } from "../constants/role-meta";
import { Role } from "../constants/roles";

export function UserRoleBadge({
  value,
  withText = true,
  className,
}: {
  value: Role;
  withText?: boolean;
  className?: string;
}) {
  const { label, description, icon: Icon, color } = ROLE_META[value];

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <CustomColorBadge color={color} className={className}>
            <Icon /> {withText && label}
          </CustomColorBadge>
        }
      />

      <TooltipPopup
      // style={{ "--tooltip-color": color } as React.CSSProperties}
      // className="bg-(--tooltip-color)"
      // arrowClassName="bg-(--tooltip-color) fill-(--tooltip-color)"
      >
        {description}
      </TooltipPopup>
    </Tooltip>
  );
}

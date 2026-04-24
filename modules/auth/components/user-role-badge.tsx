import { CustomColorBadge } from "@/core/components/ui/badge";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { Role } from "@/shared/permission";
import { roleConfig } from "../config";

export function UserRoleBadge({
  value,
  withText = true,
  className,
}: {
  value: Role;
  withText?: boolean;
  className?: string;
}) {
  const { label, description, icon: Icon, color } = roleConfig[value];

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
